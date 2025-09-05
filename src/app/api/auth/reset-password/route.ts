import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { generatePasswordResetToken } from '@/services/authService';
import { validators } from '@/utils/validation';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email } = body;
    
    // Validate required fields
    if (!email) {
      return errorHandlers.apiErrorResponse('Email is required', 400);
    }
    
    // Validate email format
    if (!validators.email(email)) {
      return errorHandlers.apiErrorResponse('Please provide a valid email address', 400);
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, we don't reveal if the email exists
      return NextResponse.json({
        message: 'If your email is registered, you will receive a password reset link shortly.'
      });
    }
    
    // Generate password reset token
    const resetToken = generatePasswordResetToken();
    // In a real application, you would save this token to the database
    // and send it via email to the user
    // For now, we'll just log it
    logger.info('Password reset token generated', { userId: user._id, token: resetToken });
    
    // In a real application, you would send an email with the reset link
    // For now, we'll just return a success message
    return NextResponse.json({
      message: 'If your email is registered, you will receive a password reset link shortly.'
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Password reset request error', error);
    return errorHandlers.apiErrorResponse('Something went wrong during password reset request');
  }
}