'use client';

import React, { useState, useEffect } from 'react';
import OfferCard from '@/components/OfferCard';

// Mock data for demonstration
const mockOffers = [
  {
    _id: '1',
    title: 'Summer Sale',
    description: 'Up to 50% off on selected items',
    discountType: 'percentage' as const,
    discountValue: 50,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    shop: { name: 'Fashion Corner' },
  },
  {
    _id: '2',
    title: 'Tech Discount',
    description: '$100 off on all laptops',
    discountType: 'fixed' as const,
    discountValue: 100,
    startDate: '2025-09-01',
    endDate: '2025-09-15',
    shop: { name: 'Electronics Store' },
  },
  {
    _id: '3',
    title: 'Back to School',
    description: '20% off on all school supplies',
    discountType: 'percentage' as const,
    discountValue: 20,
    startDate: '2025-08-01',
    endDate: '2025-09-30',
    shop: { name: 'Home & Garden' },
  },
  {
    _id: '4',
    title: 'Fitness Special',
    description: 'Buy one get one 50% off on fitness equipment',
    discountType: 'percentage' as const,
    discountValue: 50,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
    shop: { name: 'Sports Zone' },
  },
];

export default function OffersPage() {
  const [offers, setOffers] = useState(mockOffers);
  const [filteredOffers, setFilteredOffers] = useState(mockOffers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState('all');

  // Get unique shops for filters
  const shops = ['all', ...new Set(mockOffers.map(offer => offer.shop.name))];

  useEffect(() => {
    let result = offers;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by shop
    if (selectedShop !== 'all') {
      result = result.filter(offer => offer.shop.name === selectedShop);
    }
    
    setFilteredOffers(result);
  }, [searchTerm, selectedShop, offers]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
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
                placeholder="Search offers..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="shop" className="block text-sm font-medium text-gray-700 mb-1">
                Shop
              </label>
              <select
                id="shop"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
              >
                {shops.map(shop => (
                  <option key={shop} value={shop}>
                    {shop === 'all' ? 'All Shops' : shop}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Active Offers Only
              </label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="activeOnly"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="activeOnly" className="ml-2 block text-sm text-gray-900">
                  Show only active offers
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Offer List */}
        {filteredOffers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}