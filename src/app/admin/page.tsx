'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Package, 
  FolderOpen, 
  ShoppingCart, 
  TrendingUp, 
  Star,
  Plus,
  Eye,
  Edit,
  BarChart3,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalVendors: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  lowStockProducts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    fetchDashboardStats();
  }, [user, router]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message || 'Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your SuperMall platform</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Including {stats.totalVendors} vendors
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.lowStockProducts} low stock items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">
                Active categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Platform rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Management
              </CardTitle>
              <CardDescription>
                Manage products, inventory, and product details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/admin/products/new')} 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/products')} 
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Products
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/products/bulk-edit')} 
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Bulk Edit Products
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Category Management
              </CardTitle>
              <CardDescription>
                Organize products with categories and subcategories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/admin/categories/new')} 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/categories')} 
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Categories
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/categories/manage')} 
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User & Vendor Management
              </CardTitle>
              <CardDescription>
                Manage users, vendors, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/admin/vendors')} 
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Vendors
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/users')} 
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                View Users
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/vendor-approvals')} 
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Vendor Approvals
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Latest products added to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Wireless Headphones Pro</p>
                    <p className="text-sm text-gray-600">Electronics • ₹2,999</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Organic Red Apples Premium</p>
                    <p className="text-sm text-gray-600">Fresh Produce • ₹180</p>
                  </div>
                  <Badge className="bg-green-500">Featured</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Cotton T-Shirt Premium</p>
                    <p className="text-sm text-gray-600">Clothing • ₹599</p>
                  </div>
                  <Badge className="bg-orange-500">Trending</Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/products')} 
                className="w-full mt-4"
              >
                View All Products
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Statistics</CardTitle>
              <CardDescription>Key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Products per Category</p>
                      <p className="text-sm text-gray-600">3 products average</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">3.0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Active Products</p>
                      <p className="text-sm text-gray-600">In stock and available</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">{stats.totalProducts}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Verified Vendors</p>
                      <p className="text-sm text-gray-600">Approved vendors</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-purple-600">{stats.totalVendors}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/analytics')} 
                className="w-full mt-4"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}