'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Star,
  Plus,
  Eye,
  Edit,
  BarChart3
} from 'lucide-react';

interface VendorStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export default function VendorDashboardPage() {
  const [stats, setStats] = useState<VendorStats>({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    averageRating: 0,
    lowStockProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
      router.push('/');
      return;
    }
    
    fetchVendorStats();
  }, [user, router]);

  const fetchVendorStats = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call an API endpoint
      // For now, we'll use mock data
      setTimeout(() => {
        setStats({
          totalProducts: 12,
          totalSales: 89,
          totalRevenue: 125000,
          averageRating: 4.6,
          lowStockProducts: 3,
          pendingOrders: 5
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
      setError('Failed to load dashboard statistics');
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (!user || (user.role !== 'vendor' && user.role !== 'admin')) {
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
          <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your products and track performance</p>
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
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Active listings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">
                Items sold
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Total earnings
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
                Customer satisfaction
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
                Manage your product listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/vendor/products/new')} 
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/products')} 
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Products
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/products/low-stock')} 
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Low Stock Items ({stats.lowStockProducts})
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Management
              </CardTitle>
              <CardDescription>
                Handle customer orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/vendor/orders')} 
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Orders
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/orders/pending')} 
                className="w-full"
              >
                <Edit className="h-4 w-4 mr-2" />
                Pending Orders ({stats.pendingOrders})
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/shipping')} 
                className="w-full"
              >
                Shipping Management
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>
                Track your business performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/vendor/analytics')} 
                className="w-full"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Sales Analytics
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/reviews')} 
                className="w-full"
              >
                <Star className="h-4 w-4 mr-2" />
                Customer Reviews
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/reports')} 
                className="w-full"
              >
                Generate Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Your latest product listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Wireless Headphones Pro</p>
                    <p className="text-sm text-gray-600">Electronics • ₹2,999</p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
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
                  <Badge className="bg-orange-500">Low Stock</Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/products')} 
                className="w-full mt-4"
              >
                View All Products
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Insights</CardTitle>
              <CardDescription>Key metrics for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Monthly Growth</p>
                      <p className="text-sm text-gray-600">Compared to last month</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">+12.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Conversion Rate</p>
                      <p className="text-sm text-gray-600">Visitors to buyers</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">3.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Customer Retention</p>
                      <p className="text-sm text-gray-600">Repeat customers</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-purple-600">78%</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => router.push('/vendor/analytics')} 
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