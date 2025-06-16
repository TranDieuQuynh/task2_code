const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting projects',
      error: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['name', 'avatar']
      }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    console.log('Received request for createProject:', { body: req.body, file: req.file });
    // Add user to req.body
    req.body.userId = req.user.id;

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.filename;
    }

    // Xử lý trường technologies: chuyển chuỗi thành mảng nếu cần
    if (req.body.technologies && typeof req.body.technologies === 'string') {
      req.body.technologies = req.body.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');
    }

    console.log('Request Body for createProject (after processing):', req.body);
    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    console.log('=== Update Project Debug ===');
    console.log('Request user:', {
      id: req.user.id,
      email: req.user.email
    });
    console.log('Project ID to update:', req.params.id);
    console.log('Request body:', req.body);

    let project = await Project.findByPk(req.params.id);
    console.log('Found project:', project ? {
      id: project.id,
      userId: project.userId,
      title: project.title
    } : 'Not found');

    if (!project) {
      console.log('Project not found');
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.filename;
    }

    // Xử lý trường technologies: chuyển chuỗi thành mảng nếu cần
    if (req.body.technologies && typeof req.body.technologies === 'string') {
      req.body.technologies = req.body.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');
    }

    await project.update(req.body);
    console.log('Project updated successfully');

    res.json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    console.log('=== Delete Project Debug ===');
    console.log('Request user:', {
      id: req.user.id,
      email: req.user.email
    });
    console.log('Project ID to delete:', req.params.id);

    const project = await Project.findByPk(req.params.id);
    console.log('Found project:', project ? {
      id: project.id,
      userId: project.userId,
      title: project.title
    } : 'Not found');

    if (!project) {
      console.log('Project not found');
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure user is project owner
    console.log('Ownership check:', {
      projectUserId: project.userId,
      requestUserId: req.user.id,
      isOwner: Number(project.userId) === Number(req.user.id),
      types: {
        projectUserId: typeof project.userId,
        requestUserId: typeof req.user.id
      }
    });

    // Convert both IDs to numbers for comparison
    if (Number(project.userId) !== Number(req.user.id)) {
      console.log('User is not the owner of this project');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await project.destroy();
    console.log('Project deleted successfully');

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 