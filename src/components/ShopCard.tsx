'use client';

import React from 'react';
import Link from 'next/link';

interface Shop {
  _id: string;
  name: string;
  description: string;
  location: {
    floor: number;
    section: string;
  };
  categories: string[];
}

const ShopCard = ({ shop }: { shop: Shop }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{shop.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              Floor {shop.location.floor}, Section {shop.location.section}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500 line-clamp-2">
          {shop.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {shop.categories.map((category, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {category}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href={`/shops/${shop._id}`}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            View Shop Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;