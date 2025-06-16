const express = require('express');
const { getPortfolio, updatePortfolio } = require('../controllers/portfolio');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/portfolio/:userId
// @desc    Get portfolio
// @access  Public
router.get('/:userId', getPortfolio);

// @route   PUT /api/portfolio
// @desc    Update portfolio
// @access  Private
router.put('/', protect, upload.single('avatar'), updatePortfolio);

module.exports = router; 