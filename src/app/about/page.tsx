"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  ShoppingBag,
  Users,
  Globe,
  Award,
  TrendingUp,
  Heart,
  Shield,
  Zap,
  Target,
  Star
} from "lucide-react";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";
import OurStory from "@/components/page-components/OurStory";

const AboutPage = () => {
  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is centered around delivering exceptional experiences to our customers."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "We partner only with trusted brands that meet our rigorous standards for quality and authenticity."
    },
    {
      icon: Zap,
      title: "Innovation Drive",
      description: "We continuously evolve our platform to provide cutting-edge shopping technologies and features."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting premium brands with customers worldwide through our comprehensive marketplace."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Foundation",
      description: "SUPER-MALL was founded with a vision to create the ultimate global shopping destination."
    },
    {
      year: "2021",
      title: "First 100 Brands",
      description: "Reached our first milestone of 100 premium brands and 10,000 customers."
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded operations to 25 countries with same-day delivery in major cities."
    },
    {
      year: "2023",
      title: "Innovation Hub",
      description: "Launched our AI-powered personalization engine and AR shopping experience."
    },
    {
      year: "2024",
      title: "Sustainability",
      description: "Achieved carbon-neutral operations and launched our green packaging initiative."
    },
    {
      year: "2025",
      title: "Future Ready",
      description: "Continuing to lead the industry with 1000+ brands and 500K+ happy customers."
    }
  ];

  const stats = [
    { number: "1,000+", label: "Premium Brands", icon: ShoppingBag },
    { number: "500K+", label: "Active Customers", icon: Users },
    { number: "50+", label: "Countries Served", icon: Globe },
    { number: "99.9%", label: "Uptime", icon: Zap },
    { number: "4.9/5", label: "Customer Rating", icon: Star },
    { number: "24/7", label: "Support", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container-fluid relative z-10">
          <FadeIn direction="up" className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6"
            >
              <Target className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">About Us</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 hero-title">
              Welcome to <span className="text-primary">SUPER-MALL</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              The world's premier shopping destination where premium brands meet discerning customers. 
              We're revolutionizing retail through innovation, quality, and exceptional customer experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/products">
                <Button size="lg" className="rural-button">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Explore Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="container-fluid">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <ScaleIn key={index} delay={index * 0.1}>
                  <div className="text-center p-6 bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl group hover:shadow-lg transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground mb-2 hero-title">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <OurStory />

      {/* Values Section */}
      <section className="py-20 bg-card/30">
        <div className="container-fluid">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 hero-title">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The principles that guide everything we do at SUPER-MALL
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <SlideIn key={index} direction="up" delay={index * 0.1}>
                  <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 group hover:shadow-xl transition-all duration-300 h-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </SlideIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container-fluid">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 hero-title">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From startup to global leader - here's how we've grown
            </p>
          </FadeIn>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary hidden lg:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex flex-col lg:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 lg:max-w-md">
                    <div className={`bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 group hover:shadow-xl transition-all duration-300 ${
                      index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'
                    }`}>
                      <div className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
                        <span className="text-primary font-bold">{milestone.year}</span>
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground mb-3">{milestone.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full border-4 border-background shadow-lg z-10">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Spacer */}
                  <div className="flex-1 lg:max-w-md" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="container-fluid">
          <FadeIn direction="up" className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 hero-title">
              Ready to Experience <span className="text-primary">SUPER-MALL</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Join hundreds of thousands of satisfied customers who have made SUPER-MALL their preferred shopping destination.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="rural-button group">
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Shopping
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="group">
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Partner With Us
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;