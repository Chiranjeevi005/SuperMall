'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const result = await response.json();
        
        if (response.ok && result.orders) {
          setOrders(result.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    // For now, we're not filtering by payment status in the mock data
    // In a real implementation, this would filter by paymentStatus
    return statusMatch;
  });

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Order Status</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  statusFilter === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  statusFilter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('processing')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  statusFilter === 'processing' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setStatusFilter('shipped')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  statusFilter === 'shipped' 
                    ? 'bg-indigo-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setStatusFilter('delivered')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  statusFilter === 'delivered' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Delivered
              </button>
            </div>
          </div>
          
          <div className="flex flex-col ml-4">
            <label className="text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  paymentFilter === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Payments
              </button>
              <button
                onClick={() => setPaymentFilter('completed')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  paymentFilter === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setPaymentFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  paymentFilter === 'pending' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setPaymentFilter('failed')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  paymentFilter === 'failed' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Failed
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <li key={order.id} className="px-4 py-6 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Order #{order.orderId}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {order.customer} • ₹{order.amount.toFixed(2)} • {order.items} items
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.date}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 bg-purple-100 text-purple-800">
                      Stripe
                    </span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="text-green-600 hover:text-green-900"
                  >
                    View
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try selecting different filters to see orders.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;