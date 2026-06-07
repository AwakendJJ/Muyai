import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
