import * as resumeModel from '../models/resume.model.js';
import * as skillModel from '../models/skill.model.js';
import * as jobRoleModel from '../models/jobRole.model.js';
import * as skillGapModel from '../models/skillGap.model.js';
import { analyzeSkillGaps } from '../services/ai.service.js';

export async function listJobRoles(req, res) {
  try {
    const jobRoles = await jobRoleModel.ensureDefaults();

    res.json({
      success: true,
      data: { job_roles: jobRoles },
      error: null,
    });
  } catch (error) {
    console.error('List job roles error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch job roles',
    });
  }
}

export async function runGapAnalysis(req, res) {
  try {
    const { resumeId, jobRoleId } = req.body;

    if (!resumeId || !jobRoleId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'resumeId and jobRoleId are required',
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

    const jobRole = await jobRoleModel.findById(jobRoleId);
    if (!jobRole) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Job role not found',
      });
    }

    const currentSkills = await skillModel.findByResumeId(resumeId);
    if (!currentSkills.length) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'No skills found for this resume. Upload and parse a resume first.',
      });
    }

    const gaps = await analyzeSkillGaps(currentSkills, jobRole, req.user.id);

    await skillGapModel.deleteByResumeAndRole(resumeId, jobRoleId);
    await skillGapModel.bulkInsert(resumeId, jobRoleId, gaps.map((g) => ({
      skill: g.skill,
      importance: g.importance,
    })));

    res.json({
      success: true,
      data: {
        job_role: { id: jobRole.id, title: jobRole.title },
        gaps: gaps.map((g) => ({
          missing_skill: g.skill,
          importance_rank: g.importance,
          reason: g.reason,
        })),
      },
      error: null,
    });
  } catch (error) {
    console.error('Gap analysis error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Gap analysis failed',
    });
  }
}

export async function getGaps(req, res) {
  try {
    const resumeId = Number(req.params.resumeId);
    const jobRoleId = Number(req.query.jobRoleId);

    const owned = await resumeModel.belongsToUser(resumeId, req.user.id);
    if (!owned) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Resume not found',
      });
    }

    if (jobRoleId) {
      const gaps = await skillGapModel.findByResumeAndRole(resumeId, jobRoleId);
      const jobRole = await jobRoleModel.findById(jobRoleId);
      return res.json({
        success: true,
        data: { job_role: jobRole, gaps },
        error: null,
      });
    }

    const gaps = await skillGapModel.findByResumeId(resumeId);
    res.json({
      success: true,
      data: { gaps },
      error: null,
    });
  } catch (error) {
    console.error('Get gaps error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch skill gaps',
    });
  }
}
