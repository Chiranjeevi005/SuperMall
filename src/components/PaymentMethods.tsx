'use client';

import React, { useState } from 'react';

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  selectedMethod, 
  onSelectMethod, 
  onBack, 
  onNext 
}) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
    upiId: '',
    bankId: '',
  });

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay with cash upon delivery',
      icon: '💰'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay with Visa, Mastercard, or other card',
      icon: '💳'
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay with any UPI app',
      icon: '📱'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Pay directly from your bank account',
      icon: '🏦'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: '🅿️'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Pay with Stripe',
      icon: '💳'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                id="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiry"
                  id="expiry"
                  value={paymentData.expiry}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  id="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                Card Holder Name
              </label>
              <input
                type="text"
                name="cardHolder"
                id="cardHolder"
                value={paymentData.cardHolder}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
              />
            </div>
          </div>
        );
        
      case 'upi':
        return (
          <div className="mt-6">
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
              UPI ID
            </label>
            <input
              type="text"
              name="upiId"
              id="upiId"
              value={paymentData.upiId}
              onChange={handleInputChange}
              placeholder="yourname@upi"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
            />
            <p className="mt-2 text-sm text-gray-500">
              You will be redirected to your UPI app to complete the payment.
            </p>
          </div>
        );
        
      case 'netbanking':
        return (
          <div className="mt-6">
            <label htmlFor="bankId" className="block text-sm font-medium text-gray-700">
              Select Bank
            </label>
            <select
              id="bankId"
              name="bankId"
              value={paymentData.bankId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 py-3 px-4 border"
            >
              <option value="">Select your bank</option>
              <option value="sbi">State Bank of India</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </div>
        );
        
      case 'paypal':
        return (
          <div className="mt-6 text-center py-4">
            <p className="text-gray-600">
              You will be redirected to PayPal to complete your payment.
            </p>
          </div>
        );
        
      case 'stripe':
        return (
          <div className="mt-6 text-center py-4">
            <p className="text-gray-600">
              You will be redirected to Stripe to complete your payment.
            </p>
          </div>
        );
        
      case 'cod':
      default:
        return (
          <div className="mt-6 text-center py-4">
            <p className="text-gray-600">
              Pay with cash when your order is delivered.
            </p>
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <fieldset>
          <legend className="text-lg font-medium text-gray-900">Payment Method</legend>
          <p className="text-sm text-gray-500">Select your preferred payment method</p>
          
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => onSelectMethod(method.id)}
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                  selectedMethod === method.id
                    ? 'border-green-600 ring-2 ring-green-600'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{method.icon}</div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{method.name}</span>
                    <p className="text-gray-500">{method.description}</p>
                  </div>
                </div>
                <div className="ml-auto flex items-center">
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      selectedMethod === method.id
                        ? 'border-transparent bg-green-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Render payment form based on selected method */}
          {renderPaymentForm()}
        </fieldset>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Continue to Review
        </button>
      </div>
    </form>
  );
};

export default PaymentMethods;