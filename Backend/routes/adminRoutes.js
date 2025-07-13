const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const superAdminMiddleware = require('../middlewares/superAdminMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Protected routes (admin authentication required)
router.use(adminAuthMiddleware);

// Admin profile management
router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.updateProfile);
router.put('/change-password', adminController.changePassword);

// Dashboard and statistics
router.get('/dashboard', adminController.getDashboardStats);
router.get('/system-settings', adminController.getSystemSettings);

// User management (Admin only)
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.put('/users/:userId', adminController.updateUser);
router.post('/users/:userId/suspend', adminController.suspendUser);
router.post('/users/:userId/add-coins', adminController.addCoinsToUser);
router.post('/users/:userId/deduct-coins', adminController.deductCoinsFromUser);

// Admin management (Super Admin only)
router.use(superAdminMiddleware);
router.get('/admins', adminController.getAllAdmins);
router.put('/admins/:adminId', adminController.updateAdmin);
router.delete('/admins/:adminId', adminController.deleteAdmin);
router.put('/system-settings', adminController.updateSystemSettings);

module.exports = router; 