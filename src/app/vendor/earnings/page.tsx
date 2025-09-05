'use client';

import React, { useState, useEffect } from 'react';

export default function VendorEarnings() {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    pendingBalance: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  });

  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching earnings data
    const fetchEarnings = async () => {
      try {
        // In a real application, you would fetch this data from your API
        setTimeout(() => {
          setEarnings({
            totalEarnings: 98500,
            pendingBalance: 12450,
            totalOrders: 156,
            averageOrderValue: 631,
          });
          
          setWithdrawals([
            {
              id: 1,
              date: '2023-10-15',
              amount: 25000,
              status: 'completed',
            },
            {
              id: 2,
              date: '2023-09-22',
              amount: 18500,
              status: 'completed',
            },
            {
              id: 3,
              date: '2023-08-30',
              amount: 22000,
              status: 'completed',
            },
            {
              id: 4,
              date: '2023-07-18',
              amount: 15750,
              status: 'completed',
            },
          ]);
          
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching earnings:', error);
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Earnings card component
  const EarningsCard = ({ title, value, description }: { title: string; value: string; description: string }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="ml-0 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
              <dd className="mt-1 text-sm text-gray-500">{description}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'processing':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Processing</span>;
      default:
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="mt-1 text-sm text-gray-500">Track your earnings and withdrawal history</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <EarningsCard 
          title="Total Earnings" 
          value={formatCurrency(earnings.totalEarnings)} 
          description="Lifetime earnings" 
        />
        <EarningsCard 
          title="Pending Balance" 
          value={formatCurrency(earnings.pendingBalance)} 
          description="Available for withdrawal" 
        />
        <EarningsCard 
          title="Total Orders" 
          value={earnings.totalOrders.toString()} 
          description="Completed orders" 
        />
        <EarningsCard 
          title="Avg. Order Value" 
          value={formatCurrency(earnings.averageOrderValue)} 
          description="Average per order" 
        />
      </div>

      {/* Withdrawal Request Form */}
      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Request Withdrawal</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Request a withdrawal of your earnings to your bank account.</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="amount" className="sr-only">Amount</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  aria-describedby="amount-currency"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="amount-currency">
                    INR
                  </span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Request Withdrawal
            </button>
          </form>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Withdrawal History</h3>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(withdrawal.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(withdrawal.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}