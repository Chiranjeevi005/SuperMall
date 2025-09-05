'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'category' | 'shop';
  url: string;
  category?: string;
}

const EnhancedSearch = ({ 
  placeholder = "Search...",
  size = "normal" // "normal" or "large"
}: { 
  placeholder?: string;
  size?: "normal" | "large";
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) return;
      
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=4`);
        const data = await response.json();
        
        if (response.ok) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to search results page
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (url: string) => {
    router.push(url);
    setShowSuggestions(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case 'category':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        );
      case 'shop':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012-2h2a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012-2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'text-green-600';
      case 'category': return 'text-amber-600';
      case 'shop': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const inputClasses = size === "large" 
    ? "w-full py-4 px-6 rounded-2xl border-2 border-amber-200 bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg pl-12"
    : "py-1.5 px-3 bg-white text-gray-900 focus:outline-none text-xs w-full pl-8";

  const buttonClasses = size === "large"
    ? "h-10 w-10 text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors duration-300 flex items-center justify-center"
    : "h-6 w-6 text-amber-700 bg-amber-100 hover:bg-amber-200 transition-colors duration-300 rounded-r-full flex items-center justify-center";

  return (
    <div ref={searchRef} className="relative flex items-center w-full">
      <form onSubmit={handleSearch} className="relative flex items-center w-full">
        {/* Search icon inside the input field */}
        <div className="absolute left-2 z-10 text-amber-600">
          <svg xmlns="http://www.w3.org/2000/svg" className={` ${size === "large" ? "h-6 w-6" : "h-4 w-4"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <input
          type="text"
          placeholder={placeholder}
          className={inputClasses}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowSuggestions(true)}
        />
        
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-2 z-10 h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 mt-12 w-full bg-white rounded-lg shadow-lg border border-amber-200 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mx-auto"></div>
              <span className="text-sm mt-1">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="px-4 py-3 hover:bg-amber-50 cursor-pointer flex items-center border-b border-amber-50 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion.url)}
              >
                <span className={`mr-3 ${getTypeColor(suggestion.type)}`}>
                  {getTypeIcon(suggestion.type)}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{suggestion.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{suggestion.type}{suggestion.category && ` • ${suggestion.category}`}</div>
                </div>
              </div>
            ))
          ) : searchQuery.trim() ? (
            <div className="px-4 py-3 text-center text-gray-500">
              No suggestions found. Press Enter to search all products.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearch;