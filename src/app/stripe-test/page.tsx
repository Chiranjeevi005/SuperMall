'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with the publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payment/intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 500, // ₹5.00
            currency: 'inr',
          }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || 'Failed to initialize payment');
        }
      } catch (err) {
        setError('Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    if (!clientSecret) {
      // Payment intent not yet created
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
            name: 'Test Customer',
          },
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
        setProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        setProcessing(false);
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Stripe Test Payment</h2>
      
      {succeeded ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong>Success!</strong> Payment completed.
        </div>
      ) : (
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
            
            <button
              type="submit"
              disabled={processing || !stripe || succeeded}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Pay ₹5.00'}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-medium text-gray-900 mb-2">Test Card Details</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>Card Number: 4242 4242 4242 4242</li>
          <li>Expiry: Any future date</li>
          <li>CVC: Any 3 digits</li>
        </ul>
      </div>
    </div>
  );
};

const StripeTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default StripeTestPage;