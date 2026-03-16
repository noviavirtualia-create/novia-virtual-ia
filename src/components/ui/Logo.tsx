import React, { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  animate?: boolean;
  withGlint?: boolean;
  customSize?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className, 
  animate = false,
  withGlint = true,
  customSize
}) => {
  const id = useId();
  const gradientId = `logoGradient-${id.replace(/:/g, '')}`;
  const maskId = `nvMask-${id.replace(/:/g, '')}`;

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
    custom: customSize || ''
  };

  const container = (
    <div className={cn(
      "flex items-center justify-center relative",
      sizeClasses[size],
      className
    )}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E7AC9A" />
            <stop offset="100%" stopColor="#F7E7CE" />
          </linearGradient>
          <mask id={maskId}>
            <rect width="100" height="100" fill="white" />
            {/* NV in negative space */}
            <path 
              d="M25 25 L 25 75 M 25 25 L 75 75 M 75 25 L 75 75" 
              stroke="black" 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        {/* Diamond with rounded corners */}
        <motion.path
          d="M50 5 L 95 50 L 50 95 L 5 50 Z"
          fill={`url(#${gradientId})`}
          mask={`url(#${maskId})`}
          initial={animate ? { scale: 0.8, opacity: 0 } : { opacity: 1 }}
          animate={animate ? { scale: 1, opacity: 1 } : { opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Glint detail */}
        {withGlint && (
          <motion.circle
            cx="50"
            cy="15"
            r="2"
            fill="#F1E5AC"
            initial={animate ? { opacity: 0, scale: 0 } : {}}
            animate={animate ? { 
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1]
            } : { opacity: 0.8 }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ filter: 'blur(1px)' }}
          />
        )}
      </svg>
    </div>
  );

  return container;
};
