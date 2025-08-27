'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Types
export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images: { url: string; alt: string }[];
    stock: number;
    status: string;
  };
  quantity: number;
  priceAtTime: number;
  selectedVariants: {
    variantName: string;
    selectedOption: string;
  }[];
  addedAt: string;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  lastUpdated: string;
}

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number, selectedVariants?: any[]) => Promise<{ success: boolean; message: string }>;
  updateQuantity: (productId: string, quantity: number) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (productId: string) => Promise<{ success: boolean; message: string }>;
  clearCart: () => Promise<{ success: boolean; message: string }>;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

// Initial state
const initialState: CartState = {
  cart: null,
  isLoading: false,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, isLoading: false };
    case 'CLEAR_CART':
      return { ...state, cart: null };
    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// API helper functions
async function apiCall(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'An error occurred');
  }
  
  return data;
}

// Cart Provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await apiCall('/api/cart');
      dispatch({ type: 'SET_CART', payload: response.data });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_CART', payload: null });
    }
  };

  const addToCart = async (productId: string, quantity = 1, selectedVariants: any[] = []) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      const response = await apiCall('/api/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, selectedVariants }),
      });

      dispatch({ type: 'SET_CART', payload: response.data });
      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to add item to cart' 
      };
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to update cart' };
    }

    try {
      const response = await apiCall('/api/cart', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
      });

      dispatch({ type: 'SET_CART', payload: response.data });
      return { success: true, message: 'Cart updated successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update cart' 
      };
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to remove items from cart' };
    }

    try {
      const response = await apiCall(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'SET_CART', payload: response.data });
      return { success: true, message: 'Item removed from cart successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to remove item from cart' 
      };
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to clear cart' };
    }

    try {
      const response = await apiCall('/api/cart', {
        method: 'DELETE',
      });

      dispatch({ type: 'SET_CART', payload: response.data });
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to clear cart' 
      };
    }
  };

  const getCartItemCount = () => {
    return state.cart?.totalItems || 0;
  };

  const getCartTotal = () => {
    return state.cart?.totalAmount || 0;
  };

  const value: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    getCartItemCount,
    getCartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}