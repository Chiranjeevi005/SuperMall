"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Send,
  MessageCircle,
  HeadphonesIcon,
  Building2,
  Wifi,
  Car
} from "lucide-react";
import { FadeIn, SlideIn, ScaleIn } from "@/components/animations";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Headquarters",
      content: "SUPER-MALL Headquarters\n123 Business District Avenue\nMetropolitan City, MC 12345\nGlobal",
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567\nToll-free: 1-800-SUPERMALL",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      content: "General: support@super-mall.com\nBusiness: partnerships@super-mall.com\nCareers: careers@super-mall.com",
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday: 9:00 AM - 8:00 PM\nSaturday: 10:00 AM - 6:00 PM\nSunday: 12:00 PM - 5:00 PM\n(All times EST)",
      action: "View Calendar"
    }
  ];

  const departments = [
    {
      icon: HeadphonesIcon,
      title: "Customer Support",
      description: "Get help with orders, returns, and general inquiries",
      contact: "support@super-mall.com",
      hours: "24/7 Available"
    },
    {
      icon: Building2,
      title: "Business Partnerships",
      description: "Explore collaboration opportunities with SUPER-MALL",
      contact: "partnerships@super-mall.com",
      hours: "Mon-Fri, 9AM-6PM"
    },
    {
      icon: MessageCircle,
      title: "Media & Press",
      description: "Press inquiries and media relations",
      contact: "press@super-mall.com",
      hours: "Mon-Fri, 10AM-5PM"
    }
  ];

  const facilities = [
    { icon: Car, text: "Free Parking Available" },
    { icon: Wifi, text: "Free Wi-Fi Throughout" },
    { icon: Building2, text: "Wheelchair Accessible" },
    { icon: HeadphonesIcon, text: "24/7 Security" }
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
              <MessageCircle className="w-5 h-5 text-primary mr-2" />
              <span className="text-primary font-semibold">Get in Touch</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 hero-title">
              Contact <span className="text-primary">SUPER-MALL</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're here to help you with any questions, concerns, or feedback. 
              Reach out to us through any of the channels below.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section className="py-16">
        <div className="container-fluid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <ScaleIn key={index} delay={index * 0.1}>
                  <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-6 group hover:shadow-xl transition-all duration-300 h-full">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{info.title}</h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-4 text-sm">
                        {info.content}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        {info.action}
                      </Button>
                    </div>
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Departments */}
      <section className="py-16 bg-card/30">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <SlideIn direction="left" delay={0.2}>
              <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6">Send us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full p-3 border border-border rounded-lg bg-background/50 focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full rural-button group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </SlideIn>

            {/* Departments and Facilities */}
            <SlideIn direction="right" delay={0.4}>
              <div className="space-y-8">
                {/* Departments */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6">Departments</h2>
                  <div className="space-y-4">
                    {departments.map((dept, index) => {
                      const IconComponent = dept.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 group hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <IconComponent className="w-6 h-6 text-primary" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-foreground mb-2">{dept.title}</h3>
                              <p className="text-muted-foreground text-sm mb-3">{dept.description}</p>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <span className="text-primary font-medium text-sm">{dept.contact}</span>
                                <span className="text-muted-foreground text-xs">{dept.hours}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Facilities */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Our Facilities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {facilities.map((facility, index) => {
                      const IconComponent = facility.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10"
                        >
                          <IconComponent className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-foreground">{facility.text}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-16">
        <div className="container-fluid">
          <FadeIn direction="up">
            <div className="bg-background/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Find Us</h2>
              <p className="text-muted-foreground mb-6">
                Located in the heart of the Metropolitan Business District
              </p>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive map coming soon</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;