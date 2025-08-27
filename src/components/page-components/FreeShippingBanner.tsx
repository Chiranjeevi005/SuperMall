"use client"

import React from "react";
import { motion } from "framer-motion";
import { Truck, Shield, Clock, Award } from "lucide-react";

const FreeShippingBanner = () => {
  const features = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over ₹399",
      highlight: "No hidden fees"
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% protected",
      highlight: "SSL encrypted"
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "24-48 hours",
      highlight: "Express available"
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "Premium products",
      highlight: "Satisfaction assured"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 hero-title">
            Why Choose SUPER-MALL?
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            We're committed to providing you with the best shopping experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center group hover:bg-white/20 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80 mb-2">
                  {feature.description}
                </p>
                <p className="text-accent text-sm font-semibold">
                  {feature.highlight}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Special offer highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center bg-accent/20 border border-accent/30 rounded-full px-8 py-4">
            <Truck className="w-5 h-5 text-accent mr-3" />
            <span className="text-white font-semibold">
              Limited Time: Free shipping on your first order over ₹399!
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeShippingBanner;
