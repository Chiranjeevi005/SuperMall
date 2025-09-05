'use client';

import React from 'react';
import Link from 'next/link';
import EnhancedSearch from '@/components/EnhancedSearch';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50">
      {/* Decorative background elements - Indian Rural theme */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-green-200 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-amber-200 rounded-full filter blur-3xl opacity-20"></div>
        {/* Additional decorative elements for rural theme */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-amber-100 rounded-full filter blur-2xl opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 bg-green-100 rounded-full filter blur-2xl opacity-30"></div>
      </div>
      
      {/* Main content */}
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Indian Rural theme */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
              <span className="block">Discover Authentic</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-amber-600 mt-2">
                Indian Rural Markets
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-700 max-w-3xl">
              Your gateway to genuine products from Indian villages, farms, and artisan communities. 
              Connect directly with rural producers and experience the richness of traditional India.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Products
              </Link>
              <Link
                href="/register?role=merchant"
                className="px-8 py-4 border border-amber-300 text-base font-bold rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Become a Vendor
              </Link>
            </div>
            
            {/* Search bar in hero section */}
            <div className="mt-10 max-w-2xl">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <EnhancedSearch 
                  placeholder="Search for products, vendors, or categories..." 
                  size="large"
                />
              </div>
            </div>
          </div>
          
          {/* Image/Visual Content - Replaced with provided image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756989444/Hero_Image_or9ptc.png" 
                alt="SuperMall Hero Image" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;