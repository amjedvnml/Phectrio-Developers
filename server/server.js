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

// Configure CORS
app.use(cors({
  origin: true, // Allow frontend dev ports dynamically
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Database initialization
await connectDB();

// Health check
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

// API Routes
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/projects', projectRoutes);

// Fallback 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`>>> NEXIOS DEVELOPERS BACKEND RUNNING ON PORT ${PORT} <<<`);
  console.log(`>>> DB Mode: ${dbState.mode.toUpperCase()} (${dbState.message}) <<<`);
  console.log(`====================================================`);
});
