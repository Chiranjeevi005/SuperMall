'use client';

import React, { useState, useEffect } from 'react';
import FeaturedVendorCard from '@/components/FeaturedVendorCard';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import HeroSection from '@/components/HeroSection';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  features?: {
    name: string;
    value: string;
  }[];
}

interface Category {
  id: string;
  name: string;
  productCount: number;
  icon: string;
  image?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch products and filter for the specific ones we want to feature
        const response = await fetch('/api/products?limit=50');
        const data = await response.json();
        
        if (response.ok && data.products) {
          // Filter for the specific products: Fresh Milk, Hand-Carved Wooden Bowl, Fresh Fruit Juice
          const featuredProductNames = ['Farm Fresh Milk', 'Hand-Carved Wooden Bowl', 'Fresh Fruit Juice'];
          const featuredProducts = data.products.filter((product: Product) => 
            featuredProductNames.includes(product.name)
          );
          
          // If we found all three featured products, use them
          // Otherwise, fallback to the first 3 products
          if (featuredProducts.length === 3) {
            setProducts(featuredProducts);
          } else {
            // Try to find products with similar names if exact match fails
            const alternativeProducts = data.products.filter((product: Product) => 
              product.name.includes('Milk') || 
              product.name.includes('Wooden Bowl') || 
              product.name.includes('Fruit Juice')
            );
            
            if (alternativeProducts.length >= 3) {
              setProducts(alternativeProducts.slice(0, 3));
            } else {
              // Final fallback to first 3 products
              setProducts(data.products.slice(0, 3));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback to mock data if API fails
        setProducts([
          {
            _id: '1',
            name: 'Organic Honey',
            description: 'Pure, raw honey from local bees',
            price: 12.99,
            category: 'Food',
            images: [],
            stock: 50
          },
          {
            _id: '2',
            name: 'Handwoven Basket',
            description: 'Beautiful basket handwoven by local artisans',
            price: 24.99,
            category: 'Crafts',
            images: [],
            stock: 25
          },
          {
            _id: '3',
            name: 'Fresh Eggs',
            description: 'Free-range eggs from happy chickens',
            price: 5.99,
            category: 'Food',
            images: [],
            stock: 100
          }
        ]);
      }
    };

    // Fetch categories with actual product counts
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (response.ok && data.categories) {
          // Map _id to id and take only first 8 categories for the landing page
          const categoriesWithIds = data.categories
            .slice(0, 8)
            .map((category: any) => ({
              id: category._id,
              name: category.name,
              productCount: category.productCount,
              icon: category.icon,
              image: category.image
            }));
          
          setCategories(categoriesWithIds);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data if API fails with new images
        const mockCategories = [
          {
            id: '1',
            name: 'Fresh Produce',
            productCount: 86,
            icon: 'farm',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919624/Fresh-Produce_pmhf74.jpg'
          },
          {
            id: '2',
            name: 'Handicrafts & Artisans',
            productCount: 142,
            icon: 'crafts',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919625/Handicrafts-_-Artisans_wbxyaf.jpg'
          },
          {
            id: '3',
            name: 'Clothing & Apparel',
            productCount: 67,
            icon: 'fashion',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919623/Clothing-_-Apparel_gbab2k.jpg'
          },
          {
            id: '4',
            name: 'Home & Living',
            productCount: 54,
            icon: 'home',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919624/Home-_-Living_yd0zdn.jpg'
          },
          {
            id: '5',
            name: 'Dairy & Poultry',
            productCount: 32,
            icon: 'food',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919624/Dairy-_-Poultry_mtp6c2.jpg'
          },
          {
            id: '6',
            name: 'Spices & Condiments',
            productCount: 28,
            icon: 'food',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919625/Spices-_-Condiments_pxvyjr.jpg'
          },
          {
            id: '7',
            name: 'Food & Beverages',
            productCount: 45,
            icon: 'food',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919623/Food-_-Beverages_negd83.jpg'
          },
          {
            id: '8',
            name: 'Tools & Equipment',
            productCount: 38,
            icon: 'tools',
            image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919625/Tools-_-Equipment_am0qav.jpg'
          },
        ];
        setCategories(mockCategories);
      }
    };

    // Fetch all data
    const fetchData = async () => {
      await Promise.all([
        fetchFeaturedProducts(),
        fetchCategories()
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
            <Link href="/categories" className="text-amber-700 hover:text-green-700 transition-colors duration-300 font-bold text-lg">
              View all categories
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/products" className="text-amber-700 hover:text-green-700 transition-colors duration-300 font-bold text-lg">
              View all products
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* Voices of the Village - Storytelling Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-50 via-green-50 to-amber-50 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative border border-amber-100">
            {/* Subtle rural texture background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Voices of the Village</h2>
              <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-700">
                Stories of farmers, artisans, and customers whose lives are connected through SuperMall.
              </p>
              
              {/* Story Cards Carousel */}
              <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-lg border border-amber-100">
                <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                  {/* Story 1 - Artisan */}
                  <div className="flex-shrink-0 w-80">
                    <div className="bg-gradient-to-br from-amber-50 to-green-50 rounded-2xl p-6 h-full border border-amber-100 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img 
                            src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953120/Wooden_Bowl_vgre4x.jpg" 
                            alt="Ramesh, Artisan" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-gray-900">Ramesh</h3>
                          <p className="text-amber-700 text-sm">Artisan</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">
                        "I used to sell my handmade baskets only in the weekly haat. Now, through SuperMall, my craft reaches cities across India."
                      </p>
                    </div>
                  </div>
                  
                  {/* Story 2 - Customer */}
                  <div className="flex-shrink-0 w-80">
                    <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-6 h-full border border-amber-100 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img 
                            src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954850/Farm_Eggs_hdl6ds.jpg" 
                            alt="Anjali, Customer" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-gray-900">Anjali</h3>
                          <p className="text-amber-700 text-sm">Customer</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">
                        "Buying directly from farmers makes me feel connected to my roots and ensures they get fair income."
                      </p>
                    </div>
                  </div>
                  
                  {/* Story 3 - Farmer */}
                  <div className="flex-shrink-0 w-80">
                    <div className="bg-gradient-to-br from-amber-50 to-green-50 rounded-2xl p-6 h-full border border-amber-100 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img 
                            src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954589/Tomato_jhs4ox.jpg" 
                            alt="Sunita, Farmer" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-gray-900">Sunita</h3>
                          <p className="text-amber-700 text-sm">Farmer</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">
                        "SuperMall helped me sell fresh vegetables beyond my village. Now I earn enough to send my daughter to school."
                      </p>
                    </div>
                  </div>
                  
                  {/* Story 4 - Artisan */}
                  <div className="flex-shrink-0 w-80">
                    <div className="bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl p-6 h-full border border-amber-100 shadow-sm">
                      <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                          <img 
                            src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953899/Woolen_Shawl_ybgjri.jpg" 
                            alt="Priya, Artisan" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-bold text-gray-900">Priya</h3>
                          <p className="text-amber-700 text-sm">Artisan</p>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">
                        "My handwoven shawls now reach customers in metros. SuperMall has transformed my small weaving business."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Rural Marketplace Stats Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-amber-50 via-green-50 to-amber-50 rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative border border-amber-100">
            {/* Subtle rural texture background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Connecting Villages to Global Consumers</h2>
              <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-700">
                Empowering rural artisans and farmers by bringing authentic products to urban markets
              </p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-amber-100 rounded-full mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">120+</div>
                  <div className="text-lg font-medium text-amber-700">Vendors</div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-green-100 rounded-full mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                  <div className="text-lg font-medium text-amber-700">Authentic Products</div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-amber-100 rounded-full mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
                  <div className="text-lg font-medium text-amber-700">Happy Customers</div>
                </div>
              </div>
              
              {/* Product Thumbnails Carousel */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Discover Our Authentic Products</h3>
                <div className="overflow-hidden rounded-2xl bg-white p-4 shadow-lg border border-amber-100">
                  <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
                    {/* Product thumbnails with titles */}
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954589/Tomato_jhs4ox.jpg" 
                          alt="Organic Tomatoes" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Organic Tomatoes</div>
                    </div>
                    
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953120/Wooden_Bowl_vgre4x.jpg" 
                          alt="Hand-Carved Wooden Bowl" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Wooden Bowl</div>
                    </div>
                    
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953899/Handloom-Silk-Saree_ht0ync.jpg" 
                          alt="Traditional Silk Saree" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Silk Saree</div>
                    </div>
                    
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954795/Bamboo_Chair_fi6ikt.jpg" 
                          alt="Bamboo Chair" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Bamboo Chair</div>
                    </div>
                    
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954850/Farm_Milk_ocfuly.jpg" 
                          alt="Farm Fresh Milk" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Farm Milk</div>
                    </div>
                    
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955013/Turnemic_Powder_hamhyk.jpg" 
                          alt="Organic Turmeric" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Turmeric</div>
                    </div>
                    
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955068/Jaggery_Blocks_yakpys.jpg" 
                          alt="Organic Jaggery" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Jaggery</div>
                    </div>
                    
                    <div className="flex-shrink-0 w-32">
                      <div className="rounded-xl overflow-hidden border border-amber-200 h-32">
                        <img 
                          src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955131/Sickel_o9rvhm.jpg" 
                          alt="Farmers Sickle" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm font-medium text-gray-900 text-center truncate">Farmers Sickle</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-8 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                >
                  Join as Vendor
                </Link>
                <Link 
                  href="/products" 
                  className="bg-white text-amber-700 font-bold py-4 px-8 rounded-lg border-2 border-amber-600 hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}