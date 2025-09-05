'use client';

import React, { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'SuperMall',
    siteDescription: 'Connecting rural artisans with urban consumers',
    contactEmail: 'admin@supermall.com',
    contactPhone: '+91 98765 43210',
  });

  const [commissionSettings, setCommissionSettings] = useState({
    vendorCommission: 10,
    referralBonus: 5,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    orderUpdates: true,
    vendorApprovals: true,
  });

  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };

  const handleCommissionSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommissionSettings({
      ...commissionSettings,
      [name]: parseFloat(value)
    });
  };

  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleSaveGeneralSettings = () => {
    // In a real application, you would make an API call to save the settings
    console.log('Saving general settings:', generalSettings);
    alert('General settings saved successfully!');
  };

  const handleSaveCommissionSettings = () => {
    // In a real application, you would make an API call to save the settings
    console.log('Saving commission settings:', commissionSettings);
    alert('Commission settings saved successfully!');
  };

  const handleSaveNotificationSettings = () => {
    // In a real application, you would make an API call to save the settings
    console.log('Saving notification settings:', notificationSettings);
    alert('Notification settings saved successfully!');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your application settings</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`${
              activeTab === 'general'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`${
              activeTab === 'commission'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Commission
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`${
              activeTab === 'notifications'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Notifications
          </button>
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={generalSettings.siteName}
                onChange={handleGeneralSettingsChange}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                rows={3}
                value={generalSettings.siteDescription}
                onChange={handleGeneralSettingsChange}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              ></textarea>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={generalSettings.contactEmail}
                onChange={handleGeneralSettingsChange}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={generalSettings.contactPhone}
                onChange={handleGeneralSettingsChange}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveGeneralSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Settings */}
      {activeTab === 'commission' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Commission Settings</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="vendorCommission" className="block text-sm font-medium text-gray-700">
                Vendor Commission (%)
              </label>
              <input
                type="number"
                id="vendorCommission"
                name="vendorCommission"
                min="0"
                max="100"
                step="0.1"
                value={commissionSettings.vendorCommission}
                onChange={handleCommissionSettingsChange}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">
                Percentage of sales that vendors will pay as commission
              </p>
            </div>

            <div>
              <label htmlFor="referralBonus" className="block text-sm font-medium text-gray-700">
                Referral Bonus (%)
              </label>
              <input
                type="number"
                id="referralBonus"
                name="referralBonus"
                min="0"
                max="100"
                step="0.1"
                value={commissionSettings.referralBonus}
                onChange={handleCommissionSettingsChange}
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-sm text-gray-500">
                Bonus percentage for customer referrals
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveCommissionSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-900">
                  Email Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Send email notifications for important events
                </p>
              </div>
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationSettingsChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="smsNotifications" className="text-sm font-medium text-gray-900">
                  SMS Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Send SMS notifications for important events
                </p>
              </div>
              <input
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onChange={handleNotificationSettingsChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="orderUpdates" className="text-sm font-medium text-gray-900">
                  Order Updates
                </label>
                <p className="text-sm text-gray-500">
                  Notify customers about order status changes
                </p>
              </div>
              <input
                type="checkbox"
                id="orderUpdates"
                name="orderUpdates"
                checked={notificationSettings.orderUpdates}
                onChange={handleNotificationSettingsChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="vendorApprovals" className="text-sm font-medium text-gray-900">
                  Vendor Approvals
                </label>
                <p className="text-sm text-gray-500">
                  Notify admins when new vendors request approval
                </p>
              </div>
              <input
                type="checkbox"
                id="vendorApprovals"
                name="vendorApprovals"
                checked={notificationSettings.vendorApprovals}
                onChange={handleNotificationSettingsChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotificationSettings}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}