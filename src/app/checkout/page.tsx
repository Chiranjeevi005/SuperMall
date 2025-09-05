'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import CheckoutStep from '@/components/CheckoutStep';
import AddressForm from '@/components/AddressForm';
import ShippingOptions from '@/components/ShippingOptions';
import PaymentMethods from '@/components/PaymentMethods';
import OrderReview from '@/components/OrderReview';

const CheckoutPage = () => {
  const { state: cartState, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the Render backend URL for API calls
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supermall-cevd.onrender.com';

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartState.items.length === 0 && typeof window !== 'undefined') {
      window.location.href = '/cart';
    }
  }, [cartState.items.length]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate cart items
      if (cartState.items.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Validate shipping address
      const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
      for (const field of requiredAddressFields) {
        if (!shippingAddress[field as keyof typeof shippingAddress]) {
          throw new Error(`Shipping address ${field} is required`);
        }
      }
      
      // Create order in the database - ONLY ONE TIME
      const orderData = {
        customer: '65f1a0b1c2d3e4f5a6b7c8d9', // Mock customer ID - in real app this would come from auth context
        vendor: '65f1a0b1c2d3e4f5a6b7c8e0', // Mock vendor ID - in real app this would be determined by products
        items: cartState.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalAmount: cartState.totalPrice,
        shippingAddress,
        paymentMethod,
        notes: orderNotes,
        status: 'pending',
        paymentStatus: 'pending'
      };

      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const orderResult = await orderResponse.json();
      
      if (!orderResponse.ok || !orderResult.order) {
        throw new Error(orderResult?.error || orderResult?.message || 'Failed to create order');
      }

      // For Stripe payments, create PaymentIntent and redirect to payment page
      if (paymentMethod === 'stripe') {
        // Create PaymentIntent
        const paymentResponse = await fetch(`${API_BASE_URL}/api/payment/intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: cartState.totalPrice,
            currency: 'inr',
            orderId: orderResult.order.orderId,
          }),
        });

        const paymentData = await paymentResponse.json();
        
        if (!paymentResponse.ok) {
          throw new Error(paymentData.error || 'Failed to initialize payment');
        }
        
        // Redirect to payment page with order ID and client secret
        if (typeof window !== 'undefined') {
          window.location.href = `/payment?orderId=${orderResult.order.orderId}&clientSecret=${paymentData.clientSecret}`;
        }
        return;
      }
      
      // For non-Stripe payments, redirect to confirmation page directly
      // Clear cart after successful order creation
      clearCart();
      // Redirect to order confirmation page with order ID
      if (typeof window !== 'undefined') {
        window.location.href = `/order-confirmation?orderId=${orderResult.order.orderId}`;
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      // More detailed error handling
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setError('Network error. Please check your connection and try again.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while placing your order. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, name: 'Address', href: '#', status: currentStep === 1 ? 'current' : currentStep > 1 ? 'complete' : 'upcoming' },
    { id: 2, name: 'Shipping', href: '#', status: currentStep === 2 ? 'current' : currentStep > 2 ? 'complete' : 'upcoming' },
    { id: 3, name: 'Payment', href: '#', status: currentStep === 3 ? 'current' : currentStep > 3 ? 'complete' : 'upcoming' },
    { id: 4, name: 'Review', href: '#', status: currentStep === 4 ? 'current' : 'upcoming' },
  ] as const;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressForm 
            address={shippingAddress}
            setAddress={setShippingAddress}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <ShippingOptions 
            selectedMethod={shippingMethod}
            onSelectMethod={setShippingMethod}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 3:
        return (
          <PaymentMethods 
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            onBack={handlePrevStep}
            onNext={handleNextStep}
          />
        );
      case 4:
        return (
          <OrderReview 
            cartState={cartState}
            shippingAddress={shippingAddress}
            shippingMethod={shippingMethod}
            paymentMethod={paymentMethod}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            onBack={handlePrevStep}
            onPlaceOrder={handlePlaceOrder}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  if (cartState.items.length === 0) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Placing Order
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <nav aria-label="Progress" className="mb-8">
          <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
            {steps.map((step) => (
              <CheckoutStep key={step.id} step={step} />
            ))}
          </ol>
        </nav>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderStepContent()}
        </div>
        
        <div className="mt-6">
          <Link
            href="/cart"
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;