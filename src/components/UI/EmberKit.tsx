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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "glass-precision p-8 rounded-[24px]",
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
    primary: "bg-brand-orange text-white hover:bg-brand-orange/90 glow-gate border-brand-orange/20 shadow-[0_4px_20px_rgba(255,107,0,0.15)]",
    secondary: "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border glass-precision",
    ghost: "bg-background/20 backdrop-blur-xl border border-border/50 text-foreground hover:bg-background/40 hover:border-foreground/20 glass-precision"
  };

  const sizes = {
    sm: "px-5 py-2 text-[10px]",
    md: "px-7 py-3 text-xs",
    lg: "px-10 py-4 text-sm"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onClick={onClick}
      className={cn(
        "rounded-2xl font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 border shadow-sm",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export function GlassStat({ label, value, trend, className = "" }: { label: string, value: string, trend?: string, className?: string }) {
  return (
    <div className={cn(
      "glass-precision p-8 rounded-[24px] group/stat cursor-default transition-all duration-500 hover:-translate-y-1",
      className
    )}>
      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600 mb-4 block group-hover/stat:text-brand-orange transition-colors">
        {label}
      </span>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-3xl font-black text-foreground font-outfit tabular-nums tracking-tighter leading-none">
          {value}
        </span>
        {trend && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[9px] font-bold text-emerald-500">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}

