'use client';

import React from 'react';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
}

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {product.images && product.images.length > 0 ? (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-6">
          <Link
            href={`/products/${product._id}`}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            View Product Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;