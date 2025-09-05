'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Simulate fetching product data
    const fetchProduct = async () => {
      try {
        // In a real application, you would fetch this data from your API
        setTimeout(() => {
          setProduct({
            id: params.id,
            name: 'Organic Brown Rice',
            category: 'Grains & Pulses',
            price: 120,
            originalPrice: 150,
            discount: 20,
            rating: 4.5,
            reviews: 124,
            description: 'Premium quality organic brown rice, grown without pesticides or chemicals. Rich in fiber and nutrients, perfect for a healthy diet.',
            images: [
              'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954795/Bamboo_Chair_fi6ikt.jpg',
              'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954796/Wooden_Stool_oghjer.jpg',
              'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954795/Brass_Utensils_aps7dn.jpg',
            ],
            inWishlist: false,
            vendor: 'Farmers Kitchen',
            vendorRating: 4.7,
            stock: 50,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleWishlistToggle = () => {
    // In a real application, you would make an API call to update the wishlist
    if (product) {
      setProduct({ ...product, inWishlist: !product.inWishlist });
    }
  };

  const handleAddToCart = () => {
    // In a real application, you would make an API call to add to cart
    alert(`Added ${quantity} ${product.name} to cart`);
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

  if (!product) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-2 text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
        >
          <svg className="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to products
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-green-500' : ''}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-1 text-lg text-gray-500">{product.category}</p>
              </div>
              <button
                onClick={handleWishlistToggle}
                className="p-2 rounded-full hover:bg-amber-50"
              >
                <svg 
                  className={`h-6 w-6 ${product.inWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mt-4 flex items-center">
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <svg
                    key={rating}
                    className={`h-5 w-5 ${rating < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
              </div>
              <div className="ml-4 flex items-center">
                <span className="text-gray-600">Sold by:</span>
                <span className="ml-1 font-medium">{product.vendor}</span>
                <span className="ml-2 flex items-center">
                  <svg className="h-4 w-4 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-600">{product.vendorRating}</span>
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
                {product.originalPrice > product.price && (
                  <>
                    <p className="ml-4 text-xl text-gray-500 line-through">{formatCurrency(product.originalPrice)}</p>
                    <span className="ml-4 bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <span className="text-gray-600">Availability:</span>
                <span className="ml-2 font-medium text-green-600">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="mt-8">
                <div className="flex items-center">
                  <span className="mr-4 text-gray-600">Quantity:</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-l-md border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 border-t border-b border-gray-300 text-center"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 rounded-r-md border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                    >
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => alert('Buy now functionality would go here')}
                    className="flex-1 bg-amber-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}