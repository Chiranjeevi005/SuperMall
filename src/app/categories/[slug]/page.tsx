'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter,
  SortAsc,
  SortDesc,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Heart,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Category;
  level: number;
  seoTitle?: string;
  seoDescription?: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  subcategory?: Category;
  vendor: {
    _id: string;
    name: string;
  };
  rating: number;
  reviewCount: number;
  stock: number;
  isActive: boolean;
}

type SortOption = 'name' | 'price' | 'rating' | 'newest';
type ViewMode = 'grid' | 'list';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    try {
      setIsLoading(true);
      
      // Fetch category details
      const categoryResponse = await fetch(`/api/categories?slug=${slug}`);
      if (!categoryResponse.ok) {
        throw new Error('Category not found');
      }
      
      const categoryData = await categoryResponse.json();
      if (!categoryData.categories || categoryData.categories.length === 0) {
        throw new Error('Category not found');
      }
      
      const currentCategory = categoryData.categories[0];
      setCategory(currentCategory);

      // Fetch products in this category
      const productsResponse = await fetch(`/api/products?category=${currentCategory._id}&limit=50`);
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const productsData = await productsResponse.json();
      setProducts(productsData.products || []);

    } catch (error) {
      console.error('Error fetching category and products:', error);
      setError(error instanceof Error ? error.message : 'Failed to load category');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryHierarchy = (category: Category): Category[] => {
    const hierarchy: Category[] = [];
    let current = category;
    
    hierarchy.unshift(current);
    while (current.parentCategory) {
      hierarchy.unshift(current.parentCategory);
      current = current.parentCategory;
    }
    
    return hierarchy;
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
      const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'newest':
          comparison = new Date(a._id).getTime() - new Date(b._id).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading category...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-red-900 mb-2">Category Not Found</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Link href="/categories">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/categories" className="hover:text-gray-700">Categories</Link>
        {getCategoryHierarchy(category).map((cat, index) => (
          <React.Fragment key={cat._id}>
            <ChevronRight className="h-4 w-4" />
            <Link 
              href={`/categories/${cat.slug}`}
              className={index === getCategoryHierarchy(category).length - 1 ? 'text-gray-900 font-medium' : 'hover:text-gray-700'}
            >
              {cat.name}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mb-4">{category.description}</p>
        )}
        <Badge variant="outline">
          {filteredAndSortedProducts.length} products
        </Badge>
      </div>

      {/* Filters and Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Min Price (₹)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Max Price (₹)
              </label>
              <Input
                type="number"
                placeholder="Any"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sort By
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-') as [SortOption, 'asc' | 'desc'];
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low-High)</option>
                <option value="price-desc">Price (High-Low)</option>
                <option value="rating-desc">Rating (High-Low)</option>
                <option value="newest-desc">Newest First</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                View
              </label>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      {filteredAndSortedProducts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find products.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredAndSortedProducts.map((product) => (
            <Card key={product._id} className="hover:shadow-lg transition-shadow">
              <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-4 flex space-x-4'}>
                {/* Product Image */}
                <div className={viewMode === 'grid' ? 'mb-4' : 'flex-shrink-0'}>
                  <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'w-24 h-24'} bg-gray-100 rounded-lg overflow-hidden`}>
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes={viewMode === 'grid' ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw' : '96px'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Grid3X3 className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {viewMode === 'list' && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mb-2">
                    by {product.vendor?.name || 'Unknown Seller'}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="text-green-600">
                        In Stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link href={`/products/${product.slug}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    
                    <Button variant="outline" size="sm" disabled={product.stock === 0}>
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}