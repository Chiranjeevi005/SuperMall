'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate fetching products data
    const fetchProducts = async () => {
      try {
        // In a real application, you would fetch this data from your API
        setTimeout(() => {
          setProducts([
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
              inWishlist: false,
              vendor: 'Farmers Kitchen',
              stock: 50,
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
              inWishlist: true,
              vendor: 'Artisan Crafts',
              stock: 12,
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
              inWishlist: false,
              vendor: 'Dairy Products',
              stock: 0,
            },
            {
              id: 4,
              name: 'Organic Honey',
              category: 'Food & Beverages',
              price: 250,
              originalPrice: 300,
              discount: 17,
              rating: 4.7,
              reviews: 142,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954796/Lamp_daeeg7.jpg',
              inWishlist: false,
              vendor: 'Beekeepers Co-op',
              stock: 25,
            },
            {
              id: 5,
              name: 'Handwoven Shawl',
              category: 'Clothing & Textiles',
              price: 450,
              originalPrice: 500,
              discount: 10,
              rating: 4.6,
              reviews: 76,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953899/Handloom-Silk-Saree_ht0ync.jpg',
              inWishlist: false,
              vendor: 'Textile Artisans',
              stock: 8,
            },
            {
              id: 6,
              name: 'Organic Turmeric Powder',
              category: 'Spices & Condiments',
              price: 180,
              originalPrice: 200,
              discount: 10,
              rating: 4.4,
              reviews: 98,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955013/Turnemic_Powder_hamhyk.jpg',
              inWishlist: false,
              vendor: 'Spice Masters',
              stock: 42,
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleWishlistToggle = (productId: number) => {
    // In a real application, you would make an API call to update the wishlist
    setProducts(products.map(product => 
      product.id === productId ? { ...product, inWishlist: !product.inWishlist } : product
    ));
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return a.id - b.id; // featured/default
      }
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const categories = ['all', 'Grains & Pulses', 'Dairy & Poultry', 'Fruits & Vegetables', 'Home & Living', 'Food & Beverages', 'Clothing & Textiles', 'Spices & Condiments'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'newest', label: 'Newest' },
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">Browse all products from our vendors</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="relative rounded-md shadow-sm flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search products, vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Mobile filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filters
          </button>
        </div>

        {/* Desktop filters */}
        <div className="hidden md:flex md:items-center md:space-x-4 mt-4">
          <div>
            <select
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <span>{filteredProducts.length} products</span>
          </div>
        </div>

        {/* Mobile filters - collapsible */}
        {showFilters && (
          <div className="md:hidden mt-4 p-4 bg-white rounded-lg shadow">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-3 pr-10 py-2 text-base border-gray-300 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">₹{priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">₹{priceRange[1]}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{filteredProducts.length} products</span>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="text-green-600 hover:text-green-800"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => handleWishlistToggle(product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-amber-50"
              >
                <svg 
                  className={`h-5 w-5 ${product.inWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
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
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-xs text-gray-400">by {product.vendor}</p>
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
                <Link 
                  href={`/customer/products/${product.id}`}
                  className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white ${
                    product.stock === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                  }`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'View'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange([0, 1000]);
                setSortBy('featured');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}