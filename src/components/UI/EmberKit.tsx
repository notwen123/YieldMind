'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function OnyxCard({ children, className = "" }: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "glass-onyx p-8 rounded-[40px] border border-transparent",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function EmberButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = "",
  onClick
}: { 
  children: React.ReactNode, 
  variant?: 'primary' | 'secondary' | 'ghost',
  size?: 'sm' | 'md' | 'lg',
  className?: string,
  onClick?: () => void
}) {
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-brand-orange/90 shadow-[0_12px_40px_rgba(255,107,0,0.25)]",
    secondary: "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border",
    ghost: "bg-background/40 backdrop-blur-md border border-border text-foreground hover:bg-background/60 hover:border-foreground/20"
  };

  const sizes = {
    sm: "px-6 py-2.5 text-xs",
    md: "px-8 py-4 text-sm",
    lg: "px-10 py-5 text-base"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={cn(
        "rounded-[40px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export function GlassStat({ label, value, trend }: { label: string, value: string, trend?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-foreground font-outfit">{value}</span>
        {trend && <span className="text-[10px] font-bold text-emerald-600">{trend}</span>}
      </div>
    </div>
  );
}

