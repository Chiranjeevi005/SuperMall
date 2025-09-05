import { NextRequest, NextResponse } from 'next/server';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

export async function POST(request: NextRequest) {
  try {
    // Clear refresh token cookie
    const response = NextResponse.json({
      message: 'Logged out successfully',
    });
    
    response.cookies.delete('refreshToken');
    
    logger.info('User logged out');
    
    return response;
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Logout error', error);
    return errorHandlers.apiErrorResponse('Something went wrong during logout');
  }
}