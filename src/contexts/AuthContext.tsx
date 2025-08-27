'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types
export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  label?: 'home' | 'work' | 'other';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendor' | 'user' | 'deliveryPerson';
  address?: string;
  savedAddresses: Address[];
  avatar?: string | null; // Adding avatar field
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' };

interface AuthContextType extends AuthState {
  login: (email: string, password: string, adminKey?: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; message: string }>;
  addAddress: (address: Address) => Promise<{ success: boolean; message: string }>;
  updateAddress: (addressId: string, address: Address) => Promise<{ success: boolean; message: string }>;
  deleteAddress: (addressId: string) => Promise<{ success: boolean; message: string }>;
  setDefaultAddress: (addressId: string) => Promise<{ success: boolean; message: string }>;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
  address?: string;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API helper functions
async function apiCall(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

// Auth Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiCall('/api/auth/profile');
      dispatch({ type: 'SET_USER', payload: response.data });
    } catch (error) {
      dispatch({ type: 'SET_USER', payload: null });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string, adminKey?: string) => {
    try {
      const response = await apiCall('/api/auth/Login', {
        method: 'POST',
        body: JSON.stringify({ email, password, adminKey }),
      });

      dispatch({ type: 'SET_USER', payload: response.data });
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      dispatch({ type: 'SET_USER', payload: response.data });
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await apiCall('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      dispatch({ type: 'SET_USER', payload: response.data });
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Profile update failed' 
      };
    }
  };

  const addAddress = async (address: Address) => {
    if (!state.user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Validate address data
      if (!address.fullName || address.fullName.trim().length < 2) {
        return { success: false, message: 'Full name is required and must be at least 2 characters' };
      }
      
      if (!address.phone || !/^\d{10}$/.test(address.phone)) {
        return { success: false, message: 'Please enter a valid 10-digit phone number' };
      }
      
      if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
        return { success: false, message: 'Address line 1 is required and must be at least 5 characters' };
      }
      
      if (!address.city || address.city.trim().length < 2) {
        return { success: false, message: 'City is required and must be at least 2 characters' };
      }
      
      if (!address.state || address.state.trim().length < 2) {
        return { success: false, message: 'State is required and must be at least 2 characters' };
      }
      
      if (!address.postalCode || !/^\d{6}$/.test(address.postalCode)) {
        return { success: false, message: 'Please enter a valid 6-digit postal code' };
      }

      // Create a copy of current addresses
      const updatedAddresses = [...state.user.savedAddresses, address];
      
      const response = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });

      dispatch({ type: 'SET_USER', payload: response.data });
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to add address' 
      };
    }
  };

  const updateAddress = async (addressId: string, address: Address) => {
    if (!state.user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Validate address data
      if (!address.fullName || address.fullName.trim().length < 2) {
        return { success: false, message: 'Full name is required and must be at least 2 characters' };
      }
      
      if (!address.phone || !/^\d{10}$/.test(address.phone)) {
        return { success: false, message: 'Please enter a valid 10-digit phone number' };
      }
      
      if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
        return { success: false, message: 'Address line 1 is required and must be at least 5 characters' };
      }
      
      if (!address.city || address.city.trim().length < 2) {
        return { success: false, message: 'City is required and must be at least 2 characters' };
      }
      
      if (!address.state || address.state.trim().length < 2) {
        return { success: false, message: 'State is required and must be at least 2 characters' };
      }
      
      if (!address.postalCode || !/^\d{6}$/.test(address.postalCode)) {
        return { success: false, message: 'Please enter a valid 6-digit postal code' };
      }

      // Find and update the address
      const updatedAddresses = state.user.savedAddresses.map(addr => 
        addr._id === addressId ? { ...address, _id: addressId } : addr
      );
      
      const response = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });

      dispatch({ type: 'SET_USER', payload: response.data });
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update address' 
      };
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!state.user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Filter out the address to delete
      const updatedAddresses = state.user.savedAddresses.filter(addr => addr._id !== addressId);
      
      const response = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });

      dispatch({ type: 'SET_USER', payload: response.data });
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete address' 
      };
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!state.user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      // Set the selected address as default and others as non-default
      const updatedAddresses = state.user.savedAddresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }));
      
      const response = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ savedAddresses: updatedAddresses }),
      });

      dispatch({ type: 'SET_USER', payload: response.data });
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to set default address' 
      };
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}