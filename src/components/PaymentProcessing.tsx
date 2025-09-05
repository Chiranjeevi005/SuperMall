'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface PaymentProcessingProps {
  orderId: string;
  onComplete: () => void;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({ orderId, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate payment processing progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // After 2-3 seconds, redirect to order confirmation
          setTimeout(() => {
            onComplete();
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-green-200 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Processing Your Payment</h1>
        <p className="mt-2 text-gray-600">
          Securing your transaction... Please do not refresh the page.
        </p>
        
        <div className="mt-8 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Order ID: {orderId}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="mt-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span className="ml-2 text-green-600 font-medium">Secure Payment Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;