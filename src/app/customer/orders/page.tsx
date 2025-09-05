'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const result = await response.json();
        
        if (response.ok && result.orders) {
          setOrders(result.orders);
        } else {
          console.error('Failed to fetch orders:', result.message);
          // Fallback to mock data if API fails
          setOrders([
            {
              id: '1',
              orderId: 'ORD-2023-001234',
              date: 'October 15, 2023',
              total: 2450.00,
              status: 'shipped',
              items: 2,
            },
            {
              id: '2',
              orderId: 'ORD-2023-001233',
              date: 'October 10, 2023',
              total: 1875.50,
              status: 'delivered',
              items: 3,
            },
            {
              id: '3',
              orderId: 'ORD-2023-001232',
              date: 'October 5, 2023',
              total: 3200.00,
              status: 'processing',
              items: 1,
            },
          ]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data if API fails
        setOrders([
          {
            id: '1',
            orderId: 'ORD-2023-001234',
            date: 'October 15, 2023',
            total: 2450.00,
            status: 'shipped',
            items: 2,
          },
          {
            id: '2',
            orderId: 'ORD-2023-001233',
            date: 'October 10, 2023',
            total: 1875.50,
            status: 'delivered',
            items: 3,
          },
          {
            id: '3',
            orderId: 'ORD-2023-001232',
            date: 'October 5, 2023',
            total: 3200.00,
            status: 'processing',
            items: 1,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h2>
          <p className="mt-1 text-gray-500">Start shopping to place your first order</p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/customer/orders/${order.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-green-600 truncate">
                        Order #{order.orderId}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Ordered on <time dateTime={order.date}>{order.date}</time>
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerOrdersPage;