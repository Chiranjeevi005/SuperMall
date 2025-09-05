'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

interface AddToCartButtonProps {
  product: any;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up to parent elements
    addToCart(product, 1);
    
    // Show visual feedback
    const button = e.currentTarget;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.classList.add('bg-green-700');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-700');
    }, 1500);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full px-3 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 ${className}`}
    >
      Add to Cart
    </button>
  );
};

export default AddToCartButton;