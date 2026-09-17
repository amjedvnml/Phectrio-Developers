import express from 'express';
import { Project } from '../config/db.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/projects (Public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let list = await Project.find({});

    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: list.length,
      projects: list
    });
  } catch (err) {
    console.error('[ProjectRoutes] List error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve portfolio projects.' });
  }
});

// POST /api/projects (Protected Admin)
router.post('/', requireAdminAuth, async (req, res) => {
  try {
    const { title, category, description, imageUrl, tags, featured, metrics } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and description are required fields.'
      });
    }

    const newProject = await Project.create({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      featured: Boolean(featured),
      metrics: metrics ? metrics.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      project: newProject
    });
  } catch (err) {
    console.error('[ProjectRoutes] Creation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
});

// DELETE /api/projects/:id (Protected Admin)
router.delete('/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
      project: deleted
    });
  } catch (err) {
    console.error('[ProjectRoutes] Delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
});

export default router;
