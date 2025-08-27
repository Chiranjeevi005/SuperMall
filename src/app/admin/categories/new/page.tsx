'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: {
    _id: string;
    name: string;
  };
  level: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export default function NewCategoryPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    isActive: true,
    seoTitle: '',
    seoDescription: '',
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    fetchCategories();
  }, [user, router]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories?level=0,1'); // Only fetch main categories and subcategories
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Category name is required');
    } else if (formData.name.trim().length < 2) {
      newErrors.push('Category name must be at least 2 characters long');
    } else if (formData.name.trim().length > 100) {
      newErrors.push('Category name must be less than 100 characters');
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.push('Description must be less than 500 characters');
    }

    if (formData.seoTitle && formData.seoTitle.length > 60) {
      newErrors.push('SEO title must be less than 60 characters');
    }

    if (formData.seoDescription && formData.seoDescription.length > 160) {
      newErrors.push('SEO description must be less than 160 characters');
    }

    // Check level constraints
    if (formData.parentCategory) {
      const parent = categories.find(cat => cat._id === formData.parentCategory);
      if (parent && parent.level >= 2) {
        newErrors.push('Cannot create subcategory under a level 2 category');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      const slug = generateSlug(formData.name);
      const submitData = {
        ...formData,
        slug,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        seoTitle: formData.seoTitle.trim() || undefined,
        seoDescription: formData.seoDescription.trim() || undefined,
        parentCategory: formData.parentCategory || undefined,
      };

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        setErrors([data.error || 'Failed to create category']);
      }

    } catch (error) {
      console.error('Error creating category:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const getAvailableParentCategories = () => {
    return categories.filter(cat => cat.level < 2); // Only allow up to level 2
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Category</h1>
          <p className="text-gray-600 mt-1">Add a new category to organize your products</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new category
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Please fix the following errors:
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul className="list-disc pl-5 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  A descriptive name for the category
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows={3}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional description to help customers understand the category
                </p>
              </div>

              <div>
                <Label htmlFor="parentCategory">Parent Category</Label>
                <select
                  id="parentCategory"
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
                >
                  <option value="">None (Main Category)</option>
                  {getAvailableParentCategories().map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.level > 0 ? '  └─ ' : ''}{category.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Select a parent category to create a subcategory
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active</Label>
                <p className="text-sm text-gray-500">
                  Inactive categories won't be shown to customers
                </p>
              </div>
            </div>

            {/* SEO Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    type="text"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="Enter SEO title"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Title for search engines (recommended: 50-60 characters)
                  </p>
                </div>

                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    placeholder="Enter SEO description"
                    rows={2}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Description for search engines (recommended: 150-160 characters)
                  </p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>URL:</strong> /categories/{generateSlug(formData.name) || 'category-name'}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Level:</strong> {formData.parentCategory ? 
                    (categories.find(cat => cat._id === formData.parentCategory)?.level ?? 0) + 1 : 
                    0
                  }
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {formData.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Category
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}