// Error handling utility functions

// Standardized API error response
export const apiErrorResponse = (message: string, status: number = 500) => {
  // Don't expose internal error details to users in production
  const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'An error occurred. Please try again later.' 
    : message;
  
  return new Response(
    JSON.stringify({ error: errorMessage }),
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
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  
  // Sanitize error message before logging
  const sanitizedMessage = sanitizeErrorMessage(errorMessage);
  
  logger.error(context, { 
    error: sanitizedMessage,
    stack: error instanceof Error ? error.stack : undefined
  });
};

// Sanitize error messages to prevent information leakage
export const sanitizeErrorMessage = (message: string): string => {
  // Remove sensitive information patterns
  return message
    .replace(/(password|secret|key|token)=['"][^'"]*['"]/gi, '$1=[REDACTED]')
    .replace(/['"][^'"]*(password|secret|key|token)['"][^'"]*/gi, '[REDACTED]')
    .replace(/d{16}/g, '****-****-****-****') // Credit card numbers
    .replace(/d{3}-?d{2}-?d{4}/g, '***-**-****'); // SSN
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
    
    // Don't expose internal database errors to users in production
    return process.env.NODE_ENV === 'production' 
      ? 'A database error occurred. Please try again later.' 
      : error.message;
  }
  return 'An unexpected database error occurred.';
};

// Network error handler
export const handleNetworkError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === 'FetchError' || error.name === 'TypeError') {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Don't expose internal network errors to users in production
    return process.env.NODE_ENV === 'production' 
      ? 'A network error occurred. Please try again later.' 
      : error.message;
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
    
    // Don't expose internal authentication errors to users in production
    return process.env.NODE_ENV === 'production' 
      ? 'An authentication error occurred. Please try again.' 
      : error.message;
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
    
    // Don't expose internal business logic errors to users in production
    return process.env.NODE_ENV === 'production' 
      ? 'A business logic error occurred. Please try again.' 
      : error.message;
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
    
    // Don't expose internal external service errors to users in production
    return process.env.NODE_ENV === 'production' 
      ? 'An error occurred with an external service. Please try again.' 
      : `External service error: ${error.message}`;
  }
  return 'An error occurred with an external service.';
};

// Format error for user display
export const formatErrorForUser = (error: unknown): string => {
  if (error instanceof Error) {
    // Don't expose internal error details to users
    if (error.message.includes('internal') || error.message.includes('database') || error.message.includes('secret') || error.message.includes('key')) {
      return 'An internal error occurred. Please try again later.';
    }
    
    // In production, provide generic error messages
    if (process.env.NODE_ENV === 'production') {
      return 'An error occurred. Please try again later.';
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
  sanitizeErrorMessage,
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