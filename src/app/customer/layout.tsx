'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated and is customer
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      if (parsedUser.role !== 'customer' && parsedUser.role !== 'admin') {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/customer', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Products', href: '/customer/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Orders', href: '/customer/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Wishlist', href: '/customer/wishlist', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { name: 'Profile', href: '/customer/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Main content */}
      <main className="flex-1">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Dashboard Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
                  <p className="mt-1 text-sm text-gray-500">Welcome back, {user.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link 
                    href="/customer/profile" 
                    className="text-sm font-medium text-gray-700 hover:text-green-600"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            {/* Dashboard Navigation */}
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6">
                <nav className="flex space-x-4 overflow-x-auto">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        pathname === item.href
                          ? 'bg-amber-100 text-green-700 border-b-2 border-green-600'
                          : 'text-gray-600 hover:bg-amber-50 hover:text-gray-900'
                      } px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Dashboard Content */}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}