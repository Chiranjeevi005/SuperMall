'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    offers?: {
      discountType: 'percentage' | 'fixed';
      discountValue: number;
    }[];
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Calculate discounted price if offer exists
  const calculateDiscountedPrice = () => {
    if (product.offers && product.offers.length > 0) {
      const offer = product.offers[0]; // Take the first offer
      if (offer.discountType === 'percentage') {
        return product.price - (product.price * offer.discountValue) / 100;
      } else if (offer.discountType === 'fixed') {
        return product.price - offer.discountValue;
      }
    }
    return product.price;
  };

  const discountedPrice = calculateDiscountedPrice();
  const hasOffer = product.offers && product.offers.length > 0;

  // Prevent card click from interfering with button clicks
  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if not clicking on buttons or links
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
      e.preventDefault();
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="aspect-square overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Link href={`/products/${product._id}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        ) : (
          <Link href={`/products/${product._id}`} className="block">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </Link>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start flex-grow">
          <div>
            <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 line-clamp-2">
              <Link href={`/products/${product._id}`} className="block">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-gray-500">{product.category}</p>
          </div>
        </div>

        {/* Price and Offer */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            {hasOffer ? (
              <div className="flex items-center">
                <p className="text-sm font-bold text-gray-900">₹{discountedPrice.toFixed(2)}</p>
                <p className="ml-2 text-xs text-gray-500 line-through">₹{product.price.toFixed(2)}</p>
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {product.offers![0].discountType === 'percentage' 
                    ? `${product.offers![0].discountValue}% off` 
                    : `₹${product.offers![0].discountValue} off`}
                </span>
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Stock Status */}
        {product.stock < 5 && product.stock > 0 && (
          <div className="mt-2 text-xs text-red-600">
            Only {product.stock} left in stock!
          </div>
        )}

        {product.stock === 0 && (
          <div className="mt-2 text-xs text-red-600 font-medium">
            Out of stock
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link 
            href={`/products/${product._id}`}
            className="flex-1 text-center px-3 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
          >
            View Details
          </Link>
          {product.stock > 0 ? (
            <div className="flex-1">
              <AddToCartButton product={product} />
            </div>
          ) : (
            <button
              disabled
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;