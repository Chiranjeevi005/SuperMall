'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  X,
  RotateCcw,
  ArrowLeft,
  Download,
  AlertCircle,
  User
} from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    _id: string;
    product: {
      _id: string;
      name: string;
      images: { url: string; alt: string }[];
    };
    productDetails: {
      name: string;
      image: string;
      sku: string;
    };
    quantity: number;
    price: number;
    selectedVariants: {
      variantName: string;
      selectedOption: string;
    }[];
    vendor: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
    amount: number;
    paidAt?: string;
  };
  pricing: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    discount: number;
    total: number;
  };
  trackingHistory: {
    _id: string;
    status: string;
    message?: string;
    location?: string;
    timestamp: string;
    updatedBy?: {
      _id: string;
      name: string;
    };
  }[];
  notes: {
    customer?: string;
    admin?: string;
  };
  estimatedDelivery?: string;
  actualDelivery?: string;
  shippingTrackingNumber?: string;
  shippingCarrier?: string;
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (params.id) {
      fetchOrder();
    }
  }, [isAuthenticated, params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/orders/${params.id}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data || null);
      } else {
        setError(data.message || 'Order not found');
        setOrder(null);
      }
    } catch (error: any) {
      setError('Failed to load order details. Please try again.');
      setOrder(null);
      console.error('Error fetching order:', error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) {
      alert('Order not found');
      return;
    }

    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      setCancelling(true);

      const response = await fetch(`/api/orders/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ reason: cancelReason })
      });

      const data = await response.json();

      if (data.success) {
        alert('Order cancelled successfully');
        // Update the order status in the UI
        if (order) {
          setOrder({
            ...order,
            status: 'cancelled'
          });
        }
        // Refresh order data
        fetchOrder();
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      alert('Failed to cancel order. Please try again.');
      console.error('Error cancelling order:', error as Error);
    } finally {
      setCancelling(false);
      setCancelReason('');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: { [key: string]: { color: string; icon: any; label: string } } = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Confirmed' },
      processing: { color: 'bg-orange-100 text-orange-800', icon: Package, label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Shipped' },
      out_for_delivery: { color: 'bg-indigo-100 text-indigo-800', icon: Truck, label: 'Out for Delivery' },
      delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: X, label: 'Cancelled' },
      returned: { color: 'bg-gray-100 text-gray-800', icon: RotateCcw, label: 'Returned' }
    };
    return configs[status] || configs.pending;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The order you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={() => router.push('/orders')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
            
            <div className="flex items-center gap-3">
              {order.status === 'delivered' && (
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              )}
              
              {canCancel && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCancelling(true)}
                  className="text-red-600 hover:text-red-700"
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <Badge className={`${statusConfig.color} border flex items-center gap-1 text-sm px-3 py-1`}>
              <StatusIcon className="w-4 h-4" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.product?.images?.[0]?.url || item.productDetails?.image || '/placeholder-product.jpg'}
                          alt={item.product?.name || item.productDetails?.name || 'Product'}
                          className="w-16 h-16 object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.jpg';
                          }}
                        />
                        
                        <div className="flex-1">
                          {item.product?._id ? (
                            <Link href={`/products/${item.product._id}`}>
                              <h3 className="font-medium text-gray-900 hover:text-primary cursor-pointer">
                                {item.product?.name || item.productDetails?.name || 'Unknown Product'}
                              </h3>
                            </Link>
                          ) : (
                            <h3 className="font-medium text-gray-900">
                              {item.productDetails?.name || 'Unknown Product'}
                            </h3>
                          )}
                          
                          {item.productDetails?.sku && (
                            <p className="text-sm text-gray-600">SKU: {item.productDetails.sku}</p>
                          )}
                          
                          {item.selectedVariants && item.selectedVariants.length > 0 && (
                            <div className="mt-1">
                              {item.selectedVariants.map((variant, index) => (
                                <span key={index} className="text-sm text-gray-600">
                                  {variant.variantName}: {variant.selectedOption}
                                  {index < item.selectedVariants.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              Quantity: {item.quantity || 1}
                            </span>
                            <span className="font-medium">
                              {formatPrice((item.price || 0) * (item.quantity || 1))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No items found in this order</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Order Tracking</CardTitle>
                {order.shippingTrackingNumber && (
                  <p className="text-sm text-gray-600">
                    Tracking Number: {order.shippingTrackingNumber}
                    {order.shippingCarrier && ` (${order.shippingCarrier})`}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.trackingHistory && order.trackingHistory.length > 0 ? (
                    [...order.trackingHistory].reverse().map((track, index) => {
                      const trackConfig = getStatusConfig(track.status || 'pending');
                      const TrackIcon = trackConfig.icon;
                      const isLatest = index === 0;
                      
                      return (
                        <div key={track._id || index} className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isLatest ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            <TrackIcon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${isLatest ? 'text-primary' : 'text-gray-900'}`}>
                                {trackConfig.label}
                              </p>
                              <p className="text-sm text-gray-600">
                                {track.timestamp ? formatDate(track.timestamp) : 'N/A'}
                              </p>
                            </div>
                            
                            {track.message && (
                              <p className="text-sm text-gray-600 mt-1">{track.message}</p>
                            )}
                            
                            {track.location && (
                              <p className="text-sm text-gray-500 mt-1">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {track.location}
                              </p>
                            )}
                            
                            {track.updatedBy?.name && (
                              <p className="text-xs text-gray-500 mt-1">
                                Updated by {track.updatedBy.name}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No tracking information available</p>
                    </div>
                  )}
                </div>

                {order.estimatedDelivery && !order.actualDelivery && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Estimated Delivery: {formatDate(order.estimatedDelivery)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Notes */}
            {order.notes.customer && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{order.notes.customer}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.pricing?.subtotal ?? 0)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {(order.pricing?.shippingCost ?? 0) === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(order.pricing?.shippingCost ?? 0)
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (GST)</span>
                  <span>{formatPrice(order.pricing?.tax ?? 0)}</span>
                </div>
                
                {(order.pricing?.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.pricing?.discount ?? 0)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(order.pricing?.total ?? 0)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shippingAddress ? (
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{order.shippingAddress.fullName || 'N/A'}</p>
                    <p>{order.shippingAddress.addressLine1 || 'Address not provided'}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city || 'N/A'}, {order.shippingAddress.state || 'N/A'} {order.shippingAddress.postalCode || ''}
                    </p>
                    <p>{order.shippingAddress.country || 'N/A'}</p>
                    {order.shippingAddress.phone && (
                      <div className="flex items-center gap-1 mt-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {order.shippingAddress.phone}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No shipping address available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.payment ? (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="capitalize">{(order.payment.method || 'N/A').replace('_', ' ')}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Payment Status</span>
                      <Badge 
                        className={order.payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {order.payment.status || 'pending'}
                      </Badge>
                    </div>
                    
                    {order.payment.transactionId && (
                      <div className="flex justify-between">
                        <span>Transaction ID</span>
                        <span className="font-mono text-xs">{order.payment.transactionId}</span>
                      </div>
                    )}
                    
                    {order.payment.paidAt && (
                      <div className="flex justify-between">
                        <span>Paid At</span>
                        <span>{formatDate(order.payment.paidAt)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No payment information available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p className="text-gray-600">
                    Have questions about your order? Contact our support team.
                  </p>
                  
                  <div className="flex items-center gap-2 text-blue-600">
                    <Mail className="w-4 h-4" />
                    <span>support@supermall.com</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-blue-600">
                    <Phone className="w-4 h-4" />
                    <span>1800-123-4567</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cancel Order Modal */}
        {cancelling && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Please provide a reason for cancelling this order..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCancelling(false);
                    setCancelReason('');
                  }}
                >
                  Keep Order
                </Button>
                <Button 
                  onClick={handleCancelOrder}
                  disabled={!cancelReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}