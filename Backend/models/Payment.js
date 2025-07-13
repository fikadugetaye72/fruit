const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  paymentNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'mobile_money', 'bank_transfer', 'paypal', 'stripe', 'apple_pay', 'google_pay'),
    allowNull: false
  },
  paymentGateway: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  exchangeRate: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    defaultValue: 1.0
  },
  amountInBaseCurrency: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  // Card Information (encrypted)
  cardLast4: {
    type: DataTypes.STRING(4),
    allowNull: true
  },
  cardBrand: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  cardExpiryMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 12
    }
  },
  cardExpiryYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 2020
    }
  },
  // Bank Transfer Information
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  accountNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  routingNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  // Mobile Money Information
  mobileProvider: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  mobileNumber: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // Processing Information
  processingFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  gatewayFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  netAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  // Timing Information
  processedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Gateway Response
  gatewayResponse: {
    type: DataTypes.JSON,
    allowNull: true
  },
  gatewayError: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  gatewayErrorCode: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  // Refund Information
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  refundReason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  refundTransactionId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  refundedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  // Security
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deviceFingerprint: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Risk Assessment
  riskScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  isHighRisk: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  riskFactors: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  // Dispute Information
  isDisputed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disputeReason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  disputeDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  disputeResolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  disputeResolution: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Receipt Information
  receiptNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  receiptUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Notes
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  customerNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Audit
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  updatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  }
}, {
  tableName: 'payments',
  timestamps: true
  // Indexes will be added later after table creation
});

module.exports = Payment; 