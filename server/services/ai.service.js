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

function getProviderConfig(options = {}) {
  const provider = options.provider || process.env.AI_PROVIDER || 'claude';
  const model = options.model || process.env.AI_MODEL || 'claude-sonnet-4-20250514';
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

async function callOpenAI(prompt, systemPrompt, model) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI API request failed');
  }

  const text = data.choices?.[0]?.message?.content || '';
  const tokensUsed = data.usage?.total_tokens || 0;

  return { text, tokensUsed };
}

export async function callAI(prompt, systemPrompt, options = {}) {
  const { provider, model } = getProviderConfig(options);
  const { userId, feature } = options;

  let result;

  if (provider === 'openai') {
    result = await callOpenAI(prompt, systemPrompt, model);
  } else {
    result = await callClaude(prompt, systemPrompt, model);
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
