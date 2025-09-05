import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';
import crypto from 'crypto';
import mongoose from 'mongoose';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

// Generate access token (short-lived)
export const generateAccessToken = (user: IUser): string => {
  const payload: JwtPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '15m', // Short-lived token
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (user: IUser): string => {
  const payload: JwtPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d', // Long-lived token
  });
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Generate password reset token
export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate email verification token
export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};