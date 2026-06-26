import * as interviewSessionModel from '../models/interviewSession.model.js';
import * as resumeModel from '../models/resume.model.js';
import * as skillModel from '../models/skill.model.js';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../services/ai.service.js';

function mapSession(row) {
  return {
    id: row.id,
    job_title: row.job_title,
    company: row.company,
    questions: row.questions || [],
    created_at: row.created_at,
  };
}

export async function listSessions(req, res) {
  try {
    const sessions = await interviewSessionModel.findByUser(req.user.id);
    res.json({
      success: true,
      data: { sessions: sessions.map(mapSession) },
      error: null,
    });
  } catch (error) {
    console.error('List interview sessions error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to fetch sessions' });
  }
}

export async function getSession(req, res) {
  try {
    const id = Number(req.params.id);
    const session = await interviewSessionModel.findById(id);

    if (!session || session.user_id !== req.user.id) {
      return res.status(404).json({ success: false, data: null, error: 'Session not found' });
    }

    res.json({ success: true, data: { session: mapSession(session) }, error: null });
  } catch (error) {
    console.error('Get interview session error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to fetch session' });
  }
}

export async function startSession(req, res) {
  try {
    const { job_title, company, resume_id } = req.body;

    if (!job_title?.trim()) {
      return res.status(400).json({ success: false, data: null, error: 'Job title is required' });
    }

    const resumes = await resumeModel.findByUser(req.user.id);
    let resume = null;

    if (resume_id) {
      resume = await resumeModel.findById(resume_id);
      if (!resume || resume.user_id !== req.user.id) {
        return res.status(404).json({ success: false, data: null, error: 'Resume not found' });
      }
    } else if (resumes.length > 0) {
      resume = await resumeModel.findById(resumes[0].id);
    }

    const skills = resume ? await skillModel.findByResumeId(resume.id) : [];

    const { questions, demo_mode } = await generateInterviewQuestions({
      jobTitle: job_title.trim(),
      company: company?.trim(),
      skills,
    }, req.user.id);

    const session = await interviewSessionModel.create({
      userId: req.user.id,
      jobTitle: job_title.trim(),
      company: company?.trim(),
      questions,
    });

    res.status(201).json({
      success: true,
      data: { session: mapSession(session), demo_mode },
      error: null,
    });
  } catch (error) {
    console.error('Start interview session error:', error);
    res.status(500).json({ success: false, data: null, error: error.message || 'Failed to start session' });
  }
}

export async function submitAnswer(req, res) {
  try {
    const id = Number(req.params.id);
    const { question_index, answer } = req.body;

    if (question_index === undefined || !answer?.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Question index and answer are required',
      });
    }

    const session = await interviewSessionModel.findById(id);
    if (!session || session.user_id !== req.user.id) {
      return res.status(404).json({ success: false, data: null, error: 'Session not found' });
    }

    const questions = [...(session.questions || [])];
    const idx = Number(question_index);

    if (idx < 0 || idx >= questions.length) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid question index' });
    }

    const evaluation = await evaluateInterviewAnswer({
      question: questions[idx].question,
      answer: answer.trim(),
      jobTitle: session.job_title,
    }, req.user.id);

    questions[idx] = {
      ...questions[idx],
      answer: answer.trim(),
      feedback: evaluation.feedback,
      score: evaluation.score,
      tips: evaluation.tips,
    };

    const updated = await interviewSessionModel.updateQuestions(id, req.user.id, questions);

    res.json({
      success: true,
      data: {
        session: mapSession(updated),
        evaluation,
        demo_mode: evaluation.demo_mode,
      },
      error: null,
    });
  } catch (error) {
    console.error('Submit interview answer error:', error);
    res.status(500).json({ success: false, data: null, error: error.message || 'Failed to submit answer' });
  }
}

export async function deleteSession(req, res) {
  try {
    const id = Number(req.params.id);
    const exists = await interviewSessionModel.belongsToUser(id, req.user.id);
    if (!exists) {
      return res.status(404).json({ success: false, data: null, error: 'Session not found' });
    }

    await interviewSessionModel.remove(id, req.user.id);
    res.json({ success: true, data: { deleted: true }, error: null });
  } catch (error) {
    console.error('Delete interview session error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to delete session' });
  }
}
