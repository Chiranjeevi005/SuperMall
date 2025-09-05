'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // In a real implementation, you would fetch the order details from the API
        // For now, we'll simulate with mock data but with a delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order data
        const mockOrder = {
          id: params.id,
          orderId: 'ORD-2023-001234',
          date: 'October 15, 2023',
          status: 'shipped',
          totalAmount: 2450.00,
          shippingAddress: {
            street: '123 Main Street',
            city: 'Bengaluru',
            state: 'Karnataka',
            zipCode: '560001',
            country: 'India',
          },
          items: [
            {
              id: '1',
              name: 'Organic Honey',
              price: 850.00,
              quantity: 2,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954850/Farm_Milk_ocfuly.jpg',
            },
            {
              id: '2',
              name: 'Handwoven Basket',
              price: 750.00,
              quantity: 1,
              image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954796/Lamp_daeeg7.jpg',
            },
          ],
          trackingInfo: {
            trackingNumber: 'TN1234567890',
            carrier: 'India Post',
            estimatedDelivery: 'October 20, 2023',
            shippedAt: 'October 16, 2023',
          },
          paymentMethod: 'Credit Card',
          paymentStatus: 'completed',
        };
        
        setOrder(mockOrder);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
    { id: 'pending', name: 'Order Placed', status: 'complete' },
    { id: 'processing', name: 'Processing', status: 'complete' },
    { id: 'shipped', name: 'Shipped', status: 'current' },
    { id: 'delivered', name: 'Delivered', status: 'upcoming' },
  ];

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
              <h1 className="text-lg font-medium text-gray-900">Order Details</h1>
              <p className="mt-1 text-sm text-gray-500">
                Order #{order.orderId} placed on {order.date}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:px-6">
          <nav aria-label="Progress" className="mb-8">
            <ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
              {statusSteps.map((step) => (
                <li key={step.name} className="md:flex-1">
                  {step.status === 'complete' ? (
                    <div className="group flex flex-col border-l-4 border-green-600 py-2 pl-4 hover:border-green-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-green-600 group-hover:text-green-800">{step.name}</span>
                    </div>
                  ) : step.status === 'current' ? (
                    <div className="flex flex-col border-l-4 border-green-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                      <span className="text-sm font-medium text-green-600">{step.name}</span>
                    </div>
                  ) : (
                    <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          
          {order.trackingInfo && (
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
          )}
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {order.items.map((item: any) => (
                  <li key={item.id} className="flex py-6 px-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <a href="#">{item.name}</a>
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
                    <p className="font-medium">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">Free</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <p className="text-base font-medium text-gray-900">Order total</p>
                    <p className="text-base font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-gray-900">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Payment Status:</span> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;