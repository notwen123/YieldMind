"use client";

import React from 'react';
import { motion } from 'framer-motion';

export interface DeltaGaugeProps {
  value: number; // -1 to 1
  label?: string;
}

export const DeltaGauge: React.FC<DeltaGaugeProps> = ({ value, label = "Portfolio Delta" }) => {
  // Map value (-1 to 1) to rotation (-90 to 90)
  const rotation = Math.max(-90, Math.min(90, value * 90));
  
  // Color mapping sync with Noir Palette
  const getColor = (v: number) => {
    const absV = Math.abs(v);
    if (absV < 0.05) return 'text-emerald-500';
    if (absV < 0.2) return 'text-brand-orange';
    return 'text-rose-500';
  };

  const getStrokeColor = (v: number) => {
    const absV = Math.abs(v);
    if (absV < 0.05) return '#10b981'; // emerald-500
    if (absV < 0.2) return '#FF6B00'; // brand-orange
    return '#f43f5e'; // rose-500
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 glass-precision relative overflow-hidden group">
      <div className="relative w-48 h-24 overflow-hidden mb-4">
        {/* Gauge Background Plate */}
        <div className="absolute top-0 left-0 w-48 h-48 border-[10px] border-foreground/[0.03] rounded-full shadow-inner" />
        
        {/* Active Luminescent Segment */}
        <svg className="absolute top-0 left-0 w-48 h-48 -rotate-180 transform origin-center z-10">
          <motion.circle
            cx="96"
            cy="96"
            r="86"
            fill="transparent"
            stroke={getStrokeColor(value)}
            strokeWidth="10"
            strokeDasharray={270}
            initial={{ strokeDashoffset: 270 }}
            animate={{ strokeDashoffset: 270 - (Math.abs(value) * 135) }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            style={{ 
              transformOrigin: 'center',
              rotate: value < 0 ? '-180deg' : '0deg',
              filter: `drop-shadow(0 0 8px ${getStrokeColor(value)}44)`
            }}
          />
        </svg>

        {/* Surgical Needle Component */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-[1.5px] h-20 bg-foreground/40 origin-bottom -translate-x-1/2 z-20"
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-foreground rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center justify-center">
            <div className="w-1 h-1 bg-background rounded-full" />
          </div>
        </motion.div>
      </div>

      <div className="text-center relative z-10">
        <h3 className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.25em] mb-1">{label}</h3>
        <div className={`text-4xl font-black font-bebas tabular-nums tracking-widest ${getColor(value)}`}>
          {value > 0 ? '+' : ''}{(value * 100).toFixed(2)}
          <span className="text-lg opacity-50 ml-1">%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 w-full mt-8 text-[8px] font-black font-mono uppercase tracking-widest relative z-10">
        <div className="text-zinc-500 text-left border-l border-border/20 pl-2">Short</div>
        <div className="text-zinc-400 text-center">Neutral</div>
        <div className="text-zinc-500 text-right border-r border-border/20 pr-2">Long</div>
      </div>

      {/* Atmospheric Background Trace */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-foreground/[0.02] blur-3xl rounded-full" />
    </div>
  );
};
