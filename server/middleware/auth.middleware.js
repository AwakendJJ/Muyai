import { verifyIdToken } from '../config/firebase.js';
import * as userModel from '../models/user.model.js';

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Authentication required',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyIdToken(token);
    const user = await userModel.findByFirebaseUid(decoded.uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'User not found — please sign in again',
      });
    }

    req.user = { id: user.id, email: user.email, uid: decoded.uid };
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Invalid or expired token',
    });
  }
}
