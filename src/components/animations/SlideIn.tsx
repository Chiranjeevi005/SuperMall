'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'left',
  delay = 0,
  duration = 0.8,
  distance = 100,
  threshold = 0.1,
  className = '',
  once = true,
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
  });

  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return { x: -distance, opacity: 0 };
      case 'right':
        return { x: distance, opacity: 0 };
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      default:
        return { x: -distance, opacity: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialTransform()}
      animate={inView ? { x: 0, y: 0, opacity: 1 } : getInitialTransform()}
      transition={{
        duration,
        delay,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;