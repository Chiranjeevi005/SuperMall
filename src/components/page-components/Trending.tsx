"use client";

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Flame, ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { FadeIn, SlideIn, ScaleIn, StaggerContainer } from '@/components/animations';
import OptimizedImage from '@/components/ui/OptimizedImage';

const Trending = () => {
  const products = [
    {
      id: 1,
      name: "Organic Jaggery",
      category: "Agri Produce",
      price: "₹299",
      originalPrice: "₹399",
      discount: 25,
      rating: 4.8,
      reviews: 245,
      image: "https://images.unsplash.com/photo-1587049016823-c90bb44ad623?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      trending: true,
      featured: false,
      soldCount: "2.5K+",
      description: "Pure organic jaggery from traditional farms"
    },
    {
      id: 2,
      name: "Handcrafted Basket",
      category: "Handicrafts",
      price: "₹1,499",
      originalPrice: "₹1,999",
      discount: 25,
      rating: 4.6,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      trending: true,
      featured: true,
      soldCount: "1.2K+",
      description: "Traditional bamboo basket crafted by artisans"
    },
    {
      id: 3,
      name: "Farm Tools Kit",
      category: "Farm Equipment",
      price: "₹4,999",
      originalPrice: "₹6,499",
      discount: 23,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      trending: true,
      featured: false,
      soldCount: "800+",
      description: "Complete set of essential farming tools"
    },
    {
      id: 4,
      name: "Fresh Turmeric",
      category: "Agri Produce",
      price: "₹149",
      originalPrice: "₹199",
      discount: 25,
      rating: 4.9,
      reviews: 324,
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      trending: true,
      featured: true,
      soldCount: "3.1K+",
      description: "Fresh organic turmeric from Kerala farms"
    },
    {
      id: 5,
      name: "Pottery Set",
      category: "Handicrafts",
      price: "₹899",
      originalPrice: "₹1,299",
      discount: 31,
      rating: 4.5,
      reviews: 98,
      image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      trending: true,
      featured: false,
      soldCount: "650+",
      description: "Handmade clay pottery for kitchen use"
    },
    {
      id: 6,
      name: "Irrigation Kit",
      category: "Farm Equipment",
      price: "₹2,999",
      originalPrice: "₹3,999",
      discount: 25,
      rating: 4.4,
      reviews: 87,
      image: "https://images.unsplash.com/photo-1530841344095-8a84d3fbfe3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      trending: true,
      featured: false,
      soldCount: "420+",
      description: "Modern drip irrigation system for farms"
    },
  ];

  const categories = [
    { value: 'all', label: 'All Products', icon: '🔥' },
    { value: 'Agri & Produce', label: 'Agri & Produce', icon: '🌾' },
    { value: 'Handicrafts & Artisan', label: 'Handicrafts & Artisan', icon: '🏺' },
    { value: 'Farm Equipments', label: 'Farm Equipment', icon: '🔧' },
  ];

  const filteredProducts = (category: string) => {
    if (category === 'all') return products;
    return products.filter(product => 
      product.category.toLowerCase().includes(category.toLowerCase().replace('s', '').replace('& ', ''))
    );
  };

  return (
    <section className='py-16 md:py-20 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden'>
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-64 h-64 md:w-80 md:h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-0 w-56 h-56 md:w-72 md:h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-3/4 left-1/4 w-48 h-48 md:w-60 md:h-60 bg-destructive/3 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>
      
      <div className='container-fluid relative z-10'>
        {/* Enhanced header with animations */}
        <FadeIn direction="up" delay={0.2} className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center bg-destructive/10 border border-destructive/20 rounded-full px-4 py-2 md:px-6 md:py-2 mb-6 backdrop-blur-sm shadow-lg"
          >
            <TrendingUp className="w-4 h-4 text-destructive mr-2 animate-pulse" />
            <span className="text-destructive font-semibold text-sm md:text-base">Hot Trending</span>
          </motion.div>
          
          <SlideIn direction="up" delay={0.4}>
            <h2 className='responsive-title font-bold mb-4 md:mb-6 hero-title text-foreground'>
              <span className="text-destructive bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">Trending</span> Products
              <br className="hidden sm:block" />Right Now
            </h2>
          </SlideIn>
          
          <FadeIn direction="up" delay={0.6}>
            <p className='responsive-text text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4'>
              Discover the most popular products and categories that are making waves in our rural marketplace. 
              From farm-fresh produce to artisan crafts, these trending items are loved by our community.
            </p>
          </FadeIn>
          
          <ScaleIn delay={0.8} type="bounce">
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-destructive to-accent rounded-full mx-auto mt-6 md:mt-8"></div>
          </ScaleIn>
        </FadeIn>

        <FadeIn direction="up" delay={0.4}>
          <Tabs defaultValue='all' className='w-full'>
            <div className='flex justify-center mb-8 md:mb-12'>
              <SlideIn direction="up" delay={0.6}>
                <TabsList className='bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl p-1'>
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <TabsTrigger 
                        value={category.value} 
                        className='rural-button !rounded-xl whitespace-nowrap px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300'
                      >
                        <span className="mr-2 text-base">{category.icon}</span>
                        <span className="font-medium">{category.label}</span>
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </SlideIn>
            </div>

            {categories.map((category) => (
              <TabsContent key={category.value} value={category.value} className='mt-0'>
                <StaggerContainer
                  className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'
                  staggerDelay={0.1}
                >
                  {filteredProducts(category.value).map((product, index) => (
                    <FadeIn key={product.id} direction="up" delay={index * 0.1} className="h-full">
                      <motion.div
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group h-full"
                      >
                        <Card className='overflow-hidden rural-marketplace-card h-full flex flex-col'>
                          <div className='relative pt-[75%] overflow-hidden'>
                            {/* Trending badge */}
                            <ScaleIn delay={0.5 + index * 0.1} className="absolute top-3 left-3 z-30">
                              <div className="flex items-center space-x-1 bg-destructive/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg border border-white/20">
                                <Flame className="w-3 h-3" />
                                <span>Hot</span>
                              </div>
                            </ScaleIn>
                            
                            {/* Discount badge */}
                            {product.discount > 0 && (
                              <ScaleIn delay={0.6 + index * 0.1} className="absolute top-3 right-3 z-30">
                                <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold shadow-lg">
                                  -{product.discount}%
                                </Badge>
                              </ScaleIn>
                            )}
                            
                            {/* Enhanced optimized image */}
                            <OptimizedImage
                              src={product.image}
                              alt={product.name}
                              width={400}
                              height={300}
                              className='absolute inset-0 w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110'
                              objectFit="cover"
                              quality={85}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              fallbackSrc="/images/placeholder.jpg"
                            />
                            
                            {/* Quick actions overlay */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                <Heart className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                          
                          <CardContent className='p-6 flex flex-col flex-grow'>
                            <SlideIn direction="up" delay={0.3 + index * 0.1}>
                              <div className='flex justify-between items-start mb-3'>
                                <div className="flex-grow">
                                  <Badge variant="secondary" className='text-xs mb-2 font-medium'>
                                    {product.category}
                                  </Badge>
                                  <h3 className='font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors'>
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {product.description}
                                  </p>
                                </div>
                              </div>
                            </SlideIn>
                            
                            <FadeIn direction="up" delay={0.5 + index * 0.1}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${
                                        i < Math.floor(product.rating) 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">({product.reviews})</span>
                                <span className="text-xs text-accent font-medium ml-auto">{product.soldCount} sold</span>
                              </div>
                            </FadeIn>
                            
                            <ScaleIn delay={0.7 + index * 0.1} className="mt-auto">
                              <div className='flex items-center justify-between mb-4'>
                                <div className="flex items-center gap-2">
                                  <p className='text-xl font-bold text-foreground'>{product.price}</p>
                                  {product.originalPrice && (
                                    <p className='text-sm text-muted-foreground line-through'>{product.originalPrice}</p>
                                  )}
                                </div>
                              </div>
                              
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button className='w-full rural-button group/btn bg-primary hover:bg-primary/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300'>
                                  <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                                  Add to Cart
                                </Button>
                              </motion.div>
                            </ScaleIn>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </FadeIn>
                  ))}
                </StaggerContainer>
              </TabsContent>
            ))}
          </Tabs>
        </FadeIn>
      </div>
    </section>
  )
}

export default Trending;
