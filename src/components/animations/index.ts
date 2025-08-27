// Animation Components Export
export { default as FadeIn } from './FadeIn';
export { default as SlideIn } from './SlideIn';
export { default as ScaleIn } from './ScaleIn';
export { default as Parallax } from './Parallax';
export { default as StaggerContainer } from './StaggerContainer';

// Types
export interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
}

export interface DirectionalAnimationProps extends AnimationProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export interface ScaleAnimationProps extends AnimationProps {
  scale?: number;
  type?: 'spring' | 'ease' | 'bounce';
}

export interface ParallaxProps extends AnimationProps {
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: [string, string];
}

export interface StaggerProps extends AnimationProps {
  staggerDelay?: number;
}