"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ShoppingBag,
  ArrowUp
} from "lucide-react";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";

const Footer = memo(() => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = useMemo(() => [
    { icon: Facebook, label: "Facebook", href: "#", color: "hover:text-blue-500" },
    { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-pink-500" },
    { icon: Youtube, label: "YouTube", href: "#", color: "hover:text-red-500" },
  ], []);

  const navigationLinks = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Partners", href: "/vendors" },
  ], []);

  const categoryLinks = useMemo(() => [
    { label: "Fresh Produce", href: "/products?category=Fresh%20Produce" },
    { label: "Handicrafts & Artisans", href: "/products?category=Handicrafts%20%26%20Artisans" },
    { label: "Clothing & Apparel", href: "/products?category=Clothing%20%26%20Apparel" },
    { label: "Home & Living", href: "/products?category=Home%20%26%20Living" },
    { label: "Dairy & Poultry", href: "/products?category=Dairy%20%26%20Poultry" },
    { label: "Spices & Condiments", href: "/products?category=Spices%20%26%20Condiments" },
    { label: "Food & Beverages", href: "/products?category=Food%20%26%20Beverages" },
    { label: "Tools & Equipment", href: "/products?category=Tools%20%26%20Equipment" },
  ], []);

  const contactInfo = useMemo(() => [
    {
      icon: MapPin,
      content: "SUPER-MALL Headquarters, Business District, Metropolitan City, India",
    },
    {
      icon: Phone,
      content: "+91 9876543210",
      href: "tel: 9876543210",
    },
    {
      icon: Mail,
      content: "support@super-mall.com",
      href: "mailto:support@super-mall.com",
    },
  ], []);

  const paymentMethods = useMemo(() => [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "PayPal", icon: "🅿️" },
    { name: "UPI", icon: "📱" },
    { name: "Razorpay", icon: "💰" },
  ], []);

  // Memoized components for better performance
  const brandSection = useMemo(() => (
    <FadeIn direction="up" delay={0.1} className="sm:col-span-2 lg:col-span-1">
      <div className="space-y-4 md:space-y-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2 md:space-x-3"
        >
          <div className="relative">
            <ShoppingBag className="h-8 w-8 md:h-10 md:w-10 text-accent" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hero-title">
            SUPER-MALL
          </h3>
        </motion.div>
        
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          Your ultimate shopping destination connecting premium brands with discerning customers worldwide. 
          Discover quality products, exceptional service, and unmatched shopping experiences.
        </p>
        
        {/* Social Links with enhanced mobile touch targets */}
        <div className="flex gap-3 md:gap-4">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <ScaleIn key={social.label} delay={0.2 + index * 0.1}>
                <motion.a
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 flex items-center justify-center transition-all duration-300 ${social.color} hover:border-current hover:shadow-lg`}
                >
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                </motion.a>
              </ScaleIn>
            );
          })}
        </div>
      </div>
    </FadeIn>
  ), [socialLinks]);

  const navigationSection = useMemo(() => (
    <SlideIn direction="up" delay={0.2} className="space-y-4 md:space-y-6">
      <h4 className="font-bold text-lg md:text-xl text-white mb-4 md:mb-6">Quick Links</h4>
      <ul className="space-y-2 md:space-y-3">
        {navigationLinks.map((link, index) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index }}
          >
            <Link
              href={link.href}
              className="text-gray-300 hover:text-white transition-all duration-300 py-2 md:py-1 block text-sm md:text-base group"
            >
              <span className="relative">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </SlideIn>
  ), [navigationLinks]);

  const categoriesSection = useMemo(() => (
    <SlideIn direction="up" delay={0.3} className="space-y-4 md:space-y-6">
      <h4 className="font-bold text-lg md:text-xl text-white mb-4 md:mb-6">Categories</h4>
      <ul className="space-y-2 md:space-y-3">
        {categoryLinks.map((link, index) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * index }}
          >
            <Link
              href={link.href}
              className="text-gray-300 hover:text-white transition-all duration-300 py-2 md:py-1 block text-sm md:text-base group"
            >
              <span className="relative">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </SlideIn>
  ), [categoryLinks]);

  const contactSection = useMemo(() => (
    <SlideIn direction="up" delay={0.4} className="space-y-4 md:space-y-6">
      <h4 className="font-bold text-lg md:text-xl text-white mb-4 md:mb-6">Get In Touch</h4>
      <ul className="space-y-3 md:space-y-4">
        {contactInfo.map((item, index) => {
          const IconComponent = item.icon;
          const content = (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-3 md:gap-4 group"
            >
              <div className="mt-1 p-2 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <span className="text-gray-300 text-sm md:text-base leading-relaxed flex-1">
                {item.content}
              </span>
            </motion.li>
          );
          
          return item.href ? (
            <a key={index} href={item.href} className="block hover:text-primary transition-colors">
              {content}
            </a>
          ) : content;
        })}
      </ul>
    </SlideIn>
  ), [contactInfo]);

  const bottomSection = useMemo(() => (
    <FadeIn direction="up" delay={0.6}>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="text-center lg:text-left">
          <p className="text-gray-400 text-sm md:text-base mb-2">
            © 2025 SUPER-MALL. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 text-xs md:text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="flex flex-col items-center lg:items-end gap-3">
          <span className="text-gray-400 text-sm font-medium">We Accept</span>
          <div className="flex gap-2 md:gap-3">
            {paymentMethods.map((payment, index) => (
              <motion.div
                key={payment.name}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, type: "spring" }}
                whileHover={{ scale: 1.1 }}
                className="w-10 h-6 md:w-12 md:h-8 bg-gray-800/80 rounded-md flex items-center justify-center text-xs border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                title={payment.name}
              >
                {payment.icon}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  ), [paymentMethods]);

  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-60 md:h-60 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            {/* Brand Section */}
            {brandSection}

            {/* Navigation Links */}
            {navigationSection}

            {/* Categories */}
            {categoriesSection}

            {/* Contact Information */}
            {contactSection}
          </div>

          <FadeIn direction="up" delay={0.5}>
            <Separator className="bg-gray-700/50 mb-6 md:mb-8" />
          </FadeIn>

          {/* Bottom Section */}
          {bottomSection}
        </div>
        
        {/* Scroll to Top Button */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
      </div>
    </motion.footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;