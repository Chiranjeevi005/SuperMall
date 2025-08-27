'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Plus, 
  Folder, 
  FolderOpen, 
  Tag, 
  Eye, 
  EyeOff,
  ChevronRight,
  Grid3X3
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: Category;
  level: number;
  isActive: boolean;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<number | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories?includeTree=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === null || category.level === filterLevel;
    const matchesActive = showInactive || category.isActive;

    return matchesSearch && matchesLevel && matchesActive;
  });

  const getCategoryHierarchy = (category: Category): string[] => {
    const hierarchy: string[] = [];
    let current = category;
    
    while (current.parentCategory) {
      hierarchy.unshift(current.parentCategory.name);
      current = current.parentCategory;
    }
    
    return hierarchy;
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 0: return <Folder className="h-5 w-5 text-blue-500" />;
      case 1: return <FolderOpen className="h-5 w-5 text-green-500" />;
      case 2: return <Tag className="h-5 w-5 text-purple-500" />;
      default: return <Grid3X3 className="h-5 w-5 text-gray-500" />;
    }
  };

  const getLevelName = (level: number) => {
    switch (level) {
      case 0: return 'Main Category';
      case 1: return 'Subcategory';
      case 2: return 'Sub-subcategory';
      default: return `Level ${level}`;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Browse products by category</p>
        </div>
        
        {isAdmin && (
          <Link href="/admin/categories/new">
            <Button className="mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search Categories
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Category Level
              </label>
              <select
                value={filterLevel || ''}
                onChange={(e) => setFilterLevel(e.target.value ? parseInt(e.target.value) : null)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">All Levels</option>
                <option value="0">Main Categories</option>
                <option value="1">Subcategories</option>
                <option value="2">Sub-subcategories</option>
              </select>
            </div>

            {isAdmin && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Button
                  variant={showInactive ? "default" : "outline"}
                  onClick={() => setShowInactive(!showInactive)}
                  className="w-full justify-start"
                >
                  {showInactive ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  {showInactive ? 'Show All' : 'Active Only'}
                </Button>
              </div>
            )}

            <div className="flex items-end">
              <Button variant="outline" onClick={fetchCategories} className="w-full">
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterLevel !== null 
                  ? "Try adjusting your filters to see more categories."
                  : "No categories are available at the moment."
                }
              </p>
              {isAdmin && !searchTerm && filterLevel === null && (
                <Link href="/admin/categories/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Category
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category._id} className={`hover:shadow-lg transition-shadow ${!category.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getLevelIcon(category.level)}
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {getLevelName(category.level)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!category.isActive && (
                      <Badge variant="destructive" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {category.productCount} products
                    </Badge>
                  </div>
                </div>

                {/* Hierarchy breadcrumb */}
                {category.level > 0 && (
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    {getCategoryHierarchy(category).map((parentName, index) => (
                      <React.Fragment key={index}>
                        <span>{parentName}</span>
                        <ChevronRight className="h-3 w-3 mx-1" />
                      </React.Fragment>
                    ))}
                    <span className="font-medium text-gray-700">{category.name}</span>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {category.description && (
                  <CardDescription className="mb-4">
                    {category.description}
                  </CardDescription>
                )}

                <div className="flex justify-between items-center">
                  <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                    <Button variant="outline" size="sm">
                      View Products
                    </Button>
                  </Link>

                  {isAdmin && (
                    <Link href={`/admin/categories/${category._id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}