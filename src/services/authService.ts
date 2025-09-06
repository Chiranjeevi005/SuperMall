import jwt from 'jsonwebtoken';
import { IUser } from '@/models/User';
import crypto from 'crypto';
import mongoose from 'mongoose';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Helper function to validate environment variables
const validateEnvVars = () => {
  // During build time, skip validation
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return true;
  }
  
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET environment variable is required');
  }
  
  return true;
};

// Generate access token (short-lived)
export const generateAccessToken = (user: IUser): string => {
  // Validate environment variables
  validateEnvVars();
  
  const payload: JwtPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    role: user.role,
  };

  // Validate payload
  if (!payload.id || !payload.email || !payload.role) {
    throw new Error('Invalid user data for token generation');
  }

  // Validate JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      // During build, return a mock token
      return 'mock-jwt-token';
    }
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '15m', // Short-lived token
  });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (user: IUser): string => {
  // Validate environment variables
  validateEnvVars();
  
  const payload: JwtPayload = {
    id: (user._id as mongoose.Types.ObjectId).toString(),
    email: user.email,
    role: user.role,
  };

  // Validate payload
  if (!payload.id || !payload.email || !payload.role) {
    throw new Error('Invalid user data for token generation');
  }

  // Validate REFRESH_TOKEN_SECRET is set
  if (!process.env.REFRESH_TOKEN_SECRET) {
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      // During build, return a mock token
      return 'mock-refresh-token';
    }
    throw new Error('REFRESH_TOKEN_SECRET environment variable is not set');
  }
  
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d', // Long-lived token
  });
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayload | null => {
  // Validate input
  if (!token) {
    return null;
  }

  try {
    // Check if token is a valid string
    if (typeof token !== 'string') {
      return null;
    }

    // Validate environment variables
    validateEnvVars();
    
    // Validate JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        // During build, return null
        return null;
      }
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    // Log verification errors for debugging (but don't expose to user)
    console.error('Access token verification failed:', error);
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  // Validate input
  if (!token) {
    return null;
  }

  try {
    // Check if token is a valid string
    if (typeof token !== 'string') {
      return null;
    }

    // Validate environment variables
    validateEnvVars();
    
    // Validate REFRESH_TOKEN_SECRET is set
    if (!process.env.REFRESH_TOKEN_SECRET) {
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        // During build, return null
        return null;
      }
      throw new Error('REFRESH_TOKEN_SECRET environment variable is not set');
    }
    
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded as JwtPayload;
  } catch (error) {
    // Log verification errors for debugging (but don't expose to user)
    console.error('Refresh token verification failed:', error);
    return null;
  }
};

// Generate password reset token
export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Validate token format
export const validateTokenFormat = (token: string): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Check if it's a valid hex string of appropriate length
  const hexRegex = /^[a-f0-9]{64}$/;
  return hexRegex.test(token);
};

// Generate email verification token
export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};