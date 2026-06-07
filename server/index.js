import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { testConnection } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import resumeRoutes from './routes/resume.routes.js';
import analysisRoutes from './routes/analysis.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await testConnection();
    res.json({
      success: true,
      data: { status: 'ok', database: 'connected' },
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
  try {
    await testConnection();
    console.log('Database connected');
  } catch (error) {
    console.warn('Warning: Database not connected. Ensure MySQL is running and schema is imported.');
    console.warn(error.message);
  }

  app.listen(PORT, () => {
    console.log(`Muyai server running on http://localhost:${PORT}`);
  });
}

start();
