# Error Handling and Validation in SuperMall

This document outlines the error handling and validation strategies implemented in the SuperMall application.

## 1. Validation System

### 1.1 Validation Utilities

The application uses a centralized validation system located in `src/utils/validation.ts`. This file contains validation functions for common data types:

- **Email Validation**: Uses regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Password Validation**: Requires at least 8 characters with uppercase, lowercase, and number
- **Name Validation**: Between 2 and 50 characters
- **Contact Validation**: 10-15 digit phone number format
- **Token Validation**: 64-character hexadecimal string

### 1.2 Usage Examples

```typescript
import { validators } from '@/utils/validation';

// Validate email
if (!validators.email(email)) {
  return NextResponse.json(
    { error: 'Please provide a valid email address' },
    { status: 400 }
  );
}

// Validate password
if (!validators.password(password)) {
  return NextResponse.json(
    { error: 'Password must be at least 8 characters with uppercase, lowercase, and number' },
    { status: 400 }
  );
}
```

## 2. Error Handling System

### 2.1 Error Handling Utilities

The application uses a centralized error handling system located in `src/utils/errorHandler.ts`. This file contains functions for:

- **API Error Responses**: Standardized error response format
- **API Success Responses**: Standardized success response format
- **Error Logging**: Context-aware error logging with stack traces
- **Database Error Handling**: Specific handling for MongoDB errors
- **Network Error Handling**: Handling for network-related errors
- **Authentication Error Handling**: Handling for JWT and authentication errors

### 2.2 Usage Examples

```typescript
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

// Standardized error response
return errorHandlers.apiErrorResponse('User not found', 404);

// Error logging with context
errorHandlers.logError(logger, 'User registration error', error);

// Database error handling
try {
  await user.save();
} catch (error) {
  const errorMessage = errorHandlers.handleDatabaseError(error);
  return errorHandlers.apiErrorResponse(errorMessage, 400);
}
```

## 3. API Route Error Handling

All API routes implement comprehensive error handling:

### 3.1 Try-Catch Blocks

Every API route is wrapped in a try-catch block to handle unexpected errors:

```typescript
export async function POST(request: NextRequest) {
  try {
    // Route logic here
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Route context', error);
    return errorHandlers.apiErrorResponse('Something went wrong');
  }
}
```

### 3.2 Validation Errors

All required fields and data formats are validated before processing:

```typescript
// Validate required fields
if (!email || !password) {
  return errorHandlers.apiErrorResponse('Email and password are required', 400);
}

// Validate data format
if (!validators.email(email)) {
  return errorHandlers.apiErrorResponse('Please provide a valid email address', 400);
}
```

### 3.3 Database Errors

Database operations are wrapped to handle specific database errors:

```typescript
try {
  const user = await User.findOne({ email });
  if (!user) {
    return errorHandlers.apiErrorResponse('User not found', 404);
  }
} catch (error) {
  const errorMessage = errorHandlers.handleDatabaseError(error);
  return errorHandlers.apiErrorResponse(errorMessage, 500);
}
```

## 4. Frontend Error Handling

### 4.1 Form Validation

Frontend forms implement client-side validation before submitting to the API:

```typescript
const validateForm = () => {
  if (!validators.email(email)) {
    setError('Please enter a valid email address');
    return false;
  }
  return true;
};
```

### 4.2 API Error Handling

Frontend components handle API errors gracefully:

```typescript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.error || 'Login failed');
    return;
  }

  // Success handling
} catch (err) {
  setError('Network error. Please try again.');
}
```

## 5. Security Considerations

### 5.1 Error Message Sanitization

Error messages are sanitized to prevent information leakage:

```typescript
// Don't reveal if user exists
if (!user) {
  return errorHandlers.apiErrorResponse('Invalid email or password', 401);
}
```

### 5.2 Logging Sensitive Data

Sensitive data is not logged:

```typescript
// Log without sensitive data
logger.info('User login attempt', { email: user.email });
```

## 6. HTTP Status Codes

The application uses appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource not found)
- **423**: Locked (account locked)
- **500**: Internal Server Error (unexpected errors)

## 7. Best Practices

### 7.1 Consistent Error Format

All API errors return a consistent format:

```json
{
  "error": "Error message"
}
```

### 7.2 User-Friendly Messages

Error messages are user-friendly and actionable:

```typescript
// Good
return errorHandlers.apiErrorResponse('Password must be at least 8 characters with uppercase, lowercase, and number', 400);

// Bad
return errorHandlers.apiErrorResponse('Password validation failed', 400);
```

### 7.3 Comprehensive Logging

All errors are logged with context for debugging:

```typescript
errorHandlers.logError(logger, 'User registration error', error);
```