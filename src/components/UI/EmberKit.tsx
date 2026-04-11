'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const OnyxCard = ({ children, className, glow = false }: CardProps) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "relative rounded-[32px] overflow-hidden border border-white/5 bg-zinc-950/40 backdrop-blur-xl p-8 transition-colors hover:border-white/10",
        glow && "shadow-[0_0_50px_rgba(255,107,0,0.05)]",
        className
      )}
    >
      {/* Subtle internal gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const EmberButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}: ButtonProps) => {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-10 py-4 text-base"
  };

  const variants = {
    primary: "bg-brand-orange text-black hover:bg-orange-400 ember-glow",
    ghost: "bg-transparent text-white border border-white/10 hover:bg-white/5"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-full font-black uppercase tracking-widest transition-all duration-300",
        sizes[size],
        variants[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

