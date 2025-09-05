'use client';

import React from 'react';
import Link from 'next/link';

interface Vendor {
  _id: string;
  name: string;
  description: string;
  location: {
    floor: number;
    section: string;
  };
  categories: string[];
}

const FeaturedVendorCard = ({ vendor }: { vendor: Vendor }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
      {/* Shop Image Placeholder - Indian Rural theme */}
      <div className="h-48 bg-gradient-to-r from-amber-100 to-green-100 flex items-center justify-center">
        <div className="bg-white rounded-full p-5 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{vendor.name}</h3>
            <div className="flex items-center mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-gray-600">
                Floor {vendor.location.floor}, Section {vendor.location.section}
              </p>
            </div>
          </div>
        </div>
        
        <p className="mt-4 text-gray-700 line-clamp-2">
          {vendor.description}
        </p>
        
        <div className="mt-5 flex flex-wrap gap-2">
          {vendor.categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors duration-200"
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="mt-6">
          <Link
            href={`/vendors/${vendor._id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            View Vendor
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVendorCard;