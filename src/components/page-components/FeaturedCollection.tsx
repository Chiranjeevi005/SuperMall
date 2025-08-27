import { Button } from '@/components/ui/button'
import React from 'react'

const FeaturedCollection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center container mx-auto px-6">
        
        {/* Left Content */}
        <div>
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium mb-4">
            Featured Collection
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Summer Essentials
          </h2>
          <p className="text-gray-600">
            Discover the curated collection of summer must-haves.
          </p>
          <ul className="space-y-3 mt-4">
            {["Exclusive Designs", "Fast Shipping", "30-day Returns"].map((feature, index) => (
              <li key={index} className="flex items-center">
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="!rounded-button whitespace-nowrap bg-gradient-to-r from-indigo-500 to-purple-600 text-white mt-6 hover:from-indigo-600 hover:to-purple-700 px-8 py-6 text-lg">
            Shop Collections
          </Button>
        </div>

        {/* Right Image */}
        <div className="relative flex justify-end">
          <img
            src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1755536551/Gemini_Generated_Image_ef217eef217eef21_dw71js.png"
            alt="Summer Collection"
            className="rounded-lg shadow-xl object-cover"
          />
          <div className="absolute -bottom-6 right-0 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-100 rounded-full p-2"></div>
              <h4 className="font-bold">Free Shipping</h4>
            </div>
            <p className="text-gray-600 text-sm">
              On all orders over ₹399. International shipping available.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollection
