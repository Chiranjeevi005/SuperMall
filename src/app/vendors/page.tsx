'use client';

import React, { useState, useEffect } from 'react';
import VendorCard from '@/components/VendorCard';
import { motion } from 'framer-motion';

interface Vendor {
  _id: string;
  shopName: string;
  description: string;
  category: string;
  floor: number;
  rating: number;
  logoURL?: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [loading, setLoading] = useState(true);

  // Get unique floors and categories for filters
  const floors = ['all', ...new Set(vendors.map(vendor => vendor.floor.toString()))];
  const categories = ['all', ...new Set(vendors.map(vendor => vendor.category))];
  const ratings = ['all', '4+', '3+', '2+', '1+'];

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    let result = vendors;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(vendor => 
        vendor.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by floor
    if (selectedFloor !== 'all') {
      result = result.filter(vendor => vendor.floor.toString() === selectedFloor);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(vendor => vendor.category === selectedCategory);
    }
    
    // Filter by rating
    if (selectedRating !== 'all') {
      const minRating = parseInt(selectedRating);
      result = result.filter(vendor => vendor.rating >= minRating);
    }
    
    setFilteredVendors(result);
  }, [searchTerm, selectedFloor, selectedCategory, selectedRating, vendors]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vendors');
      const data = await response.json();
      setVendors(data.vendors);
      setFilteredVendors(data.vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants for vendor cards
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Vendors</h1>
          <p className="mt-2 text-gray-600">
            Discover amazing shops and vendors in our mall
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search vendors..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
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
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rating
              </label>
              <select
                id="rating"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
              >
                {ratings.map(rating => (
                  <option key={rating} value={rating}>
                    {rating === 'all' ? 'Any Rating' : `${rating} Stars & Up`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vendor List */}
        {filteredVendors.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredVendors.map((vendor) => (
              <motion.div key={vendor._id} variants={item}>
                <VendorCard vendor={{
                  _id: vendor._id,
                  name: vendor.shopName,
                  description: vendor.description,
                  category: vendor.category,
                  floor: vendor.floor,
                  rating: vendor.rating,
                  logoURL: vendor.logoURL
                }} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}