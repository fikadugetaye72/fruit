const { Admin } = require('../models');

const superAdminMiddleware = async (req, res, next) => {
  try {
    const adminId = req.admin.adminId;

    // Get admin details
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Admin not found'
      });
    }

    // Check if admin is super admin
    if (admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        error: 'Super admin access required'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authorization error'
    });
  }
};

module.exports = superAdminMiddleware; 