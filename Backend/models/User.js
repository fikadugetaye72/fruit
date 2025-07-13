const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Coin and Reward System
  coins: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalCoinsEarned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalCoinsSpent: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Ad Watching System
  adsWatchedToday: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  maxAdsPerDay: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },
  lastAdWatchDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Reward System
  rewardPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalRewardPoints: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  rewardLevel: {
    type: DataTypes.ENUM('bronze', 'silver', 'gold', 'platinum', 'diamond'),
    allowNull: false,
    defaultValue: 'bronze'
  },
  // Referral System
  referralCode: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true
  },
  referredBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  referralCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  referralRewardsEarned: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Daily Rewards
  dailyRewardStreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  lastDailyRewardDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  maxDailyRewardStreak: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Achievement System
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  totalAchievements: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Purchase History for Coins
  coinPurchaseHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  totalCoinsPurchased: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Ad Preferences
  adPreferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      allowAds: true,
      allowTargetedAds: true,
      adCategories: []
    }
  },
  // Statistics
  totalOrders: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalSpent: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  averageOrderValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  // VIP Status
  isVIP: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  vipExpiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  vipLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 10
    }
  },
  // Notification Preferences
  notificationPreferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      email: true,
      push: true,
      sms: false,
      coinRewards: true,
      dailyRewards: true,
      newOffers: true,
      orderUpdates: true
    }
  },
  // Last Activity
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastActivityAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Account Status
  accountStatus: {
    type: DataTypes.ENUM('active', 'suspended', 'banned', 'pending_verification'),
    allowNull: false,
    defaultValue: 'pending_verification'
  },
  suspensionReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  suspensionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true
  // Indexes will be added later after table creation
});

module.exports = User; 