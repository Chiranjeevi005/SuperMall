'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User,
  Mail,
  MapPin,
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Camera,
  X
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileData {
  name: string;
  email: string;
  address: string;
  avatar?: string | null;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    address: '',
    avatar: null,
  });
  
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isAuthenticated, updateProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        address: user.address || '',
        avatar: user.avatar || null,
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [isAuthenticated, user]);

  const validateProfile = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!profileData.name.trim() || profileData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters long';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors({ avatar: 'Please select a valid image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ avatar: 'Image size must be less than 5MB' });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Clear any previous avatar errors
    if (errors.avatar) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.avatar;
        return newErrors;
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfile()) return;

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      // Handle avatar upload if a new avatar is selected
      let avatarData = profileData.avatar;
      
      // If there's a new avatar file selected, convert it to base64
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        avatarData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
      
      const result = await updateProfile({
        name: profileData.name,
        address: profileData.address,
        avatar: avatarData
      });
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        // Reset file input after successful upload
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setLoading(true);
    setErrors({});
    setSuccess('');

    try {
      // Make direct API call for password update
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setSuccess('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setErrors({ general: data.message || 'Failed to update password' });
      }
    } catch (error: any) {
      console.error('Password update error:', error as Error);
      setErrors({ general: 'Failed to update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    if (success) setSuccess('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    setProfileData(prev => ({ ...prev, avatar: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasswordChange = (field: keyof PasswordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    if (success) setSuccess('');
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <p className="ml-3 text-green-700">{success}</p>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-red-700">{errors.general}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="addresses">Saved Addresses</TabsTrigger>
            <TabsTrigger value="security">Security Settings</TabsTrigger>
          </TabsList>

          {/* Profile Information Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        {avatarPreview ? (
                          <AvatarImage src={avatarPreview} alt="Profile" />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold text-2xl">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-md hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-2 -right-2 bg-destructive rounded-full p-1 shadow-md hover:bg-destructive/90 transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-sm text-gray-600 mt-2">Click the camera icon to upload a profile photo</p>
                    {errors.avatar && (
                      <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          className={`pl-10 ${errors.name ? 'border-red-500' : ''}`}
                          placeholder="Enter your full name"
                        />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="Enter your email address"
                          disabled // Email should not be editable
                        />
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        className="pl-10"
                        placeholder="Enter your address"
                      />
                      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Account Role</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {user?.role?.replace('_', ' ')} Account
                      </p>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Saved Addresses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Your Addresses</h3>
                  <p className="text-gray-600 mb-6">
                    View and manage all your saved shipping addresses
                  </p>
                  <Button onClick={() => router.push('/profile/addresses')}>
                    Manage Addresses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className={`pl-10 pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
                        placeholder="Enter your current password"
                      />
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPasswords(prev => ({
                          ...prev,
                          current: !prev.current
                        }))}
                      >
                        {showPasswords.current ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className={`pl-10 pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
                          placeholder="Enter new password"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPasswords(prev => ({
                            ...prev,
                            new: !prev.new
                          }))}
                        >
                          {showPasswords.new ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                          placeholder="Confirm new password"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPasswords(prev => ({
                            ...prev,
                            confirm: !prev.confirm
                          }))}
                        >
                          {showPasswords.confirm ? <EyeOff /> : <Eye />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• At least 6 characters long</li>
                      <li>• Different from your current password</li>
                      <li>• Use a strong, unique password</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Account Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="font-medium text-gray-900">Account Created</label>
                <p className="text-gray-600 mt-1">
                  {user ? new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="font-medium text-gray-900">User ID</label>
                <p className="text-gray-600 mt-1 font-mono">{user?.id || 'N/A'}</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-900">Account Status</label>
                <p className="text-green-600 mt-1 font-medium">Active</p>
              </div>
              
              <div>
                <label className="font-medium text-gray-900">Email Verified</label>
                <p className="text-green-600 mt-1 font-medium">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}