'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth, Address } from '@/contexts/AuthContext';
import { 
  MapPin,
  User,
  Phone,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label: 'home' | 'work' | 'other';
  isDefault: boolean;
}

export default function AddressManagementPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressForm>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    label: 'home',
    isDefault: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(false);

  const { user, isAuthenticated, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user && user.savedAddresses) {
      setAddresses(user.savedAddresses);
    }
  }, [isAuthenticated, user]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (formData.fullName.trim().length < 2) newErrors.fullName = 'Full name must be at least 2 characters';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
    if (formData.addressLine1.trim().length < 5) newErrors.addressLine1 = 'Address must be at least 5 characters';
    
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (formData.city.trim().length < 2) newErrors.city = 'City must be at least 2 characters';
    
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (formData.state.trim().length < 2) newErrors.state = 'State must be at least 2 characters';
    
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Please enter a valid 6-digit postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AddressForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      
      if (editingId) {
        // Update existing address
        result = await updateAddress(editingId, formData);
      } else {
        // Add new address
        result = await addAddress(formData);
      }

      if (result.success) {
        // Reset form
        setFormData({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'India',
          label: 'home',
          isDefault: false
        });
        setEditingId(null);
        setErrors({});
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Failed to save address. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      label: address.label || 'home',
      isDefault: address.isDefault || false
    });
    setEditingId(address._id || null);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    
    try {
      const result = await deleteAddress(addressId);
      if (!result.success) {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Failed to delete address. Please try again.' });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const result = await setDefaultAddress(addressId);
      if (!result.success) {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Failed to set default address. Please try again.' });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      label: 'home',
      isDefault: false
    });
    setEditingId(null);
    setErrors({});
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>
              <p className="text-gray-600 mt-2">Manage your shipping addresses</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/profile')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{errors.general}</p>
          </div>
        )}

        {/* Address Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {editingId ? 'Edit Address' : 'Add New Address'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
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
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
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
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange('addressLine1', e.target.value)}
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
                  value={formData.addressLine2}
                  onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                  placeholder="Landmark, Area"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
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
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
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
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
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
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Label
                  </label>
                  <Select 
                    value={formData.label} 
                    onValueChange={(value) => handleInputChange('label', value as 'home' | 'work' | 'other')}
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                  Set as default address
                </label>
              </div>

              <Separator />

              <div className="flex justify-end space-x-3">
                {editingId && (
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
                <Button onClick={handleSaveAddress} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {editingId ? 'Update Address' : 'Add Address'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Addresses List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Your Saved Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved addresses</h3>
                <p className="text-gray-600 mb-6">
                  Add your first address to make checkout faster
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address._id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{address.fullName}</h3>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                          {address.label && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                              {address.label}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.postalCode}</p>
                          <p>{address.phone}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {!address.isDefault && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSetDefault(address._id || '')}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteAddress(address._id || '')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}