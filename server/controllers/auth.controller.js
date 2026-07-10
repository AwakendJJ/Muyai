import { verifyIdToken } from '../config/firebase.js';
import * as userModel from '../models/user.model.js';

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    plan: user.plan,
    role: user.role,
    created_at: user.created_at,
  };
}

export async function sync(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Authentication required',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyIdToken(token);
    const { name } = req.body || {};

    let user = await userModel.findByFirebaseUid(decoded.uid);

    if (!user) {
      user = await userModel.findByEmail(decoded.email);
      if (user) {
        user = await userModel.linkFirebaseUid(user.id, decoded.uid);
      }
    }

    if (!user) {
      const displayName = name || decoded.name || decoded.email?.split('@')[0] || 'User';
      user = await userModel.createFromFirebase({
        name: displayName,
        email: decoded.email,
        firebaseUid: decoded.uid,
      });
    } else if (name && user.name !== name) {
      user = await userModel.updateName(user.id, name);
    }

    res.json({
      success: true,
      data: { user: formatUser(user) },
      error: null,
    });
  } catch (error) {
    console.error('Sync error:', error);

    if (error.message?.includes('Firebase Admin is not configured')) {
      return res.status(503).json({
        success: false,
        data: null,
        error: 'Server auth is not configured. Set FIREBASE_* environment variables on the API server.',
      });
    }

    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid or expired sign-in token. Please try again.',
      });
    }

    res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Failed to sync user',
    });
  }
}

export async function me(req, res) {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: { user: formatUser(user) },
      error: null,
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Failed to fetch user',
    });
  }
}
