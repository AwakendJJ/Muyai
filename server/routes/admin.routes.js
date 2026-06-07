import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/admin.middleware.js';
import { getUsers, getUsage } from '../controllers/admin.controller.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users', getUsers);
router.get('/usage', getUsage);

export default router;
