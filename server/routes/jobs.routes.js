import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlan } from '../middleware/plan.middleware.js';
import { listCountries, search, match } from '../controllers/jobs.controller.js';

const router = Router();

router.use(authenticate, requirePlan('pro'));

router.get('/countries', listCountries);
router.get('/search', search);
router.get('/match', match);

export default router;
