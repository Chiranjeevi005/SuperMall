'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerWishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching wishlist data
    const fetchWishlist = async () => {
      try {
        // In a real application, you would fetch this data from your API
        setTimeout(() => {
          setWishlist([
            {
              id: 1,
              name: 'Organic Brown Rice',
              category: 'Grains & Pulses',
              price: 120,
              originalPrice: 150,
              discount: 20,
              rating: 4.5,
              reviews: 124,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954795/Bamboo_Chair_fi6ikt.jpg',
            },
            {
              id: 2,
              name: 'Handmade Pottery Set',
              category: 'Home & Living',
              price: 850,
              originalPrice: 1000,
              discount: 15,
              rating: 4.8,
              reviews: 89,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954796/Wooden_Stool_oghjer.jpg',
            },
            {
              id: 3,
              name: 'Fresh Farm Milk',
              category: 'Dairy & Poultry',
              price: 60,
              originalPrice: 65,
              discount: 8,
              rating: 4.3,
              reviews: 256,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954850/Farm_Milk_ocfuly.jpg',
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = (productId: number) => {
    // In a real application, you would make an API call to remove from wishlist
    setWishlist(wishlist.filter(item => item.id !== productId));
  };

  const handleAddToCart = (productId: number) => {
    // In a real application, you would make an API call to add to cart
    alert(`Added product ${productId} to cart`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="mt-1 text-sm text-gray-500">Your saved items</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-gray-500">Start adding items to your wishlist by clicking the heart icon on products.</p>
          <div className="mt-6">
            <Link
              href="/customer/products"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-amber-50"
                >
                  <svg 
                    className="h-5 w-5 text-red-500 fill-current" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className={`h-4 w-4 ${rating < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">({product.reviews})</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/customer/products/${product.id}`}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}