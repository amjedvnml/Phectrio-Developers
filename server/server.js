import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import { connectDB, dbState } from './config/db.js';

import inquiryRoutes from './routes/inquiryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// --------------------------------------
// CORS
// --------------------------------------

const configuredOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || '').split(',')
]
  .map((origin) => origin?.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...configuredOrigins,

  ...(!isProduction
    ? [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
      ]
    : [])
]);

app.use(
  cors({
    origin(origin, callback) {
      // Requests from Postman/curl may not send an Origin header.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked request from origin: ${origin}`)
      );
    }
  })
);

// --------------------------------------
// Middleware
// --------------------------------------

app.use(
  express.json({
    limit: '1mb'
  })
);

app.use(
  morgan(isProduction ? 'combined' : 'dev')
);

// --------------------------------------
// Database
// --------------------------------------

await connectDB();

// --------------------------------------
// Health check
// --------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Nexios Developers API',

    database: {
      mode: dbState.mode,
      connected: dbState.connected,
      message: dbState.message
    }
  });
});

// --------------------------------------
// API routes
// --------------------------------------

app.use('/api/inquiries', inquiryRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/projects', projectRoutes);

// --------------------------------------
// API 404
// --------------------------------------

app.use('/api/*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`
  });
});

// --------------------------------------
// Global error handler
// --------------------------------------

app.use((err, req, res, next) => {
  console.error('[ServerError]', err);

  if (err.message?.startsWith('CORS blocked request')) {
    return res.status(403).json({
      success: false,
      message: 'Origin is not allowed to access this API.'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: isProduction
      ? undefined
      : err.message
  });
});

// --------------------------------------
// Start server
// --------------------------------------

app.listen(PORT, () => {
  console.log('====================================================');

  console.log(
    `>>> NEXIOS DEVELOPERS BACKEND RUNNING ON PORT ${PORT} <<<`
  );

  console.log(
    `>>> DB Mode: ${dbState.mode.toUpperCase()} (${dbState.message}) <<<`
  );

  console.log('====================================================');
});