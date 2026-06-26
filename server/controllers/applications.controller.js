import * as applicationModel from '../models/application.model.js';

const VALID_STATUSES = new Set(['saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn']);

function mapApplication(row) {
  return {
    id: row.id,
    job_title: row.job_title,
    company: row.company,
    location: row.location,
    job_url: row.job_url,
    status: row.status,
    notes: row.notes,
    applied_at: row.applied_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listApplications(req, res) {
  try {
    const [applications, stats] = await Promise.all([
      applicationModel.findByUser(req.user.id),
      applicationModel.getStats(req.user.id),
    ]);

    res.json({
      success: true,
      data: {
        applications: applications.map(mapApplication),
        stats,
      },
      error: null,
    });
  } catch (error) {
    console.error('List applications error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to fetch applications' });
  }
}

export async function createApplication(req, res) {
  try {
    const { job_title, company, location, job_url, status, notes, applied_at } = req.body;

    if (!job_title?.trim() || !company?.trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Job title and company are required',
      });
    }

    if (status && !VALID_STATUSES.has(status)) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid status' });
    }

    const application = await applicationModel.create({
      userId: req.user.id,
      jobTitle: job_title.trim(),
      company: company.trim(),
      location: location?.trim(),
      jobUrl: job_url?.trim(),
      status: status || 'saved',
      notes: notes?.trim(),
      appliedAt: applied_at || (status === 'applied' ? new Date().toISOString() : null),
    });

    res.status(201).json({
      success: true,
      data: { application: mapApplication(application) },
      error: null,
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to create application' });
  }
}

export async function updateApplication(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid application id' });
    }

    const exists = await applicationModel.belongsToUser(id, req.user.id);
    if (!exists) {
      return res.status(404).json({ success: false, data: null, error: 'Application not found' });
    }

    const { job_title, company, location, job_url, status, notes, applied_at } = req.body;

    if (status && !VALID_STATUSES.has(status)) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid status' });
    }

    const application = await applicationModel.update(id, req.user.id, {
      jobTitle: job_title?.trim(),
      company: company?.trim(),
      location,
      jobUrl: job_url,
      status,
      notes,
      appliedAt: applied_at !== undefined
        ? applied_at
        : status === 'applied'
          ? new Date().toISOString()
          : undefined,
    });

    res.json({
      success: true,
      data: { application: mapApplication(application) },
      error: null,
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to update application' });
  }
}

export async function deleteApplication(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, data: null, error: 'Invalid application id' });
    }

    const exists = await applicationModel.belongsToUser(id, req.user.id);
    if (!exists) {
      return res.status(404).json({ success: false, data: null, error: 'Application not found' });
    }

    await applicationModel.remove(id, req.user.id);

    res.json({ success: true, data: { deleted: true }, error: null });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to delete application' });
  }
}

export async function getApplicationStats(req, res) {
  try {
    const stats = await applicationModel.getStats(req.user.id);
    res.json({ success: true, data: { stats }, error: null });
  } catch (error) {
    console.error('Application stats error:', error);
    res.status(500).json({ success: false, data: null, error: 'Failed to fetch stats' });
  }
}
