"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ShoppingCart, Globe, Award, TrendingUp, Shield } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: "1,000+",
      label: "Premium Brands",
      description: "Trusted retailers and partners"
    },
    {
      icon: ShoppingCart,
      value: "500K+", 
      label: "Orders Delivered",
      description: "Successful transactions worldwide"
    },
    {
      icon: Globe,
      value: "50+",
      label: "Countries Served",
      description: "Global marketplace reach"
    },
    {
      icon: Award,
      value: "4.9/5",
      label: "Customer Rating",
      description: "Exceptional service quality"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "Customer Satisfaction",
      description: "Happy customers return"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Secure Payments",
      description: "Protected transactions"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-secondary/5 via-background to-card/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 hero-title">
            Trusted by <span className="text-primary">Communities</span> Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of brands and millions of customers who trust SUPER-MALL 
            for authentic, quality products and exceptional service.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center group hover:shadow-2xl transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-foreground mb-2 hero-title">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-primary mr-2" />
            <span className="text-primary font-semibold">Verified • Secure • Trusted</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;