const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Fruit = sequelize.define('Fruit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.ENUM('citrus', 'berry', 'tropical', 'stone', 'pome', 'other'),
    allowNull: false
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  imageUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'fruits',
  timestamps: true
  // Indexes will be added later after table creation
});

module.exports = Fruit; 