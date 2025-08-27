"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Tractor, Heart, Globe, ArrowRight, Users, ShoppingBasket, Star, Shield, Truck, TrendingUp, Award } from "lucide-react";
import { FadeIn, SlideIn, ScaleIn, Parallax } from "@/components/animations";
import OptimizedImage from "@/components/ui/OptimizedImage";

const HeroSection = () => {
  const { scrollY } = useScroll();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Parallax transforms
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const textY = useTransform(scrollY, [0, 500], [0, -50]);
  const imageY = useTransform(scrollY, [0, 500], [0, -100]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-card to-background overflow-hidden">
      {/* Enhanced Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10"
      >
        {/* Animated background orbs with improved performance */}
        <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-60 h-60 md:w-80 md:h-80 bg-accent/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 md:w-60 md:h-60 bg-secondary/6 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 md:w-52 md:h-52 bg-primary/4 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
      </motion.div>

      {/* Enhanced geometric pattern with responsive sizing */}
      <div className="absolute inset-0 opacity-[0.015] md:opacity-[0.02]">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Cpath d='m0 30l30-30h-30v30z'/%3E%3Cpath d='m30 0v30h-30l30-30z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: isSmallScreen ? '20px 20px' : '30px 30px'
        }} />
      </div>

      <div className="relative z-10 container-fluid">
        {/* Enhanced announcement bar with improved mobile layout */}
        <FadeIn direction="down" delay={0.2}>
          <div className="text-center py-4 md:py-6">
            <div className="inline-flex items-center bg-accent/10 border border-accent/20 rounded-full px-4 py-2 md:px-6 md:py-2 text-xs md:text-sm font-medium text-accent shadow-lg backdrop-blur-sm">
              <Star className="w-3 h-3 md:w-4 md:h-4 mr-2 fill-current animate-pulse" />
              <span className="hidden sm:inline">Trusted by 50,000+ farmers and customers worldwide</span>
              <span className="sm:hidden">50,000+ trusted users</span>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center py-8 md:py-12 lg:py-20">
          {/* Enhanced Text Content with better mobile responsiveness */}
          <motion.div
            style={{ y: textY }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full border border-primary/20">
                  <Tractor className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <span className="text-primary font-semibold text-base md:text-lg tracking-wide">Global Shopping Hub</span>
              </div>

              <h1 className="responsive-title font-bold text-foreground leading-tight hero-title">
                Experience{' '}
                <span className="text-primary relative inline-block">
                  Premium Shopping
                  <div className="absolute -bottom-2 md:-bottom-3 left-0 w-full h-3 md:h-4 bg-gradient-to-r from-accent/30 to-primary/20 -z-10 rounded-full transform -rotate-1"></div>
                </span>
                <br />
                <span className="text-accent bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">At SUPER-MALL</span>
              </h1>

              <p className="responsive-text text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                Discover the world's finest brands and products in one ultimate destination.
                From fashion and electronics to home goods and lifestyle essentials,
                experience unparalleled quality and exceptional shopping at SUPER-MALL.
              </p>
            </motion.div>

            {/* Enhanced stats with mobile optimization */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 md:gap-6 py-6 md:py-8">
              <ScaleIn delay={0.3} className="text-center space-y-1 md:space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
                  1K+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">Premium Brands</div>
              </ScaleIn>
              <ScaleIn delay={0.4} className="text-center space-y-1 md:space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-accent flex items-center justify-center">
                  <Users className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
                  500K+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">Happy Shoppers</div>
              </ScaleIn>
              <ScaleIn delay={0.5} className="text-center space-y-1 md:space-y-2">
                <div className="text-2xl md:text-3xl font-bold text-secondary-foreground flex items-center justify-center">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2" />
                  50+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground font-medium">Countries</div>
              </ScaleIn>
            </motion.div>

            {/* Enhanced feature badges with responsive layout */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-4">
              <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-2 md:px-4 md:py-2 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span className="text-xs md:text-sm font-medium">Verified</span>
              </div>
              <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-2 md:px-4 md:py-2 shadow-sm hover:shadow-md transition-shadow">
                <Truck className="h-3 w-3 md:h-4 md:w-4 text-accent" />
                <span className="text-xs md:text-sm font-medium">Global Ship</span>
              </div>
              <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full px-3 py-2 md:px-4 md:py-2 shadow-sm hover:shadow-md transition-shadow">
                <Heart className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
                <span className="text-xs md:text-sm font-medium">Ethical</span>
              </div>
            </motion.div>

            {/* Enhanced CTA buttons with improved mobile layout */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6">
              <Link href="/products" className="flex-1 sm:flex-none">
                <Button size="lg" className="w-full sm:w-auto rural-button btn-enhanced group text-base md:text-lg px-6 py-4 md:px-8 md:py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <ShoppingBasket className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Explore Marketplace</span>
                  <span className="sm:hidden">Shop Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/vendors" className="flex-1 sm:flex-none">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base md:text-lg px-6 py-4 md:px-8 md:py-6 border-2 hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300">
                  <Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">Become a Vendor</span>
                  <span className="sm:hidden">Sell</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          {/* Enhanced Image Section with better mobile handling */}
          <motion.div
            style={{ y: imageY }}
            className="relative order-first lg:order-last"
          >
            <SlideIn direction="right" delay={0.3} className="relative group">
              {/* Main hero image with responsive sizing */}
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl md:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 z-10" />
                <OptimizedImage
                  src="https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756173049/Gemini_Generated_Image_ef217eef217eef21_smguee.png"
                  alt="Modern shopping mall interior with premium stores and shoppers"
                  width={1200}
                  height={675}
                  className="transition-transform duration-700 group-hover:scale-105 accelerated"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />

                {/* Floating cards with responsive positioning */}
                <FadeIn delay={0.8} className="absolute top-3 left-3 md:top-6 md:left-6">
                  <div className="bg-background/95 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-border/50">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-xs md:text-sm font-semibold text-foreground">Live Brands</div>
                        <div className="text-xs text-muted-foreground">1,247 online</div>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={1} className="absolute top-3 right-3 md:top-6 md:right-6">
                  <div className="bg-background/95 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-border/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs md:text-sm font-medium text-foreground">New Arrivals</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Updated now</div>
                  </div>
                </FadeIn>

                <FadeIn delay={1.2} className="absolute bottom-3 left-3 md:bottom-6 md:left-6">
                  <div className="bg-background/95 backdrop-blur-md rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg border border-border/50 max-w-[200px] md:max-w-xs">
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex items-center space-x-2">
                        <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                        <span className="text-xs md:text-sm font-semibold text-foreground">4.9/5 Rating</span>
                      </div>
                      <div className="text-xs text-muted-foreground">"Amazing quality!"</div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-2 h-2 md:w-3 md:h-3 text-destructive fill-current" />
                        <span className="text-xs text-muted-foreground">45K+ customers</span>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={1.4} className="absolute bottom-3 right-3 md:bottom-6 md:right-6">
                  <div className="bg-gradient-to-br from-accent to-accent/80 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-lg text-white">
                    <div className="text-center">
                      <div className="text-lg md:text-2xl font-bold">24/7</div>
                      <div className="text-xs opacity-90">Customer Support</div>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Decorative elements with responsive sizing */}
              <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-12 h-12 md:w-20 md:h-20 bg-accent/20 rounded-full blur-xl" />
              <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-10 h-10 md:w-16 md:h-16 bg-primary/20 rounded-full blur-lg" />
            </SlideIn>
          </motion.div>
        </div>

        {/* Enhanced trust indicators */}
        <FadeIn delay={1.6} className="text-center py-8 md:py-12">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-60">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Award className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">Certified Organic</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Shield className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Truck className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">Fair Trade</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default HeroSection;
