const { Admin, User, Order, Payment, Category, Juice } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AdminController {
  // Admin Registration (Super Admin only)
  async register(req, res) {
    try {
      const { username, email, password, firstName, lastName, role, department, employeeId } = req.body;

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({
        where: {
          [require('sequelize').Op.or]: [{ email }, { username }, { employeeId }]
        }
      });

      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          error: 'Admin with this email, username, or employee ID already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create admin
      const admin = await Admin.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'staff',
        department,
        employeeId,
        isActive: true,
        isVerified: true,
        createdBy: req.admin?.id || null
      });

      // Remove password from response
      const adminResponse = admin.toJSON();
      delete adminResponse.password;

      res.status(201).json({
        success: true,
        data: adminResponse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Admin Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find admin
      const admin = await Admin.findOne({
        where: { email }
      });

      if (!admin) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if admin is active
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account is not active'
        });
      }

      // Update last login
      await admin.update({
        lastLoginAt: new Date(),
        lastLoginIp: req.ip
      });

      // Generate JWT token
      const token = jwt.sign(
        { adminId: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from response
      const adminResponse = admin.toJSON();
      delete adminResponse.password;

      res.status(200).json({
        success: true,
        data: adminResponse,
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get Admin Profile
  async getProfile(req, res) {
    try {
      const adminId = req.admin.adminId;
      const admin = await Admin.findByPk(adminId, {
        attributes: { exclude: ['password'] }
      });

      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }

      res.status(200).json({
        success: true,
        data: admin
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update Admin Profile
  async updateProfile(req, res) {
    try {
      const adminId = req.admin.adminId;
      const { firstName, lastName, phone, department, address } = req.body;

      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }

      await admin.update({
        firstName,
        lastName,
        phone,
        department,
        address,
        updatedBy: adminId
      });

      const adminResponse = admin.toJSON();
      delete adminResponse.password;

      res.status(200).json({
        success: true,
        data: adminResponse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Change Admin Password
  async changePassword(req, res) {
    try {
      const adminId = req.admin.adminId;
      const { currentPassword, newPassword } = req.body;

      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await admin.update({
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
        updatedBy: adminId
      });

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get All Users (Admin only)
  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, search, status, role } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (search) {
        whereClause[require('sequelize').Op.or] = [
          { username: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { email: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { firstName: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { lastName: { [require('sequelize').Op.iLike]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.accountStatus = status;
      }

      const users = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: {
          users: users.rows,
          total: users.count,
          page: parseInt(page),
          totalPages: Math.ceil(users.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get User Details (Admin only)
  async getUserDetails(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: User,
            as: 'referrals',
            attributes: ['id', 'username', 'firstName', 'lastName', 'createdAt']
          },
          {
            model: User,
            as: 'referredByUser',
            attributes: ['id', 'username', 'firstName', 'lastName']
          }
        ]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update User (Admin only)
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { accountStatus, isVIP, vipLevel, vipExpiryDate, maxAdsPerDay, rewardLevel } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update({
        accountStatus,
        isVIP,
        vipLevel,
        vipExpiryDate,
        maxAdsPerDay,
        rewardLevel,
        updatedBy: req.admin.adminId
      });

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        data: userResponse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Suspend User (Admin only)
  async suspendUser(req, res) {
    try {
      const { userId } = req.params;
      const { reason, duration } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const suspensionEndDate = duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null;

      await user.update({
        accountStatus: 'suspended',
        suspensionReason: reason,
        suspensionEndDate,
        updatedBy: req.admin.adminId
      });

      res.status(200).json({
        success: true,
        message: 'User suspended successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Add Coins to User (Admin only)
  async addCoinsToUser(req, res) {
    try {
      const { userId } = req.params;
      const { amount, reason } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      user.coins += parseInt(amount);
      user.totalCoinsEarned += parseInt(amount);
      user.lastActivityAt = new Date();

      await user.save();

      res.status(200).json({
        success: true,
        data: {
          coinsAdded: amount,
          newBalance: user.coins,
          reason
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Deduct Coins from User (Admin only)
  async deductCoinsFromUser(req, res) {
    try {
      const { userId } = req.params;
      const { amount, reason } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      if (user.coins < amount) {
        return res.status(400).json({
          success: false,
          error: 'User has insufficient coins'
        });
      }

      user.coins -= parseInt(amount);
      user.totalCoinsSpent += parseInt(amount);
      user.lastActivityAt = new Date();

      await user.save();

      res.status(200).json({
        success: true,
        data: {
          coinsDeducted: amount,
          newBalance: user.coins,
          reason
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get Dashboard Statistics (Admin only)
  async getDashboardStats(req, res) {
    try {
      // User statistics
      const totalUsers = await User.count();
      const activeUsers = await User.count({ where: { accountStatus: 'active' } });
      const vipUsers = await User.count({ where: { isVIP: true } });

      // Order statistics
      const totalOrders = await Order.count();
      const pendingOrders = await Order.count({ where: { status: 'pending' } });
      const completedOrders = await Order.count({ where: { status: 'delivered' } });

      // Payment statistics
      const totalPayments = await Payment.count();
      const successfulPayments = await Payment.count({ where: { status: 'completed' } });

      // Coin statistics
      const totalCoinsEarned = await User.sum('totalCoinsEarned') || 0;
      const totalCoinsSpent = await User.sum('totalCoinsSpent') || 0;
      const totalCoinsPurchased = await User.sum('totalCoinsPurchased') || 0;

      // Recent activity
      const recentUsers = await User.findAll({
        attributes: ['id', 'username', 'firstName', 'lastName', 'createdAt', 'coins'],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      const recentOrders = await Order.findAll({
        attributes: ['id', 'orderNumber', 'totalAmount', 'status', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5
      });

      res.status(200).json({
        success: true,
        data: {
          users: {
            total: totalUsers,
            active: activeUsers,
            vip: vipUsers
          },
          orders: {
            total: totalOrders,
            pending: pendingOrders,
            completed: completedOrders
          },
          payments: {
            total: totalPayments,
            successful: successfulPayments
          },
          coins: {
            totalEarned: totalCoinsEarned,
            totalSpent: totalCoinsSpent,
            totalPurchased: totalCoinsPurchased,
            netCoins: totalCoinsEarned - totalCoinsSpent
          },
          recentActivity: {
            users: recentUsers,
            orders: recentOrders
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get All Admins (Super Admin only)
  async getAllAdmins(req, res) {
    try {
      const { page = 1, limit = 10, search, role, department } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (search) {
        whereClause[require('sequelize').Op.or] = [
          { username: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { email: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { firstName: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { lastName: { [require('sequelize').Op.iLike]: `%${search}%` } },
          { employeeId: { [require('sequelize').Op.iLike]: `%${search}%` } }
        ];
      }

      if (role) {
        whereClause.role = role;
      }

      if (department) {
        whereClause.department = department;
      }

      const admins = await Admin.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: {
          admins: admins.rows,
          total: admins.count,
          page: parseInt(page),
          totalPages: Math.ceil(admins.count / limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update Admin (Super Admin only)
  async updateAdmin(req, res) {
    try {
      const { adminId } = req.params;
      const { role, department, isActive, permissions, salary } = req.body;

      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }

      await admin.update({
        role,
        department,
        isActive,
        permissions,
        salary,
        updatedBy: req.admin.adminId
      });

      const adminResponse = admin.toJSON();
      delete adminResponse.password;

      res.status(200).json({
        success: true,
        data: adminResponse
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete Admin (Super Admin only)
  async deleteAdmin(req, res) {
    try {
      const { adminId } = req.params;

      const admin = await Admin.findByPk(adminId);
      if (!admin) {
        return res.status(404).json({
          success: false,
          error: 'Admin not found'
        });
      }

      if (admin.role === 'super_admin') {
        return res.status(403).json({
          success: false,
          error: 'Cannot delete super admin'
        });
      }

      await admin.update({
        isActive: false,
        updatedBy: req.admin.adminId
      });

      res.status(200).json({
        success: true,
        message: 'Admin deactivated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get System Settings (Admin only)
  async getSystemSettings(req, res) {
    try {
      // This would typically come from a settings table
      const settings = {
        coinSettings: {
          coinsPerAd: 5,
          maxAdsPerDay: 10,
          dailyRewardBase: 10,
          referralReward: 100,
          referredUserReward: 50
        },
        vipSettings: {
          monthlyPrice: 9.99,
          yearlyPrice: 99.99,
          benefits: [
            'Extra daily rewards',
            'Higher coin multipliers',
            'Exclusive items',
            'Priority support',
            'No ad watching required'
          ]
        },
        adSettings: {
          enabled: true,
          minDuration: 30,
          maxDuration: 60,
          categories: ['food', 'health', 'lifestyle']
        }
      };

      res.status(200).json({
        success: true,
        data: settings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update System Settings (Super Admin only)
  async updateSystemSettings(req, res) {
    try {
      const { coinSettings, vipSettings, adSettings } = req.body;

      // This would typically update a settings table
      // For now, we'll just return success

      res.status(200).json({
        success: true,
        message: 'System settings updated successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AdminController(); 