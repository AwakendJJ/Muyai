import { createRequire } from 'module';
import * as aiUsageModel from '../models/aiUsage.model.js';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const VALID_PROFICIENCY = new Set(['beginner', 'intermediate', 'advanced']);

const RESUME_PARSE_SYSTEM = `You are a resume analysis expert. Extract structured information from resumes.
Always respond with valid JSON only — no markdown, no explanation.
Use this exact schema:
{
  "skills": [{ "name": "string", "proficiency": "beginner|intermediate|advanced", "category": "string" }],
  "experience_summary": "string",
  "education": [{ "degree": "string", "institution": "string", "year": "string" }],
  "suggested_roles": ["string"]
}`;

const DEFAULT_MODELS = {
  claude: 'claude-sonnet-4-20250514',
  openai: 'gpt-4o',
  deepseek: 'deepseek-chat',
};

const MODEL_ALIASES = {
  'deepseek-v3': 'deepseek-chat',
  'deepseek-v3.2': 'deepseek-chat',
  'deepseek-reasoner': 'deepseek-reasoner',
};

function getProviderConfig(options = {}) {
  const provider = (options.provider || process.env.AI_PROVIDER || 'claude').toLowerCase().trim();
  let model = (options.model || process.env.AI_MODEL || '').trim().replace(/,$/, '');
  if (MODEL_ALIASES[model.toLowerCase()]) {
    model = MODEL_ALIASES[model.toLowerCase()];
  }
  if (!model) {
    model = DEFAULT_MODELS[provider] || DEFAULT_MODELS.claude;
  }
  return { provider, model };
}

function extractJSON(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  return JSON.parse(raw.trim());
}

function validateResumeParse(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('AI response is not a valid object');
  }

  if (!Array.isArray(data.skills)) {
    throw new Error('AI response missing skills array');
  }

  const skills = data.skills
    .filter((s) => s?.name)
    .map((s) => ({
      name: String(s.name).trim(),
      proficiency: VALID_PROFICIENCY.has(s.proficiency) ? s.proficiency : 'intermediate',
      category: s.category ? String(s.category).trim() : 'General',
    }));

  return {
    skills,
    experience_summary: data.experience_summary ? String(data.experience_summary) : '',
    education: Array.isArray(data.education) ? data.education : [],
    suggested_roles: Array.isArray(data.suggested_roles) ? data.suggested_roles.map(String) : [],
  };
}

async function callClaude(prompt, systemPrompt, model) {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error('CLAUDE_API_KEY is not configured');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Claude API request failed');
  }

  const text = data.content?.map((block) => block.text).join('') || '';
  const tokensUsed = (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

  return { text, tokensUsed };
}

async function callOpenAICompatible(prompt, systemPrompt, model, { apiKey, apiUrl, providerLabel, jsonMode = true }) {
  if (!apiKey) {
    throw new Error(`${providerLabel} API key is not configured`);
  }

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
  };

  if (jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `${providerLabel} API request failed`);
  }

  const text = data.choices?.[0]?.message?.content || '';
  const tokensUsed = data.usage?.total_tokens || 0;

  return { text, tokensUsed };
}

async function callOpenAI(prompt, systemPrompt, model) {
  return callOpenAICompatible(prompt, systemPrompt, model, {
    apiKey: process.env.OPENAI_API_KEY,
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    providerLabel: 'OPENAI_API_KEY',
  });
}

async function callDeepSeek(prompt, systemPrompt, model) {
  return callOpenAICompatible(prompt, systemPrompt, model, {
    apiKey: process.env.DEEPSEEK_API_KEY,
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    providerLabel: 'DEEPSEEK_API_KEY',
  });
}

export async function callAI(prompt, systemPrompt, options = {}) {
  const { provider, model } = getProviderConfig(options);
  const { userId, feature } = options;

  let result;

  if (provider === 'openai') {
    result = await callOpenAI(prompt, systemPrompt, model);
  } else if (provider === 'deepseek') {
    result = await callDeepSeek(prompt, systemPrompt, model);
  } else if (provider === 'claude') {
    result = await callClaude(prompt, systemPrompt, model);
  } else {
    throw new Error(`Unsupported AI_PROVIDER: ${provider}. Use claude, openai, or deepseek.`);
  }

  const parsed = extractJSON(result.text);

  if (userId && feature) {
    await aiUsageModel.log({
      userId,
      feature,
      provider,
      model,
      tokensUsed: result.tokensUsed,
    });
  }

  return { parsed, tokensUsed: result.tokensUsed, provider, model };
}

export async function parseResumeText(rawText, userId) {
  const prompt = `Analyze this resume and extract skills, experience, education, and suggested career roles:\n\n${rawText}`;

  const { parsed } = await callAI(prompt, RESUME_PARSE_SYSTEM, {
    userId,
    feature: 'resume_parse',
  });

  return validateResumeParse(parsed);
}

export async function extractPdfText(buffer) {
  const data = await pdfParse(buffer);
  return data.text?.trim() || '';
}

const GAP_ANALYSIS_SYSTEM = `You are a career skills analyst. Compare a candidate's current skills against a target job role.
Always respond with valid JSON only — no markdown, no explanation.
Use this exact schema:
{
  "missing_skills": [{ "skill": "string", "importance": "high|medium|low", "reason": "string" }]
}`;

const RECOMMENDATIONS_SYSTEM = `You are a career advisor for African talent. Based on skill gaps, suggest career paths and courses.
Always respond with valid JSON only — no markdown, no explanation.
Use this exact schema:
{
  "career_paths": [{ "title": "string", "description": "string", "fit_score": number }],
  "courses": [{ "title": "string", "provider": "string", "url": "string", "covers_skill": "string" }]
}`;

const VALID_IMPORTANCE = new Set(['high', 'medium', 'low']);

function validateGapAnalysis(data) {
  if (!Array.isArray(data?.missing_skills)) {
    throw new Error('AI response missing missing_skills array');
  }

  return data.missing_skills
    .filter((g) => g?.skill)
    .map((g) => ({
      skill: String(g.skill).trim(),
      importance: VALID_IMPORTANCE.has(g.importance) ? g.importance : 'medium',
      reason: g.reason ? String(g.reason) : '',
    }));
}

function validateRecommendations(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('AI response is not a valid object');
  }

  const career_paths = Array.isArray(data.career_paths)
    ? data.career_paths.map((c) => ({
        title: String(c.title || '').trim(),
        description: String(c.description || '').trim(),
        fit_score: Number(c.fit_score) || 0,
      })).filter((c) => c.title)
    : [];

  const courses = Array.isArray(data.courses)
    ? data.courses.map((c) => ({
        title: String(c.title || '').trim(),
        provider: String(c.provider || '').trim(),
        url: String(c.url || '').trim(),
        covers_skill: String(c.covers_skill || '').trim(),
      })).filter((c) => c.title)
    : [];

  return { career_paths, courses };
}

export async function analyzeSkillGaps(currentSkills, jobRole, userId) {
  const skillsList = currentSkills.map((s) => `${s.skill_name} (${s.proficiency_level})`).join(', ');

  const prompt = `Target role: ${jobRole.title}
Required skills: ${jobRole.required_skills.join(', ')}
Candidate's current skills: ${skillsList}

Identify missing or underdeveloped skills needed for this role.`;

  const { parsed } = await callAI(prompt, GAP_ANALYSIS_SYSTEM, {
    userId,
    feature: 'gap_analysis',
  });

  return validateGapAnalysis(parsed);
}

export async function generateRecommendations(skillGaps, userId) {
  const gapsList = skillGaps
    .map((g) => `${g.missing_skill} (${g.importance_rank} importance)`)
    .join(', ');

  const prompt = `Based on these skill gaps: ${gapsList}

Suggest career paths and online courses to close these gaps. Focus on resources accessible to African talent.`;

  const { parsed } = await callAI(prompt, RECOMMENDATIONS_SYSTEM, {
    userId,
    feature: 'recommendations',
  });

  return validateRecommendations(parsed);
}

export function isAIConfigured() {
  const provider = (process.env.AI_PROVIDER || 'claude').toLowerCase().trim();
  if (provider === 'openai') return !!process.env.OPENAI_API_KEY;
  if (provider === 'deepseek') return !!process.env.DEEPSEEK_API_KEY;
  return !!process.env.CLAUDE_API_KEY;
}

async function callProviderText(prompt, systemPrompt, options = {}) {
  const { provider, model } = getProviderConfig(options);

  if (provider === 'openai') {
    return callOpenAICompatible(prompt, systemPrompt, model, {
      apiKey: process.env.OPENAI_API_KEY,
      apiUrl: 'https://api.openai.com/v1/chat/completions',
      providerLabel: 'OPENAI_API_KEY',
      jsonMode: false,
    });
  }
  if (provider === 'deepseek') {
    return callOpenAICompatible(prompt, systemPrompt, model, {
      apiKey: process.env.DEEPSEEK_API_KEY,
      apiUrl: 'https://api.deepseek.com/v1/chat/completions',
      providerLabel: 'DEEPSEEK_API_KEY',
      jsonMode: false,
    });
  }
  return callClaude(prompt, systemPrompt, model);
}

export async function callAIText(prompt, systemPrompt, options = {}) {
  const { provider, model } = getProviderConfig(options);
  const { userId, feature } = options;

  const result = await callProviderText(prompt, systemPrompt, options);

  if (userId && feature) {
    await aiUsageModel.log({
      userId,
      feature,
      provider,
      model,
      tokensUsed: result.tokensUsed,
    });
  }

  return { text: result.text.trim(), tokensUsed: result.tokensUsed, provider, model, demo_mode: false };
}

const COVER_LETTER_SYSTEM = `You are a professional cover letter writer for African talent applying to global and local roles.
Write a concise, compelling cover letter (3-4 paragraphs). Use plain text only — no markdown.
Tailor the letter to the job and candidate background. Be authentic and professional.`;

const INTERVIEW_QUESTIONS_SYSTEM = `You are an interview coach. Generate realistic interview questions for a job candidate.
Always respond with valid JSON only — no markdown.
Use this exact schema:
{
  "questions": [{ "question": "string", "category": "behavioral|technical|situational" }]
}`;

const INTERVIEW_FEEDBACK_SYSTEM = `You are an interview coach giving constructive feedback on a candidate's answer.
Always respond with valid JSON only — no markdown.
Use this exact schema:
{
  "feedback": "string",
  "score": number,
  "tips": ["string"]
}
Score is 1-10.`;

const COACH_SYSTEM = `You are Muyai Career Coach — a supportive career advisor for African professionals.
Give practical, actionable guidance on careers, job search, interviews, and skill development.
Keep responses concise (2-4 short paragraphs). Be encouraging and specific.`;

const DEFAULT_INTERVIEW_QUESTIONS = [
  { question: 'Tell me about yourself and why you are interested in this role.', category: 'behavioral', answer: null, feedback: null, score: null },
  { question: 'Describe a challenging project you worked on and how you handled it.', category: 'behavioral', answer: null, feedback: null, score: null },
  { question: 'What are your greatest strengths and how do they apply to this position?', category: 'behavioral', answer: null, feedback: null, score: null },
  { question: 'Where do you see yourself in three to five years?', category: 'situational', answer: null, feedback: null, score: null },
  { question: 'Why do you want to work at this company?', category: 'situational', answer: null, feedback: null, score: null },
];

function buildDemoCoverLetter({ candidateName, jobTitle, company, skills, experienceSummary }) {
  const skillLine = skills.length
    ? `My experience includes ${skills.slice(0, 5).join(', ')}, which aligns well with the requirements of this role.`
    : 'I bring a strong foundation of relevant skills and a commitment to continuous learning.';

  const experienceLine = experienceSummary
    ? experienceSummary.slice(0, 200)
    : 'I have built practical experience through projects and professional work that prepared me for this opportunity.';

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. As a motivated professional seeking to grow my career, I am excited about the opportunity to contribute to your team.

${experienceLine} ${skillLine}

I am drawn to ${company} because of its mission and the chance to make a meaningful impact. I would welcome the opportunity to discuss how my background and enthusiasm can support your goals.

Thank you for your time and consideration.

Sincerely,
${candidateName || 'Candidate'}

---
[Demo mode — add CLAUDE_API_KEY, OPENAI_API_KEY, or DEEPSEEK_API_KEY for AI-generated letters]`;
}

export async function generateCoverLetter({ candidateName, resumeText, skills, jobTitle, company, jobDescription }, userId) {
  if (!isAIConfigured()) {
    return {
      content: buildDemoCoverLetter({
        candidateName,
        jobTitle,
        company,
        skills: skills.map((s) => s.skill_name || s.name),
        experienceSummary: resumeText?.slice(0, 300),
      }),
      demo_mode: true,
    };
  }

  const skillsList = skills.map((s) => s.skill_name || s.name).join(', ');
  const prompt = `Candidate name: ${candidateName || 'Candidate'}
Skills: ${skillsList || 'Not specified'}
Resume excerpt:\n${(resumeText || '').slice(0, 3000)}

Job title: ${jobTitle}
Company: ${company}
Job description:\n${(jobDescription || 'Not provided').slice(0, 2000)}

Write a tailored cover letter for this application.`;

  const { text } = await callAIText(prompt, COVER_LETTER_SYSTEM, {
    userId,
    feature: 'cover_letter',
  });

  return { content: text, demo_mode: false };
}

export async function generateInterviewQuestions({ jobTitle, company, skills }, userId) {
  if (!isAIConfigured()) {
    const tailored = DEFAULT_INTERVIEW_QUESTIONS.map((q, i) => ({
      ...q,
      question: i === 0
        ? `Tell me about yourself and why you want the ${jobTitle} role${company ? ` at ${company}` : ''}.`
        : q.question,
    }));
    return { questions: tailored, demo_mode: true };
  }

  const skillsList = skills.map((s) => s.skill_name || s.name).join(', ');
  const prompt = `Role: ${jobTitle}
Company: ${company || 'Not specified'}
Candidate skills: ${skillsList || 'General'}

Generate 5 interview questions mixing behavioral, technical, and situational categories.`;

  const { parsed } = await callAI(prompt, INTERVIEW_QUESTIONS_SYSTEM, {
    userId,
    feature: 'interview_questions',
  });

  const questions = (parsed.questions || [])
    .filter((q) => q?.question)
    .slice(0, 6)
    .map((q) => ({
      question: String(q.question).trim(),
      category: q.category || 'behavioral',
      answer: null,
      feedback: null,
      score: null,
    }));

  return { questions: questions.length ? questions : DEFAULT_INTERVIEW_QUESTIONS, demo_mode: false };
}

export async function evaluateInterviewAnswer({ question, answer, jobTitle }, userId) {
  if (!isAIConfigured()) {
    const wordCount = answer.trim().split(/\s+/).length;
    const score = wordCount < 20 ? 4 : wordCount < 80 ? 6 : 8;
    return {
      feedback: score >= 7
        ? 'Good structure. You addressed the question with relevant detail. In demo mode, add an AI API key for personalized coaching.'
        : 'Try expanding your answer with a specific example using the STAR method (Situation, Task, Action, Result).',
      score,
      tips: [
        'Use a concrete example from your experience',
        'Quantify impact where possible',
        'Keep answers under 2 minutes when spoken',
      ],
      demo_mode: true,
    };
  }

  const prompt = `Role: ${jobTitle}
Question: ${question}
Candidate answer: ${answer}

Evaluate this interview answer.`;

  const { parsed } = await callAI(prompt, INTERVIEW_FEEDBACK_SYSTEM, {
    userId,
    feature: 'interview_feedback',
  });

  return {
    feedback: String(parsed.feedback || 'No feedback generated'),
    score: Math.min(10, Math.max(1, Number(parsed.score) || 5)),
    tips: Array.isArray(parsed.tips) ? parsed.tips.map(String) : [],
    demo_mode: false,
  };
}

export async function coachChat({ message, history, context }, userId) {
  if (!isAIConfigured()) {
    const lower = message.toLowerCase();
    let reply = 'I am here to help with your career journey. Ask me about job search strategies, interview prep, or skill development.';

    if (lower.includes('interview')) {
      reply = 'For interviews, prepare 3-5 STAR stories (Situation, Task, Action, Result) that highlight your best work. Practice out loud and keep answers under 2 minutes. Use the Interview Prep app to practice with role-specific questions.';
    } else if (lower.includes('resume') || lower.includes('cv')) {
      reply = 'Keep your resume focused on achievements, not just duties. Use numbers where possible (e.g. "reduced processing time by 30%"). Upload your resume in Resume Lab to get AI skill extraction and gap analysis.';
    } else if (lower.includes('salary') || lower.includes('negotiat')) {
      reply = 'Research market rates for your role and location before negotiating. Anchor with a range based on data, emphasize your unique value, and be prepared to discuss total compensation, not just base salary.';
    } else if (lower.includes('remote') || lower.includes('job')) {
      reply = 'Cast a wide net: use Job Match for remote roles, track applications in the Applications tracker, and tailor each cover letter. Consistency beats volume — aim for quality applications each week.';
    }

    return { reply: `${reply}\n\n[Demo mode — add an AI API key for personalized coaching]`, demo_mode: true };
  }

  const historyText = history
    .slice(-8)
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `Career context:
- Name: ${context.name || 'User'}
- Plan: ${context.plan || 'free'}
- Skills: ${context.skills?.join(', ') || 'Not specified'}
- Applications tracked: ${context.applicationCount ?? 0}

Recent conversation:
${historyText || '(none)'}

User message: ${message}`;

  const { text } = await callAIText(prompt, COACH_SYSTEM, {
    userId,
    feature: 'career_coach',
  });

  return { reply: text, demo_mode: false };
}
