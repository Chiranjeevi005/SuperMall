'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X,
  AlertCircle
} from 'lucide-react';

interface Category {
  _id: string;
  name: string;
}

export default function NewVendorProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    category: '',
    subcategory: '',
    brand: '',
    stock: '',
    sku: '',
    weight: '',
    seoTitle: '',
    seoDescription: '',
    featured: false,
    trending: false,
    newArrival: false
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<{url: string, alt: string}[]>([{url: '', alt: ''}]);
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>([{key: '', value: ''}]);
  const [variants, setVariants] = useState<{name: string, options: string[]}[]>([{name: '', options: ['']}]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      router.push('/');
      return;
    }
    
    fetchCategories();
  }, [user, router]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
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

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Product name is required');
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.push('Valid price is required');
    }

    if (!formData.category) {
      newErrors.push('Category is required');
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.push('Valid stock quantity is required');
    }

    // Validate images
    images.forEach((image, index) => {
      if (!image.url.trim()) {
        newErrors.push(`Image ${index + 1} URL is required`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors([]);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        stock: parseInt(formData.stock),
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        images: images.filter(img => img.url.trim()),
        specifications: specifications.filter(spec => spec.key.trim() && spec.value.trim()),
        variants: variants.filter(variant => variant.name.trim() && variant.options.some(opt => opt.trim())),
        tags: tags.filter(tag => tag.trim()),
        vendor: user?.id // Current vendor
      };

      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/vendor/products');
      } else {
        setErrors([data.message || 'Failed to create product']);
      }

    } catch (error) {
      console.error('Error creating product:', error);
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

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [field]: value };
    setImages(newImages);
  };

  const addImage = () => {
    setImages([...images, {url: '', alt: ''}]);
  };

  const removeImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, {key: '', value: ''}]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const handleVariantChange = (index: number, field: 'name', value: string) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleVariantOptionChange = (variantIndex: number, optionIndex: number, value: string) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options[optionIndex] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, {name: '', options: ['']}]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const addVariantOption = (variantIndex: number) => {
    const newVariants = [...variants];
    newVariants[variantIndex].options.push('');
    setVariants(newVariants);
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    const newVariants = [...variants];
    if (newVariants[variantIndex].options.length > 1) {
      newVariants[variantIndex].options.splice(optionIndex, 1);
      setVariants(newVariants);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600 mt-1">Create a new product for your store</p>
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <h3 className="text-red-800 font-medium">Please correct the following errors:</h3>
            </div>
            <ul className="mt-2 list-disc list-inside text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential product details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief product description"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Detailed product description"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing and Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>
                  Product pricing and stock information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comparePrice">Compare Price (₹)</Label>
                    <Input
                      id="comparePrice"
                      name="comparePrice"
                      type="number"
                      step="0.01"
                      value={formData.comparePrice}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Product SKU"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (grams)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="Product weight"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  Product categorization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      placeholder="Enter subcategory"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Add product images with alt text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {images.map((image, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`imageUrl-${index}`}>Image URL *</Label>
                        <Input
                          id={`imageUrl-${index}`}
                          value={image.url}
                          onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`imageAlt-${index}`}>Alt Text</Label>
                        <Input
                          id={`imageAlt-${index}`}
                          value={image.alt}
                          onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                          placeholder="Image description"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(index)}
                        disabled={images.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImage}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Image
                </Button>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>
                  Product specifications and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          value={spec.key}
                          onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                          placeholder="Specification name (e.g., Material)"
                        />
                      </div>
                      <div>
                        <Input
                          value={spec.value}
                          onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                          placeholder="Specification value (e.g., Cotton)"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSpecification(index)}
                        disabled={specifications.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecification}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
                <CardDescription>
                  Product variants (size, color, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {variants.map((variant, variantIndex) => (
                  <div key={variantIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                      <div className="flex-1">
                        <Input
                          value={variant.name}
                          onChange={(e) => handleVariantChange(variantIndex, 'name', e.target.value)}
                          placeholder="Variant name (e.g., Size, Color)"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(variantIndex)}
                          disabled={variants.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Options</Label>
                      {variant.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              value={option}
                              onChange={(e) => handleVariantOptionChange(variantIndex, optionIndex, e.target.value)}
                              placeholder="Option value"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVariantOption(variantIndex, optionIndex)}
                            disabled={variant.options.length <= 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addVariantOption(variantIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addVariant}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Product tags for search and filtering
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Enter a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-primary/10 rounded-full px-3 py-1">
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-primary hover:text-primary/80"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
                <CardDescription>
                  Search engine optimization details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="SEO title for search engines"
                    maxLength={60}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seoTitle.length}/60 characters
                  </p>
                </div>
                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    name="seoDescription"
                    value={formData.seoDescription}
                    onChange={handleChange}
                    placeholder="SEO description for search engines"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.seoDescription.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
                <CardDescription>
                  Product visibility and status settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Featured Product</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="trending"
                      checked={formData.trending}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>Trending Product</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="newArrival"
                      checked={formData.newArrival}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="px-8">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}