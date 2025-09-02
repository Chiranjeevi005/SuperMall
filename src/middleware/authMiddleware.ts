import { NextRequest, NextFetchEvent } from 'next/server';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Add user info to request headers for use in API routes
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
    return new Response(
      JSON.stringify({ error: 'Invalid token.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
}