import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try to get token from cookie
  const tokenCookie = request.cookies.get('token');
  if (tokenCookie) {
    return tokenCookie.value;
  }
  
  return null;
}

export function createAuthResponse(data: any, token?: string): NextResponse {
  const response = NextResponse.json(data);
  
  if (token) {
    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/',
    });
  }
  
  return response;
}

export function clearAuthCookie(): NextResponse {
  const response = NextResponse.json({ message: 'Logged out successfully' });
  response.cookies.delete('token');
  return response;
}