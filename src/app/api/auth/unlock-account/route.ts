import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
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
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorHandlers.apiErrorResponse('User not found', 404);
    }
    
    // Check if account is locked
    if (!user.isAccountLocked()) {
      return errorHandlers.apiErrorResponse('Account is not locked', 400);
    }
    
    // Unlock account
    user.resetLoginAttempts();
    user.isLocked = false;
    user.lockUntil = undefined;
    await user.save();
    
    // Log the unlock
    logger.info('Account unlocked', { userId: user._id, email: user.email });
    
    return NextResponse.json({
      message: 'Account unlocked successfully'
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Account unlock error', error);
    return errorHandlers.apiErrorResponse('Something went wrong during account unlock');
  }
}