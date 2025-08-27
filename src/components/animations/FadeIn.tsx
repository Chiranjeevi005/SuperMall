'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 30,
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
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'none':
        return { opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getAnimateTransform = () => {
    return { x: 0, y: 0, opacity: 1 };
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialTransform()}
      animate={inView ? getAnimateTransform() : getInitialTransform()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;