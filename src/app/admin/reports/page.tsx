'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Simple chart component for demonstration
const BarChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map(item => item.value), 0);
  
  return (
    <div className="flex items-end h-64 gap-4 mt-4 p-4 border rounded-lg">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-1">{item.value}</div>
          <div 
            className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-md transition-all duration-500 ease-out"
            style={{ height: `${maxValue ? (item.value / maxValue) * 100 : 0}%` }}
          ></div>
          <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">{item.name}</div>
        </div>
      ))}
    </div>
  );
};

// Simple pie chart component for demonstration
const PieChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  
  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const angle = (percentage / 100) * 360;
          const endAngle = startAngle + angle;
          
          // Convert angles to radians
          const startRad = (startAngle - 90) * Math.PI / 180;
          const endRad = (endAngle - 90) * Math.PI / 180;
          
          // Calculate coordinates
          const x1 = 50 + 40 * Math.cos(startRad);
          const y1 = 50 + 40 * Math.sin(startRad);
          const x2 = 50 + 40 * Math.cos(endRad);
          const y2 = 50 + 40 * Math.sin(endRad);
          
          // Determine if it's a large arc
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          // Create path data
          const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          
          startAngle = endAngle;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total</div>
        </div>
      </div>
    </div>
  );
};

export default function ReportsDashboard() {
  const [salesData, setSalesData] = useState([
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Apr', value: 22000 },
    { name: 'May', value: 18000 },
    { name: 'Jun', value: 25000 },
    { name: 'Jul', value: 21000 },
    { name: 'Aug', value: 28000 },
    { name: 'Sep', value: 24000 },
    { name: 'Oct', value: 30000 },
    { name: 'Nov', value: 26000 },
    { name: 'Dec', value: 32000 },
  ]);

  const [categoryData, setCategoryData] = useState([
    { name: 'Grains', value: 32, color: '#10B981' },
    { name: 'Dairy', value: 28, color: '#F59E0B' },
    { name: 'Fruits', value: 24, color: '#3B82F6' },
    { name: 'Home', value: 18, color: '#8B5CF6' },
    { name: 'Food', value: 15, color: '#EF4444' },
    { name: 'Clothing', value: 12, color: '#EC4899' },
  ]);

  const [vendorPerformanceData, setVendorPerformanceData] = useState([
    { name: 'Farmers Kitchen', value: 42, color: '#10B981' },
    { name: 'Artisan Crafts', value: 38, color: '#F59E0B' },
    { name: 'Dairy Products', value: 35, color: '#3B82F6' },
    { name: 'Organic Farms', value: 28, color: '#8B5CF6' },
    { name: 'Spice Masters', value: 24, color: '#EF4444' },
  ]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Stat card component
  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Comprehensive analytics and reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard 
          title="Total Sales" 
          value={formatCurrency(324500)} 
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Orders" 
          value={1242} 
          icon="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Vendors" 
          value={42} 
          icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Active Customers" 
          value={1242} 
          icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
          color="bg-purple-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Sales Trend</h2>
          <BarChart data={salesData} />
        </div>

        {/* Category Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h2>
          <PieChart data={categoryData} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vendor Performance */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Vendor Performance</h2>
        <BarChart data={vendorPerformanceData} />
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Sales Reports</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Monthly Sales Summary
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Quarterly Performance
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Yearly Analytics
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Vendor Reports</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Vendor Performance
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                New Vendor Analysis
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Vendor Comparison
              </Link>
            </li>
          </ul>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-md font-medium text-gray-900 mb-3">Customer Reports</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Customer Demographics
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Purchase Behavior
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-green-600 hover:text-green-800">
                Retention Analysis
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}