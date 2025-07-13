const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserController {
  // User Registration
  async register(req, res) {
    try {
      const { username, email, password, firstName, lastName, referralCode } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this email or username already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Generate referral code
      const newReferralCode = `USER${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create user
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        referralCode: newReferralCode,
        accountStatus: 'active'
      });

      // Process referral if provided
      if (referralCode) {
        await this.processReferral(referralCode, user.id);
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        data: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // User Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check account status
      if (user.accountStatus !== 'active') {
        return res.status(403).json({
          success: false,
          error: 'Account is not active'
        });
      }

      // Update last login
      await user.update({
        lastLoginAt: new Date(),
        lastActivityAt: new Date()
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        data: userResponse,
        token
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get User Profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
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

  // Update User Profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { firstName, lastName, phone, notificationPreferences } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update({
        firstName,
        lastName,
        phone,
        notificationPreferences,
        lastActivityAt: new Date()
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

  // Change Password
  async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      await user.update({
        password: hashedNewPassword,
        lastActivityAt: new Date()
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

  // Watch Ad (Earn Coins)
  async watchAd(req, res) {
    try {
      const userId = req.user.userId;
      const { adType, duration, reward } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if user can watch ads today
      const today = new Date().toDateString();
      const lastWatch = user.lastAdWatchDate?.toDateString();

      if (lastWatch !== today) {
        user.adsWatchedToday = 0;
      }

      if (user.adsWatchedToday >= user.maxAdsPerDay) {
        return res.status(400).json({
          success: false,
          error: 'Daily ad watching limit reached'
        });
      }

      // Add coins
      const coinsEarned = reward || 5; // Default 5 coins per ad
      user.coins += coinsEarned;
      user.totalCoinsEarned += coinsEarned;
      user.adsWatchedToday += 1;
      user.lastAdWatchDate = new Date();
      user.lastActivityAt = new Date();

      await user.save();

      res.status(200).json({
        success: true,
        data: {
          coinsEarned,
          newBalance: user.coins,
          adsWatchedToday: user.adsWatchedToday,
          maxAdsPerDay: user.maxAdsPerDay
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Claim Daily Reward
  async claimDailyReward(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const today = new Date().toDateString();
      const lastReward = user.lastDailyRewardDate?.toDateString();

      if (lastReward === today) {
        return res.status(400).json({
          success: false,
          error: 'Daily reward already claimed today'
        });
      }

      // Calculate reward
      const baseReward = 10;
      const streakBonus = Math.floor(user.dailyRewardStreak / 7) * 5;
      const vipMultiplier = user.isVIP ? 1.5 : 1;
      const totalReward = Math.floor((baseReward + streakBonus) * vipMultiplier);

      // Update user
      user.coins += totalReward;
      user.totalCoinsEarned += totalReward;
      user.dailyRewardStreak += 1;
      user.maxDailyRewardStreak = Math.max(user.maxDailyRewardStreak, user.dailyRewardStreak);
      user.lastDailyRewardDate = new Date();
      user.lastActivityAt = new Date();

      await user.save();

      res.status(200).json({
        success: true,
        data: {
          reward: totalReward,
          newBalance: user.coins,
          streak: user.dailyRewardStreak,
          maxStreak: user.maxDailyRewardStreak
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Use Referral Code
  async useReferralCode(req, res) {
    try {
      const userId = req.user.userId;
      const { referralCode } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      if (user.referredBy) {
        return res.status(400).json({
          success: false,
          error: 'User has already used a referral code'
        });
      }

      // Find referrer
      const referrer = await User.findOne({
        where: { referralCode }
      });

      if (!referrer) {
        return res.status(400).json({
          success: false,
          error: 'Invalid referral code'
        });
      }

      if (referrer.id === userId) {
        return res.status(400).json({
          success: false,
          error: 'Cannot use your own referral code'
        });
      }

      // Process referral
      await this.processReferral(referralCode, userId);

      res.status(200).json({
        success: true,
        message: 'Referral code applied successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Process Referral (Helper method)
  async processReferral(referralCode, referredUserId) {
    try {
      const referrer = await User.findOne({
        where: { referralCode }
      });

      if (!referrer) return;

      const referred = await User.findByPk(referredUserId);
      if (!referred) return;

      // Reward referrer
      referrer.coins += 100;
      referrer.referralCount += 1;
      referrer.referralRewardsEarned += 100;
      referrer.totalCoinsEarned += 100;

      // Reward referred user
      referred.coins += 50;
      referred.referredBy = referrer.id;
      referred.totalCoinsEarned += 50;

      await referrer.save();
      await referred.save();
    } catch (error) {
      console.error('Error processing referral:', error);
    }
  }

  // Get Referral Statistics
  async getReferralStats(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId, {
        include: [{
          model: User,
          as: 'referrals',
          attributes: ['id', 'username', 'firstName', 'lastName', 'createdAt']
        }]
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          referralCode: user.referralCode,
          referralCount: user.referralCount,
          referralRewardsEarned: user.referralRewardsEarned,
          referrals: user.referrals
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Spend Coins
  async spendCoins(req, res) {
    try {
      const userId = req.user.userId;
      const { amount, itemId, reason } = req.body;

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
          error: 'Insufficient coins'
        });
      }

      // Update coins
      user.coins -= amount;
      user.totalCoinsSpent += amount;
      user.lastActivityAt = new Date();

      await user.save();

      res.status(200).json({
        success: true,
        data: {
          coinsSpent: amount,
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

  // Get Coin History
  async getCoinHistory(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          currentCoins: user.coins,
          totalEarned: user.totalCoinsEarned,
          totalSpent: user.totalCoinsSpent,
          totalPurchased: user.totalCoinsPurchased,
          rewardLevel: user.rewardLevel,
          isVIP: user.isVIP
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get User Statistics
  async getUserStats(req, res) {
    try {
      const userId = req.user.userId;
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          totalOrders: user.totalOrders,
          totalSpent: user.totalSpent,
          averageOrderValue: user.averageOrderValue,
          dailyRewardStreak: user.dailyRewardStreak,
          maxDailyRewardStreak: user.maxDailyRewardStreak,
          totalAchievements: user.totalAchievements,
          referralCount: user.referralCount,
          lastLoginAt: user.lastLoginAt,
          lastActivityAt: user.lastActivityAt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update Ad Preferences
  async updateAdPreferences(req, res) {
    try {
      const userId = req.user.userId;
      const { adPreferences } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update({
        adPreferences,
        lastActivityAt: new Date()
      });

      res.status(200).json({
        success: true,
        data: user.adPreferences
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update Notification Preferences
  async updateNotificationPreferences(req, res) {
    try {
      const userId = req.user.userId;
      const { notificationPreferences } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await user.update({
        notificationPreferences,
        lastActivityAt: new Date()
      });

      res.status(200).json({
        success: true,
        data: user.notificationPreferences
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete Account
  async deleteAccount(req, res) {
    try {
      const userId = req.user.userId;
      const { password } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid password'
        });
      }

      // Soft delete - update account status
      await user.update({
        accountStatus: 'banned',
        lastActivityAt: new Date()
      });

      res.status(200).json({
        success: true,
        message: 'Account deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController(); 