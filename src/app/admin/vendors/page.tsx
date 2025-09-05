'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VendorsManagement() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch vendors data from API
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendors');
        const data = await response.json();
        
        if (response.ok) {
          // Transform the data to match the existing structure
          const transformedVendors = data.vendors.map((vendor: any) => ({
            id: vendor._id,
            name: vendor.shopName || vendor.name,
            email: vendor.email,
            contact: vendor.contact || 'N/A',
            products: vendor.productCount || 0,
            status: vendor.isApproved ? (vendor.isSuspended ? 'suspended' : 'active') : 'pending',
            joinDate: new Date(vendor.createdAt).toISOString().split('T')[0],
          }));
          
          setVendors(transformedVendors);
          setLoading(false);
        } else {
          console.error('Error fetching vendors:', data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleApprove = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}/approve`, {
        method: 'PUT',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVendors(vendors.map(vendor => 
          vendor.id === vendorId ? { ...vendor, status: 'active' } : vendor
        ));
      } else {
        console.error('Error approving vendor:', data.error);
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  const handleSuspend = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}/suspend`, {
        method: 'PUT',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVendors(vendors.map(vendor => 
          vendor.id === vendorId ? { ...vendor, status: 'suspended' } : vendor
        ));
      } else {
        console.error('Error suspending vendor:', data.error);
      }
    } catch (error) {
      console.error('Error suspending vendor:', error);
    }
  };

  const handleActivate = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}/activate`, {
        method: 'PUT',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setVendors(vendors.map(vendor => 
          vendor.id === vendorId ? { ...vendor, status: 'active' } : vendor
        ));
      } else {
        console.error('Error activating vendor:', data.error);
      }
    } catch (error) {
      console.error('Error activating vendor:', error);
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.contact && typeof vendor.contact === 'object' 
      ? (vendor.contact.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (vendor.contact.email || '').toLowerCase().includes(searchTerm.toLowerCase())
      : (vendor.contact || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'suspended':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Suspended</span>;
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage all vendors in the marketplace</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none">
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Vendor
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-2 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">All Vendors</h3>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-amber-800 font-bold">
                              {vendor.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {vendor.contact && typeof vendor.contact === 'object' 
                          ? (vendor.contact.phone || vendor.contact.email || 'N/A')
                          : (vendor.contact || 'N/A')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-sm text-gray-900">{vendor.products}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{vendor.joinDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(vendor.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {vendor.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(vendor.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                        )}
                        {vendor.status === 'active' && (
                          <button
                            onClick={() => handleSuspend(vendor.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Suspend
                          </button>
                        )}
                        {vendor.status === 'suspended' && (
                          <button
                            onClick={() => handleActivate(vendor.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Activate
                          </button>
                        )}
                        <Link href={`/admin/vendors/${vendor.id}`} className="text-indigo-600 hover:text-indigo-900">
                          View
                        </Link>
                      </div>
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