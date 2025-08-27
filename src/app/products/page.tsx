'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Eye, 
  Heart,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: { url: string; alt: string }[];
  stock: number;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  slug: string;
  vendor?: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

interface Filters {
  categories: string[];
  brands: string[];
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: Filters;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({ categories: [], brands: [] });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get parameters from URL
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    const urlBrand = searchParams.get('brand');
    const urlPage = searchParams.get('page');
    
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
    if (urlBrand) {
      setSelectedBrand(urlBrand);
    }
    
    // Set the page from URL parameter or default to 1
    const page = urlPage ? parseInt(urlPage, 10) : 1;
    setPagination(prev => ({ ...prev, currentPage: page }));
    
    fetchProducts(page);
  }, [searchParams]);

  const buildQueryString = (page: number) => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (minRating) params.append('rating', minRating);
    if (featuredOnly) params.append('featured', 'true');
    if (inStockOnly) params.append('inStock', 'true');
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);
    params.append('page', page.toString());
    params.append('limit', '12');

    return params.toString();
  };

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const queryString = buildQueryString(page);
      const url = `/api/products?${queryString}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
        setFilters(data.data.filters);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (error) {
      setError('Failed to load products. Please try again.');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProducts(1);
  };

  const handleFilterChange = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchProducts(1);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }

    const result = await addToCart(product._id, 1);
    if (result.success) {
      // Show success message (you can add toast notification here)
      console.log('Added to cart successfully');
    } else {
      console.error('Failed to add to cart:', result.message);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setFeaturedOnly(false);
    setInStockOnly(false);
    setSortBy('createdAt');
    setSortOrder('desc');
    fetchProducts(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button onClick={handleSearch} className="md:w-auto">
              Search
            </Button>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              
              {(selectedCategory || selectedBrand || minPrice || maxPrice || minRating || featuredOnly || inStockOnly) && (
                <Button variant="ghost" onClick={clearFilters} className="text-sm">
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                  handleFilterChange();
                }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="averageRating-desc">Highest Rated</option>
                <option value="totalSold-desc">Best Selling</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Categories</option>
                    {filters.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Brands</option>
                    {filters.brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onBlur={handleFilterChange}
                      className="text-sm"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onBlur={handleFilterChange}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => {
                          setInStockOnly(e.target.checked);
                          handleFilterChange();
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={featuredOnly}
                        onChange={(e) => {
                          setFeaturedOnly(e.target.checked);
                          handleFilterChange();
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">Featured Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {pagination.totalProducts} products
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <Card 
                key={product._id} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  viewMode === 'list' ? 'flex flex-row' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link href={`/products/${product._id}`}>
                      <img
                        src={product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={product.images[0]?.alt || product.name}
                        className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                          viewMode === 'list' ? 'h-48' : 'h-48 sm:h-56'
                        }`}
                      />
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.newArrival && (
                        <Badge className="bg-green-500 text-white text-xs">New</Badge>
                      )}
                      {product.featured && (
                        <Badge className="bg-blue-500 text-white text-xs">Featured</Badge>
                      )}
                      {product.trending && (
                        <Badge className="bg-orange-500 text-white text-xs">Trending</Badge>
                      )}
                      {product.stock === 0 && (
                        <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Link href={`/products/${product._id}`}>
                        <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                  <div>
                    <Link href={`/products/${product._id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {product.shortDescription && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {renderStars(product.averageRating)}
                      </div>
                      <span className="ml-1 text-sm text-gray-600">
                        ({product.totalReviews})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {product.totalSold} sold
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-3">
                      by {product.vendor?.name || 'Unknown Seller'}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {(() => {
                const pageButtons = [];
                const maxVisiblePages = 5;
                let startPage = 1;
                let endPage = Math.min(maxVisiblePages, pagination.totalPages);
                
                // Adjust the range of visible pages based on current page
                if (pagination.currentPage > Math.floor(maxVisiblePages / 2)) {
                  startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
                  endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
                  
                  // Adjust startPage if we're near the end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }
                }
                
                // Add first page button if not in the visible range
                if (startPage > 1) {
                  pageButtons.push(
                    <Button
                      key={1}
                      variant={1 === pagination.currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(1)}
                      className="w-10 h-10 p-0"
                    >
                      1
                    </Button>
                  );
                  
                  // Add ellipsis if there's a gap
                  if (startPage > 2) {
                    pageButtons.push(<span key="start-ellipsis" className="px-2">...</span>);
                  }
                }
                
                // Add page buttons for the visible range
                for (let page = startPage; page <= endPage; page++) {
                  pageButtons.push(
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  );
                }
                
                // Add last page button if not in the visible range
                if (endPage < pagination.totalPages) {
                  // Add ellipsis if there's a gap
                  if (endPage < pagination.totalPages - 1) {
                    pageButtons.push(<span key="end-ellipsis" className="px-2">...</span>);
                  }
                  
                  pageButtons.push(
                    <Button
                      key={pagination.totalPages}
                      variant={pagination.totalPages === pagination.currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className="w-10 h-10 p-0"
                    >
                      {pagination.totalPages}
                    </Button>
                  );
                }
                
                return pageButtons;
              })()}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}