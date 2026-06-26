import * as coverLetterModel from '../models/coverLetter.model.js';
import * as applicationModel from '../models/application.model.js';
import * as resumeModel from '../models/resume.model.js';
import * as skillModel from '../models/skill.model.js';
import * as userModel from '../models/user.model.js';
import { generateCoverLetter } from '../services/ai.service.js';

function mapLetter(row) {
  return {
    id: row.id,
    application_id: row.application_id,
    job_title: row.job_title,
    company: row.company,
    job_description: row.job_description,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listCoverLetters(req, res) {
  try {
    const letters = await coverLetterModel.findByUser(req.user.id);
    res.json({
      success: true,
      data: { cover_letters: letters.map(mapLetter) },
      error: null,
    });
  } catch (error) {
    console.error('List cover letters error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to fetch cover letters' });
  }
}

export async function getCoverLetter(req, res) {
  try {
    const id = Number(req.params.id);
    const letter = await coverLetterModel.findById(id);

    if (!letter || letter.user_id !== req.user.id) {
      return res.status(404).json({ success: false, data: null, error: 'Cover letter not found' });
    }

    res.json({ success: true, data: { cover_letter: mapLetter(letter) }, error: null });
  } catch (error) {
    console.error('Get cover letter error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to fetch cover letter' });
  }
}

export async function generateCoverLetterHandler(req, res) {
  try {
    const { job_title, company, job_description, application_id, resume_id } = req.body;

    if (!job_title?.trim() || !company?.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Job title and company are required',
      });
    }

    if (application_id) {
      const app = await applicationModel.findById(application_id);
      if (!app || app.user_id !== req.user.id) {
        return res.status(404).json({ success: false, data: null, error: 'Application not found' });
      }
    }

    const user = await userModel.findById(req.user.id);
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

    const { content, demo_mode } = await generateCoverLetter({
      candidateName: user.name,
      resumeText: resume?.raw_text,
      skills,
      jobTitle: job_title.trim(),
      company: company.trim(),
      jobDescription: job_description?.trim(),
    }, req.user.id);

    const letter = await coverLetterModel.create({
      userId: req.user.id,
      applicationId: application_id || null,
      jobTitle: job_title.trim(),
      company: company.trim(),
      jobDescription: job_description?.trim(),
      content,
    });

    res.status(201).json({
      success: true,
      data: { cover_letter: mapLetter(letter), demo_mode },
      error: null,
    });
  } catch (error) {
    console.error('Generate cover letter error:', error);
    res.status(500).json({ success: false, data: null, error: error.message || 'Failed to generate cover letter' });
  }
}

export async function updateCoverLetter(req, res) {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ success: false, data: null, error: 'Content is required' });
    }

    const exists = await coverLetterModel.belongsToUser(id, req.user.id);
    if (!exists) {
      return res.status(404).json({ success: false, data: null, error: 'Cover letter not found' });
    }

    const letter = await coverLetterModel.updateContent(id, req.user.id, content.trim());

    res.json({ success: true, data: { cover_letter: mapLetter(letter) }, error: null });
  } catch (error) {
    console.error('Update cover letter error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to update cover letter' });
  }
}

export async function deleteCoverLetter(req, res) {
  try {
    const id = Number(req.params.id);
    const exists = await coverLetterModel.belongsToUser(id, req.user.id);
    if (!exists) {
      return res.status(404).json({ success: false, data: null, error: 'Cover letter not found' });
    }

    await coverLetterModel.remove(id, req.user.id);
    res.json({ success: true, data: { deleted: true }, error: null });
  } catch (error) {
    console.error('Delete cover letter error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to delete cover letter' });
  }
}
