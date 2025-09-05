'use client';

import React from 'react';

interface CouponFormProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  handleApplyCoupon: (e: React.FormEvent) => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ couponCode, setCouponCode, handleApplyCoupon }) => {
  return (
    <form onSubmit={handleApplyCoupon} className="flex space-x-2">
      <input
        type="text"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        placeholder="Discount code"
        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Apply
      </button>
    </form>
  );
};

export default CouponForm;