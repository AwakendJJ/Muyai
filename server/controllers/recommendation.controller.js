import * as resumeModel from '../models/resume.model.js';
import * as skillGapModel from '../models/skillGap.model.js';
import * as recommendationModel from '../models/recommendation.model.js';
import { generateRecommendations } from '../services/ai.service.js';

function formatRecommendations(rows) {
  const career = rows.filter((r) => r.type === 'career');
  const courses = rows.filter((r) => r.type === 'course');
  return { career_paths: career, courses };
}

function toDbRows(parsed) {
  const careerRows = parsed.career_paths.map((c) => ({
    type: 'career',
    title: c.title,
    description: `${c.description} (Fit score: ${c.fit_score}%)`,
    url: null,
  }));

  const courseRows = parsed.courses.map((c) => ({
    type: 'course',
    title: c.title,
    description: `${c.provider} — covers ${c.covers_skill}`,
    url: c.url || null,
  }));

  return [...careerRows, ...courseRows];
}

export async function getRecommendations(req, res) {
  try {
    const resumeId = Number(req.params.resumeId);

    const owned = await resumeModel.belongsToUser(resumeId, req.user.id);
    if (!owned) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Resume not found',
      });
    }

    const cached = await recommendationModel.findByResumeId(resumeId);
    if (cached.length > 0) {
      return res.json({
        success: true,
        data: formatRecommendations(cached),
        error: null,
      });
    }

    const skillGaps = await skillGapModel.findByResumeId(resumeId);
    if (!skillGaps.length) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Run gap analysis first before generating recommendations.',
      });
    }

    const parsed = await generateRecommendations(skillGaps, req.user.id);
    const rows = toDbRows(parsed);

    await recommendationModel.bulkInsert(resumeId, rows);
    const saved = await recommendationModel.findByResumeId(resumeId);

    res.json({
      success: true,
      data: formatRecommendations(saved),
      error: null,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Failed to generate recommendations',
    });
  }
}

export async function refreshRecommendations(req, res) {
  try {
    const resumeId = Number(req.params.resumeId);

    const owned = await resumeModel.belongsToUser(resumeId, req.user.id);
    if (!owned) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Resume not found',
      });
    }

    const skillGaps = await skillGapModel.findByResumeId(resumeId);
    if (!skillGaps.length) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Run gap analysis first before generating recommendations.',
      });
    }

    await recommendationModel.deleteByResumeId(resumeId);
    const parsed = await generateRecommendations(skillGaps, req.user.id);
    const rows = toDbRows(parsed);

    await recommendationModel.bulkInsert(resumeId, rows);
    const saved = await recommendationModel.findByResumeId(resumeId);

    res.json({
      success: true,
      data: formatRecommendations(saved),
      error: null,
    });
  } catch (error) {
    console.error('Refresh recommendations error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Failed to refresh recommendations',
    });
  }
}
