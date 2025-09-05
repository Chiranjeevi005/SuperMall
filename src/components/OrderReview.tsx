'use client';

import React from 'react';
import Image from 'next/image';

interface OrderReviewProps {
  cartState: any;
  shippingAddress: any;
  shippingMethod: string;
  paymentMethod: string;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
  isLoading?: boolean;
}

const OrderReview: React.FC<OrderReviewProps> = ({ 
  cartState, 
  shippingAddress, 
  shippingMethod, 
  paymentMethod, 
  orderNotes, 
  setOrderNotes, 
  onBack, 
  onPlaceOrder,
  isLoading = false
}) => {
  const shippingMethods: any = {
    standard: { name: 'Standard Shipping', price: 0 },
    express: { name: 'Express Shipping', price: 150 },
    overnight: { name: 'Overnight Shipping', price: 300 }
  };

  const paymentMethods: any = {
    cod: 'Cash on Delivery',
    card: 'Credit/Debit Card',
    upi: 'UPI',
    netbanking: 'Net Banking',
    paypal: 'PayPal',
    stripe: 'Stripe'
  };

  const getShippingCost = () => {
    return shippingMethods[shippingMethod]?.price || 0;
  };

  const getTotalCost = () => {
    return cartState.totalPrice + getShippingCost();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
        
        <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cartState.items.map((item: any) => (
              <li key={item.product._id} className="flex py-6 px-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                  {item.product.images && item.product.images.length > 0 ? (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={64}
                      height={64}
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
                        <a href={`/products/${item.product._id}`}>{item.product.name}</a>
                      </h3>
                      <p className="ml-4">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                  </div>
                  <div className="flex-1 flex items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-gray-200 py-6 px-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">₹{cartState.totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">
                  {getShippingCost() === 0 ? 'Free' : `₹${getShippingCost().toFixed(2)}`}
                </p>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-4">
                <p className="text-base font-medium text-gray-900">Order total</p>
                <p className="text-base font-medium text-gray-900">₹{getTotalCost().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
        
        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 gap-y-2">
            <p className="text-gray-900">{shippingAddress.street}</p>
            <p className="text-gray-900">
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
            <p className="text-gray-900">{shippingAddress.country}</p>
            <p className="text-gray-900 mt-2">
              <span className="font-medium">Shipping Method:</span> {shippingMethods[shippingMethod]?.name}
            </p>
            <p className="text-gray-900">
              <span className="font-medium">Payment Method:</span> {paymentMethods[paymentMethod]}
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="order-notes" className="block text-sm font-medium text-gray-700">
          Order notes
        </label>
        <div className="mt-1">
          <textarea
            id="order-notes"
            name="order-notes"
            rows={4}
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
            placeholder="Any special instructions for your order..."
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </button>
      </div>
    </div>
  );
};

export default OrderReview;