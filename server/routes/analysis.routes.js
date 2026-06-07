import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlan } from '../middleware/plan.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { listJobRoles, runGapAnalysis, getGaps } from '../controllers/analysis.controller.js';

const router = Router();

router.use(authenticate, requirePlan('student'));

router.get('/job-roles', listJobRoles);
router.get('/gaps/:resumeId', getGaps);
router.post(
  '/gap',
  [
    body('resumeId').isInt({ min: 1 }).withMessage('Valid resumeId is required'),
    body('jobRoleId').isInt({ min: 1 }).withMessage('Valid jobRoleId is required'),
  ],
  validate,
  runGapAnalysis
);

export default router;
