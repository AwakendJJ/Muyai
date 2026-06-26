import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlan } from '../middleware/plan.middleware.js';
import { getMessages, sendMessage, clearMessages } from '../controllers/coach.controller.js';

const router = Router();

router.use(authenticate, requirePlan('pro'));

router.get('/messages', getMessages);
router.post('/chat', sendMessage);
router.delete('/messages', clearMessages);

export default router;
