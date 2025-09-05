// Error handling utility functions

// Standardized API error response
export const apiErrorResponse = (message: string, status: number = 500) => {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

// Standardized API success response
export const apiSuccessResponse = (data: any, status: number = 200) => {
  return new Response(
    JSON.stringify(data),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

// Error logging with context
export const logError = (logger: any, context: string, error: unknown) => {
  logger.error(context, { 
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined
  });
};

// Database error handler
export const handleDatabaseError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle common MongoDB errors
    if (error.name === 'ValidationError') {
      return 'Validation failed. Please check your input data.';
    }
    if (error.name === 'MongoServerError' && (error as any).code === 11000) {
      return 'Duplicate entry. This record already exists.';
    }
    if (error.name === 'CastError') {
      return 'Invalid data format. Please check your input.';
    }
    return error.message;
  }
  return 'An unexpected database error occurred.';
};

// Network error handler
export const handleNetworkError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === 'FetchError' || error.name === 'TypeError') {
      return 'Network error. Please check your connection and try again.';
    }
    return error.message;
  }
  return 'A network error occurred.';
};

// Authentication error handler
export const handleAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === 'JsonWebTokenError') {
      return 'Invalid token. Please log in again.';
    }
    if (error.name === 'TokenExpiredError') {
      return 'Token expired. Please log in again.';
    }
    return error.message;
  }
  return 'An authentication error occurred.';
};

// Validation error handler
export const handleValidationError = (errors: { field: string; message: string }[]): string => {
  if (errors.length === 0) return 'Validation failed.';
  
  // If there's only one error, return it directly
  if (errors.length === 1) return errors[0].message;
  
  // For multiple errors, format them nicely
  return `Validation failed: ${errors.map(e => `${e.field} - ${e.message}`).join(', ')}`;
};

// Business logic error handler
export const handleBusinessLogicError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle specific business logic errors
    if (error.message.includes('insufficient')) {
      return 'Insufficient resources to complete this operation.';
    }
    if (error.message.includes('permission')) {
      return 'You do not have permission to perform this action.';
    }
    if (error.message.includes('not found')) {
      return 'The requested resource was not found.';
    }
    return error.message;
  }
  return 'A business logic error occurred.';
};

// External service error handler
export const handleExternalServiceError = (error: unknown): string => {
  if (error instanceof Error) {
    // Handle specific external service errors
    if (error.message.includes('timeout')) {
      return 'The external service is currently unavailable. Please try again later.';
    }
    if (error.message.includes('unauthorized')) {
      return 'Authentication with external service failed.';
    }
    return `External service error: ${error.message}`;
  }
  return 'An error occurred with an external service.';
};

// Format error for user display
export const formatErrorForUser = (error: unknown): string => {
  if (error instanceof Error) {
    // Don't expose internal error details to users
    if (error.message.includes('internal') || error.message.includes('database')) {
      return 'An internal error occurred. Please try again later.';
    }
    return error.message;
  }
  return 'An unexpected error occurred.';
};

// Export all error handlers
export const errorHandlers = {
  apiErrorResponse,
  apiSuccessResponse,
  logError,
  handleDatabaseError,
  handleNetworkError,
  handleAuthError,
  handleValidationError,
  handleBusinessLogicError,
  handleExternalServiceError,
  formatErrorForUser,
};

// Error categories for better error handling
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  UNKNOWN = 'UNKNOWN'
}

// Enhanced error response with category
export const apiErrorResponseWithCategory = (message: string, category: ErrorCategory, status: number = 500) => {
  return new Response(
    JSON.stringify({ 
      error: message,
      category: category
    }),
    { 
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};