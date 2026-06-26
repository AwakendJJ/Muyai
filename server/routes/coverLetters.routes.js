import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { requirePlan } from '../middleware/plan.middleware.js';
import {
  listCoverLetters,
  getCoverLetter,
  generateCoverLetterHandler,
  updateCoverLetter,
  deleteCoverLetter,
} from '../controllers/coverLetters.controller.js';

const router = Router();

router.use(authenticate, requirePlan('pro'));

router.get('/', listCoverLetters);
router.get('/:id', getCoverLetter);
router.post('/generate', generateCoverLetterHandler);
router.patch('/:id', updateCoverLetter);
router.delete('/:id', deleteCoverLetter);

export default router;
