"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Globe,
  ShoppingBag,
  Star,
  Award,
  Zap,
  Shield,
  Target,
  ArrowRight,
  CheckCircle,
  DollarSign,
  BarChart3
} from "lucide-react";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";
import Link from "next/link";

const VendorsPage = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    businessType: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your interest! We'll review your application and get back to you within 24 hours.");
    setFormData({
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      website: "",
      businessType: "",
      message: ""
    });
  };

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access millions of customers across 50+ countries worldwide"
    },
    {
      icon: TrendingUp,
      title: "Increased Sales",
      description: "Average 300% increase in sales within first 6 months"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "100% secure payments and fraud protection guaranteed"
    },
    {
      icon: Zap,
      title: "Easy Integration",
      description: "Quick setup with our user-friendly vendor dashboard"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Detailed sales reports and customer behavior analytics"
    },
    {
      icon: Award,
      title: "Marketing Support",
      description: "Featured placements and promotional opportunities"
    }
  ];

  const stats = [
    { number: "1M+", label: "Daily Visitors", icon: Users },
    { number: "500K+", label: "Active Customers", icon: ShoppingBag },
    { number: "50+", label: "Countries", icon: Globe },
    { number: "99.9%", label: "Uptime", icon: Zap }
  ];

  const requirements = [
    "Valid business registration and licenses",
    "High-quality product images and descriptions",
    "Commitment to customer service excellence",
    "Competitive pricing and authentic products",
    "Ability to fulfill orders within 24-48 hours"
  ];

  const businessTypes = [
    "Fashion & Apparel",
    "Electronics & Gadgets",
    "Home & Garden",
    "Sports & Fitness",
    "Beauty & Health",
    "Books & Media",
    "Toys & Games",
    "Other"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn direction="up" className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center bg-primary/10 border border-primary/20 rounded-full px-6 py-3 mb-6"
            >
              <Building2 className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Partner With Us</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 hero-title">
              Grow Your Business with <span className="text-primary">SUPER-MALL</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Join thousands of successful brands and retailers on the world's premier shopping platform. 
              Reach millions of customers globally and scale your business like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rural-button group" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <Target className="w-5 h-5 mr-2" />
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 hero-title">
              Why Choose <span className="text-primary">SUPER-MALL</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Join a platform that's designed for your success
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <SlideIn key={index} direction="up" delay={index * 0.1}>
                  <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 group hover:shadow-xl transition-all duration-300 h-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-4">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </SlideIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements & Application Form */}
      <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Requirements */}
            <SlideIn direction="left" delay={0.2}>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">Partner Requirements</h2>
                <p className="text-muted-foreground mb-8">
                  To maintain our high standards, we require all partners to meet these criteria:
                </p>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground leading-relaxed">{requirement}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <DollarSign className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Pricing</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• No setup fees or monthly charges</li>
                    <li>• Competitive commission rates starting at 5%</li>
                    <li>• Volume discounts available</li>
                    <li>• Fast weekly payouts</li>
                  </ul>
                </div>
              </div>
            </SlideIn>

            {/* Application Form */}
            <SlideIn direction="right" delay={0.4}>
              <div id="application-form" className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">Apply to Partner</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and our partnership team will review your application.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Business Name *</label>
                      <Input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Contact Name *</label>
                      <Input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="business@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                      <Input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Business Type *</label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-border rounded-lg bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tell us about your business *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full p-3 border border-border rounded-lg bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                      placeholder="Describe your products, target market, and why you'd like to partner with SUPER-MALL..."
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full rural-button group">
                    <Target className="w-5 h-5 mr-2" />
                    Submit Application
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up" className="text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 hero-title">
              Ready to <span className="text-primary">Scale</span> Your Business?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Join SUPER-MALL today and start reaching millions of customers worldwide. 
              Our team is ready to help you succeed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rural-button group" onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <Target className="w-5 h-5 mr-2" />
                Start Your Application
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="group">
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Speak with Our Team
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default VendorsPage;