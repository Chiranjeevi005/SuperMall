import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'supermall_jwt_secret';

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
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user info to request (for use in route handlers)
    (request as any).user = decoded;
    
    // Continue to the next middleware or route handler
    return null;
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' }, 
      { status: 401 }
    );
  }
};