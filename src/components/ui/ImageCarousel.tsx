'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

interface ImageCarouselProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
  showThumbnails?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  allowZoom?: boolean;
  aspectRatio?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className = '',
  showThumbnails = true,
  autoplay = false,
  autoplayInterval = 5000,
  allowZoom = false,
  aspectRatio = '16/9',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [dragStart, setDragStart] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoplayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, images.length, autoplayInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    setDragStart(clientX);
  };

  const handleDragEnd = (event: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'changedTouches' in event ? event.changedTouches[0].clientX : event.clientX;
    const dragDistance = dragStart - clientX;
    const threshold = 50;

    if (dragDistance > threshold) {
      goToNext();
    } else if (dragDistance < -threshold) {
      goToPrevious();
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (!images || images.length === 0) {
    return (
      <div className={`relative bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <ZoomIn className="w-12 h-12 mx-auto mb-2" />
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {/* Main Image Container */}
      <div 
        className="relative overflow-hidden rounded-lg bg-gray-100"
        style={{ aspectRatio }}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                goToNext();
              } else if (swipe > swipeConfidenceThreshold) {
                goToPrevious();
              }
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <OptimizedImage
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              width={600}
              height={400}
              className="w-full h-full"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Zoom overlay */}
            {allowZoom && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsZoomed(true)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Image Caption */}
        {images[currentIndex].caption && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 px-3 py-2 bg-black/50 text-white text-sm rounded-lg max-w-xs"
          >
            {images[currentIndex].caption}
          </motion.div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => goToSlide(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                index === currentIndex 
                  ? 'border-primary' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                width={64}
                height={64}
                className="w-full h-full"
                objectFit="cover"
                sizes="64px"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary/20" />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && !showThumbnails && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                width={1200}
                height={800}
                className="w-full h-full"
                objectFit="contain"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageCarousel;