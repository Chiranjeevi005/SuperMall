'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { useCart } from '@/context/CartContext';
import logger from '@/utils/clientLogger';
import { IProduct } from '@/models/Product'; // Import the proper type

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${unwrappedParams.id}`);
        const data = await response.json();
        
        if (response.ok) {
          // Create a proper IProduct object from the API response
          const apiProduct = data.product;
          
          // Create a minimal IProduct object with required fields
          // We'll use type assertion to bypass some of the complex Mongoose Document requirements
          const mappedProduct = {
            _id: apiProduct._id,
            name: apiProduct.name,
            description: apiProduct.description,
            price: apiProduct.price,
            category: apiProduct.category,
            images: apiProduct.images || [],
            stock: apiProduct.stock !== undefined ? apiProduct.stock : 0,
            shop: typeof apiProduct.shop === 'object' ? apiProduct.shop._id : apiProduct.shop,
            features: apiProduct.features || [],
            // Use default values for required fields that might be missing
            isActive: apiProduct.isActive !== undefined ? apiProduct.isActive : true,
            isApproved: apiProduct.isApproved !== undefined ? apiProduct.isApproved : false,
            createdAt: apiProduct.createdAt ? new Date(apiProduct.createdAt) : new Date(),
            updatedAt: apiProduct.updatedAt ? new Date(apiProduct.updatedAt) : new Date(),
            offers: apiProduct.offers || [],
          } as unknown as IProduct;
          
          setProduct(mappedProduct);
        } else {
          setError(data.error || 'Failed to fetch product');
        }
      } catch (err) {
        logger.error('Error fetching product', { error: err });
        setError('An error occurred while fetching product');
      } finally {
        setLoading(false);
      }
    };

    if (unwrappedParams.id) {
      fetchProduct();
    }
  }, [unwrappedParams.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      alert(`Added ${quantity} ${product.name} to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/products')}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200 mr-4"
          >
            Back to Products
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <div className="text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <button 
            onClick={() => router.push('/products')}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Helper function to safely get shop ID
  const getShopId = () => {
    if (typeof product.shop === 'string') {
      return product.shop;
    } else if (product.shop && typeof product.shop === 'object' && '_id' in product.shop) {
      return product.shop._id;
    }
    return null;
  };

  // Helper function to safely get shop name
  const getShopName = () => {
    if (typeof product.shop === 'string') {
      return 'Unknown Vendor';
    } else if (product.shop && typeof product.shop === 'object' && 'name' in product.shop) {
      return (product.shop as { name: string }).name;
    }
    return 'Unknown Vendor';
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-green-700">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-green-700">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs md:max-w-md">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images Gallery */}
            <div className="bg-amber-50 rounded-lg p-4">
              {/* Main Image Display */}
              <div className="relative aspect-square w-full mb-4 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image 
                    src={product.images[selectedImageIndex]} 
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`} 
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="bg-white rounded-full p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-green-600' : 'border-amber-200'}`}
                    >
                      <Image 
                        src={image} 
                        alt={`${product.name} - Thumbnail ${index + 1}`} 
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="mt-2 flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-700">₹{product.price.toFixed(2)}</div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600">{product.description}</p>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-lg font-medium text-gray-900">Features</h2>
                  <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <dt className="text-sm font-medium text-gray-500 w-24">{feature.name}</dt>
                        <dd className="text-sm text-gray-900 ml-2">{feature.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Vendor Information */}
              <div className="mt-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="ml-2 text-sm text-gray-600">
                    Sold by {getShopId() ? (
                      <a href={`/vendors/${getShopId()}`} className="text-green-700 hover:text-green-800">
                        {getShopName()}
                      </a>
                    ) : (
                      <span className="text-gray-900">{getShopName()}</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Quantity Selector and Actions */}
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <span className="mr-4 text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-amber-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-amber-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 text-gray-600 hover:bg-amber-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="ml-4 text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      product.stock === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      product.stock === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-700 text-white hover:bg-green-800'
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}