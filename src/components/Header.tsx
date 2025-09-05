'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import EnhancedSearch from '@/components/EnhancedSearch';
import NotificationBell from '@/components/NotificationBell';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { state: cartState } = useCart();

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Vendors', path: '/vendors' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const searchCategories = ['All', 'Products'];

  // Role-based navigation items for authenticated users
  const getRoleBasedNavItems = () => {
    if (!user) return navItems;
    
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Home', path: '/' },
          { name: 'Vendors', path: '/vendors' },
          { name: 'Products', path: '/products' },
          { name: 'Contact', path: '/contact' },
        ];
      case 'merchant':
        return [
          { name: 'Home', path: '/' },
          { name: 'Vendors', path: '/vendors' },
          { name: 'Products', path: '/products' },
          { name: 'Contact', path: '/contact' },
        ];
      case 'customer':
        return [
          { name: 'Home', path: '/' },
          { name: 'Vendors', path: '/vendors' },
          { name: 'Products', path: '/products' },
          { name: 'Contact', path: '/contact' },
        ];
      default:
        return navItems;
    }
  };

  const roleBasedNavItems = getRoleBasedNavItems();

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50 transition-all duration-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main header row with proper alignment */}
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and brand name */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-2xl font-extrabold text-gray-900">
                    Super<span className="text-green-700">Mall</span>
                  </h1>
                  <p className="text-[10px] text-gray-500 mt-0">India&apos;s Rural Marketplace</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Center section - Navigation links and search bar */}
          <div className="hidden md:flex md:items-center md:flex-1 md:justify-center md:space-x-8">
            {/* Navigation links */}
            <nav className="flex items-center space-x-1">
              {roleBasedNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${
                    pathname === item.path
                      ? 'text-green-700 border-b-2 border-green-600 font-extrabold'
                      : 'text-gray-700 hover:text-green-600'
                  } inline-flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 relative group`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-amber-400 to-green-500 rounded-full"></span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-green-500 rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Search bar with proper spacing */}
            <div className="flex items-center ml-6 w-64">
              <div className="relative rounded-full overflow-hidden shadow-sm bg-white border border-amber-200 w-full">
                <div className="flex items-center">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="py-1.5 pl-3 pr-2 text-gray-700 bg-amber-50 border-r border-amber-200 focus:outline-none rounded-l-full text-xs font-medium h-full"
                  >
                    {searchCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center flex-1">
                    <EnhancedSearch placeholder="Search..." size="normal" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Cart, Notifications and Auth buttons */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            {/* Cart Icon */}
            <Link href="/cart" className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all duration-300 shadow-sm hover:shadow-md relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartState.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartState.totalItems}
                </span>
              )}
            </Link>

            {/* Notifications Bell */}
            {user && <NotificationBell />}

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* User Name Display */}
                  <span className="text-sm font-medium text-gray-700 hidden lg:inline">
                    Welcome, {user.name.split(' ')[0]}
                  </span>
                  
                  {/* User Avatar/Initials with Dashboard Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <div className="bg-gradient-to-r from-amber-100 to-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">
                          {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <svg className="h-5 w-5 text-gray-400 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {mobileMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Link
                            href={user.role === 'admin' ? '/admin' : user.role === 'merchant' ? '/vendor' : '/customer'}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            href={user.role === 'admin' ? '/admin/profile' : user.role === 'merchant' ? '/vendor/profile' : '/customer/profile'}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-bold rounded-full text-gray-700 hover:bg-amber-100 transition-all duration-300 border border-amber-200 shadow-sm hover:shadow"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-bold rounded-full text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm hover:shadow"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-gray-700 hover:bg-amber-100 focus:outline-none shadow-sm hover:shadow"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-amber-100 bg-white rounded-b-xl shadow-lg">
            {/* Mobile Search */}
            <div className="mb-4 px-4">
              <div className="relative rounded-full overflow-hidden shadow-sm bg-white border border-amber-200">
                <div className="flex items-center">
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="py-2 pl-3 pr-2 text-gray-700 bg-amber-50 border-r border-amber-200 focus:outline-none rounded-l-full text-xs font-medium"
                  >
                    {searchCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center flex-1">
                    <EnhancedSearch placeholder="Search..." size="normal" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-1 px-4">
              {roleBasedNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${
                    pathname === item.path
                      ? 'text-green-700 bg-amber-50 border-l-2 border-green-600 font-bold'
                      : 'text-gray-700 hover:bg-amber-50'
                  } px-4 py-3 rounded-lg text-sm transition-colors duration-300 shadow-sm hover:shadow`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Action Icons */}
            <div className="flex justify-around px-4 mt-4 pb-3 border-b border-amber-100">
              <Link href="/cart" className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all duration-300 shadow-sm relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartState.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center">
                    {cartState.totalItems}
                  </span>
                )}
              </Link>
              
              {user && (
                <button className="p-2 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-all duration-300 shadow-sm relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] rounded-full h-4 w-4 flex items-center justify-center">3</span>
                </button>
              )}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex space-x-2 px-4 mt-4">
              {user ? (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-amber-100 to-green-100 rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-700">
                          {user.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={user.role === 'admin' ? '/admin' : user.role === 'merchant' ? '/vendor' : '/customer'}
                        className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700 text-center"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleLogout}
                      className="flex-1 text-center px-4 py-2.5 text-sm font-bold rounded-full text-gray-700 bg-amber-100 hover:bg-amber-200 transition-colors duration-300 border border-amber-200 shadow-sm"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-bold rounded-full text-gray-700 bg-amber-100 hover:bg-amber-200 transition-colors duration-300 border border-amber-200 shadow-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center px-4 py-2.5 text-sm font-bold rounded-full text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;