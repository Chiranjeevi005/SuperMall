"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Sparkles, TrendingUp } from "lucide-react";
import { FadeIn, SlideIn, ScaleIn, StaggerContainer } from "@/components/animations";
import OptimizedImage from "@/components/ui/OptimizedImage";

const Featured = () => {
  const categories = [
    { 
      title: "Fresh Produce", 
      description: "Fruits, vegetables, grains, and farm-fresh items directly from local farmers",
      image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "🥕",
      itemCount: "2.5K+ items",
      trending: true
    },
    { 
      title: "Handicrafts & Artisans", 
      description: "Locally crafted products, handmade goods, traditional art from skilled artisans",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "🏺",
      itemCount: "1.8K+ items",
      trending: false
    },
    { 
      title: "Clothing & Apparel", 
      description: "Ethnic wear, casuals, and rural fashion collections with authentic designs",
      image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "👘",
      itemCount: "3.2K+ items",
      trending: true
    },
    { 
      title: "Home & Living", 
      description: "Furniture, kitchenware, décor, everyday essentials for comfortable living",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "🏠",
      itemCount: "1.5K+ items",
      trending: false
    },
    { 
      title: "Dairy & Poultry", 
      description: "Fresh milk, cheese, eggs, and related organic dairy products",
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "🥛",
      itemCount: "800+ items",
      trending: true
    },
    { 
      title: "Spices & Condiments", 
      description: "Locally sourced spices, herbs, pickles, and traditional flavor enhancers",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "🌶️",
      itemCount: "1.2K+ items",
      trending: false
    },
    { 
      title: "Food & Beverages", 
      description: "Packaged foods, snacks, traditional delicacies, and healthy drinks",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "🍯",
      itemCount: "2.1K+ items",
      trending: true
    },
    { 
      title: "Tools & Equipment", 
      description: "Farming tools, household utilities, and small-scale machinery for daily use",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", 
      icon: "🔧",
      itemCount: "900+ items",
      trending: false
    },
  ];

  return (
    <section 
      className="py-16 md:py-20 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden" 
      style={{
        backgroundColor: '#f8f9fa',
        minHeight: '800px'
      }}
    >
      {/* Enhanced background elements with better responsive sizing */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-56 h-56 md:w-80 md:h-80 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-3/4 left-1/3 w-48 h-48 md:w-60 md:h-60 bg-secondary/6 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 md:w-52 md:h-52 bg-primary/4 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}} />
      </div>
      
      {/* Enhanced grid pattern with responsive sizing */}
      <div className="absolute inset-0 opacity-[0.01] md:opacity-[0.015]">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.2'%3E%3Crect width='1' height='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }} />
      </div>
      
      <div className="container-fluid relative z-10">
        {/* Enhanced header with staggered animations */}
        <FadeIn direction="up" delay={0.2} className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 md:px-6 md:py-2 mb-6 backdrop-blur-sm shadow-lg"
          >
            <ShoppingBasket className="w-4 h-4 text-primary mr-2 animate-pulse" />
            <span className="text-primary font-semibold text-sm md:text-base">Marketplace Categories</span>
          </motion.div>
          
          <SlideIn direction="up" delay={0.4}>
            <h2 className="responsive-title font-bold mb-4 md:mb-6 hero-title text-foreground">
              Discover <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Authentic</span>
              <br className="hidden sm:block" />Products by Category
            </h2>
          </SlideIn>
          
          <FadeIn direction="up" delay={0.6}>
            <p className="responsive-text text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
              From farm-fresh produce to handcrafted artisan goods, explore our carefully 
              curated categories featuring authentic rural products that tell stories of 
              tradition, quality, and sustainable practices.
            </p>
          </FadeIn>
          
          <ScaleIn delay={0.8} type="bounce">
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mt-6 md:mt-8"></div>
          </ScaleIn>
        </FadeIn>

        {/* Enhanced category grid with staggered animations */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 min-h-[500px]"
          staggerDelay={0.1}
        >
          {categories && categories.length > 0 ? categories.map((category, index) => {
            const categoryUrl = `/products?category=${encodeURIComponent(category.title)}`;
            
            return (
              <FadeIn key={index} direction="up" delay={index * 0.1} className="h-full">
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group h-full"
                >
                  <Link 
                    href={categoryUrl}
                    className="block relative rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl cursor-pointer bg-white border border-border/50 h-full"
                    style={{
                      minHeight: '400px',
                      height: '450px'
                    }}
                  >
                    {/* Enhanced gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-accent/20 group-hover:from-primary/20 group-hover:to-accent/30 transition-all duration-700 z-10" />

                    {/* Optimized image with enhanced styling */}
                    <OptimizedImage
                      src={category.image}
                      alt={`Shop ${category.title}`}
                      width={400}
                      height={450}
                      className="absolute inset-0 w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      objectFit="cover"
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      fallbackSrc="/images/placeholder.jpg"
                    />

                    {/* Trending badge with animation */}
                    {category.trending && (
                      <ScaleIn delay={0.5 + index * 0.1} className="absolute top-4 right-4 z-30">
                        <div className="flex items-center space-x-1 bg-destructive/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-white/20">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span>Trending</span>
                        </div>
                      </ScaleIn>
                    )}

                    {/* Enhanced content with better positioning */}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 z-30">
                      <div className="space-y-3 md:space-y-4">
                        <SlideIn direction="up" delay={0.3 + index * 0.1}>
                          <div className="flex items-center space-x-3 md:space-x-4">
                            <ScaleIn delay={0.4 + index * 0.1} type="bounce">
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center text-xl md:text-2xl shadow-2xl border-2 border-white/50 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                                {category.icon}
                              </div>
                            </ScaleIn>
                            <div>
                              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white hero-title leading-tight">
                                {category.title}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-white/80 text-xs md:text-sm font-medium">
                                  {category.itemCount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </SlideIn>

                        <FadeIn direction="up" delay={0.6 + index * 0.1}>
                          <p className="text-white/90 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-150">
                          </p>
                        </FadeIn>

                        <FadeIn direction="up" delay={0.8 + index * 0.1}>
                          <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                            <Button 
                              className="bg-white/90 hover:bg-white text-foreground border-0 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm"
                              asChild
                            >
                              <span className="flex items-center">
                                Shop Now 
                                <ShoppingBasket className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
                              </span>
                            </Button>
                          </div>
                        </FadeIn>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </FadeIn>
            );
          }) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No categories available</p>
            </div>
          )}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Featured;
