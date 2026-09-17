import express from 'express';
import { Inquiry, dbState, seedDefaultData } from '../config/db.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply admin authentication to all admin routes
router.use(requireAdminAuth);

// GET /api/admin/stats (Aggregated metrics)
router.get('/stats', async (req, res) => {
  try {
    const inquiries = await Inquiry.find({});
    const totalInquiries = inquiries.length;
    const pendingLeads = inquiries.filter(i => i.status === 'New').length;
    const inProgress = inquiries.filter(i => i.status === 'In Progress').length;
    const completed = inquiries.filter(i => i.status === 'Completed').length;
    const archived = inquiries.filter(i => i.status === 'Archived').length;

    const conversionRate = totalInquiries > 0 
      ? Number(((completed / totalInquiries) * 100).toFixed(1))
      : 0;

    // Service Breakdown
    const serviceBreakdown = inquiries.reduce((acc, curr) => {
      acc[curr.service] = (acc[curr.service] || 0) + 1;
      return acc;
    }, {});

    // Budget Tier Breakdown
    const budgetBreakdown = inquiries.reduce((acc, curr) => {
      acc[curr.budget] = (acc[curr.budget] || 0) + 1;
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      stats: {
        totalInquiries,
        pendingLeads,
        inProgress,
        completed,
        archived,
        conversionRate,
        serviceBreakdown,
        budgetBreakdown,
        dbMode: dbState.mode,
        dbStatus: dbState.message
      }
    });
  } catch (err) {
    console.error('[AdminRoutes] Stats error:', err);
    return res.status(500).json({ success: false, message: 'Failed to aggregate admin statistics.' });
  }
});

// GET /api/admin/inquiries (List with filters)
router.get('/inquiries', async (req, res) => {
  try {
    const { status, service, search } = req.query;
    let list = await Inquiry.find({});

    if (status && status !== 'All') {
      list = list.filter(i => i.status === status);
    }
    if (service && service !== 'All') {
      list = list.filter(i => i.service === service);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(i => 
        (i.name && i.name.toLowerCase().includes(q)) ||
        (i.email && i.email.toLowerCase().includes(q)) ||
        (i.message && i.message.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: list.length,
      inquiries: list
    });
  } catch (err) {
    console.error('[AdminRoutes] Inquiries list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve inquiries list.' });
  }
});

// PATCH /api/admin/inquiries/:id (Update status)
router.patch('/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'In Progress', 'Completed', 'Archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Inquiry status updated to ${status}.`,
      inquiry: updated
    });
  } catch (err) {
    console.error('[AdminRoutes] Status update error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update inquiry status.' });
  }
});

// DELETE /api/admin/inquiries/:id (Delete lead)
router.delete('/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Inquiry.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Inquiry record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully.',
      inquiry: deleted
    });
  } catch (err) {
    console.error('[AdminRoutes] Delete inquiry error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete inquiry.' });
  }
});

// POST /api/admin/seed (Reset / re-populate default showcase data)
router.post('/seed', async (req, res) => {
  try {
    await seedDefaultData();
    return res.status(200).json({
      success: true,
      message: 'Database re-seeded successfully with demo inquiries and portfolio assets.'
    });
  } catch (err) {
    console.error('[AdminRoutes] Re-seed error:', err);
    return res.status(500).json({ success: false, message: 'Failed to reset seed data.' });
  }
});

export default router;
