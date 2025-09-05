import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateAccessToken, generateRefreshToken } from '@/services/authService';
import { validators } from '@/utils/validation';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Try to connect to database, but don't fail during build time
    try {
      await dbConnect();
    } catch (dbError) {
      // If we're in build phase, return a mock response
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        return NextResponse.json({ message: 'Login endpoint - build phase' });
      }
      throw dbError;
    }
    
    const body = await request.json();
    const { email, password } = body;
    
    // Validate required fields
    if (!email || !password) {
      return errorHandlers.apiErrorResponse('Email and password are required', 400);
    }
    
    // Validate email format
    if (!validators.email(email)) {
      return errorHandlers.apiErrorResponse('Please provide a valid email address', 400);
    }
    
    // Validate password
    if (password.length < 1) {
      return errorHandlers.apiErrorResponse('Password is required', 400);
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Security: Don't reveal if user exists
      return errorHandlers.apiErrorResponse('Invalid email or password', 401);
    }
    
    // Check if account is locked
    if (user.isAccountLocked()) {
      return errorHandlers.apiErrorResponse('Account is locked. Please try again later or contact support.', 423);
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incrementFailedLoginAttempts();
      
      return errorHandlers.apiErrorResponse('Invalid email or password', 401);
    }
    
    // Reset failed login attempts on successful login
    user.resetLoginAttempts();
    user.lastLogin = new Date();
    await user.save();
    
    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Log the login
    logger.info('User logged in', { userId: user._id, email: user.email, role: user.role });
    
    // Set refresh token as HTTP-only cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        contact: user.contact,
      },
    });
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
    
    // Return access token in response body
    response.headers.set('Authorization', `Bearer ${accessToken}`);
    
    return response;
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Login error', error);
    return errorHandlers.apiErrorResponse('Something went wrong during login');
  }
}