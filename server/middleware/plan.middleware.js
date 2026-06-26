import * as userModel from '../models/user.model.js';
import * as resumeModel from '../models/resume.model.js';
import { PLAN_GATING_ENABLED } from '../config/plan.js';

const PLAN_RANK = { free: 0, student: 1, pro: 2 };
const FREE_SCAN_LIMIT = 2;

export function requirePlan(minimumPlan) {
  return async (req, res, next) => {
    if (!PLAN_GATING_ENABLED) {
      return next();
    }

    try {
      const user = await userModel.findById(req.user.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          data: null,
          error: 'User not found',
        });
      }

      req.userPlan = user.plan;

      if (PLAN_RANK[user.plan] < PLAN_RANK[minimumPlan]) {
        return res.status(403).json({
          success: false,
          data: null,
          error: `${minimumPlan} plan or above required. Upgrade to access this feature.`,
        });
      }

      next();
    } catch (error) {
      console.error('Plan check error:', error);
      res.status(500).json({
        success: false,
        data: null,
        error: 'Failed to verify plan',
      });
    }
  };
}

export async function checkScanLimit(req, res, next) {
  if (!PLAN_GATING_ENABLED) {
    return next();
  }

  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'User not found',
      });
    }

    req.userPlan = user.plan;

    if (user.plan === 'free') {
      const count = await resumeModel.countByUser(req.user.id);

      if (count >= FREE_SCAN_LIMIT) {
        return res.status(403).json({
          success: false,
          data: null,
          error: `Free plan allows ${FREE_SCAN_LIMIT} resume scans. Upgrade to student for unlimited scans.`,
        });
      }
    }

    next();
  } catch (error) {
    console.error('Scan limit error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to verify scan limit',
    });
  }
}
