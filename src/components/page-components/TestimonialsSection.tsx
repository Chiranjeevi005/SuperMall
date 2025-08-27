"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, MapPin, Verified, Heart } from "lucide-react";
import { FadeIn, SlideIn, ScaleIn, StaggerContainer } from "@/components/animations";
import OptimizedImage from "@/components/ui/OptimizedImage";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rohan Deshpande",
      role: "Home Chef",
      location: "Bidadi, India",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The quality of products I receive from SUPER-MALL is exceptional. Premium brands, authentic items, and delivered right to my door. My family loves the shopping experience!",
      verified: true
    },
    {
      name: "Rao Sahab",
      role: "Restaurant Owner",
      location: "Haryana, India",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "As a business owner, sourcing quality products is crucial. SUPER-MALL connects me with premium brands, ensuring the best selection for my customers.",
      verified: true
    },
    {
      name: "Manisha Pai",
      role: "Sustainability Advocate", 
      location: "Goa, India",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "I love supporting small farmers while getting the freshest produce. The platform makes it easy to buy ethically and sustainably.",
      verified: true
    },
    {
      name: "Raj Patel",
      role: "Organic Farmer",
      location: "Gujarat, India",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "SUPER-MALL transformed my retail business. Now I can reach customers worldwide through their platform and offer the finest products.",
      verified: true
    },
    {
      name: "Manisha Singh",
      role: "Health Enthusiast",
      location: "Sydney, Australia", 
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      text: "The handcrafted products and fresh ingredients have elevated my cooking. The stories behind each product make every purchase meaningful.",
      verified: true
    },
    {
      name: "Carlos Rodriguez",
      role: "Food Blogger",
      location: "Mexico City, Mexico",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80", 
      rating: 5,
      text: "The variety and quality of products on SUPER-MALL is incredible. It's my go-to platform for discovering premium brands and unique items.",
      verified: true
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-background via-card/30 to-background relative overflow-hidden">
      {/* Enhanced background elements with responsive sizing */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-56 h-56 md:w-80 md:h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-72 md:h-72 bg-heart/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>
      
      <div className="container-fluid relative z-10">
        {/* Enhanced header with mobile-first responsive design */}
        <FadeIn direction="up" delay={0.2} className="text-center mb-12 md:mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 md:px-6 md:py-2 mb-6 backdrop-blur-sm shadow-lg"
          >
            <Star className="w-4 h-4 text-accent fill-current mr-2 animate-pulse" />
            <span className="text-accent font-semibold text-sm md:text-base">Customer Stories</span>
          </motion.div>
          
          <SlideIn direction="up" delay={0.4}>
            <h2 className="responsive-title font-bold mb-4 md:mb-6 hero-title text-foreground">
              What Our <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Community</span>
              <br className="hidden sm:block" />Says About Us
            </h2>
          </SlideIn>
          
          <FadeIn direction="up" delay={0.6}>
            <p className="responsive-text text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
              Real stories from farmers, customers, and food enthusiasts who are part 
              of the SUPER-MALL family worldwide. Join our growing community today.
            </p>
          </FadeIn>
          
          <ScaleIn delay={0.8} type="bounce">
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-accent to-primary rounded-full mx-auto mt-6 md:mt-8"></div>
          </ScaleIn>
        </FadeIn>

        {/* Enhanced testimonials grid with staggered animations */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          staggerDelay={0.1}
        >
          {testimonials.map((testimonial, index) => (
            <FadeIn key={index} direction="up" delay={index * 0.1} className="h-full">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="rural-marketplace-card h-full relative group cursor-pointer"
              >
                {/* Enhanced quote decoration */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Quote className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                
                {/* Enhanced rating with animation */}
                <ScaleIn delay={0.3 + index * 0.1} className="mb-4 md:mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i, type: "spring" }}
                      >
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </ScaleIn>
                
                {/* Enhanced testimonial text with better mobile typography */}
                <SlideIn direction="up" delay={0.4 + index * 0.1}>
                  <p className="text-foreground leading-relaxed mb-6 md:mb-8 text-sm md:text-base lg:text-lg">
                    "{testimonial.text}"
                  </p>
                </SlideIn>
                
                {/* Enhanced user info with better mobile layout */}
                <FadeIn direction="up" delay={0.6 + index * 0.1}>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="relative flex-shrink-0">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                      >
                        <OptimizedImage
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={56}
                          height={56}
                          className="w-full h-full"
                          objectFit="cover"
                          sizes="56px"
                          fallbackSrc="/images/placeholder.jpg"
                        />
                      </motion.div>
                      {testimonial.verified && (
                        <ScaleIn delay={0.8 + index * 0.1} className="absolute -bottom-1 -right-1">
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-background">
                            <Verified className="w-2.5 h-2.5 md:w-3 md:h-3 text-white fill-current" />
                          </div>
                        </ScaleIn>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm md:text-base truncate">
                        {testimonial.name}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground truncate">
                        {testimonial.role}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </motion.div>
            </FadeIn>
          ))}
        </StaggerContainer>

        {/* Enhanced call to action with mobile optimization */}
        <FadeIn direction="up" delay={0.8} className="text-center mt-12 md:mt-16">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl px-6 py-4 md:px-8 md:py-6 backdrop-blur-sm shadow-lg"
          >
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="flex -space-x-2">
                {testimonials.slice(0, 4).map((testimonial, index) => (
                  <motion.div 
                    key={index}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, type: "spring" }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 md:border-3 border-background shadow-lg"
                  >
                    <OptimizedImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="w-full h-full"
                      objectFit="cover"
                      sizes="40px"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-sm md:text-base font-semibold text-foreground flex items-center">
                  <Heart className="w-4 h-4 text-destructive mr-2 animate-pulse" />
                  Join 50,000+ Happy Customers
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  Start your journey today
                </div>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TestimonialsSection;