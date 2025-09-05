'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  productCount: number;
  icon: string;
  image?: string;
}

const CategoryCard = ({ category }: { category: Category }) => {
  // Map category names to gradient colors - Indian Rural theme
  const getCategoryGradient = (categoryName: string) => {
    const gradients: Record<string, string> = {
      electronics: 'from-blue-50 to-cyan-50',
      fashion: 'from-purple-50 to-pink-50',
      home: 'from-green-50 to-emerald-50',
      beauty: 'from-rose-50 to-pink-50',
      sports: 'from-orange-50 to-amber-50',
      books: 'from-indigo-50 to-purple-50',
      farm: 'from-amber-50 to-yellow-50',
      food: 'from-green-50 to-lime-50',
      crafts: 'from-amber-50 to-orange-50',
      'fresh produce': 'from-green-50 to-emerald-50',
      'handicrafts & artisans': 'from-amber-50 to-orange-50',
      'clothing & apparel': 'from-purple-50 to-pink-50',
      'home & living': 'from-amber-50 to-yellow-50',
      'dairy & poultry': 'from-blue-50 to-cyan-50',
      'spices & condiments': 'from-red-50 to-orange-50',
      'food & beverages': 'from-green-50 to-lime-50',
      'tools & equipment': 'from-gray-50 to-gray-100',
      'textiles & fabrics': 'from-indigo-50 to-purple-50',
      'jewelry & accessories': 'from-yellow-50 to-amber-50',
      'handloom & weaving': 'from-rose-50 to-pink-50',
      'ayurvedic products': 'from-green-50 to-emerald-50',
      'traditional arts': 'from-orange-50 to-red-50',
      'organic & natural': 'from-green-50 to-emerald-50',
      default: 'from-amber-50 to-yellow-50' // Indian wheat field colors
    };
    
    const key = categoryName.toLowerCase();
    return gradients[key] || gradients.default;
  };

  // Map category names to icons - Indian Rural theme
  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, string> = {
      electronics: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
      fashion: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      beauty: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      sports: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      books: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      farm: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      food: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      crafts: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      'fresh produce': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      'handicrafts & artisans': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      'clothing & apparel': 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      'home & living': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      'dairy & poultry': 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      'spices & condiments': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      'food & beverages': 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z',
      'tools & equipment': 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'textiles & fabrics': 'M4 6h16M4 10h16M4 14h16M4 18h16',
      'jewelry & accessories': 'M7 11l5-5m0 0l5 5m-5-5v12m0-15a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h6z',
      'handloom & weaving': 'M4 6h16M4 10h16M4 14h16M4 18h16',
      'ayurvedic products': 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      'traditional arts': 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      'organic & natural': 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      default: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    };
    
    const key = categoryName.toLowerCase();
    return icons[key] || icons.default;
  };

  // Map category names to icon colors - Indian Rural theme
  const getCategoryIconColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      electronics: 'text-blue-700',
      fashion: 'text-purple-700',
      home: 'text-green-700',
      beauty: 'text-rose-700',
      sports: 'text-orange-700',
      books: 'text-indigo-700',
      farm: 'text-amber-700',
      food: 'text-green-700',
      crafts: 'text-orange-700',
      'fresh produce': 'text-green-700',
      'handicrafts & artisans': 'text-amber-700',
      'clothing & apparel': 'text-purple-700',
      'home & living': 'text-amber-700',
      'dairy & poultry': 'text-blue-700',
      'spices & condiments': 'text-red-700',
      'food & beverages': 'text-green-700',
      'tools & equipment': 'text-gray-700',
      'textiles & fabrics': 'text-indigo-700',
      'jewelry & accessories': 'text-yellow-700',
      'handloom & weaving': 'text-rose-700',
      'ayurvedic products': 'text-green-700',
      'traditional arts': 'text-orange-700',
      'organic & natural': 'text-green-700',
      default: 'text-amber-700' // Indian wheat color
    };
    
    const key = categoryName.toLowerCase();
    return colors[key] || colors.default;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-100 hover:border-amber-200">
      {/* Square container for 1:1 aspect ratio */}
      <div className="relative aspect-square bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-center p-0">
        {category.image ? (
          // Display category image with full coverage in square container
          <div className="relative w-full h-full rounded-t-2xl overflow-hidden">
            <Image 
              src={category.image} 
              alt={category.name} 
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          // Fallback to icon if no image is available
          <div className="bg-white bg-opacity-80 rounded-full p-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-20 w-20 ${getCategoryIconColor(category.name)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getCategoryIcon(category.name)} />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-800">
            {category.productCount} items
          </span>
        </div>
        
        <div className="mt-6">
          <Link
            href={`/categories/${category.id}`}
            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-amber-800 bg-amber-50 hover:bg-amber-100 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            Browse Category
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;