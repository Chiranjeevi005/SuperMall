'use client';

import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    interactiveTime: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            setMetrics(prev => ({
              ...prev,
              loadTime: navEntry.loadEventEnd - navEntry.fetchStart,
              renderTime: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
            }));
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });

      return () => observer.disconnect();
    }
  }, []);

  return metrics;
};

// Lazy loading wrapper component
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <div className="skeleton w-full h-48 rounded-lg" />,
  threshold = 0.1,
  rootMargin = '50px',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin]);

  return (
    <div ref={setRef} className="lazy-loading">
      {isVisible ? children : fallback}
    </div>
  );
};

// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
      onLoad?.();
    };
    
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    };

    if (priority) {
      img.src = src;
    } else {
      // Lazy load non-priority images
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.disconnect();
        }
      });

      const element = document.createElement('div');
      observer.observe(element);
    }

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, priority, onLoad, onError]);

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div 
          className="absolute inset-0 skeleton-image"
          style={{ width, height }}
        />
      )}
      {currentSrc && (
        <motion.img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
};

// Resource preloader
export const ResourcePreloader: React.FC = () => {
  useEffect(() => {
    // Preload critical fonts
    const fonts = [
      'Fredoka One',
      'Crimson Text',
      'Merriweather',
      'Cabin'
    ];

    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical images
    const criticalImages = [
      '/images/hero-bg.jpg',
      '/images/logo.png',
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};

// Performance monitoring component
export const PerformanceMonitor: React.FC = () => {
  const metrics = usePerformanceMonitor();

  useEffect(() => {
    // Log performance metrics in development
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Metrics');
      console.log('Load Time:', metrics.loadTime + 'ms');
      console.log('Render Time:', metrics.renderTime + 'ms');
      console.log('Interactive Time:', metrics.interactiveTime + 'ms');
      console.groupEnd();
    }
  }, [metrics]);

  return null;
};

// Code splitting utility
export const createLazyComponent = <T extends Record<string, any>>(
  importFunc: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return (props: T) => (
    <Suspense fallback={fallback || <div className="skeleton w-full h-48" />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Accessibility helper component
interface AccessibilityHelperProps {
  children: React.ReactNode;
  skipToContent?: boolean;
  announceNavigation?: boolean;
}

export const AccessibilityHelper: React.FC<AccessibilityHelperProps> = ({
  children,
  skipToContent = true,
  announceNavigation = true,
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    // Announce route changes for screen readers
    if (announceNavigation && typeof window !== 'undefined') {
      const handleRouteChange = () => {
        const title = document.title;
        setAnnouncement(`Navigated to ${title}`);
        setTimeout(() => setAnnouncement(''), 1000);
      };

      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, [announceNavigation]);

  return (
    <>
      {skipToContent && (
        <a 
          href="#main-content" 
          className="skip-link focus-visible"
          onClick={(e) => {
            e.preventDefault();
            const main = document.getElementById('main-content');
            main?.focus();
            main?.scrollIntoView();
          }}
        >
          Skip to main content
        </a>
      )}
      
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
      
      {children}
    </>
  );
};

// Service Worker registration
export const ServiceWorkerManager: React.FC = () => {
  useEffect(() => {
    if (
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator && 
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  return null;
};

// Bundle analyzer component (development only)
export const BundleAnalyzer: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Log bundle information
      console.group('Bundle Information');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('React version:', React.version);
      console.groupEnd();
    }
  }, []);

  return null;
};

// Main performance optimization provider
interface PerformanceProviderProps {
  children: React.ReactNode;
  enableMonitoring?: boolean;
  enablePreloading?: boolean;
  enableAccessibility?: boolean;
  enableServiceWorker?: boolean;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
  enableMonitoring = true,
  enablePreloading = true,
  enableAccessibility = true,
  enableServiceWorker = true,
}) => {
  return (
    <>
      {enablePreloading && <ResourcePreloader />}
      {enableMonitoring && <PerformanceMonitor />}
      {enableServiceWorker && <ServiceWorkerManager />}
      {process.env.NODE_ENV === 'development' && <BundleAnalyzer />}
      
      {enableAccessibility ? (
        <AccessibilityHelper>
          {children}
        </AccessibilityHelper>
      ) : (
        children
      )}
    </>
  );
};

export default PerformanceProvider;