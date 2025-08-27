'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package,
  Calendar,
  Eye,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Truck,
  CheckCircle,
  Clock,
  X,
  RotateCcw,
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  BarChart3,
  CalendarClock,
  CheckCheck,
  Timer
} from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  pricing: {
    total: number;
    subtotal: number;
    shippingCost: number;
    tax: number;
  };
  items: {
    _id: string;
    product: {
      _id: string;
      name: string;
      images: { url: string; alt: string }[];
    };
    quantity: number;
    price: number;
  }[];
  createdAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  deliveredOrders: number;
  recentOrders: Order[];
  monthlySpending: { month: string; amount: number }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    fetchOrders();
    fetchOrderStats();
  }, [isAuthenticated]);

  const fetchOrders = async (page = 1, status = '', search = '') => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (status) params.append('status', status);
      if (search) params.append('search', search);

      const response = await fetch(`/api/orders?${params.toString()}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders || []);
        setPagination(data.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0,
          hasNextPage: false,
          hasPrevPage: false,
        });
      } else {
        setError(data.message || 'Failed to load orders');
        setOrders([]);
      }
    } catch (error) {
      setError('Failed to load orders. Please try again.');
      setOrders([]);
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const response = await fetch('/api/orders?limit=100', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        const orders = data.data.orders || [];
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum: number, order: Order) => sum + (order.pricing?.total ?? 0), 0);
        const pendingOrders = orders.filter((order: Order) => 
          ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(order.status)
        ).length;
        const deliveredOrders = orders.filter((order: Order) => order.status === 'delivered').length;
        const recentOrders = orders.slice(0, 5);

        // Calculate monthly spending
        const monthlySpending: { month: string; amount: number }[] = [];
        const monthlyTotals: { [key: string]: number } = {};
        
        orders.forEach((order: Order) => {
          if (order.createdAt) {
            const date = new Date(order.createdAt);
            const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            
            if (!monthlyTotals[monthKey]) {
              monthlyTotals[monthKey] = 0;
            }
            monthlyTotals[monthKey] += order.pricing?.total ?? 0;
          }
        });
      
      Object.keys(monthlyTotals).forEach(key => {
        const date = new Date(key + '-01');
        const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlySpending.push({
          month: monthName,
          amount: monthlyTotals[key]
        });
      });
      
      // Sort by date descending
      monthlySpending.sort((a, b) => {
        // Extract year and month from the month string (e.g., "Aug 2023")
        const [monthA, yearA] = a.month.split(' ');
        const [monthB, yearB] = b.month.split(' ');
        
        const dateA = new Date(`${monthA} 1, ${yearA}`);
        const dateB = new Date(`${monthB} 1, ${yearB}`);
        
        return dateB.getTime() - dateA.getTime();
      });

      setOrderStats({
        totalOrders,
        totalSpent,
        pendingOrders,
        deliveredOrders,
        recentOrders,
        monthlySpending: monthlySpending.slice(0, 6) // Last 6 months
      });
    }
  } catch (error) {
    console.error('Error fetching order stats:', error);
  }
};

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    fetchOrders(1, status, searchQuery);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(1, statusFilter, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage, statusFilter, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStatusConfig = (status: string) => {
    const configs: {[key: string]: any} = {
      pending: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        icon: Clock,
        label: 'Pending'
      },
      confirmed: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: CheckCircle,
        label: 'Confirmed'
      },
      processing: { 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        icon: Package,
        label: 'Processing'
      },
      shipped: { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: Truck,
        label: 'Shipped'
      },
      out_for_delivery: { 
        color: 'bg-indigo-100 text-indigo-800 border-indigo-200', 
        icon: Truck,
        label: 'Out for Delivery'
      },
      delivered: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: CheckCircle,
        label: 'Delivered'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: X,
        label: 'Cancelled'
      },
      returned: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: RotateCcw,
        label: 'Returned'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
          
          {/* Stats Cards */}
          {orderStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{orderStats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold">{formatPrice(orderStats.totalSpent)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold">{orderStats.pendingOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold">{orderStats.deliveredOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Monthly Spending Chart */}
          {orderStats && orderStats.monthlySpending.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Monthly Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end h-32 gap-2 mt-4">
                  {orderStats.monthlySpending.slice(0, 6).map((item, index) => {
                    // Find the maximum amount for scaling
                    const maxAmount = Math.max(...orderStats.monthlySpending.map(i => i.amount), 1);
                    const heightPercentage = Math.max(10, (item.amount / maxAmount) * 100);
                    
                    return (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                          style={{ height: `${heightPercentage}%` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2 text-center">
                          {item.month.split(' ')[0]}
                        </span>
                        <span className="text-xs font-medium text-gray-900">
                          {formatPrice(item.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      fetchOrders(1, statusFilter, '');
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('')}
              >
                All Orders
              </Button>
              {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => {
                const config = getStatusConfig(status);
                return (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleStatusFilter(status)}
                    className="flex items-center gap-1"
                  >
                    <config.icon className="w-4 h-4" />
                    {config.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Orders Count */}
          <p className="text-gray-600">
            {pagination.totalOrders} {pagination.totalOrders === 1 ? 'order' : 'orders'} found
            {statusFilter && ` with status "${getStatusConfig(statusFilter).label}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {statusFilter ? `No ${getStatusConfig(statusFilter).label.toLowerCase()} orders` : 'No orders yet'}
            </h2>
            <p className="text-gray-600 mb-8">
              {statusFilter 
                ? 'Try changing the filter to see other orders' 
                : 'Start shopping to see your orders here'
              }
            </p>
            {!statusFilter && (
              <Link href="/products">
                <Button size="lg">
                  Start Shopping
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.orderNumber}
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Placed on {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge className={`${statusConfig.color} border flex items-center gap-1`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </Badge>
                        <div className="text-lg font-semibold text-gray-900">
                          {formatPrice(order.pricing.total)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Order Items */}
                    <div className="space-y-3 mb-6">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item._id} className="flex items-center space-x-4">
                          <img
                            src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-600 pl-16">
                          +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>

                    {/* Delivery Info */}
                    {(order.estimatedDelivery || order.actualDelivery) && (
                      <div className="mb-6 p-3 bg-blue-50 rounded-md">
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4 text-blue-600" />
                          {order.actualDelivery ? (
                            <span className="text-blue-800">
                              Delivered on {formatDate(order.actualDelivery)}
                            </span>
                          ) : order.estimatedDelivery ? (
                            <span className="text-blue-800">
                              Estimated delivery: {formatDate(order.estimatedDelivery)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/orders/${order.orderNumber}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </Link>
                      
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Download Invoice
                        </Button>
                      )}
                      
                      {['pending', 'confirmed'].includes(order.status) && (
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Cancel Order
                        </Button>
                      )}

                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          Return/Exchange
                        </Button>
                      )}
                      
                      <Link href={`/products/${order.items[0].product._id}`}>
                        <Button variant="outline" size="sm">
                          Buy Again
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                // Calculate the starting page number based on current page
                let startPage = Math.max(1, pagination.currentPage - 2);
                if (startPage + 4 > pagination.totalPages) {
                  startPage = Math.max(1, pagination.totalPages - 4);
                }
                
                const page = startPage + i;
                
                // Only render if page is within valid range
                if (page <= pagination.totalPages) {
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  );
                }
                return null;
              })}
              
              {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    variant={pagination.currentPage === pagination.totalPages ? "default" : "outline"}
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={loading}
                    className="w-10 h-10 p-0"
                  >
                    {pagination.totalPages}
                  </Button>
                </>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
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