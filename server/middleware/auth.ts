import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { gymRepository } from '../repositories/gymRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'fitzone_super_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export const generateToken = (payload: { id: string; email: string; role: 'admin' | 'user' }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { id: string; email: string; role: 'admin' | 'user' } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'admin' | 'user' };
  } catch (err) {
    return null;
  }
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(403).json({ success: false, message: 'Invalid or expired token' });
    return;
  }

  const user = gymRepository.getUserById(decoded.id);
  if (!user || user.status === 'inactive') {
    res.status(403).json({ success: false, message: 'User account disabled or not found' });
    return;
  }

  req.user = decoded;
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Admin privileges required' });
    return;
  }
  next();
};
