'use client';

import React from 'react';
import Link from 'next/link';

interface Offer {
  _id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  shop: {
    name: string;
  };
}

const OfferCard = ({ offer }: { offer: Offer }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDiscountText = () => {
    if (offer.discountType === 'percentage') {
      return `${offer.discountValue}% off`;
    } else {
      return `$${offer.discountValue} off`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{offer.title}</h3>
            <p className="mt-1 text-sm text-gray-500">at {offer.shop.name}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {getDiscountText()}
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-500 line-clamp-2">
          {offer.description}
        </p>
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>Start: {formatDate(offer.startDate)}</span>
          <span>End: {formatDate(offer.endDate)}</span>
        </div>
        <div className="mt-6">
          <Link
            href={`/offers/${offer._id}`}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            View Offer Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;