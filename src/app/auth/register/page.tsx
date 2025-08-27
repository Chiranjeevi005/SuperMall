'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, MapPin, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.push('Name must be at least 2 characters long');
    }

    if (!formData.email) {
      newErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }

    if (!formData.password) {
      newErrors.push('Password is required');
    } else if (formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long');
    }

    if (!formData.confirmPassword) {
      newErrors.push('Please confirm your password');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    if (!formData.role || !['user', 'vendor', 'admin'].includes(formData.role)) {
      newErrors.push('Please select a valid account type');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors([]);

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
      
      if (result.success) {
        router.push('/');
      } else {
        setErrors([result.message]);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Join SuperMall
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start shopping
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to create a new account
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Please fix the following errors:
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    placeholder="Create a password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="user">Customer</option>
                  <option value="vendor">Vendor/Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address (Optional)
                </label>
                <div className="relative">
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Enter your address"
                  />
                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Sign in here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}