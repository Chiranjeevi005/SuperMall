'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({ name: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Textile Artisan, Rajasthan",
      quote: "SuperMall transformed my traditional craft business. My handwoven textiles now reach customers across India, increasing my income by 300%.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Organic Farmer, Punjab",
      quote: "For the first time, I can sell my organic produce directly to health-conscious consumers without middlemen taking huge cuts.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Meera Patel",
      role: "Urban Customer, Mumbai",
      quote: "I love knowing exactly where my products come from and supporting rural communities with every purchase. The quality is exceptional.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Journey timeline data
  const journeyMilestones = [
    {
      year: "2020",
      title: "Humble Beginnings",
      description: "Started with 15 farmers and 3 artisans in a small village, proving that direct connections could work.",
      vendors: "15 Farmers + 3 Artisans"
    },
    {
      year: "2022",
      title: "Regional Expansion",
      description: "Grew to 600+ vendors across multiple states, introducing mobile-friendly features and regional language support.",
      vendors: "600+ Vendors"
    },
    {
      year: "2024",
      title: "National Movement",
      description: "Today we connect over 50,000 rural vendors with consumers nationwide, creating sustainable livelihoods.",
      vendors: "50,000+ Vendors"
    }
  ];

  // Impact statistics
  const impactStats = [
    { number: "₹25 Cr+", label: "Transactions", icon: "💰" },
    { number: "5,000+", label: "Lives Transformed", icon: "🌱" },
    { number: "100%", label: "Authentic Products", icon: "✅" },
    { number: "100+", label: "Villages Connected", icon: "🏘️" }
  ];

  // Vendor benefits
  const vendorBenefits = [
    { icon: "🚜", title: "Direct Sales", desc: "Sell directly to consumers without middlemen" },
    { icon: "💰", title: "Fair Income", desc: "Earn 60-80% more than traditional channels" },
    { icon: "🌐", title: "National Reach", desc: "Access customers across the entire country" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50">
      {/* Hero Section with rural market scene */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 to-amber-900">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDIwQzQxLjAyMTcgMjAgNTAgMjguOTc4MyA1MCA0MUM1MCA1My4wMjE3IDQxLjAyMTcgNjIgMzAgNjJDMTguOTc4MyA2MiAxMCA1My4wMjE3IDEwIDQxQzEwIDI4Ljk3ODMgMTguOTc4MyAyMCAzMCAyMFoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=')]"></div>
        
        {/* Floating leaves animation */}
        <div className="absolute top-10 left-10 w-8 h-8 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-amber-300 rounded-full opacity-40 animate-ping"></div>
        <div className="absolute bottom-20 left-1/4 w-10 h-10 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-white mb-6 leading-tight">
                Building Bridges Between Rural Craftsmanship and Urban Homes
              </h1>
              <p className="text-xl text-stone-200 max-w-3xl mb-10">
                Your connection to the timeless traditions of India's most talented rural producers. 
                Every message creates a meaningful impact for farmers and artisans.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="#contact-form" 
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 font-medium rounded-lg hover:from-amber-300 hover:to-amber-400 transition-all duration-300 transform hover:-translate-y-1 text-lg shadow-lg hover:shadow-xl"
                >
                  Contact With Us
                </Link>
                <Link 
                  href="#our-impact" 
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-emerald-900 transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  See Impact
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-10 border border-white border-opacity-20 max-w-md">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-br from-amber-100 to-emerald-100 rounded-full p-6 shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-light text-white mb-4 text-center">Your Voice Shapes Our Mission</h3>
                <p className="text-stone-200 text-center">
                  Join thousands who have become part of our movement to empower rural India through meaningful connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Connection Block */}
      <div className="py-20 bg-gradient-to-br from-amber-50 to-stone-100 relative">
        {/* Handmade paper texture */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iI2QyYjI4OCIvPgo8cGF0aCBkPSJNMjAgMTBoMjB2MTBIMjB6IiBmaWxsPSIjY2FiYTc3Ii8+CjxwYXRoIGQ9Ik0xMCAzMGMxMCAwIDIwIDEwIDIwIDIwIiBzdHJva2U9IiNjYWJhNzciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <div className="mb-4">
              <span className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-1 rounded-full">
                OUR MISSION
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-6">
              Connecting Communities, Empowering Lives
            </h2>
            
            {/* Animated journey */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-16 mb-12">
              <div className="flex flex-col items-center mb-10 md:mb-0">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-medium text-stone-800">Farmer Outreach</h3>
              </div>
              
              <div className="hidden md:block text-3xl text-amber-500">→</div>
              
              <div className="flex flex-col items-center mb-10 md:mb-0">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl">🏪</span>
                </div>
                <h3 className="font-medium text-stone-800">We Connect</h3>
              </div>
              
              <div className="hidden md:block text-3xl text-amber-500">→</div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-2xl">💚</span>
                </div>
                <h3 className="font-medium text-stone-800">You Empower</h3>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-stone-600 italic">
                "From a farmer sowing seeds to an artisan shaping clay, every journey matters. 
                We built SuperMall to amplify their voices — and your message helps us make that voice stronger."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Timeline - Enhanced Rural Theme Card Format */}
      <div id="our-impact" className="py-20 bg-gradient-to-br from-stone-50 to-amber-50 relative overflow-hidden">
        {/* Rural texture background */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iI2QyYjI4OCIvPgo8cGF0aCBkPSJNMjAgMTBoMjB2MTBIMjB6IiBmaWxsPSIjY2FiYTc3Ii8+CjxwYXRoIGQ9Ik0xMCAzMGMxMCAwIDIwIDEwIDIwIDIwIiBzdHJva2U9IiNjYWJhNzciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="mb-4">
              <span className="bg-amber-50 text-amber-800 text-sm font-medium px-4 py-1 rounded-full">
                OUR JOURNEY
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-6">
              Creating Sustainable Impact
            </h2>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Every milestone represents lives transformed and communities empowered.
            </p>
          </div>

          {/* Enhanced Rural Theme Journey Timeline - Card Format */}
          <div className="relative">
            {/* Decorative path elements with rural theme */}
            <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-emerald-600 to-amber-700 transform -translate-x-1/2 hidden md:block opacity-70"></div>
            <div className="absolute left-1/2 top-0 w-6 h-6 rounded-full bg-emerald-600 transform -translate-x-1/2 -translate-y-1/2 hidden md:block shadow-lg"></div>
            <div className="absolute left-1/2 bottom-0 w-6 h-6 rounded-full bg-amber-700 transform -translate-x-1/2 translate-y-1/2 hidden md:block shadow-lg"></div>
            
            <div className="space-y-20">
              {journeyMilestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative flex flex-col md:flex-row items-center transition-all duration-500 ease-in-out transform hover:scale-[1.01] ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  {/* Timeline connector for mobile */}
                  {index < journeyMilestones.length - 1 && (
                    <div className="absolute left-8 top-32 h-24 w-0.5 bg-stone-300 md:hidden"></div>
                  )}
                  
                  {/* Year Badge with Rural Theme */}
                  <div className="md:w-1/2 flex justify-center md:justify-end mb-8 md:mb-0">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-700 to-amber-800 flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110">
                        <span className="text-white font-bold text-xl">{milestone.year}</span>
                      </div>
                      <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-700 to-amber-800 opacity-20 animate-ping"></div>
                    </div>
                  </div>
                  
                  {/* Content Card with Rural Theme */}
                  <div className="md:w-1/2 md:px-16">
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-stone-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Decorative rural element */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 to-amber-600 rounded-t-2xl"></div>
                      
                      <div className="pt-4">
                        <h3 className="text-2xl font-bold text-stone-900 mb-4">{milestone.title}</h3>
                        
                        {/* Rural-themed decorative elements */}
                        <div className="flex items-center mb-4">
                          <div className="w-8 h-0.5 bg-amber-400 rounded-full"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mx-2"></div>
                          <div className="w-8 h-0.5 bg-amber-400 rounded-full"></div>
                        </div>
                        
                        <p className="text-stone-700 mb-6 leading-relaxed">{milestone.description}</p>
                        
                        {/* Rural-themed vendor badge */}
                        <div className="inline-flex items-center bg-gradient-to-r from-amber-100 to-emerald-50 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium border border-amber-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {milestone.vendors}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Journey Completion Message with Rural Theme */}
            <div className="text-center mt-28 mb-12">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-50 to-amber-50 rounded-full px-8 py-4 border border-amber-200 shadow-md backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-stone-800 font-medium">And the journey continues...</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <p className="mt-6 text-stone-600 max-w-2xl mx-auto">
                Our story is still being written with every farmer we connect, every artisan we empower, 
                and every customer who chooses authentic rural products.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px);
            opacity: 1;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.7;
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>

      {/* Voices of the Village (Testimonials) - With Demo Images */}
      <div className="py-20 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-1 rounded-full">
                VOICES OF THE VILLAGE
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-6">
              Stories From Our Community
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl p-10 border border-stone-200 shadow-sm relative overflow-hidden">
              {/* Rustic texture background */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iI2QyYjI4OCIvPgo8cGF0aCBkPSJNMjAgMTBoMjB2MTBIMjB6IiBmaWxsPSIjY2FiYTc3Ii8+CjxwYXRoIGQ9Ik0xMCAzMGMxMCAwIDIwIDEwIDIwIDIwIiBzdHJva2U9IiNjYWJhNzciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')]"></div>
              
              <div className="flex flex-col md:flex-row items-center mb-8">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mb-6 md:mb-0 md:mr-8 flex-shrink-0 overflow-hidden">
                  {/* Demo Image for Testimonial */}
                  {testimonials.length > 0 && testimonials[currentTestimonial] ? (
                    <img 
                      src={testimonials[currentTestimonial].image} 
                      alt={testimonials[currentTestimonial].name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-amber-200 to-emerald-200 w-full h-full flex items-center justify-center">
                      <span className="text-2xl text-stone-600">👤</span>
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-medium text-stone-900">
                    {testimonials.length > 0 ? testimonials[currentTestimonial]?.name : "Loading..."}
                  </h3>
                  <p className="text-emerald-700 text-lg">
                    {testimonials.length > 0 ? testimonials[currentTestimonial]?.role : ""}
                  </p>
                </div>
              </div>
              <p className="text-xl text-stone-700 italic text-center md:text-left">
                "{testimonials.length > 0 ? testimonials[currentTestimonial]?.quote : "Loading testimonial..."}"
              </p>
              
              <div className="flex justify-center space-x-2 mt-10">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial 
                        ? 'bg-emerald-700 w-8' 
                        : 'bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form (Humanized) */}
      <div id="contact-form" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="mb-4">
                <span className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-1 rounded-full">
                  START A CONVERSATION
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-6">
                Start a Conversation That Matters
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                Every message is a step toward empowering rural vendors and artisans.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-10 md:p-14 border border-stone-200 shadow-lg relative overflow-hidden">
              {/* Subtle fabric texture */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iI2QyYjI4OCIvPgo8cGF0aCBkPSJNMjAgMTBoMjB2MTBIMjB6IiBmaWxsPSIjY2FiYTc3Ii8+CjxwYXRoIGQ9Ik0xMCAzMGMxMCAwIDIwIDEwIDIwIDIwIiBzdHJva2U9IiNjYWJhNzciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')]"></div>
              
              {submitSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-lg mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Thank you for your message!</p>
                      <p>We'll get back to you soon. Your voice matters to us.</p>
                    </div>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg mb-8">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p>{submitError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label htmlFor="name" className="block text-stone-800 font-medium text-lg mb-3">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-lg shadow-sm"
                    placeholder="Tell us your name"
                  />
                </div>

                <div className="mb-8">
                  <label htmlFor="subject" className="block text-stone-800 font-medium text-lg mb-3">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-lg shadow-sm"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="mb-10">
                  <label htmlFor="message" className="block text-stone-800 font-medium text-lg mb-3">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-5 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-lg shadow-sm"
                    placeholder="Tell us your story or question..."
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium py-4 px-10 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 text-lg transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor CTA Section */}
      <div className="py-20 bg-gradient-to-r from-emerald-700 to-amber-800 relative overflow-hidden">
        {/* Rural texture background */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iI2QyYjI4OCIvPgo8cGF0aCBkPSJNMjAgMTBoMjB2MTBIMjB6IiBmaWxsPSIjY2FiYTc3Ii8+CjxwYXRoIGQ9Ik0xMCAzMGMxMCAwIDIwIDEwIDIwIDIwIiBzdHJva2U9IiNjYWJhNzciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6">
              <span className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-1 rounded-full">
                FOR VENDORS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-8">
              Farmers, Artisans, Producers — Showcase Your Craft
            </h2>
            <p className="text-xl text-stone-100 mb-12 max-w-3xl mx-auto">
              Your traditional skills and authentic products deserve recognition. 
              Let us help you reach thousands of conscious consumers across the nation.
            </p>

            {/* Collage of tools, produce, crafts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {vendorBenefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20 text-center hover:bg-opacity-20 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-3">{benefit.title}</h3>
                  <p className="text-orange-400 font-medium">{benefit.desc}</p>
                </div>
              ))}
            </div>

            <Link 
              href="/register" 
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-emerald-900 font-medium py-4 px-10 rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-md hover:shadow-lg text-lg transform hover:-translate-y-0.5"
            >
              Become a Vendor
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter / Stay Connected */}
      <div className="py-20 bg-gradient-to-br from-white to-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <span className="bg-emerald-50 text-emerald-800 text-sm font-medium px-4 py-1 rounded-full">
                STAY CONNECTED
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-6">
              Be Part of the Transformation
            </h2>
            <p className="text-xl text-stone-600 mb-12 max-w-3xl mx-auto">
              Receive farmer stories, artisan journeys, and rural impact updates.
            </p>

            <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl p-10 border border-stone-200 shadow-sm relative overflow-hidden">
              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iI2QyYjI4OCIvPgo8cGF0aCBkPSJNMjAgMTBoMjB2MTBIMjB6IiBmaWxsPSIjY2FiYTc3Ii8+CjxwYXRoIGQ9Ik0xMCAzMGMxMCAwIDIwIDEwIDIwIDIwIiBzdHJva2U9IiNjYWJhNzciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')]"></div>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-grow relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-5 py-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-lg shadow-sm pr-12"
                    required
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300 group-hover:w-full"></div>
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-medium py-4 px-8 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-md hover:shadow-lg text-lg whitespace-nowrap transform hover:-translate-y-0.5"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Quote Banner */}
      <div className="py-16 bg-gradient-to-r from-stone-700 to-stone-800 relative overflow-hidden">
        {/* Rural texture background */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0iI2QyYjI4OCIvPgo8cGF0aCBkPSJNMjAgMTBoMjB2MTBIMjB6IiBmaWxsPSIjY2FiYTc3Ii8+CjxwYXRoIGQ9Ik0xMCAzMGMxMCAwIDIwIDEwIDIwIDIwIiBzdHJva2U9IiNjYWJhNzciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K')]"></div>
        {/* Sunset silhouette */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDQwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgNDAwQzIwMCAzMDAgNDAwIDI1MCA2MDAgMjUwQzgwMCAyNTAgMTAwMCAzMDAgMTIwMCA0MDBIMHoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+')] bg-cover bg-center"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-serif font-light text-stone-200 italic">
              "Every contact, every story, every product — together, they weave the fabric of a stronger rural economy."
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center bg-white bg-opacity-10 rounded-full px-6 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-yellow-400 font-medium">Thank you for being part of our journey</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}