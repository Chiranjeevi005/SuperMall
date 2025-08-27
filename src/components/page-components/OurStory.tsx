"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Leaf, Award, TrendingUp, Globe } from "lucide-react";

const OurStory = () => {
  const storyPoints = [
    {
      icon: Heart,
      title: "Born from Innovation",
      description: "Our journey began with a vision to create the ultimate shopping destination that connects quality brands with discerning customers."
    },
    {
      icon: Users,
      title: "Community First",
      description: "We bring together the best brands and retailers to offer an unparalleled shopping experience for our valued customers."
    },
    {
      icon: Leaf,
      title: "Quality Excellence",
      description: "Every product in our marketplace meets the highest standards of quality, authenticity, and customer satisfaction."
    }
  ];

  const achievements = [
    { number: "1,000+", label: "Premium Brands", icon: Users },
    { number: "500K+", label: "Happy Customers", icon: Heart },
    { number: "50+", label: "Shopping Categories", icon: Globe },
    { number: "98%", label: "Customer Satisfaction", icon: Award }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-6 py-2 mb-6">
            <Leaf className="w-4 h-4 text-primary mr-2" />
            <span className="text-primary font-semibold">Our Journey</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 hero-title">
            The <span className="text-primary">SUPER-MALL</span> Story
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From a visionary concept to becoming the world's premier shopping destination, 
            our story is one of innovation, quality, and exceptional customer experiences.
          </p>
        </motion.div>

        {/* Main Story Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground leading-relaxed mb-6">
                SUPER-MALL was founded with a vision to revolutionize the retail experience by creating 
                the world's most comprehensive shopping destination. We believe that exceptional products 
                come from passionate brands who care deeply about quality and customer satisfaction.
              </p>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                Our platform brings together premium brands from around the world, offering customers 
                access to the finest products, from fashion and electronics to home goods and lifestyle items.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                Every purchase at SUPER-MALL is backed by our commitment to quality, authenticity, 
                and exceptional customer service, creating lasting relationships between brands and consumers.
              </p>
            </div>

            <div className="flex items-center space-x-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Global Expansion</h4>
                <p className="text-muted-foreground">
                  Every year, we partner with more premium brands and bring exceptional 
                  shopping experiences to more customers worldwide.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {storyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 group hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <point.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{point.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl group hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <achievement.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2 hero-title">
                {achievement.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {achievement.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;