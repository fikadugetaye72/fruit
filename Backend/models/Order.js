const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  orderType: {
    type: DataTypes.ENUM('pickup', 'delivery', 'dine_in'),
    allowNull: false,
    defaultValue: 'pickup'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'mobile_money', 'bank_transfer', 'paypal', 'stripe'),
    allowNull: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  totalAmount: {
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
  // Customer Information
  customerName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  customerPhone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  // Delivery Information
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryCity: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deliveryState: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deliveryCountry: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deliveryZipCode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  deliveryLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  deliveryLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  // Timing Information
  estimatedDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDeliveryTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pickupTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Special Instructions
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Coupon and Discount
  couponCode: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  discountPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  // Payment Information
  paymentTransactionId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  paymentGateway: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  paymentResponse: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Staff Information
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  preparedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  deliveredBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  // Tracking
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  trackingUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  // Notes and History
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  customerNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statusHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  // Cancellation
  cancellationReason: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Refund
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
  refundedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  refundedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Ratings and Reviews
  customerRating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  customerReview: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Source
  source: {
    type: DataTypes.ENUM('web', 'mobile_app', 'phone', 'walk_in', 'third_party'),
    allowNull: false,
    defaultValue: 'web'
  },
  sourceDetails: {
    type: DataTypes.JSON,
    allowNull: true
  },
  // Marketing
  utmSource: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  utmMedium: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  utmCampaign: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  // Created by
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
  tableName: 'orders',
  timestamps: true
  // Indexes will be added later after table creation
});

module.exports = Order; 