"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Eye, Sparkles, TrendingUp } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn } from '@/components/animations';
import OptimizedImage from '@/components/ui/OptimizedImage';

const NewArrival = () => {
  const products = [
    {
      id: 1,
      name: "Fresh Mushrooms",
      category: "Agri Produce",
      price: "₹299",
      originalPrice: "₹399",
      discount: 25,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1578454163926-eac9db4b3db8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      isTrending: false,
      description: "Farm-fresh organic mushrooms, hand-picked daily"
    },
    {
      id: 2,
      name: "Modern Seed Drill",
      category: "Farm Equipment",
      price: "₹6,999",
      originalPrice: "₹8,999",
      discount: 22,
      rating: 4.6,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      isTrending: true,
      description: "High-precision seeding equipment for modern farming"
    },
    {
      id: 3,
      name: "Handwoven Cotton Shirt",
      category: "Clothing & Apparel",
      price: "₹899",
      originalPrice: "₹1,299",
      discount: 31,
      rating: 4.7,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      isTrending: false,
      description: "Traditional handwoven cotton shirt with natural dyes"
    },
    {
      id: 4,
      name: "Bamboo Kitchenware Set",
      category: "Home & Living",
      price: "₹999",
      originalPrice: "₹1,499",
      discount: 33,
      rating: 4.9,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      isTrending: true,
      description: "Eco-friendly bamboo kitchen essentials set"
    },
    {
      id: 5,
      name: "Organic Honey",
      category: "Agri Produce",
      price: "₹449",
      originalPrice: "₹599",
      discount: 25,
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1587049016823-c90bb44ad623?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      isTrending: false,
      description: "Pure raw honey from wildflower meadows"
    },
    {
      id: 6,
      name: "Handcrafted Pottery",
      category: "Handicrafts",
      price: "₹1,299",
      originalPrice: "₹1,799",
      discount: 28,
      rating: 4.5,
      reviews: 74,
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isNew: true,
      isTrending: true,
      description: "Artisan-crafted clay pottery for modern homes"
    },
  ];

  return (
    <section className='py-16 md:py-20 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden'>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-64 h-64 md:w-80 md:h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-0 w-56 h-56 md:w-72 md:h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>
      
      <div className='container-fluid relative z-10'>
        {/* Enhanced header with animations */}
        <FadeIn direction="up" delay={0.2} className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 md:px-6 md:py-2 mb-6 backdrop-blur-sm shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-accent mr-2 animate-pulse" />
            <span className="text-accent font-semibold text-sm md:text-base">Fresh Arrivals</span>
          </motion.div>
          
          <SlideIn direction="up" delay={0.4}>
            <h2 className='responsive-title font-bold mb-4 md:mb-6 hero-title text-foreground'>
              <span className="text-accent bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">New</span> Arrivals
              <br className="hidden sm:block" />Just For You
            </h2>
          </SlideIn>
          
          <FadeIn direction="up" delay={0.6}>
            <p className='responsive-text text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4'>
              Discover the latest additions to our rural marketplace. From farm-fresh produce 
              to handcrafted artisan goods, explore what's new and trending in authentic rural products.
            </p>
          </FadeIn>
          
          <ScaleIn delay={0.8} type="bounce">
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full mx-auto mt-6 md:mt-8"></div>
          </ScaleIn>
        </FadeIn>

        {/* Enhanced Swiper with better mobile responsiveness */}
        <FadeIn direction="up" delay={0.4}>
          <div className="relative">
            <Swiper 
              modules={[Pagination, Autoplay, Navigation, EffectCoverflow]} 
              slidesPerView={1}
              spaceBetween={20}
              centeredSlides={true}
              breakpoints={{
                480: { 
                  slidesPerView: 1.2,
                  spaceBetween: 24
                },
                640: { 
                  slidesPerView: 1.5,
                  spaceBetween: 30
                },
                768: { 
                  slidesPerView: 2.2,
                  spaceBetween: 30
                },
                1024: { 
                  slidesPerView: 3,
                  spaceBetween: 40
                },
                1280: { 
                  slidesPerView: 4,
                  spaceBetween: 40
                },
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                bulletClass: 'swiper-pagination-bullet !bg-primary',
                bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary'
              }}
              autoplay={{ 
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
              }}
              className='!pb-16 md:!pb-20 group'
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group/card h-full"
                  >
                    <Card className='h-full rural-marketplace-card overflow-hidden flex flex-col'>
                      <div className='relative overflow-hidden'>
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                          {product.isNew && (
                            <ScaleIn delay={0.3 + index * 0.1}>
                              <Badge className="bg-accent hover:bg-accent/90 text-white text-xs font-semibold shadow-lg border border-white/20">
                                <Sparkles className="w-3 h-3 mr-1" />
                                New
                              </Badge>
                            </ScaleIn>
                          )}
                          {product.isTrending && (
                            <ScaleIn delay={0.4 + index * 0.1}>
                              <Badge className="bg-destructive hover:bg-destructive/90 text-white text-xs font-semibold shadow-lg border border-white/20">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            </ScaleIn>
                          )}
                        </div>
                        
                        {/* Discount badge */}
                        {product.discount > 0 && (
                          <ScaleIn delay={0.5 + index * 0.1} className="absolute top-3 right-3 z-20">
                            <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold shadow-lg">
                              -{product.discount}%
                            </Badge>
                          </ScaleIn>
                        )}
                        
                        {/* Enhanced optimized image */}
                        <div className="relative aspect-[4/5] md:aspect-[3/4]">
                          <OptimizedImage
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={500}
                            className='absolute inset-0 w-full h-full transition-all duration-700 group-hover/card:scale-110'
                            objectFit="cover"
                            quality={85}
                            sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                            fallbackSrc="/images/placeholder.jpg"
                          />
                          
                          {/* Enhanced hover overlay */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex items-end justify-center pb-4'>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 md:p-3 bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="Add to wishlist"
                              >
                                <Heart className="w-4 h-4 md:w-5 md:h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 md:p-3 bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                                aria-label="Quick view"
                              >
                                <Eye className="w-4 h-4 md:w-5 md:h-5" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className='p-4 md:p-6 flex flex-col flex-grow'>
                        <SlideIn direction="up" delay={0.3 + index * 0.1}>
                          <div className='mb-3'>
                            <Badge variant="secondary" className='text-xs mb-2 font-medium'>
                              {product.category}
                            </Badge>
                            <h3 className='font-bold text-lg md:text-xl text-foreground mb-2 group-hover/card:text-primary transition-colors leading-tight'>
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {product.description}
                            </p>
                          </div>
                        </SlideIn>
                        
                        <FadeIn direction="up" delay={0.5 + index * 0.1}>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 md:w-4 md:h-4 ${
                                    i < Math.floor(product.rating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({product.reviews})</span>
                          </div>
                        </FadeIn>
                        
                        <ScaleIn delay={0.7 + index * 0.1} className="mt-auto">
                          <div className='flex items-center gap-2 mb-4'>
                            <p className='text-xl md:text-2xl font-bold text-foreground'>{product.price}</p>
                            {product.originalPrice && (
                              <p className='text-sm text-muted-foreground line-through'>{product.originalPrice}</p>
                            )}
                          </div>
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button className='w-full rural-button group/btn bg-accent hover:bg-accent/90 text-white font-semibold py-3 md:py-4 shadow-lg hover:shadow-xl transition-all duration-300'>
                              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover/btn:animate-bounce" />
                              <span className="text-sm md:text-base">Add to Cart</span>
                            </Button>
                          </motion.div>
                        </ScaleIn>
                      </CardContent>
                    </Card>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom navigation arrows with better mobile handling */}
            <div className="hidden md:block">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="swiper-button-prev !w-12 !h-12 !bg-primary/90 backdrop-blur-sm !text-white rounded-full shadow-lg !mt-0 !top-1/2 !-translate-y-1/2 !left-4 border border-white/20 after:!text-lg after:!font-bold"
              />
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="swiper-button-next !w-12 !h-12 !bg-primary/90 backdrop-blur-sm !text-white rounded-full shadow-lg !mt-0 !top-1/2 !-translate-y-1/2 !right-4 border border-white/20 after:!text-lg after:!font-bold"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
    )
}

export default NewArrival;