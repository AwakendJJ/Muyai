import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlan } from '../middleware/plan.middleware.js';
import {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats,
} from '../controllers/applications.controller.js';

const router = Router();

router.use(authenticate, requirePlan('pro'));

router.get('/stats', getApplicationStats);
router.get('/', listApplications);
router.post('/', createApplication);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
