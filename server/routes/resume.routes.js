import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware.js';
import { checkScanLimit } from '../middleware/plan.middleware.js';
import { listResumes, uploadResume, getSkills } from '../controllers/resume.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

router.use(authenticate);

router.get('/', listResumes);
router.post('/upload', checkScanLimit, upload.single('resume'), uploadResume);
router.get('/:id/skills', getSkills);

export default router;
