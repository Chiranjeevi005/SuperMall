"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  WifiOff, 
  RefreshCw, 
  ShoppingCart, 
  Heart, 
  Search,
  Smartphone,
  Globe,
  Home
} from 'lucide-react';

const OfflinePage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [retryAttempts, setRetryAttempts] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Reload page when back online
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial connection status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetryAttempts(prev => prev + 1);
    window.location.reload();
  };

  const offlineFeatures = [
    {
      icon: ShoppingCart,
      title: "Browse Cached Products",
      description: "View previously loaded products and add them to your cart for later.",
      action: "View Products",
      href: "/products"
    },
    {
      icon: Heart,
      title: "Manage Wishlist",
      description: "Your wishlist items are saved locally and will sync when you're back online.",
      action: "View Wishlist",
      href: "/wishlist"
    },
    {
      icon: Search,
      title: "Search Cached Content",
      description: "Search through previously loaded products and categories.",
      action: "Search",
      href: "/search"
    }
  ];

  const tips = [
    "Your cart and wishlist items are saved locally",
    "Product images may be cached for offline viewing",
    "Recent searches and browsing history are available",
    "All data will sync automatically when you're back online"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card/20 to-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container-fluid py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">RH</span>
              </div>
              <span className="font-bold text-lg text-foreground">SUPER-MALL</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container-fluid py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Offline Icon and Message */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-12 h-12 md:w-16 md:h-16 text-red-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              You're Offline
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              No internet connection detected. But don't worry! You can still browse 
              cached content and manage your cart and wishlist.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleRetry}
                className="rural-button"
                disabled={retryAttempts >= 3}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {retryAttempts >= 3 ? 'Too many attempts' : 'Try Again'}
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Available Features */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              What You Can Do Offline
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offlineFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                  >
                    <Card className="rural-card h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">
                          {feature.title}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm mb-4">
                          {feature.description}
                        </p>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="w-full"
                        >
                          <Link href={feature.href}>
                            {feature.action}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-12"
          >
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Offline Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                  className="flex items-start space-x-3 text-left"
                >
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connection Help */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-card/50 rounded-lg p-6 border border-border/50"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center justify-center">
              <Smartphone className="w-5 h-5 mr-2" />
              Connection Troubleshooting
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Mobile Data:</strong>
                <p>Check if mobile data is enabled and you have sufficient balance.</p>
              </div>
              
              <div>
                <strong className="text-foreground">WiFi Connection:</strong>
                <p>Ensure you're connected to a working WiFi network.</p>
              </div>
              
              <div>
                <strong className="text-foreground">Airplane Mode:</strong>
                <p>Make sure airplane mode is turned off on your device.</p>
              </div>
              
              <div>
                <strong className="text-foreground">Router Issues:</strong>
                <p>Try restarting your router or contact your ISP.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default OfflinePage;