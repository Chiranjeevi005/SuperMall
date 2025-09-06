import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/services/authService';

export const cartMiddleware = async (request: NextRequest) => {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    // Check if authorization header exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' }, 
        { status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify the token using our authService
    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or expired token' }, 
        { status: 401 }
      );
    }
    
    // Add user info to request (for use in route handlers)
    (request as any).user = decoded;
    
    // Continue to the next middleware or route handler
    return null;
  } catch (error) {
    console.error('Cart middleware error:', error);
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' }, 
      { status: 401 }
    );
  }
};