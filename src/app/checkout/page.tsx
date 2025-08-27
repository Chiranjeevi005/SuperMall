'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth, Address } from '@/contexts/AuthContext';
import { 
  CreditCard,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Wallet,
  Building,
  Smartphone,
  Plus,
  Edit3,
  Trash2,
  Check
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [billingAddress, setBillingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState<'home' | 'work' | 'other'>('home');

  const { cart, clearCart } = useCart();
  const { user, isAuthenticated, addAddress, setDefaultAddress } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      router.push('/cart');
      return;
    }

    // Pre-fill user data
    if (user) {
      // If user has saved addresses, use the default one
      const defaultAddress = user.savedAddresses && user.savedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        const addressData: ShippingAddress = {
          fullName: defaultAddress.fullName,
          phone: defaultAddress.phone,
          addressLine1: defaultAddress.addressLine1,
          addressLine2: defaultAddress.addressLine2 || '',
          city: defaultAddress.city,
          state: defaultAddress.state,
          postalCode: defaultAddress.postalCode,
          country: defaultAddress.country
        };
        setShippingAddress(addressData);
        setSelectedAddressId(defaultAddress._id || null);
      } else if (user.name) {
        // Fallback to user's name if available
        setShippingAddress(prev => ({
          ...prev,
          fullName: user.name
        }));
      }
    }
  }, [isAuthenticated, cart, user]);

  const validateAddress = (address: ShippingAddress): {[key: string]: string} => {
    const newErrors: {[key: string]: string} = {};

    if (!address.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (address.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(address.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!address.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (address.addressLine1.trim().length < 5) newErrors.addressLine1 = 'Address must be at least 5 characters';
    
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (address.city.trim().length < 2) newErrors.city = 'City must be at least 2 characters';
    
    if (!address.state.trim()) newErrors.state = 'State is required';
    if (address.state.trim().length < 2) newErrors.state = 'State must be at least 2 characters';
    
    if (!address.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!/^\d{6}$/.test(address.postalCode)) {
      newErrors.postalCode = 'Please enter a valid 6-digit postal code';
    }

    return newErrors;
  };

  const handleAddressChange = (field: keyof ShippingAddress, value: string, isShipping = true) => {
    if (isShipping) {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
      if (sameAsShipping) {
        setBillingAddress(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectSavedAddress = (addressId: string) => {
    if (!user || !user.savedAddresses) return;
    
    const selectedAddress = user.savedAddresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      const addressData: ShippingAddress = {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2 || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: selectedAddress.postalCode,
        country: selectedAddress.country
      };
      setShippingAddress(addressData);
      setSelectedAddressId(addressId);
      setShowAddressForm(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!user) return;
    
    // Validate the address before saving
    const addressErrors = validateAddress(shippingAddress);
    if (Object.keys(addressErrors).length > 0) {
      setErrors(addressErrors);
      return;
    }
    
    const addressToSave: Address = {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      addressLine1: shippingAddress.addressLine1,
      addressLine2: shippingAddress.addressLine2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      isDefault: !user.savedAddresses || user.savedAddresses.length === 0, // First address becomes default
      label: addressLabel
    };
    
    const result = await addAddress(addressToSave);
    if (result.success) {
      // Find the newly added address and set it as selected
      if (user.savedAddresses) {
        const newAddressId = user.savedAddresses.length > 0 
          ? user.savedAddresses[user.savedAddresses.length - 1]._id || null 
          : null;
        setSelectedAddressId(newAddressId);
      }
      setShowAddressForm(false);
      setErrors({});
    } else {
      setErrors({ general: result.message });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate shipping address
      const shippingErrors = validateAddress(shippingAddress);
      let billingErrors: {[key: string]: string} = {};
      
      if (!sameAsShipping) {
        billingErrors = validateAddress(billingAddress);
        // Prefix billing errors
        const prefixedBillingErrors: {[key: string]: string} = {};
        Object.keys(billingErrors).forEach(key => {
          prefixedBillingErrors[`billing_${key}`] = billingErrors[key];
        });
        billingErrors = prefixedBillingErrors;
      }

      const allErrors = { ...shippingErrors, ...billingErrors };
      
      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Placing order...');
    
    // Reset errors
    setErrors({});
    setLoading(true);
    
    try {
      // Validate form data
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }
      
      // Prepare order data with better null safety
      const orderData = {
        shippingAddress: {
          fullName: shippingAddress.fullName || '',
          phone: shippingAddress.phone || '',
          addressLine1: shippingAddress.addressLine1 || '',
          addressLine2: shippingAddress.addressLine2 || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          postalCode: shippingAddress.postalCode || '',
          country: shippingAddress.country || 'India'
        },
        billingAddress: sameAsShipping ? { ...shippingAddress } : {
          fullName: billingAddress.fullName || '',
          phone: billingAddress.phone || '',
          addressLine1: billingAddress.addressLine1 || '',
          addressLine2: billingAddress.addressLine2 || '',
          city: billingAddress.city || '',
          state: billingAddress.state || '',
          postalCode: billingAddress.postalCode || '',
          country: billingAddress.country || 'India'
        },
        paymentMethod: paymentMethod || 'cod',
        notes: notes || ''
      };

      console.log('Order data prepared:', orderData);

      // Create order first
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      });

      console.log('API response status:', response.status);
      
      // Check if response is valid and has content
      if (!response.ok) {
        let errorMessage = 'Failed to place order. Please try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Check if response has content before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid server response format');
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Invalid server response. Please try again.');
      }
      
      console.log('API response data:', data);

      // Validate that we received the expected data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid server response format');
      }

      if (data.success) {
        console.log('Order placed successfully');
        const order = data.data;
        
        // Validate that we have order data
        if (!order || typeof order !== 'object') {
          throw new Error('Invalid order data received from server');
        }
        
        // Handle payment processing for non-COD orders
        if (paymentMethod !== 'cod') {
          console.log('Processing payment for order:', order.orderNumber);
          
          try {
            // Create payment intent
            const paymentResponse = await fetch('/api/payments/create-intent', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                orderId: order._id,
                amount: order.pricing?.total || 0,
                currency: 'inr'
              })
            });

            if (!paymentResponse.ok) {
              let errorMessage = 'Failed to process payment. Please try again.';
              try {
                const paymentErrorData = await paymentResponse.json();
                errorMessage = paymentErrorData.message || paymentErrorData.error || errorMessage;
              } catch (parseError) {
                errorMessage = paymentResponse.statusText || errorMessage;
              }
              // For demo purposes, we'll continue with the order even if payment processing fails
              console.warn('Payment processing failed, but continuing with order:', errorMessage);
            } else {
              const paymentData = await paymentResponse.json();
              
              if (!paymentData.success) {
                // For demo purposes, we'll continue with the order even if payment processing fails
                console.warn('Payment processing failed, but continuing with order:', paymentData.error || 'Payment processing failed');
              } else {
                // Payment intent created successfully
                console.log('Payment intent created:', paymentData);
                // Here you would typically redirect to a payment page or show the Stripe payment element
                // For now, we'll proceed to order confirmation
              }
            }
          } catch (paymentError) {
            // For demo purposes, we'll continue with the order even if payment processing fails
            console.warn('Payment processing error, but continuing with order:', paymentError);
          }
        }
        
        try {
          // Clear the cart first
          await clearCart();
          console.log('Cart cleared successfully');
          
          // Redirect to order confirmation page
          console.log('Redirecting to order confirmation page...');
          // Ensure we have a valid order number with better null safety
          let orderNumber = null;
          
          // Try to get order number with multiple fallbacks
          if (order && typeof order === 'object') {
            if (order.orderNumber && typeof order.orderNumber === 'string') {
              orderNumber = order.orderNumber;
            } else if (order._id && typeof order._id === 'string') {
              orderNumber = order._id;
            } else if (order._id && typeof order._id === 'object' && order._id.toString) {
              orderNumber = order._id.toString();
            }
          }
          
          if (orderNumber) {
            router.push(`/order-confirmation?orderNumber=${encodeURIComponent(orderNumber)}`);
          } else {
            // If we can't get an order number, redirect to orders page
            console.log('No order number found, redirecting to orders page');
            router.push('/orders');
            return;
          }
        } catch (redirectError) {
          console.error('Error during redirect:', redirectError);
          // Even if redirect fails, we've successfully created the order
          // Show success message and provide a link to the order confirmation page
          setOrderPlaced(true);
          // Set order number from the order object, with fallback
          let orderNum = 'unknown';
          if (order && typeof order === 'object') {
            if (order.orderNumber && typeof order.orderNumber === 'string') {
              orderNum = order.orderNumber;
            } else if (order._id && typeof order._id === 'string') {
              orderNum = order._id;
            } else if (order._id && typeof order._id === 'object' && order._id.toString) {
              orderNum = order._id.toString();
            }
          }
          setOrderNumber(orderNum);
        }
        
        // We don't need to set state here since we're redirecting
        return;
      } else {
        console.error('Order placement failed:', data);
        let errorMessage = data.message || 'Failed to place order';
        
        // Handle specific error cases
        if (data.error) {
          errorMessage += ': ' + data.error;
        }
        
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.join(', ');
        }
        
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('Network or parsing error in handlePlaceOrder:', error);
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Server response error. Please try again.';
        } else {
          errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }
      }
      
      // Even if there's an error, we want to show the user that the order might have been placed
      // and redirect them to the orders page to check
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const validateForm = (): {[key: string]: string} => {
    const errors: {[key: string]: string} = {};
    
    // Validate shipping address
    const shippingErrors = validateAddress(shippingAddress);
    Object.assign(errors, shippingErrors);
    
    // Validate billing address if it's different from shipping
    if (!sameAsShipping) {
      const billingErrors = validateAddress(billingAddress);
      // Prefix billing errors to differentiate from shipping errors
      Object.keys(billingErrors).forEach(key => {
        errors[`billing_${key}`] = billingErrors[key];
      });
    }
    
    // Validate payment method
    if (!paymentMethod) {
      errors.paymentMethod = 'Please select a payment method';
    }
    
    return errors;
  };

  if (!isAuthenticated || !cart) {
    return null; // Will redirect
  }

  const subtotal = cart.totalAmount;
  const shippingCost = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shippingCost + tax;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-4">
              Your order #{orderNumber} has been placed successfully.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push(`/orders/${orderNumber}`)}
                className="w-full"
              >
                Track Your Order
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/products')}
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <Button variant="outline" onClick={() => router.push('/cart')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step <= currentStep 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    step < currentStep ? 'bg-primary' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Shipping</span>
            <span>Payment</span>
            <span>Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                      {errors.general}
                    </div>
                  )}

                  {/* Saved Addresses */}
                  {user && user.savedAddresses && user.savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-gray-900">Saved Addresses</h3>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowAddressForm(!showAddressForm)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          {showAddressForm ? 'Cancel' : 'Add New'}
                        </Button>
                      </div>
                      
                      {!showAddressForm && (
                        <div className="space-y-3">
                          <Select onValueChange={handleSelectSavedAddress} value={selectedAddressId || undefined}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a saved address" />
                            </SelectTrigger>
                            <SelectContent>
                              {user.savedAddresses.map((address) => (
                                <SelectItem key={address._id} value={address._id || ''}>
                                  <div className="flex justify-between w-full">
                                    <span>{address.fullName}</span>
                                    {address.isDefault && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        Default
                                      </span>
                                    )}
                                    {address.label && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2 capitalize">
                                        {address.label}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {selectedAddressId && (
                            <div className="p-4 border rounded-lg bg-gray-50">
                              {user.savedAddresses
                                .filter(addr => addr._id === selectedAddressId)
                                .map(address => (
                                  <div key={address._id} className="text-sm">
                                    <p className="font-medium">{address.fullName}</p>
                                    <p>{address.addressLine1}</p>
                                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                                    <p>{address.city}, {address.state} {address.postalCode}</p>
                                    <p>{address.phone}</p>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Address Form */}
                  {(showAddressForm || !user || !user.savedAddresses || user.savedAddresses.length === 0) && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <Input
                            value={shippingAddress.fullName}
                            onChange={(e) => handleAddressChange('fullName', e.target.value)}
                            className={errors.fullName ? 'border-red-500' : ''}
                            placeholder="Enter your full name"
                          />
                          {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <Input
                            value={shippingAddress.phone}
                            onChange={(e) => handleAddressChange('phone', e.target.value)}
                            placeholder="10-digit mobile number"
                            className={errors.phone ? 'border-red-500' : ''}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <Input
                          value={shippingAddress.addressLine1}
                          onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                          placeholder="House/Building number, Street name"
                          className={errors.addressLine1 ? 'border-red-500' : ''}
                        />
                        {errors.addressLine1 && (
                          <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <Input
                          value={shippingAddress.addressLine2}
                          onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                          placeholder="Landmark, Area"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <Input
                            value={shippingAddress.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            className={errors.city ? 'border-red-500' : ''}
                          />
                          {errors.city && (
                            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <Input
                            value={shippingAddress.state}
                            onChange={(e) => handleAddressChange('state', e.target.value)}
                            className={errors.state ? 'border-red-500' : ''}
                          />
                          {errors.state && (
                            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <Input
                            value={shippingAddress.postalCode}
                            onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                            placeholder="6-digit PIN code"
                            className={errors.postalCode ? 'border-red-500' : ''}
                          />
                          {errors.postalCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country
                          </label>
                          <Input
                            value={shippingAddress.country}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                            disabled
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Label
                          </label>
                          <Select 
                            value={addressLabel} 
                            onValueChange={(value: string) => setAddressLabel(value as 'home' | 'work' | 'other')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select label" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="home">Home</SelectItem>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {user && user.savedAddresses && user.savedAddresses.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="saveAddress"
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSaveAddress();
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="saveAddress" className="text-sm font-medium text-gray-700">
                            Save this address for future orders
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Billing Address */}
                  <Separator />

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => {
                          setSameAsShipping(e.target.checked);
                          if (e.target.checked) {
                            setBillingAddress(shippingAddress);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Billing address same as shipping address
                      </span>
                    </label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <Input
                            value={billingAddress.fullName}
                            onChange={(e) => handleAddressChange('fullName', e.target.value, false)}
                            className={errors.billing_fullName ? 'border-red-500' : ''}
                            placeholder="Enter your full name"
                          />
                          {errors.billing_fullName && (
                            <p className="text-red-500 text-sm mt-1">{errors.billing_fullName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <Input
                            value={billingAddress.phone}
                            onChange={(e) => handleAddressChange('phone', e.target.value, false)}
                            placeholder="10-digit mobile number"
                            className={errors.billing_phone ? 'border-red-500' : ''}
                          />
                          {errors.billing_phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.billing_phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 1 *
                        </label>
                        <Input
                          value={billingAddress.addressLine1}
                          onChange={(e) => handleAddressChange('addressLine1', e.target.value, false)}
                          placeholder="House/Building number, Street name"
                          className={errors.billing_addressLine1 ? 'border-red-500' : ''}
                        />
                        {errors.billing_addressLine1 && (
                          <p className="text-red-500 text-sm mt-1">{errors.billing_addressLine1}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Line 2
                        </label>
                        <Input
                          value={billingAddress.addressLine2}
                          onChange={(e) => handleAddressChange('addressLine2', e.target.value, false)}
                          placeholder="Landmark, Area"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                          </label>
                          <Input
                            value={billingAddress.city}
                            onChange={(e) => handleAddressChange('city', e.target.value, false)}
                            className={errors.billing_city ? 'border-red-500' : ''}
                          />
                          {errors.billing_city && (
                            <p className="text-red-500 text-sm mt-1">{errors.billing_city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                          </label>
                          <Input
                            value={billingAddress.state}
                            onChange={(e) => handleAddressChange('state', e.target.value, false)}
                            className={errors.billing_state ? 'border-red-500' : ''}
                          />
                          {errors.billing_state && (
                            <p className="text-red-500 text-sm mt-1">{errors.billing_state}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Postal Code *
                          </label>
                          <Input
                            value={billingAddress.postalCode}
                            onChange={(e) => handleAddressChange('postalCode', e.target.value, false)}
                            placeholder="6-digit PIN code"
                            className={errors.billing_postalCode ? 'border-red-500' : ''}
                          />
                          {errors.billing_postalCode && (
                            <p className="text-red-500 text-sm mt-1">{errors.billing_postalCode}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <Input
                          value={billingAddress.country}
                          onChange={(e) => handleAddressChange('country', e.target.value, false)}
                          disabled
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleNextStep} size="lg">
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI', icon: Smartphone },
                      { id: 'netbanking', label: 'Net Banking', icon: Building },
                      { id: 'wallet', label: 'Digital Wallet', icon: Wallet },
                      { id: 'cod', label: 'Cash on Delivery', icon: Truck }
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <method.icon className="w-5 h-5 mr-3 text-gray-600" />
                        <span className="font-medium">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                        <div>
                          <p className="text-sm text-yellow-800">
                            Cash on Delivery charges may apply for orders below ₹500.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions for delivery..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back to Shipping
                    </Button>
                    <Button onClick={handleNextStep} size="lg">
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Order</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                      {errors.general}
                    </div>
                  )}

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item._id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
                          <img
                            src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            {item.selectedVariants && item.selectedVariants.length > 0 && (
                              <div className="mt-1">
                                {item.selectedVariants.map((variant, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                                    {variant.variantName}: {variant.selectedOption}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="font-medium">{formatPrice(item.priceAtTime * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-700">
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-700 capitalize">
                      {paymentMethod.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back to Payment
                    </Button>
                    <Button 
                      onClick={handlePlaceOrder} 
                      disabled={loading}
                      size="lg"
                      className="min-w-[120px]"
                    >
                      {loading ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Estimated delivery: 5-7 days
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Secure checkout
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}