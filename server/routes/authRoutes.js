import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../config/db.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return secret;
};

// --------------------------------------
// POST /api/auth/login
// --------------------------------------

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Both email/username and password are required.'
      });
    }

    const cleanIdentifier = email
      .trim()
      .toLowerCase();

    // Search using email
    let admin = await Admin.findOne({
      email: cleanIdentifier
    });

    // Search using username
    if (!admin) {
      admin = await Admin.findOne({
          username: cleanIdentifier 
        });
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const isMatch = bcrypt.compareSync(
      password,
      admin.passwordHash
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const payload = {
      id: admin._id || admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role || 'superadmin'
    };

    const token = jwt.sign(
      payload,
      getJwtSecret(),
      {
        expiresIn: '7d'
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin authorization successful.',
      token,
      user: payload
    });
  } catch (err) {
    console.error(
      '[AuthRoutes] Login error:',
      err
    );

    return res.status(500).json({
      success: false,
      message:
        'Internal server error during authentication.'
    });
  }
});

// --------------------------------------
// GET /api/auth/me
// --------------------------------------

router.get(
  '/me',
  requireAdminAuth,
  async (req, res) => {
    return res.status(200).json({
      success: true,
      user: req.admin
    });
  }
);

  export default router;