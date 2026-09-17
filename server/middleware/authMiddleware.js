import jwt from 'jsonwebtoken';
import { Admin } from '../config/db.js';

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
    const secret = process.env.JWT_SECRET || 'nexios_super_secret_jwt_key_2026_built_for_whats_next';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
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

    next();
  } catch (err) {
    console.error('[AuthMiddleware] Verification error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication server error.'
    });
  }
};
