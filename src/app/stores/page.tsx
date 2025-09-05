'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { indianRuralTheme } from '@/theme/designSystem';
import VendorCard from '@/components/VendorCard';

// Define TypeScript interfaces
interface Store {
  _id: string;
  shopName: string;
  description: string;
  category: string;
  floor?: number;
  section?: string;
  logoURL?: string;
  rating?: number;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  icon?: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState('alphabetical');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and stores
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories?activeOnly=true&limit=0');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        // Extract categories array from response
        let categories: Category[] = [];
        if (Array.isArray(categoriesData)) {
          categories = categoriesData;
        } else if (categoriesData && typeof categoriesData === 'object') {
          if (Array.isArray(categoriesData.categories)) {
            categories = categoriesData.categories;
          } else if (Array.isArray(categoriesData.data)) {
            categories = categoriesData.data;
          }
        }
        setCategories(categories);
        
        // Fetch stores/vendors
        const storesResponse = await fetch('/api/vendors');
        if (!storesResponse.ok) {
          throw new Error('Failed to fetch stores');
        }
        const storesData = await storesResponse.json();
        
        // Extract vendors array from response (like the vendor page does)
        let vendors: Store[] = [];
        if (storesData && typeof storesData === 'object' && Array.isArray(storesData.vendors)) {
          vendors = storesData.vendors;
        } else if (Array.isArray(storesData)) {
          vendors = storesData;
        }
        
        setStores(vendors);
        setFilteredStores(vendors);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    // Start with all stores
    let result = [...stores];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(store => 
        store.shopName.toLowerCase().includes(term) ||
        store.description.toLowerCase().includes(term) ||
        store.category.toLowerCase().includes(term)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(store => store.category === selectedCategory);
    }
    
    // Sort stores
    switch (sortOption) {
      case 'alphabetical':
        result.sort((a, b) => a.shopName.localeCompare(b.shopName));
        break;
      case 'popular':
        // Sort by rating (descending), then by name
        result.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return a.shopName.localeCompare(b.shopName);
        });
        break;
      case 'recent':
        // For now, we'll sort alphabetically as we don't have createdAt field in Vendor model
        result.sort((a, b) => a.shopName.localeCompare(b.shopName));
        break;
      default:
        result.sort((a, b) => a.shopName.localeCompare(b.shopName));
    }
    
    setFilteredStores(result);
  }, [searchTerm, selectedCategory, sortOption, stores]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mt-4">Error Loading Stores</h3>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-700 hover:bg-green-800 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-100 via-orange-50 to-green-100 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 ${indianRuralTheme.patterns.jute}`}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Discover Authentic Stores
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-700 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore handpicked shops from villages, artisans, and local producers across India
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-green-700">{stores.length}</div>
              <div className="text-gray-600 mt-1">Active Stores</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-amber-600">{categories.length}</div>
              <div className="text-gray-600 mt-1">Categories</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md">
              <div className="text-3xl font-bold text-blue-600">8+</div>
              <div className="text-gray-600 mt-1">States Covered</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Stores
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name, category..."
                  className="w-full px-4 py-2.5 border border-amber-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2.5 border border-amber-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                className="w-full px-4 py-2.5 border border-amber-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="popular">Most Popular</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-green-700 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="font-bold">{filteredStores.length}</span> of <span className="font-bold">{stores.length}</span> stores
          </p>
          {filteredStores.length > 0 && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortOption('alphabetical');
              }}
              className="text-sm text-amber-700 hover:text-green-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Store List */}
        {filteredStores.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredStores.map((store) => (
              <motion.div key={store._id} variants={item}>
                <VendorCard vendor={{
                  _id: store._id,
                  name: store.shopName,
                  description: store.description,
                  category: store.category,
                  floor: store.floor || 1,
                  rating: store.rating || 0,
                  logoURL: store.logoURL
                }} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mt-4">No stores found</h3>
            <p className="text-gray-600 mt-2">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortOption('alphabetical');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-700 hover:bg-green-800 transition-colors duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}