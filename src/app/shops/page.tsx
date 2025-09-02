'use client';

import React, { useState, useEffect } from 'react';
import ShopCard from '@/components/ShopCard';

// Mock data for demonstration
const mockShops = [
  {
    _id: '1',
    name: 'Electronics Store',
    description: 'Latest gadgets and electronics at affordable prices',
    location: { floor: 1, section: 'A' },
    categories: ['Electronics', 'Gadgets'],
  },
  {
    _id: '2',
    name: 'Fashion Corner',
    description: 'Trendy clothing and accessories for all ages',
    location: { floor: 2, section: 'B' },
    categories: ['Clothing', 'Accessories'],
  },
  {
    _id: '3',
    name: 'Home & Garden',
    description: 'Everything for your home and garden needs',
    location: { floor: 1, section: 'C' },
    categories: ['Home', 'Garden'],
  },
  {
    _id: '4',
    name: 'Sports Zone',
    description: 'Sports equipment and apparel',
    location: { floor: 3, section: 'A' },
    categories: ['Sports', 'Fitness'],
  },
];

export default function ShopsPage() {
  const [shops, setShops] = useState(mockShops);
  const [filteredShops, setFilteredShops] = useState(mockShops);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique floors and categories for filters
  const floors = ['all', ...new Set(mockShops.map(shop => shop.location.floor.toString()))];
  const categories = ['all', ...new Set(mockShops.flatMap(shop => shop.categories))];

  useEffect(() => {
    let result = shops;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(shop => 
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by floor
    if (selectedFloor !== 'all') {
      result = result.filter(shop => shop.location.floor.toString() === selectedFloor);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(shop => shop.categories.includes(selectedCategory));
    }
    
    setFilteredShops(result);
  }, [searchTerm, selectedFloor, selectedCategory, shops]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search shops..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                Floor
              </label>
              <select
                id="floor"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedFloor}
                onChange={(e) => setSelectedFloor(e.target.value)}
              >
                {floors.map(floor => (
                  <option key={floor} value={floor}>
                    {floor === 'all' ? 'All Floors' : `Floor ${floor}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          </div>
        </div>

        {/* Shop List */}
        {filteredShops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}