import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlan } from '../middleware/plan.middleware.js';
import {
  listSessions,
  getSession,
  startSession,
  submitAnswer,
  deleteSession,
} from '../controllers/interview.controller.js';

const router = Router();

router.use(authenticate, requirePlan('pro'));

router.get('/sessions', listSessions);
router.get('/sessions/:id', getSession);
router.post('/sessions', startSession);
router.post('/sessions/:id/answer', submitAnswer);
router.delete('/sessions/:id', deleteSession);

export default router;
