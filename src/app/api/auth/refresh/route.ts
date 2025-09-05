import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/services/authService';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get refresh token from cookies
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return errorHandlers.apiErrorResponse('Refresh token not provided', 401);
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      return errorHandlers.apiErrorResponse('Invalid refresh token', 401);
    }
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return errorHandlers.apiErrorResponse('User not found', 404);
    }
    
    // Check if user account is locked
    if (user.isAccountLocked()) {
      return errorHandlers.apiErrorResponse('Account is locked. Please contact support.', 423);
    }
    
    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // Set new refresh token as HTTP-only cookie
    const response = NextResponse.json({
      message: 'Token refreshed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        contact: user.contact,
      },
    });
    
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
    
    // Return new access token in response body
    response.headers.set('Authorization', `Bearer ${newAccessToken}`);
    
    return response;
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Token refresh error', error);
    return errorHandlers.apiErrorResponse('Something went wrong during token refresh');
  }
}