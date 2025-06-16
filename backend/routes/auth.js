const express = require('express');
const router = express.Router();
const { signUp, signIn, getMe, forgotPassword, resetPassword, updateProfile } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), updateProfile);

module.exports = router; 