const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
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
  productType: {
    type: DataTypes.ENUM('fruit', 'juice'),
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  productSku: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  costPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
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
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  // Product-specific fields
  size: {
    type: DataTypes.ENUM('small', 'medium', 'large', 'extra_large'),
    allowNull: true
  },
  weight: {
    type: DataTypes.DECIMAL(8, 3), // in kg
    allowNull: true,
    validate: {
      min: 0
    }
  },
  volume: {
    type: DataTypes.DECIMAL(8, 2), // in ml
    allowNull: true,
    validate: {
      min: 0
    }
  },
  // Customization options
  customization: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  specialInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Preparation
  preparationTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
    validate: {
      min: 0
    }
  },
  isPrepared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  preparedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  preparedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  // Inventory tracking
  stockReserved: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  stockConsumed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  // Quality control
  qualityCheck: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  qualityCheckedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'admins',
      key: 'id'
    }
  },
  qualityCheckedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  qualityNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Refund information
  isRefunded: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
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
  // Product snapshot (for historical accuracy)
  productSnapshot: {
    type: DataTypes.JSON,
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
  tableName: 'order_items',
  timestamps: true
  // Indexes will be added later after table creation
});

module.exports = OrderItem; 