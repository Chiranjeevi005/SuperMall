// Validation utility functions

// Email validation
export const validateEmail = (email: string): boolean => {
  // Check if email is a string
  if (typeof email !== 'string') return false;
  
  // Check length
  if (email.length > 254) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const validatePassword = (password: string): boolean => {
  // Check if password is a string
  if (typeof password !== 'string') return false;
  
  // Check length
  if (password.length < 8 || password.length > 128) return false;
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Name validation (2-50 characters)
export const validateName = (name: string): boolean => {
  // Check if name is a string
  if (typeof name !== 'string') return false;
  
  // Check length
  if (name.length < 2 || name.length > 50) return false;
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name);
};

// Contact number validation (10-15 digits, may include + and spaces)
export const validateContact = (contact: string): boolean => {
  // Contact is optional
  if (!contact) return true;
  
  // Check if contact is a string
  if (typeof contact !== 'string') return false;
  
  // Check length
  if (contact.length > 20) return false;
  
  const phoneRegex = /^[\+]?[0-9\s\-]{10,15}$/;
  return phoneRegex.test(contact.trim());
};

// Token validation (64 character hex string)
export const validateToken = (token: string): boolean => {
  // Check if token is a string
  if (typeof token !== 'string') return false;
  
  return /^[a-f0-9]{64}$/.test(token);
};

// Product name validation
export const validateProductName = (name: string): boolean => {
  // Check if name is a string
  if (typeof name !== 'string') return false;
  
  // Check length
  if (name.length < 3 || name.length > 100) return false;
  
  // Check for valid characters
  const nameRegex = /^[a-zA-Z0-9\s\-_.,'()&]+$/;
  return nameRegex.test(name);
};

// Product description validation
export const validateProductDescription = (description: string): boolean => {
  // Check if description is a string
  if (typeof description !== 'string') return false;
  
  // Check length
  if (description.length < 10 || description.length > 1000) return false;
  
  return true;
};

// Price validation
export const validatePrice = (price: number): boolean => {
  // Check if price is a number
  if (typeof price !== 'number') return false;
  
  // Check if price is positive and within reasonable range
  return price > 0 && price <= 1000000;
};

// Stock validation
export const validateStock = (stock: number): boolean => {
  // Check if stock is a number
  if (typeof stock !== 'number') return false;
  
  // Check if stock is a non-negative integer within reasonable range
  return Number.isInteger(stock) && stock >= 0 && stock <= 100000;
};

// Category validation
export const validateCategory = (category: string): boolean => {
  // Check if category is a string
  if (typeof category !== 'string') return false;
  
  // Check length
  if (category.length < 2 || category.length > 50) return false;
  
  // Check for valid characters
  const categoryRegex = /^[a-zA-Z0-9\s\-_&]+$/;
  return categoryRegex.test(category);
};

// URL validation
export const validateUrl = (url: string): boolean => {
  // Check if url is a string
  if (typeof url !== 'string') return false;
  
  // Check length
  if (url.length > 2048) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Sanitize string input to prevent XSS
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validate and sanitize string input
export const validateAndSanitizeString = (input: string, maxLength: number = 1000): string | null => {
  // Check if input is a string
  if (typeof input !== 'string') return null;
  
  // Check length
  if (input.length > maxLength) return null;
  
  // Sanitize and return
  return sanitizeString(input);
};

// Export all validation functions
export const validators = {
  email: validateEmail,
  password: validatePassword,
  name: validateName,
  contact: validateContact,
  token: validateToken,
  productName: validateProductName,
  productDescription: validateProductDescription,
  price: validatePrice,
  stock: validateStock,
  category: validateCategory,
  url: validateUrl,
  sanitizeString: sanitizeString,
  validateAndSanitizeString: validateAndSanitizeString,
};

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Comprehensive validation function
export const validate = (data: Record<string, any>, rules: Record<string, (value: any) => boolean>): ValidationResult => {
  const errors: ValidationError[] = [];
  
  for (const [field, validator] of Object.entries(rules)) {
    const value = data[field];
    if (value === undefined || value === null) {
      errors.push({ field, message: `${field} is required` });
    } else if (!validator(value)) {
      errors.push({ field, message: `${field} is invalid` });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format validation errors for user display
export const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors.map(error => `${error.field}: ${error.message}`).join(', ');
};