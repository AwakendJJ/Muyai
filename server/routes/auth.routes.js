import { Router } from 'express';
import { sync, me } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/sync', sync);
router.get('/me', authenticate, me);

export default router;
