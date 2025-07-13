const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Juice = sequelize.define('Juice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  ingredients: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  nutritionalInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  price: {
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
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  size: {
    type: DataTypes.ENUM('small', 'medium', 'large', 'extra_large'),
    allowNull: false,
    defaultValue: 'medium'
  },
  volume: {
    type: DataTypes.DECIMAL(8, 2), // in ml
    allowNull: false,
    validate: {
      min: 0
    }
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },
  maxStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  barcode: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  gallery: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isOrganic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isGlutenFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVegan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isSugarFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  allergens: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  preparationTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
    validate: {
      min: 0
    }
  },
  shelfLife: {
    type: DataTypes.INTEGER, // in hours
    allowNull: true,
    validate: {
      min: 0
    }
  },
  servingTemperature: {
    type: DataTypes.ENUM('cold', 'room_temp', 'warm', 'hot'),
    allowNull: false,
    defaultValue: 'cold'
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  protein: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  carbs: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  fat: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  fiber: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  sugar: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  sodium: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  vitaminC: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  metaTitle: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.STRING(160),
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      len: [2, 100]
    }
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
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
  tableName: 'juices',
  timestamps: true
  // Indexes will be added later after table creation
});

module.exports = Juice; 