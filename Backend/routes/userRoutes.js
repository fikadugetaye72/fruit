const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (authentication required)
router.use(authMiddleware);

// Profile management
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);
router.delete('/account', userController.deleteAccount);

// Coin and reward system
router.post('/watch-ad', userController.watchAd);
router.post('/claim-daily-reward', userController.claimDailyReward);
router.post('/use-referral', userController.useReferralCode);
router.get('/referral-stats', userController.getReferralStats);
router.post('/spend-coins', userController.spendCoins);
router.get('/coin-history', userController.getCoinHistory);

// Statistics and preferences
router.get('/stats', userController.getUserStats);
router.put('/ad-preferences', userController.updateAdPreferences);
router.put('/notification-preferences', userController.updateNotificationPreferences);

module.exports = router; 