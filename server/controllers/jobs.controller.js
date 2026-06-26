import * as resumeModel from '../models/resume.model.js';
import * as skillModel from '../models/skill.model.js';
import {
  searchJobs,
  matchJobsToSkills,
  getSupportedCountries,
  buildSearchQueryFromSkills,
} from '../services/jobs.service.js';

export async function listCountries(req, res) {
  res.json({
    success: true,
    data: { countries: getSupportedCountries() },
    error: null,
  });
}

export async function search(req, res) {
  try {
    const { query = '', location = '', country = '', page = '1' } = req.query;

    const result = await searchJobs({
      query,
      location,
      country,
      page: Number(page) || 1,
    });

    res.json({
      success: true,
      data: result,
      error: null,
    });
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Job search failed',
    });
  }
}

export async function match(req, res) {
  try {
    const { resumeId, query = '', location = '', country = '', page = '1' } = req.query;

    if (!resumeId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'resumeId is required',
      });
    }

    const owned = await resumeModel.belongsToUser(Number(resumeId), req.user.id);
    if (!owned) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Resume not found',
      });
    }

    const skills = await skillModel.findByResumeId(Number(resumeId));
    if (!skills.length) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'No skills found for this resume. Upload and parse a resume first.',
      });
    }

    const result = await matchJobsToSkills({
      query: query || buildSearchQueryFromSkills(skills),
      location,
      country,
      page: Number(page) || 1,
      skills,
    });

    res.json({
      success: true,
      data: {
        ...result,
        skills_used: skills.map((s) => s.skill_name),
      },
      error: null,
    });
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Job matching failed',
    });
  }
}
