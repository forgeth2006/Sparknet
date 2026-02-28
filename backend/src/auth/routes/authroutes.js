const express = require('express');
const router = express.Router();
const {
  register, login, logout, logoutAll, refreshToken,
  verifyEmail, resendVerification,
  forgotPassword, resetPassword, changePassword,
  getMe,
} = require('../controllers/authcontroller');
const { protect } = require('../../middleware/auth');
const { loginLimiter, registerLimiter, sensitiveActionLimiter } = require('../../middleware/rateLimiter');

// Public
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refreshToken);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', sensitiveActionLimiter, resendVerification);
router.post('/forgot-password', sensitiveActionLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected
router.use(protect);
router.get('/me', getMe);
router.post('/logout', logout);
router.post('/logout-all', logoutAll);
router.post('/change-password', changePassword);

module.exports = router;
