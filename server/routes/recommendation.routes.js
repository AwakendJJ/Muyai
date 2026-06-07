import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlan } from '../middleware/plan.middleware.js';
import { getRecommendations, refreshRecommendations } from '../controllers/recommendation.controller.js';

const router = Router();

router.use(authenticate, requirePlan('student'));

router.get('/:resumeId', getRecommendations);
router.post('/:resumeId/refresh', refreshRecommendations);

export default router;
