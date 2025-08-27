'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion';

interface StaggerContainerProps {
  children: React.ReactNode;
  delay?: number;
  staggerDelay?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  delay = 0,
  staggerDelay = 0.1,
  className = '',
  once = true,
  threshold = 0.1,
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: once,
  });

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerDelay,
        when: 'beforeChildren',
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div variants={itemVariants} key={index}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggerContainer;