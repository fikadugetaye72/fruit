const { sequelize, testConnection } = require('../config/database');
const User = require('./User');
const Fruit = require('./Fruit');
const Category = require('./Category');
const Admin = require('./Admin');
const Juice = require('./Juice');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Payment = require('./Payment');

// Define associations here
// User associations
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
User.hasMany(Payment, { foreignKey: 'userId', as: 'payments' });
User.hasMany(User, { foreignKey: 'referredBy', as: 'referrals' });
User.belongsTo(User, { foreignKey: 'referredBy', as: 'referredByUser' });

// Category associations
Category.hasMany(Category, { foreignKey: 'parentId', as: 'children' });
Category.belongsTo(Category, { foreignKey: 'parentId', as: 'parent' });
Category.hasMany(Fruit, { foreignKey: 'categoryId', as: 'fruits' });
Category.hasMany(Juice, { foreignKey: 'categoryId', as: 'juices' });

// Admin associations
Admin.hasMany(Order, { foreignKey: 'assignedTo', as: 'assignedOrders' });
Admin.hasMany(Order, { foreignKey: 'preparedBy', as: 'preparedOrders' });
Admin.hasMany(Order, { foreignKey: 'deliveredBy', as: 'deliveredOrders' });
Admin.hasMany(OrderItem, { foreignKey: 'preparedBy', as: 'preparedItems' });
Admin.hasMany(OrderItem, { foreignKey: 'qualityCheckedBy', as: 'qualityCheckedItems' });
Admin.hasMany(Payment, { foreignKey: 'refundedBy', as: 'refundedPayments' });
Admin.hasMany(Category, { foreignKey: 'createdBy', as: 'createdCategories' });
Admin.hasMany(Juice, { foreignKey: 'createdBy', as: 'createdJuices' });
Admin.hasMany(Order, { foreignKey: 'createdBy', as: 'createdOrders' });
Admin.hasMany(Payment, { foreignKey: 'createdBy', as: 'createdPayments' });

// Order associations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
Order.hasMany(Payment, { foreignKey: 'orderId', as: 'payments' });
Order.belongsTo(Admin, { foreignKey: 'assignedTo', as: 'assignedToAdmin' });
Order.belongsTo(Admin, { foreignKey: 'preparedBy', as: 'preparedByAdmin' });
Order.belongsTo(Admin, { foreignKey: 'deliveredBy', as: 'deliveredByAdmin' });
Order.belongsTo(Admin, { foreignKey: 'createdBy', as: 'createdByAdmin' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Admin, { foreignKey: 'preparedBy', as: 'preparedByAdmin' });
OrderItem.belongsTo(Admin, { foreignKey: 'qualityCheckedBy', as: 'qualityCheckedByAdmin' });
OrderItem.belongsTo(Admin, { foreignKey: 'refundedBy', as: 'refundedByAdmin' });

// Payment associations
Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Payment.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Payment.belongsTo(Admin, { foreignKey: 'refundedBy', as: 'refundedByAdmin' });
Payment.belongsTo(Admin, { foreignKey: 'createdBy', as: 'createdByAdmin' });

// Juice associations
Juice.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Juice.belongsTo(Admin, { foreignKey: 'createdBy', as: 'createdByAdmin' });

// Add indexes after table creation
const addIndexes = async () => {
  try {
    // Add indexes for fruits table
    await sequelize.query('CREATE INDEX IF NOT EXISTS fruits_category ON fruits (category)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS fruits_is_available ON fruits (isAvailable)');
    
    // Add indexes for users table
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS users_email ON users (email)');
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS users_username ON users (username)');
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code ON users (referralCode)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_referred_by ON users (referredBy)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_coins ON users (coins)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_reward_level ON users (rewardLevel)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_is_vip ON users (isVIP)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_account_status ON users (accountStatus)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_last_login_at ON users (lastLoginAt)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_last_activity_at ON users (lastActivityAt)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_total_orders ON users (totalOrders)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_total_spent ON users (totalSpent)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_ads_watched_today ON users (adsWatchedToday)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_daily_reward_streak ON users (dailyRewardStreak)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_referral_count ON users (referralCount)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS users_total_achievements ON users (totalAchievements)');
    
    // Add indexes for categories table
    await sequelize.query('CREATE INDEX IF NOT EXISTS categories_slug ON categories (slug)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS categories_is_active ON categories (isActive)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS categories_is_featured ON categories (isFeatured)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS categories_parent_id ON categories (parentId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS categories_sort_order ON categories (sortOrder)');
    
    // Add indexes for admins table
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS admins_email ON admins (email)');
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS admins_username ON admins (username)');
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS admins_employee_id ON admins (employeeId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS admins_role ON admins (role)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS admins_is_active ON admins (isActive)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS admins_is_verified ON admins (isVerified)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS admins_department ON admins (department)');
    
    // Add indexes for juices table
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS juices_sku ON juices (sku)');
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS juices_barcode ON juices (barcode)');
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS juices_slug ON juices (slug)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS juices_category_id ON juices (categoryId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS juices_is_available ON juices (isAvailable)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS juices_is_featured ON juices (isFeatured)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS juices_size ON juices (size)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS juices_price ON juices (price)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS juices_rating ON juices (rating)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS juices_sort_order ON juices (sortOrder)');
    
    // Add indexes for orders table
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number ON orders (orderNumber)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_user_id ON orders (userId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_status ON orders (status)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_payment_status ON orders (paymentStatus)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_order_type ON orders (orderType)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_assigned_to ON orders (assignedTo)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_prepared_by ON orders (preparedBy)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_delivered_by ON orders (deliveredBy)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_customer_email ON orders (customerEmail)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_customer_phone ON orders (customerPhone)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_created_at ON orders (createdAt)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_estimated_delivery_time ON orders (estimatedDeliveryTime)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_actual_delivery_time ON orders (actualDeliveryTime)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_pickup_time ON orders (pickupTime)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS orders_source ON orders (source)');
    
    // Add indexes for order_items table
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_order_id ON order_items (orderId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_product_type ON order_items (productType)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_product_id ON order_items (productId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_product_sku ON order_items (productSku)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_is_prepared ON order_items (isPrepared)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_prepared_by ON order_items (preparedBy)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_quality_checked_by ON order_items (qualityCheckedBy)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_is_refunded ON order_items (isRefunded)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS order_items_refunded_by ON order_items (refundedBy)');
    
    // Add indexes for payments table
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS payments_payment_number ON payments (paymentNumber)');
    await sequelize.query('CREATE UNIQUE INDEX IF NOT EXISTS payments_transaction_id ON payments (transactionId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_order_id ON payments (orderId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_user_id ON payments (userId)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_status ON payments (status)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_payment_method ON payments (paymentMethod)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_payment_gateway ON payments (paymentGateway)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_processed_at ON payments (processedAt)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_completed_at ON payments (completedAt)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_is_high_risk ON payments (isHighRisk)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_is_disputed ON payments (isDisputed)');
    await sequelize.query('CREATE INDEX IF NOT EXISTS payments_receipt_number ON payments (receiptNumber)');
    
    console.log('✅ Database indexes created successfully.');
  } catch (error) {
    console.log('ℹ️ Indexes may already exist or will be created later');
  }
};

// Sync all models with database
const syncDatabase = async () => {
  try {
    // First, try to drop existing tables if they exist
    try {
      await sequelize.query('DROP TABLE IF EXISTS order_items');
      await sequelize.query('DROP TABLE IF EXISTS payments');
      await sequelize.query('DROP TABLE IF EXISTS orders');
      await sequelize.query('DROP TABLE IF EXISTS juices');
      await sequelize.query('DROP TABLE IF EXISTS admins');
      await sequelize.query('DROP TABLE IF EXISTS categories');
      await sequelize.query('DROP TABLE IF EXISTS fruits');
      await sequelize.query('DROP TABLE IF EXISTS users');
      console.log('🗑️ Dropped existing tables');
    } catch (dropError) {
      console.log('ℹ️ No existing tables to drop');
    }
    
    // Now create tables with correct schema
    await sequelize.sync({ force: false });
    console.log('✅ Database models synchronized successfully.');
    
    // Add indexes after table creation
    await addIndexes();
  } catch (error) {
    console.error('❌ Error synchronizing database models:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Fruit,
  Category,
  Admin,
  Juice,
  Order,
  OrderItem,
  Payment,
  syncDatabase,
  testConnection,
  addIndexes
}; 