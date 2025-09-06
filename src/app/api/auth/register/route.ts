import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generateAccessToken, generateRefreshToken, generateEmailVerificationToken } from '@/services/authService';
import { validators } from '@/utils/validation';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, password, role, contact } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return errorHandlers.apiErrorResponse('Name, email, and password are required', 400);
    }
    
    // Validate name
    if (!validators.name(name)) {
      return errorHandlers.apiErrorResponse('Name must be between 2 and 50 characters', 400);
    }
    
    // Validate email format
    if (!validators.email(email)) {
      return errorHandlers.apiErrorResponse('Please provide a valid email address', 400);
    }
    
    // Validate password strength
    if (!validators.password(password)) {
      return errorHandlers.apiErrorResponse('Password must be at least 8 characters with uppercase, lowercase, and number', 400);
    }
    
    // Validate contact if provided
    if (contact && !validators.contact(contact)) {
      return errorHandlers.apiErrorResponse('Please provide a valid contact number', 400);
    }
    
    // Validate role
    const validRoles = ['admin', 'merchant', 'customer'];
    const userRole = validRoles.includes(role) ? role : 'customer';
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorHandlers.apiErrorResponse('User with this email already exists', 400);
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: userRole,
      contact: contact || undefined,
      isVerified: false, // Email verification required
    });
    
    await user.save();
    
    // Generate email verification token
    const verificationToken = generateEmailVerificationToken();
    // In a real application, you would send this token via email
    // For now, we'll log it
    logger.info('Email verification token generated', { userId: user._id, token: verificationToken });
    
    // Generate JWT tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Log the registration
    logger.info('User registered', { userId: user._id, email: user.email, role: user.role });
    
    // Set refresh token as HTTP-only cookie
    const response = NextResponse.json({
      message: 'User registered successfully. Please check your email for verification.',
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
      sameSite: 'strict',
    });
    
    // Return access token in response body
    response.headers.set('Authorization', `Bearer ${accessToken}`);
    
    return response;
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Registration error', error);
    return errorHandlers.apiErrorResponse('Something went wrong during registration');
  }
}