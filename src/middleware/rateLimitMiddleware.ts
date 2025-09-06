import { NextRequest, NextResponse } from 'next/server';
import logger from '@/utils/clientLogger';

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per window

// Special rate limiting for authentication endpoints
const AUTH_RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const AUTH_RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per window

export async function rateLimitMiddleware(request: NextRequest) {
  try {
    // Clean up old entries periodically (every 100 requests)
    if (Math.random() < 0.01) { // 1% chance to trigger cleanup
      cleanupRateLimitStore();
    }
    
    // Get client IP (this is a simplified approach, in production you might want to use headers like X-Forwarded-For)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Get current time
    const now = Date.now();
    
    // Determine if this is an authentication endpoint
    const isAuthEndpoint = request.nextUrl.pathname.startsWith('/api/auth');
    
    // Set rate limiting parameters based on endpoint type
    const windowSize = isAuthEndpoint ? AUTH_RATE_LIMIT_WINDOW : RATE_LIMIT_WINDOW;
    const maxRequests = isAuthEndpoint ? AUTH_RATE_LIMIT_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS;
    
    // Create a unique key for this IP
    const key = `${ip}:${request.nextUrl.pathname}`;
    
    // Get or initialize rate limit data for this IP
    let rateLimitData = rateLimitStore.get(key);
    
    // If no data exists or the window has expired, reset the counter
    if (!rateLimitData || rateLimitData.resetTime <= now) {
      rateLimitData = {
        count: 0,
        resetTime: now + windowSize
      };
    }
    
    // Increment the request count
    rateLimitData.count++;
    rateLimitStore.set(key, rateLimitData);
    
    // Check if the rate limit has been exceeded
    if (rateLimitData.count > maxRequests) {
      logger.warn('Rate limit exceeded', { 
        ip, 
        pathname: request.nextUrl.pathname,
        count: rateLimitData.count,
        resetTime: new Date(rateLimitData.resetTime).toISOString()
      });
      
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Add rate limit headers to the response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - rateLimitData.count).toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitData.resetTime).toISOString());
    
    return response;
  } catch (error) {
    logger.error('Rate limiting error:', error);
    // If there's an error with rate limiting, allow the request to proceed
    return NextResponse.next();
  }
}

// Clean up old rate limit entries
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

// Note: setInterval is not available in Edge Runtime, so we'll clean up periodically during requests