'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CheckCircle, 
  Package, 
  Calendar, 
  CreditCard, 
  MapPin,
  ArrowLeft,
  Download,
  Truck,
  Clock,
  User,
  Phone,
  Mail,
  Share2,
  Heart,
  Star,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    images: { url: string }[];
  };
  quantity: number;
  price: number;
  selectedVariants: {
    variantName: string;
    selectedOption: string;
  }[];
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  pricing: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  };
  payment: {
    method: string;
    status: string;
  };
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  trackingHistory: {
    status: string;
    message: string;
    timestamp: string;
  }[];
  estimatedDelivery?: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  // Get order number from search params with better error handling
  const orderNumber = searchParams.get('orderNumber') || '';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if orderNumber is valid
    if (!orderNumber || typeof orderNumber !== 'string' || orderNumber.trim() === '') {
      router.push('/orders');
      return;
    }

    fetchOrderDetails();
    fetchRecommendedProducts();
  }, [isAuthenticated, orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');

      // Ensure we have a valid order number
      if (!orderNumber || typeof orderNumber !== 'string' || orderNumber.trim() === '') {
        throw new Error('Invalid order number');
      }

      const response = await fetch(`/api/orders/${encodeURIComponent(orderNumber.trim())}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.message || 'Order not found');
      }
    } catch (error: any) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedProducts = async () => {
    try {
      // Fetch products from the same categories as ordered items
      const response = await fetch('/api/products?limit=4', {
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        setRecommendedProducts(data.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching recommended products:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReceipt = () => {
    // In a real implementation, this would generate a PDF receipt
    alert('Receipt download functionality would be implemented here');
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation',
        text: `I just placed an order on Super Mall! Order #${order?.orderNumber}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading order confirmation...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The order you are looking for does not exist.'}
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/orders')} className="w-full">
                View All Orders
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/products')}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your order. We'll send you updates as your order progresses.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button onClick={downloadReceipt} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Receipt
            </Button>
            <Button onClick={shareOrder} variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Order
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Order Tracking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.trackingHistory && order.trackingHistory.length > 0 ? (
                    order.trackingHistory.map((track, index) => (
                      <div key={index} className="flex">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {index === 0 ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                          </div>
                          {index < order.trackingHistory.length - 1 && (
                            <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                          )}
                        </div>
                        <div className="pb-6">
                          <p className="font-medium capitalize">{track.status.replace('_', ' ')}</p>
                          <p className="text-sm text-gray-600">{track.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(track.timestamp)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Order tracking information will be available shortly</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.product._id} className="flex items-center p-4 border rounded-lg">
                      <img
                        src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        {item.selectedVariants && item.selectedVariants.length > 0 && (
                          <div className="mt-1">
                            {item.selectedVariants.map((variant, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                                {variant.variantName}: {variant.selectedOption}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
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
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="flex items-center mt-2">
                    <Phone className="w-4 h-4 mr-2" />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Order Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{order.orderNumber}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0"
                      onClick={copyOrderNumber}
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.pricing.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {order.pricing.shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(order.pricing.shippingCost)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax (GST)</span>
                    <span>{formatPrice(order.pricing.tax)}</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(order.pricing.total)}</span>
                    </div>
                  </div>
                </div>
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
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {order.payment.method.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${ 
                    order.payment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment.status}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Support */}
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <User className="w-5 h-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4">
                  If you have any questions about your order, our customer support team is here to help.
                </p>
                <div className="space-y-2 text-sm text-blue-600">
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    support@supermall.com
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    1800-123-4567
                  </p>
                </div>
                <Button 
                  onClick={() => router.push('/contact')}
                  variant="outline" 
                  className="w-full mt-4 border-blue-500 text-blue-700 hover:bg-blue-100"
                >
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push(`/orders/${order.orderNumber}`)}
            className="flex items-center gap-2"
            size="lg"
          >
            <Truck className="w-5 h-5" />
            Track Your Order
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/products')}
            className="flex items-center gap-2"
            size="lg"
          >
            <Package className="w-5 h-5" />
            Continue Shopping
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/orders')}
            className="flex items-center gap-2"
            size="lg"
          >
            <Calendar className="w-5 h-5" />
            View All Orders
          </Button>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                You Might Also Like
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedProducts.map((product) => (
                  <div 
                    key={product._id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/products/${product._id}`)}
                  >
                    <img
                      src={product.images[0]?.url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.5</span>
                    </div>
                    <p className="font-semibold mt-1">{formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}