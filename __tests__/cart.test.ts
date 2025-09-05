import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useCart, CartProvider } from '@/context/CartContext';
import { IProduct } from '@/models/Product';

// Mock product data
const mockProduct: IProduct = {
  _id: '1',
  name: 'Test Product',
  description: 'A test product',
  price: 100,
  shop: 'shop1',
  category: 'Test Category',
  images: ['image1.jpg'],
  stock: 10,
  isActive: true,
  isApproved: true,
  features: [],
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

describe('Cart Context', () => {
  it('should add item to cart', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CartProvider, null, children)
    );
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
    });
    
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.items[0].product._id).toBe('1');
    expect(result.current.state.items[0].quantity).toBe(2);
    expect(result.current.state.totalItems).toBe(2);
    expect(result.current.state.totalPrice).toBe(200);
  });

  it('should update item quantity', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CartProvider, null, children)
    );
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.updateQuantity('1', 5);
    });
    
    expect(result.current.state.items[0].quantity).toBe(5);
    expect(result.current.state.totalItems).toBe(5);
    expect(result.current.state.totalPrice).toBe(500);
  });

  it('should remove item from cart', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CartProvider, null, children)
    );
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.removeFromCart('1');
    });
    
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.totalItems).toBe(0);
    expect(result.current.state.totalPrice).toBe(0);
  });

  it('should save item for later', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CartProvider, null, children)
    );
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.saveForLater('1');
    });
    
    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.savedForLater).toHaveLength(1);
    expect(result.current.state.savedForLater[0].product._id).toBe('1');
    expect(result.current.state.savedForLater[0].quantity).toBe(2);
  });

  it('should move item to cart', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      React.createElement(CartProvider, null, children)
    );
    
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.saveForLater('1');
      result.current.moveToCart('1');
    });
    
    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.savedForLater).toHaveLength(0);
    expect(result.current.state.items[0].product._id).toBe('1');
    expect(result.current.state.items[0].quantity).toBe(2);
  });
});