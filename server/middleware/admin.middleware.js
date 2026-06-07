import * as userModel from '../models/user.model.js';

export async function requireAdmin(req, res, next) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'User not found',
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Admin access required',
      });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to verify admin access',
    });
  }
}
