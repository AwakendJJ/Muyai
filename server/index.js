import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { testConnection } from './config/db.js';
import { initFirebaseAdmin } from './config/firebase.js';
import { isAIConfigured } from './services/ai.service.js';
import { corsMiddlewareOptions } from './config/cors.js';
import { checkPhase5Tables } from './config/schemaCheck.js';
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import jobsRoutes from './routes/jobs.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import coverLettersRoutes from './routes/coverLetters.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import coachRoutes from './routes/coach.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsMiddlewareOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/cover-letters', coverLettersRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await testConnection();
    const parse = getParseConfig();
    const phase5 = await checkPhase5Tables();
    res.json({
      success: true,
      data: {
        status: 'ok',
        database: 'connected',
        phase5: phase5.ready ? 'ready' : 'missing_tables',
        phase5_tables: phase5.tables,
        ai: {
          configured: isAIConfigured(),
          provider: process.env.AI_PROVIDER || 'claude',
          model: process.env.AI_MODEL || 'default',
        },
        jobs: {
          remotive: true,
          ethiojobs: parse.isConfigured,
          parse_scraper_id: parse.scraperId,
          adzuna: Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
        },
      },
      error: null,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      data: null,
      error: 'Database connection failed',
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    error: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      data: null,
      error: err.code === 'LIMIT_FILE_SIZE' ? 'File must be under 5MB' : err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    data: null,
    error: err.message || 'Internal server error',
  });
});

async function start() {
  initFirebaseAdmin();

  try {
    await testConnection();
    console.log('Database connected');

    const phase5 = await checkPhase5Tables();
    if (!phase5.ready) {
      const missing = Object.entries(phase5.tables)
        .filter(([, ok]) => !ok)
        .map(([name]) => name);
      console.warn(
        `Warning: Phase 5 tables missing (${missing.join(', ')}). ` +
          'Run database/phase5-only.sql in Supabase SQL Editor or: node scripts/apply-phase5-schema.js'
      );
    }
  } catch (error) {
    console.warn('Warning: Supabase not connected. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
    console.warn(error.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`Muyai server running on http://localhost:${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the other process or change PORT in .env`);
      console.error(`Windows: netstat -ano | findstr :${PORT}  then  taskkill /PID <pid> /F`);
    } else {
      console.error('Server error:', error.message);
    }
    process.exit(1);
  });
}

start();
