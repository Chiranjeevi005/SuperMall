import { NextRequest, NextFetchEvent, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/services/authService';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import logger from '@/utils/logger';

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authMiddleware(request: NextRequest, event: NextFetchEvent) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Access denied. No token provided.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const decoded = verifyAccessToken(token);
    
    if (!decoded) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Connect to database to verify user still exists
    await dbConnect();
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add user info to request for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', decoded.id);
    requestHeaders.set('user-email', decoded.email);
    requestHeaders.set('user-role', decoded.role);
    
    // Clone the request with new headers
    const nextRequest = new NextRequest(request, {
      headers: requestHeaders,
    });
    
    return null; // Continue to the next middleware or route handler
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Authentication error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Role-based access control middleware
export function authorize(roles: string[] = []) {
  return async function (request: NextRequest, event: NextFetchEvent) {
    try {
      // First run auth middleware
      const authResult = await authMiddleware(request, event);
      if (authResult) return authResult; // Return early if auth failed

      // Get user role from headers
      const userRole = request.headers.get('user-role');
      
      // Check if user role is in allowed roles
      if (roles.length && !roles.includes(userRole || '')) {
        return new Response(
          JSON.stringify({ error: 'Insufficient permissions.' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return null; // Continue to the next middleware or route handler
    } catch (error) {
      logger.error('Authorization middleware error:', error);
      
      return new Response(
        JSON.stringify({ error: 'Authorization error.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}