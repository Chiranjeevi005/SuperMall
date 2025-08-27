'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  showLoader?: boolean;
  onLoadComplete?: () => void;
  onError?: () => void;
  blurDataURL?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = '/images/placeholder.jpg',
  quality = 85,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  objectFit = 'cover',
  aspectRatio,
  showLoader = true,
  onLoadComplete,
  onError,
  blurDataURL,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for better lazy loading
  useEffect(() => {
    if (!imageRef.current || priority) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback(() => {
    if (imageSrc !== fallbackSrc) {
      setHasError(true);
      setIsLoading(false);
      setImageSrc(fallbackSrc);
      onError?.();
    } else {
      // If fallback also fails, show error state
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  }, [fallbackSrc, onError, imageSrc]);

  const containerStyle = aspectRatio ? { aspectRatio } : {};

  // Don't render anything if not visible yet (for lazy loading)
  if (!isVisible && !priority) {
    return (
      <div 
        ref={imageRef} 
        className={`relative overflow-hidden ${className}`} 
        style={containerStyle}
      >
        {showLoader && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div ref={imageRef} className={`relative overflow-hidden ${className}`} style={containerStyle}>
      {/* Loading Skeleton */}
      {isLoading && showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </motion.div>
      )}

      {/* Main Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="relative w-full h-full"
      >
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          style={{
            objectFit,
            width: '100%',
            height: '100%',
          }}
          className="transition-all duration-300"
        />
      </motion.div>

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;