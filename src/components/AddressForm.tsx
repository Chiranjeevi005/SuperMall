'use client';

import React from 'react';

interface AddressFormProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  setAddress: (address: any) => void;
  onNext: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, setAddress, onNext }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Street address
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="street"
              id="street"
              value={address.street}
              onChange={handleChange}
              required
              placeholder="1234 Main Street"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-3 px-4 border"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="city"
              id="city"
              value={address.city}
              onChange={handleChange}
              required
              placeholder="Bengaluru"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-3 px-4 border"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State / Province
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="state"
              id="state"
              value={address.state}
              onChange={handleChange}
              required
              placeholder="Karnataka"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-3 px-4 border"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            ZIP / Postal code
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              required
              placeholder="560001"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-3 px-4 border"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <div className="mt-1">
            <select
              id="country"
              name="country"
              value={address.country}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm py-3 px-4 border"
            >
              <option value="">Select a country</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Continue to Shipping
        </button>
      </div>
    </form>
  );
};

export default AddressForm;