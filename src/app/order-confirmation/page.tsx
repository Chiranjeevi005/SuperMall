'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const OrderConfirmationPage = () => {
  // Wrap useSearchParams in a try/catch to handle SSR
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    // Fetch real order details from the database
    const fetchOrderDetails = async () => {
      try {
        if (!orderId) {
          throw new Error('Order ID is required');
        }
        
        // Fetch order from API
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order details');
        }
        
        setOrderDetails(data.order);
        
        // Show email popup after a short delay
        setTimeout(() => {
          setShowEmailPopup(true);
        }, 2000);
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

  const closeNotification = () => {
    setShowNotification(false);
  };

  const closeEmailPopup = () => {
    setShowEmailPopup(false);
  };

  const resendEmail = () => {
    setShowEmailPopup(false);
    alert('Order confirmation email has been resent to your registered email address.');
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

  if (!orderDetails) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="mt-2 text-gray-600">
            The order you are looking for could not be found.
          </p>
          <div className="mt-6">
            <Link
              href="/checkout"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Return to Checkout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Email notification simulation */}
      {showNotification && (
        <div className="mb-6 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Order Confirmation Email Sent
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>We've sent a confirmation email to your registered email address with order details and tracking information.</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={closeNotification}
                  className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Email popup simulation */}
      {showEmailPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Order Confirmation Email
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        We've sent an order confirmation to <span className="font-medium">customer@example.com</span> with your order details and tracking information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeEmailPopup}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Got it
                </button>
                <button
                  type="button"
                  onClick={resendEmail}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Resend Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">Payment Successful!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your order. We&apos;ve received your payment and are preparing your order for shipment.
        </p>
        
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">Order ID: <span className="font-mono">{orderDetails.orderId}</span></p>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left">
          <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
          
          {/* Order Items */}
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Items Purchased</h3>
            <div className="space-y-4">
              {orderDetails.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center border-b border-gray-100 pb-4">
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
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.product ? item.product.name : 'Product Name'}
                      </h4>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-500">₹{item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Details */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">{orderDetails.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount Paid</p>
              <p className="font-medium text-lg">₹{orderDetails.amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="font-medium text-green-600 capitalize">{orderDetails.paymentStatus}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <p className="font-medium capitalize">{orderDetails.status}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500">Shipping Address</p>
              <p className="font-medium">
                {orderDetails.shippingAddress.street}, {orderDetails.shippingAddress.city},<br />
                {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode},<br />
                {orderDetails.shippingAddress.country}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900">What happens next?</h3>
            <ul className="mt-2 space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  We&apos;ll send you a shipping confirmation email when your order has been dispatched.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600">
                  You can track your order status using the button below.
                </p>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-3">
          <Link
            href={`/track-order?orderId=${orderDetails.orderId}`}
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Track My Order
          </Link>
          <Link
            href="/products"
            className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;