'use client';

import React from 'react';

interface ShippingOptionsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const ShippingOptions: React.FC<ShippingOptionsProps> = ({ 
  selectedMethod, 
  onSelectMethod, 
  onBack, 
  onNext 
}) => {
  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivered in 5-7 business days',
      price: 0,
      estimatedDays: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivered in 2-3 business days',
      price: 150,
      estimatedDays: '2-3 business days'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Delivered by next business day',
      price: 300,
      estimatedDays: '1 business day'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <fieldset>
          <legend className="text-lg font-medium text-gray-900">Shipping Method</legend>
          <p className="text-sm text-gray-500">Select your preferred shipping method</p>
          
          <div className="mt-4 space-y-4">
            {shippingMethods.map((method) => (
              <div key={method.id} className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id={method.id}
                    name="shipping-method"
                    type="radio"
                    checked={selectedMethod === method.id}
                    onChange={() => onSelectMethod(method.id)}
                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={method.id} className="font-medium text-gray-700">
                    {method.name}
                  </label>
                  <p className="text-gray-500">{method.description}</p>
                  <p className="text-gray-500">
                    {method.price === 0 ? 'Free' : `₹${method.price}`} • {method.estimatedDays}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

export default ShippingOptions;