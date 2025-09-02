'use client';

import React, { useState, useEffect } from 'react';
import ShopCard from '@/components/ShopCard';
import ProductCard from '@/components/ProductCard';
import OfferCard from '@/components/OfferCard';

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
];

const mockProducts = [
  {
    _id: '1',
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 699.99,
    category: 'Electronics',
    images: [],
  },
  {
    _id: '2',
    name: 'Designer T-Shirt',
    description: 'Comfortable and stylish t-shirt',
    price: 29.99,
    category: 'Clothing',
    images: [],
  },
];

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
];

export default function Home() {
  const [shops, setShops] = useState(mockShops);
  const [products, setProducts] = useState(mockProducts);
  const [offers, setOffers] = useState(mockOffers);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to Super Mall
            </h1>
            <p className="mt-6 max-w-lg mx-auto text-xl text-indigo-200">
              Discover amazing products from local merchants in your area
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Featured Shops */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Shops</h2>
            <a href="/shops" className="text-indigo-600 hover:text-indigo-900">
              View all shops
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <a href="/products" className="text-indigo-600 hover:text-indigo-900">
              View all products
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Current Offers */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Current Offers</h2>
            <a href="/offers" className="text-indigo-600 hover:text-indigo-900">
              View all offers
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer._id} offer={offer} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}