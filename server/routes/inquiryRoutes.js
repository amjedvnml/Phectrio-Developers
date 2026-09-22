import express from 'express';
import { Inquiry } from '../config/db.js';

const router = express.Router();

// Email regex validator
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// POST /api/inquiries (Public lead generation endpoint)
router.post('/', async (req, res) => {
  try {
    const { name, email, service, budget, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your full name or company name.' });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid business email address.' });
    }

    if (!service || !service.trim()) {
      return res.status(400).json({ success: false, message: 'Please select a primary service needed.' });
    }

    if (!budget || !budget.trim()) {
      return res.status(400).json({ success: false, message: 'Please select an estimated project budget range.' });
    }

    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Please share a brief project summary (min 10 characters).' });
    }

    const newInquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      service: service.trim(),
      budget: budget.trim(),
      message: message.trim(),
      status: 'New'
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry received successfully. A Phectrio partner will connect with you within 24 hours.',
      inquiry: newInquiry
    });
  } catch (err) {
    console.error('[InquiryRoutes] Creation error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process inquiry submission. Please try again or reach out to partner@Phectrio.dev.'
    });
  }
});

export default router;
