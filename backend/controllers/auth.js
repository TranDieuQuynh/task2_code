const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendPasswordResetEmail } = require('../services/emailService');
const { Op } = require('sequelize');
const { sendEmail } = require('../config/email');

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signUp = async (req, res) => {
  try {
    console.log('Signup request body:', req.body);
    const { name, email, password } = req.body;

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password
    });
    console.log('User created successfully:', user.id);

    // Generate JWT token
    const token = user.getSignedJwtToken();
    console.log('JWT token generated');

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Signup error details:', error);
    res.status(500).json({
      success: false,
      message: 'Error in registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/signin
// @access  Public
exports.signIn = async (req, res) => {
  try {
    console.log('Signin request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    console.log('Checking for user with email:', email);
    try {
      const user = await User.findOne({ 
        where: { 
          email: email.toString() 
        } 
      });
      
      if (!user) {
        console.log('User not found with email:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check if password matches
      console.log('Checking password match...');
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        console.log('Password does not match for user:', email);
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      console.log('Generating JWT token...');
      const token = user.getSignedJwtToken();

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      console.log('Signin successful for user:', email);
      res.status(200).json({
        success: true,
        token,
        user: userResponse
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }
  } catch (error) {
    console.error('Signin error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user profile',
      error: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate and hash reset token, also sets resetPasswordExpire
    const resetToken = user.getResetPasswordToken();
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const emailText = `To reset your password, click on this link: ${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    await sendEmail(
      user.email,
      'Password Reset Request',
      emailText
    );

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Email could not be sent'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Get token from URL parameters
    const { password } = req.body; // Get password from request body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    // Verify token by hashing the incoming token and comparing it with the hashed token in the database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { [Op.gt]: Date.now() } // Check if token is still valid
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in reset password',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    console.log('Update profile request body:', req.body);
    console.log('Update profile request files:', req.files);

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cập nhật thông tin cơ bản
    const updateFields = [
      'name', 'email', 'title', 'bio', 'location',
      'website', 'github', 'linkedin', 'twitter'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Xử lý upload file nếu có
    if (req.files) {
      if (req.files.avatar && req.files.avatar[0]) {
        user.avatar = req.files.avatar[0].filename;
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        user.coverImage = req.files.coverImage[0].filename;
      }
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Get user
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const token = user.getSignedJwtToken();
    const newRefreshToken = user.getRefreshToken();

    // Save new refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      token,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 