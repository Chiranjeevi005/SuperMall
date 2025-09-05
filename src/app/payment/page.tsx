'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ 
  orderId, 
  clientSecret, 
  onComplete 
}: { 
  orderId: string; 
  clientSecret: string; 
  onComplete: (orderId: string) => void; 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    if (!clientSecret) {
      // Payment intent not yet created
      setError('Payment intent not found');
      return;
    }

    setProcessing(true);
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer Name',
          },
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setProcessing(false);
        // Payment successful, redirect to confirmation page
        onComplete(orderId);
      }
    } catch (err) {
      setError('Payment processing failed');
      setProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#000',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: 'rgba(0,0,0,0.5)',
        },
      },
      invalid: {
        color: '#e03131',
        iconColor: '#e03131',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm py-2">
            {error}
          </div>
        )}
        
        <div className="flex justify-between">
          <Link
            href={`/checkout`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Back to Checkout
          </Link>
          
          <button
            type="submit"
            disabled={processing || succeeded || !stripe}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

const PaymentPageContent = () => {
  const { clearCart } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  // Use the Render backend URL for API calls
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supermall-cevd.onrender.com';

  // Get search params in a safe way
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('orderId');
      const secret = params.get('clientSecret');
      setOrderId(id);
      setClientSecret(secret);
    } catch (err) {
      console.error('Error getting search params:', err);
      setPaymentResult({
        success: false,
        error: 'Invalid parameters'
      });
      setLoadingOrder(false);
    }
  }, []);

  // Redirect if no orderId
  useEffect(() => {
    if (orderId === null && typeof window !== 'undefined') {
      // Only redirect in browser, not during SSR
      window.location.href = '/cart';
    }
  }, [orderId]);

  // Fetch order details if orderId is provided
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;
      
      try {
        setLoadingOrder(true);
        // Fetch the specific order from API
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch order details');
        }
        
        setOrderDetails(data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
        // Show error to user
        setPaymentResult({
          success: false,
          error: 'Failed to load order details. Please try again.'
        });
      } finally {
        setLoadingOrder(false);
      }
    };
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handlePaymentSuccess = (orderId: string) => {
    // Clear cart after successful payment
    clearCart();
    // Redirect to order confirmation page
    if (typeof window !== 'undefined') {
      window.location.href = `/order-confirmation?orderId=${orderId}`;
    }
  };

  if (orderId === null) {
    return null; // Will be redirected by useEffect
  }

  if (loadingOrder && orderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // Show error if we couldn't load order details
  if (paymentResult && !paymentResult.success) {
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
                <p>{paymentResult.error}</p>
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

  // Show error if order details couldn't be loaded
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

  const totalAmount = orderDetails.totalAmount || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Order #{orderDetails.orderId}</p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">₹{totalAmount.toFixed(2)}</p>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">Calculated at checkout</p>
                </div>
                
                <div className="flex justify-between border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">Order total</p>
                  <p className="text-base font-medium text-gray-900">₹{totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
            
            <div className="border-t border-gray-200 pt-4">
              {/* Only show Stripe form if we have order details and clientSecret */}
              {orderId && clientSecret && orderDetails ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    orderId={orderId} 
                    clientSecret={clientSecret}
                    onComplete={handlePaymentSuccess}
                  />
                </Elements>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    Loading payment details...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = () => {
  return <PaymentPageContent />;
};

export default PaymentPage;