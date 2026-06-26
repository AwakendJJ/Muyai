import * as coachMessageModel from '../models/coachMessage.model.js';
import * as applicationModel from '../models/application.model.js';
import * as resumeModel from '../models/resume.model.js';
import * as skillModel from '../models/skill.model.js';
import * as userModel from '../models/user.model.js';
import { coachChat } from '../services/ai.service.js';

export async function getMessages(req, res) {
  try {
    const messages = await coachMessageModel.findByUser(req.user.id);
    res.json({
      success: true,
      data: { messages },
      error: null,
    });
  } catch (error) {
    console.error('Get coach messages error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to fetch messages' });
  }
}

export async function sendMessage(req, res) {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, data: null, error: 'Message is required' });
    }

    const user = await userModel.findById(req.user.id);
    const [stats, resumes, history] = await Promise.all([
      applicationModel.getStats(req.user.id),
      resumeModel.findByUser(req.user.id),
      coachMessageModel.findByUser(req.user.id),
    ]);

    let skills = [];
    if (resumes.length > 0) {
      const skillRows = await skillModel.findByResumeId(resumes[0].id);
      skills = skillRows.map((s) => s.skill_name);
    }

    await coachMessageModel.create({
      userId: req.user.id,
      role: 'user',
      content: message.trim(),
    });

    const { reply, demo_mode } = await coachChat({
      message: message.trim(),
      history,
      context: {
        name: user.name,
        plan: user.plan,
        skills,
        applicationCount: stats.total,
      },
    }, req.user.id);

    const assistantMessage = await coachMessageModel.create({
      userId: req.user.id,
      role: 'assistant',
      content: reply,
    });

    res.json({
      success: true,
      data: {
        message: assistantMessage,
        demo_mode,
      },
      error: null,
    });
  } catch (error) {
    console.error('Coach chat error:', error);
    res.status(500).json({ success: false, data: null, error: error.message || 'Failed to send message' });
  }
}

export async function clearMessages(req, res) {
  try {
    await coachMessageModel.clearForUser(req.user.id);
    res.json({ success: true, data: { cleared: true }, error: null });
  } catch (error) {
    console.error('Clear coach messages error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to clear messages' });
  }
}
