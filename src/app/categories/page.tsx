'use client';

import React, { useState, useEffect } from 'react';
import CategoryCard from '@/components/CategoryCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import logger from '@/utils/clientLogger';

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  productCount: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (response.ok) {
          // Check if data.categories exists and is an array
          if (!data.categories || !Array.isArray(data.categories)) {
            throw new Error('Invalid response format: categories is not an array');
          }
          
          // Map _id to id to match CategoryCard expectations
          const categoriesWithIds = data.categories.map((category: Category) => ({
            ...category,
            id: category._id, // Map _id to id
          }));
          
          setCategories(categoriesWithIds);
        } else {
          setError(data.error || 'Failed to fetch categories');
        }
      } catch (err: unknown) {
        logger.error('Error fetching categories', { error: err instanceof Error ? err.message : 'Unknown error' });
        setError(err instanceof Error ? err.message : 'An error occurred while fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Categories</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
            <p className="text-gray-600">
              Browse through our {categories.length} product categories
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {categories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-500">There are currently no categories available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category._id} 
                category={{
                  id: category._id,
                  name: category.name,
                  productCount: category.productCount,
                  icon: category.icon,
                  image: category.image
                }} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}