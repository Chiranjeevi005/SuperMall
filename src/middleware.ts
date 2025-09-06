import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitMiddleware } from '@/middleware/rateLimitMiddleware';
import logger from '@/utils/clientLogger';

// Define routes that should be excluded from authentication
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/health',
  '/api/products',
  '/api/categories',
  '/api/search',
  '/api/vendors',
  '/api/test-db',
];

// Define API routes that should have additional security headers
const apiRoutes = [
  '/api/',
];

export async function middleware(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    logger.warn('Rate limit exceeded', { url: request.nextUrl.pathname });
    return rateLimitResponse;
  }
  
  const response = NextResponse.next();
  
  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Add CORS headers for API routes
  if (apiRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      response.headers.set('Access-Control-Max-Age', '86400');
      return new Response(null, {
        status: 204,
        headers: response.headers
      });
    }
  }
  
  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};