'use client';

import React, { useState } from 'react';

interface ProductFilterProps {
  onFilterChange: (filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => void;
  categories: string[];
}

const ProductFilter = ({ onFilterChange, categories }: ProductFilterProps) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleApplyFilters = () => {
    const filters: {
      search?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
    } = {};
    
    if (search) filters.search = search;
    if (category) filters.category = category;
    if (minPrice) filters.minPrice = parseFloat(minPrice);
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter Products
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500 transition-all duration-200"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-3 py-1.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500 transition-all duration-200"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="bg-gray-50 rounded-lg p-3">
          <label htmlFor="search" className="flex text-xs font-medium text-gray-700 mb-1.5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Product name..."
            className="w-full rounded-md border border-gray-200 bg-white text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-all duration-200"
          />
        </div>
        
        {/* Category */}
        <div className="bg-gray-50 rounded-lg p-3">
          <label htmlFor="category" className="flex text-xs font-medium text-gray-700 mb-1.5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-all duration-200"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        {/* Min Price */}
        <div className="bg-gray-50 rounded-lg p-3">
          <label htmlFor="minPrice" className="flex text-xs font-medium text-gray-700 mb-1.5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Min Price
          </label>
          <input
            type="number"
            id="minPrice"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
            className="w-full rounded-md border border-gray-200 bg-white text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-all duration-200"
          />
        </div>
        
        {/* Max Price */}
        <div className="bg-gray-50 rounded-lg p-3">
          <label htmlFor="maxPrice" className="flex text-xs font-medium text-gray-700 mb-1.5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Max Price
          </label>
          <input
            type="number"
            id="maxPrice"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
            min="0"
            step="0.01"
            className="w-full rounded-md border border-gray-200 bg-white text-sm shadow-sm focus:border-green-500 focus:ring-green-500 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;