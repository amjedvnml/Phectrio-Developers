import jwt from 'jsonwebtoken';
import { Admin } from '../config/db.js';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return secret;
};

export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No bearer authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;

    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (err) {
      if (err.message === 'JWT_SECRET is not configured.') {
        throw err;
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.'
      });
    }

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account not found or deactivated.'
      });
    }

    req.admin = {
      id: admin._id || admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    };

    return next();
  } catch (err) {
    console.error('[AuthMiddleware] Verification error:', err);

    return res.status(500).json({
      success: false,
      message: 'Internal authentication server error.'
    });
  }
};  