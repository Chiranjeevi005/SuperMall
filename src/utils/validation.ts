// Validation utility functions

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number)
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Name validation (2-50 characters)
export const validateName = (name: string): boolean => {
  return name.length >= 2 && name.length <= 50;
};

// Contact number validation (10-15 digits, may include + and spaces)
export const validateContact = (contact: string): boolean => {
  if (!contact) return true; // Contact is optional
  const phoneRegex = /^[\+]?[0-9\s\-]{10,15}$/;
  return phoneRegex.test(contact.trim());
};

// Token validation (64 character hex string)
export const validateToken = (token: string): boolean => {
  return /^[a-f0-9]{64}$/.test(token);
};

// Product name validation
export const validateProductName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100;
};

// Product description validation
export const validateProductDescription = (description: string): boolean => {
  return description.length >= 10 && description.length <= 1000;
};

// Price validation
export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 1000000;
};

// Stock validation
export const validateStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0 && stock <= 100000;
};

// Category validation
export const validateCategory = (category: string): boolean => {
  return category.length >= 2 && category.length <= 50;
};

// URL validation
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
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