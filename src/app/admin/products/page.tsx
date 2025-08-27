'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  vendor: {
    name: string;
  } | null;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  averageRating: number;
  totalSold: number;
  status: string; // Add status field
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    fetchProducts();
  }, [user, router]);

  useEffect(() => {
    // Filter products based on search query
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      setCurrentPage(1);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.vendor?.name && product.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products');
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setFilteredProducts(data.data);
      } else {
        setError(data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      if (response.ok) {
        // Refresh the product list
        fetchProducts();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-2">Manage all products in your SuperMall</p>
            </div>
            <Button onClick={() => router.push('/admin/products/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              {filteredProducts.length} products found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-left py-3 px-4 font-medium">Stock</th>
                    <th className="text-left py-3 px-4 font-medium">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {product.featured && (
                                <Badge className="bg-blue-500 text-white text-xs">Featured</Badge>
                              )}
                              {product.trending && (
                                <Badge className="bg-orange-500 text-white text-xs">Trending</Badge>
                              )}
                              {product.newArrival && (
                                <Badge className="bg-green-500 text-white text-xs">New</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="secondary">{product.category}</Badge>
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {formatPrice(product.price)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={product.stock <= 5 ? 'text-red-600 font-medium' : ''}>
                            {product.stock} {product.stock <= 5 && '(Low)'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {product.vendor?.name || 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={product.status === 'active' ? 'default' : 'destructive'}>
                            {product.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/admin/products/${product._id}/edit`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => router.push(`/products/${product._id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteProduct(product._id)}
                              disabled={product.status === 'inactive'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

}
