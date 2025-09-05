'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface CartItemProps {
  item: {
    product: any;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, saveForLater } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    updateQuantity(item.product._id.toString(), newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.product._id.toString());
  };

  const handleSaveForLater = () => {
    saveForLater(item.product._id.toString());
  };

  return (
    <li className="flex py-6">
      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
        {item.product.images && item.product.images.length > 0 ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            width={96}
            height={96}
            className="w-full h-full object-center object-cover"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
        )}
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>
              <a href={`/products/${item.product._id}`}>{item.product.name}</a>
            </h3>
            <p className="ml-4">₹{(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
        </div>

        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-2 py-1 text-gray-600 bg-gray-100 rounded-l-md hover:bg-gray-200 focus:outline-none"
            >
              -
            </button>
            <span className="px-3 py-1 border-y border-gray-200">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-2 py-1 text-gray-600 bg-gray-100 rounded-r-md hover:bg-gray-200 focus:outline-none"
            >
              +
            </button>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              className="font-medium text-green-600 hover:text-green-500"
              onClick={handleSaveForLater}
            >
              Save for later
            </button>
            <button
              type="button"
              className="font-medium text-red-600 hover:text-red-500"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>
        
        {item.product.stock < 5 && (
          <div className="mt-2 text-xs text-red-600">
            Only {item.product.stock} left in stock!
          </div>
        )}
      </div>
    </li>
  );
};

export default CartItem;