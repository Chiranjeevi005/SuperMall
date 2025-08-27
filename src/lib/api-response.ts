import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export function successResponse<T>(data: T, message: string = 'Success'): NextResponse {
  return NextResponse.json({
    success: true,
    message,
    data,
  });
}

export function errorResponse(
  error: string,
  status: number = 400,
  message: string = 'Error'
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
}

export function validationErrorResponse(errors: string[]): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: 'Validation failed',
      errors,
    },
    { status: 400 }
  );
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'Authentication required',
    },
    { status: 401 }
  );
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'Insufficient permissions',
    },
    { status: 403 }
  );
}

export function notFoundResponse(message: string = 'Not found'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'Resource not found',
    },
    { status: 404 }
  );
}

export function serverErrorResponse(message: string = 'Internal server error'): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      error: 'Internal server error',
    },
    { status: 500 }
  );
}