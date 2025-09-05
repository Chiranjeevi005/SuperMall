'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState('pending');
  const [error, setError] = useState<string | null>(null);

  // Use the Render backend URL for API calls
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supermall-cevd.onrender.com';

  // Get search params in a safe way
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('orderId');
      setOrderId(id);
    } catch (err) {
      console.error('Error getting search params:', err);
      setError('Invalid order ID');
      setLoading(false);
    }
  }, []);

  // Fetch real order data from the database
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          throw new Error('Order ID is required');
        }
        
        // Fetch order from API
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order details');
        }
        
        const orderData = data.order;
        
        // Transform the order data to match our UI
        const transformedOrder = {
          id: orderData.id,
          orderId: orderData.orderId,
          date: orderData.date,
          total: orderData.amount,
          shippingAddress: orderData.shippingAddress,
          items: orderData.items,
          trackingInfo: {
            trackingNumber: `TN${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            carrier: 'India Post',
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          },
        };
        
        setOrder(transformedOrder);
        setCurrentStatus(orderData.status || 'pending');
        
        // Initialize status updates based on the actual order status
        const statusHistory = getStatusHistory(orderData.status || 'pending');
        setStatusUpdates(statusHistory);
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        setError(error.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const getStatusHistory = (currentStatus: string) => {
    const allStatuses = [
      { 
        id: 'pending', 
        name: 'Order Placed', 
        description: 'Your order has been placed successfully.' 
      },
      { 
        id: 'processing', 
        name: 'Order Confirmed', 
        description: 'We\'ve received your order and are preparing it for shipment.' 
      },
      { 
        id: 'shipped', 
        name: 'Order Shipped', 
        description: 'Your order has been shipped and is on its way to you.' 
      },
      { 
        id: 'delivered', 
        name: 'Order Delivered', 
        description: 'Your order has been successfully delivered.' 
      }
    ];
    
    const statusUpdates = [];
    const currentDate = new Date();
    
    for (let i = 0; i < allStatuses.length; i++) {
      const status = allStatuses[i];
      
      // Add status updates up to the current status
      if (
        (currentStatus === 'pending' && status.id === 'pending') ||
        (currentStatus === 'processing' && (status.id === 'pending' || status.id === 'processing')) ||
        (currentStatus === 'shipped' && (status.id === 'pending' || status.id === 'processing' || status.id === 'shipped')) ||
        (currentStatus === 'delivered' && (status.id === 'pending' || status.id === 'processing' || status.id === 'shipped' || status.id === 'delivered'))
      ) {
        statusUpdates.push({
          id: (i + 1).toString(),
          status: status.id,
          title: status.name,
          description: status.description,
          date: new Date(currentDate.getTime() - (allStatuses.length - i) * 24 * 60 * 60 * 1000).toLocaleString('en-IN'),
          color: getColorForStatus(status.id),
        });
      }
    }
    
    return statusUpdates;
  };

  const getColorForStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return 'gray';
      case 'processing':
        return 'green';
      case 'shipped':
        return 'orange';
      case 'delivered':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-300';
      case 'processing':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-purple-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-500';
      case 'processing':
        return 'text-green-600';
      case 'shipped':
        return 'text-orange-600';
      case 'delivered':
        return 'text-purple-600';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusRingColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'ring-gray-300';
      case 'processing':
        return 'ring-green-500';
      case 'shipped':
        return 'ring-orange-500';
      case 'delivered':
        return 'ring-purple-500';
      default:
        return 'ring-gray-300';
    }
  };

  const refreshStatus = async () => {
    try {
      // Fetch updated order status from the API
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
      const data = await response.json();
      
      if (response.ok) {
        const orderData = data.order;
        setCurrentStatus(orderData.status || 'pending');
        const statusHistory = getStatusHistory(orderData.status || 'pending');
        setStatusUpdates(statusHistory);
        alert('Order status updated successfully!');
        return;
      }
      
      alert('Failed to refresh order status. Please try again.');
    } catch (error) {
      console.error('Error refreshing order status:', error);
      alert('Failed to refresh order status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Order
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <Link
                  href="/checkout"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Return to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="mt-2 text-gray-600">
            The order you are looking for could not be found.
          </p>
          <div className="mt-6">
            <Link
              href="/customer/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { id: 'pending', name: 'Order Placed', description: 'Order placed successfully' },
    { id: 'processing', name: 'Order Confirmed', description: 'Order confirmed and being processed' },
    { id: 'shipped', name: 'Shipped', description: 'Order dispatched' },
    { id: 'delivered', name: 'Delivered', description: 'Order delivered successfully' },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex(step => step.id === currentStatus);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/customer/orders"
          className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Orders
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div>
              <h1 className="text-lg font-medium text-gray-900">Order Tracking</h1>
              <p className="mt-1 text-sm text-gray-500">
                Order #{order.orderId}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={refreshStatus}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Status
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          {/* Progress bar timeline */}
          <div className="mb-10">
            <div className="flex justify-between relative">
              {/* Progress line */}
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-green-500 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(0, (getCurrentStepIndex() / (statusSteps.length - 1)) * 100)}%` }}
                ></div>
              </div>
              
              {statusSteps.map((step, index) => {
                const isCompleted = index <= getCurrentStepIndex();
                const isCurrent = step.id === currentStatus;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isCompleted 
                        ? `${getStatusColor(step.id)} border-white ring-2 ${getStatusRingColor(step.id)}` 
                        : 'bg-white border-gray-300'
                    }`}>
                      {isCompleted ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${
                        isCurrent ? getStatusTextColor(step.id) : isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Tracking information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Tracking Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Tracking Number: <span className="font-medium">{order.trackingInfo.trackingNumber}</span></p>
                  <p>Carrier: <span className="font-medium">{order.trackingInfo.carrier}</span></p>
                  <p>Estimated Delivery: <span className="font-medium">{order.trackingInfo.estimatedDelivery}</span></p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {order.items.map((item: any, index: number) => (
                  <li key={index} className="flex py-6 px-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      {item.product && item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-center object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                      )}
                    </div>
                    
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href="#">
                              {item.product ? item.product.name : 'Product Name'}
                            </a>
                          </h3>
                          <p className="ml-4">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="text-gray-500">Total ₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 py-6 px-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">₹{order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">Free</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <p className="text-base font-medium text-gray-900">Order total</p>
                    <p className="text-base font-medium text-gray-900">₹{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-900">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
          
          {/* Status Updates */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Status Updates</h2>
            <div className="flow-root">
              <ul className="space-y-4">
                {statusUpdates.map((update, index) => (
                  <li key={update.id} className="relative pl-8">
                    {index !== statusUpdates.length - 1 ? (
                      <span className="absolute left-3 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    ) : null}
                    <div className={`relative flex items-start ${
                      update.status === currentStatus ? 'animate-pulse' : ''
                    }`}>
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                        update.status === 'pending' ? 'bg-gray-300' :
                        update.status === 'processing' ? 'bg-green-500' :
                        update.status === 'shipped' ? 'bg-orange-500' :
                        update.status === 'delivered' ? 'bg-purple-500' : 'bg-gray-300'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{update.title}</p>
                        <p className="text-sm text-gray-500">{update.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{update.date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;