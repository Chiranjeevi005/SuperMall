'use client';

import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header skeleton - Rural theme */}
      <div className="h-16 bg-amber-200 rounded"></div>
      
      {/* Hero section skeleton */}
      <div className="mt-8 h-96 bg-amber-200 rounded-2xl"></div>
      
      {/* Section headers skeleton */}
      <div className="mt-12 flex justify-between items-center">
        <div className="h-8 bg-amber-200 rounded w-1/4"></div>
        <div className="h-6 bg-amber-200 rounded w-24"></div>
      </div>
      
      {/* Cards grid skeleton */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-amber-100">
            <div className="h-48 bg-amber-200"></div>
            <div className="p-6">
              <div className="h-6 bg-amber-200 rounded w-3/4"></div>
              <div className="mt-4 h-4 bg-amber-200 rounded"></div>
              <div className="mt-2 h-4 bg-amber-200 rounded w-5/6"></div>
              <div className="mt-6 flex justify-between">
                <div className="h-10 bg-amber-200 rounded-lg w-32"></div>
                <div className="h-10 bg-amber-200 rounded-lg w-10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;