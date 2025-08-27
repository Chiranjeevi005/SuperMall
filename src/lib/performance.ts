'use client';

import { useCallback, useRef, useEffect } from 'react';

// Hook for debouncing function calls
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// Hook for throttling function calls
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRunRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (now - lastRunRef.current >= delay) {
      lastRunRef.current = now;
      callback(...args);
    } else {
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        callback(...args);
      }, delay - (now - lastRunRef.current));
    }
  }, [callback, delay]) as T;
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const renderStartRef = useRef<number>(0);

  useEffect(() => {
    renderStartRef.current = performance.now();
    return () => {
      const renderTime = performance.now() - renderStartRef.current;
      console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    };
  }, [componentName]);

  const startRender = useCallback(() => {
    renderStartRef.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartRef.current;
    console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
  }, [componentName]);

  return { startRender, endRender };
}

// Utility function for lazy loading images
export function lazyLoadImage(
  imageElement: HTMLImageElement,
  placeholderSrc?: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (placeholderSrc) {
      imageElement.src = placeholderSrc;
    }

    const loadImage = () => {
      const img = new Image();
      img.onload = () => {
        imageElement.src = img.src;
        resolve();
      };
      img.onerror = reject;
      img.src = imageElement.dataset.src || '';
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.unobserve(imageElement);
          }
        });
      });

      observer.observe(imageElement);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      loadImage();
    }
  });
}

// Utility function for preloading critical resources
export function preloadResource(url: string, as: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to preload ${url}`));
    
    document.head.appendChild(link);
  });
}

// Utility function for measuring network performance
export async function measureNetworkPerformance(url: string): Promise<number> {
  const start = performance.now();
  try {
    const response = await fetch(url);
    await response.text(); // Consume the response body
    const end = performance.now();
    return end - start;
  } catch (error) {
    console.error('Network performance measurement failed:', error);
    return -1;
  }
}