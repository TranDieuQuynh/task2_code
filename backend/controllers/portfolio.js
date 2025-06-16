const User = require('../models/User');

// @desc    Get portfolio
// @route   GET /api/portfolio/:userId
// @access  Public
exports.getPortfolio = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password', 'refreshToken', 'resetPasswordToken', 'resetPasswordExpire'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update portfolio
// @route   PUT /api/portfolio
// @access  Private
exports.updatePortfolio = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      bio: req.body.bio,
      location: req.body.location,
      website: req.body.website,
      github: req.body.github,
      linkedin: req.body.linkedin,
      twitter: req.body.twitter
    };

    // Handle avatar upload
    if (req.file) {
      fieldsToUpdate.avatar = req.file.filename;
    }

    const user = await User.findByPk(req.user.id);
    await user.update(fieldsToUpdate);

    // Get updated user without sensitive data
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refreshToken', 'resetPasswordToken', 'resetPasswordExpire'] }
    });

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 