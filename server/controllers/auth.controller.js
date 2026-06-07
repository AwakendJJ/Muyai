import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/user.model.js';

const JWT_EXPIRES_IN = '7d';

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

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

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        data: null,
        error: 'Email already registered',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ name, email, passwordHash });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      data: { token, user: formatUser(user) },
      error: null,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Registration failed',
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid email or password',
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid email or password',
      });
    }

    const token = signToken(user);

    res.json({
      success: true,
      data: { token, user: formatUser(user) },
      error: null,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      data: null,
      error: 'Login failed',
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
