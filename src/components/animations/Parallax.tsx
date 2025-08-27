'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  offset?: ["start end" | "end start" | "start start" | "end end" | "start center" | "end center", "start end" | "end start" | "start start" | "end end" | "start center" | "end center"];
}

const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  direction = 'up',
  className = '',
  offset = ["start end", "end start"] as const,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const getTransform = () => {
    const distance = speed * 100;
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [-distance, distance]);
      default:
        return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
    }
  };

  const transform = getTransform();

  const getMotionStyle = () => {
    if (direction === 'left' || direction === 'right') {
      return { x: transform };
    }
    return { y: transform };
  };

  return (
    <motion.div
      ref={ref}
      style={getMotionStyle()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default Parallax;