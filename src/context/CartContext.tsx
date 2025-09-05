'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { IProduct } from '@/models/Product';

// Create a type for the minimal product information needed for cart
interface CartProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  stock?: number;
}

interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  savedForLater: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: CartProduct; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SAVE_FOR_LATER'; payload: { productId: string } }
  | { type: 'MOVE_TO_CART'; payload: { productId: string } }
  | { type: 'APPLY_COUPON'; payload: { code: string } }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; savedForLater: CartItem[] } };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (product: IProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  applyCoupon: (code: string) => void;
} | null>(null);

// Helper function to safely get product ID as string
const getProductId = (product: IProduct): string => {
  return typeof (product._id as any) === 'string' ? (product._id as any) : (product._id as any).toString();
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items,
        savedForLater: action.payload.savedForLater,
        totalItems: action.payload.items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: action.payload.items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      };
    
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.product.price * action.payload.quantity),
        };
      } else {
        const newItem: CartItem = {
          product: action.payload.product,
          quantity: action.payload.quantity,
        };
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + action.payload.quantity,
          totalPrice: state.totalPrice + (action.payload.product.price * action.payload.quantity),
        };
      }
    
    case 'REMOVE_FROM_CART':
      const itemToRemove = state.items.find(
        item => item.product._id === action.payload.productId
      );
      
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(
          item => item.product._id !== action.payload.productId
        ),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.product.price * itemToRemove.quantity),
      };
    
    case 'UPDATE_QUANTITY':
      const itemToUpdate = state.items.find(
        item => item.product._id === action.payload.productId
      );
      
      if (!itemToUpdate) return state;
      
      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (itemToUpdate.product.price * quantityDiff),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    case 'SAVE_FOR_LATER':
      const itemToSave = state.items.find(
        item => item.product._id === action.payload.productId
      );
      
      if (!itemToSave) return state;
      
      return {
        ...state,
        items: state.items.filter(
          item => item.product._id !== action.payload.productId
        ),
        savedForLater: [...state.savedForLater, itemToSave],
        totalItems: state.totalItems - itemToSave.quantity,
        totalPrice: state.totalPrice - (itemToSave.product.price * itemToSave.quantity),
      };
    
    case 'MOVE_TO_CART':
      const itemToMove = state.savedForLater.find(
        item => item.product._id === action.payload.productId
      );
      
      if (!itemToMove) return state;
      
      return {
        ...state,
        savedForLater: state.savedForLater.filter(
          item => item.product._id !== action.payload.productId
        ),
        items: [...state.items, itemToMove],
        totalItems: state.totalItems + itemToMove.quantity,
        totalPrice: state.totalPrice + (itemToMove.product.price * itemToMove.quantity),
      };
    
    case 'APPLY_COUPON':
      // For now, we'll just log the coupon code
      console.log('Coupon applied:', action.payload.code);
      return state;
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    savedForLater: [],
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    const savedSavedForLater = typeof window !== 'undefined' ? localStorage.getItem('savedForLater') : null;
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const parsedSavedForLater = savedSavedForLater ? JSON.parse(savedSavedForLater) : [];
        dispatch({ 
          type: 'LOAD_CART', 
          payload: { 
            items: parsedCart, 
            savedForLater: parsedSavedForLater 
          } 
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state.items));
      localStorage.setItem('savedForLater', JSON.stringify(state.savedForLater));
    }
  }, [state.items, state.savedForLater]);

  const addToCart = (product: CartProduct | IProduct, quantity: number) => {
    // Convert IProduct to CartProduct if needed
    const cartProduct: CartProduct = {
      _id: product._id ? product._id.toString() : '',
      name: product.name,
      price: product.price,
      images: 'images' in product && product.images ? product.images : undefined,
      category: 'category' in product ? product.category : undefined,
      stock: 'stock' in product ? product.stock : undefined,
    };
    
    dispatch({ type: 'ADD_TO_CART', payload: { product: cartProduct, quantity } });
  };

  // Update other functions to work with string IDs
  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const saveForLater = (productId: string) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: { productId } });
  };

  const moveToCart = (productId: string) => {
    dispatch({ type: 'MOVE_TO_CART', payload: { productId } });
  };

  const applyCoupon = (code: string) => {
    dispatch({ type: 'APPLY_COUPON', payload: { code } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveForLater,
        moveToCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};