import * as resumeModel from '../models/resume.model.js';
import * as skillModel from '../models/skill.model.js';
import * as userModel from '../models/user.model.js';
import { extractPdfText, parseResumeText } from '../services/ai.service.js';

const FREE_SCAN_LIMIT = 2;

export async function listResumes(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    const resumes = await resumeModel.findByUser(req.user.id);
    const scanCount = resumes.length;

    res.json({
      success: true,
      data: {
        resumes,
        scan_count: scanCount,
        scan_limit: user.plan === 'free' ? FREE_SCAN_LIMIT : null,
        plan: user.plan,
      },
      error: null,
    });
  } catch (error) {
    console.error('List resumes error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch resumes',
    });
  }
}

export async function uploadResume(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'PDF file is required',
      });
    }

    const rawText = await extractPdfText(req.file.buffer);

    if (!rawText || rawText.length < 50) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Could not extract enough text from PDF. Ensure the file is a readable resume.',
      });
    }

    const analysis = await parseResumeText(rawText, req.user.id);

    const resume = await resumeModel.create({
      userId: req.user.id,
      filename: req.file.originalname,
      rawText,
    });

    await skillModel.bulkInsert(resume.id, analysis.skills);
    const skills = await skillModel.findByResumeId(resume.id);

    res.status(201).json({
      success: true,
      data: {
        resume: {
          id: resume.id,
          filename: resume.filename,
          uploaded_at: resume.uploaded_at,
        },
        skills,
        experience_summary: analysis.experience_summary,
        education: analysis.education,
        suggested_roles: analysis.suggested_roles,
      },
      error: null,
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Resume upload failed',
    });
  }
}

export async function getSkills(req, res) {
  try {
    const resumeId = Number(req.params.id);

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invalid resume ID',
      });
    }

    const owned = await resumeModel.belongsToUser(resumeId, req.user.id);
    if (!owned) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Resume not found',
      });
    }

    const resume = await resumeModel.findById(resumeId);
    const skills = await skillModel.findByResumeId(resumeId);

    res.json({
      success: true,
      data: {
        resume: {
          id: resume.id,
          filename: resume.filename,
          uploaded_at: resume.uploaded_at,
        },
        skills,
      },
      error: null,
    });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch skills',
    });
  }
}
