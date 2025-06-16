const express = require('express');
const { check } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/project');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { Project, User } = require('../models');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', getProject);

// @route   POST /api/projects
// @desc    Create project
// @access  Private
router.post(
  '/',
  [
    protect,
    upload.single('image'),
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('technologies', 'At least one technology is required').isArray({ min: 1 })
    ]
  ],
  createProject
);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', protect, upload.single('image'), updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', protect, deleteProject);

// @route   GET /api/projects/debug/all
// @desc    Get all projects with detailed information
// @access  Public
router.get('/debug/all', async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    console.error('Debug route error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 