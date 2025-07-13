const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists and is active
    const admin = await Admin.findByPk(decoded.adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Admin not found'
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Admin account is not active'
      });
    }

    // Add admin to request
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

module.exports = adminAuthMiddleware; 