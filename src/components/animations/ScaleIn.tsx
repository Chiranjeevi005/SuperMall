'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, Transition } from 'framer-motion';

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  scale?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  type?: 'spring' | 'ease' | 'bounce';
}

const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  scale = 0.3,
  threshold = 0.1,
  className = '',
  once = true,
  type = 'spring',
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
  });

  const getTransition = (): Transition => {
    switch (type) {
      case 'spring':
        return {
          type: 'spring' as const,
          stiffness: 300,
          damping: 30,
          delay,
        };
      case 'bounce':
        return {
          duration,
          delay,
          ease: 'backOut',
        };
      case 'ease':
      default:
        return {
          duration,
          delay,
          ease: 'easeOut',
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ scale, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale, opacity: 0 }}
      transition={getTransition()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;