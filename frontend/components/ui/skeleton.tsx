'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  radius?: string;
  className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  radius = 'md',
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        block
        animate-pulse
        bg-[var(--pink-primary)]/20
        rounded-${radius}
        ${className}
      `}
      style={{ width, height }}
    />
  );
};