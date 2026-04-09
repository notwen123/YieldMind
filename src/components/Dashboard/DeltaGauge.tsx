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
  
  // Color mapping: 0 = emerald, extremes = rose
  const getColor = (v: number) => {
    const absV = Math.abs(v);
    if (absV < 0.05) return 'text-emerald-400';
    if (absV < 0.2) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getStrokeColor = (v: number) => {
    const absV = Math.abs(v);
    if (absV < 0.05) return '#34d399';
    if (absV < 0.2) return '#fbbf24';
    return '#fb7185';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Gauge Background */}
        <div className="absolute top-0 left-0 w-48 h-48 border-[12px] border-slate-800 rounded-full" />
        
        {/* Active Gauge Segment */}
        <svg className="absolute top-0 left-0 w-48 h-48 -rotate-180 transform origin-center">
          <motion.circle
            cx="96"
            cy="96"
            r="84"
            fill="transparent"
            stroke={getStrokeColor(value)}
            strokeWidth="12"
            strokeDasharray={264}
            initial={{ strokeDashoffset: 264 }}
            animate={{ strokeDashoffset: 264 - (Math.abs(value) * 132) }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ 
              transformOrigin: 'center',
              rotate: value < 0 ? '-180deg' : '0deg'
            }}
          />
        </svg>

        {/* Needle */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom -translate-x-1/2"
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </motion.div>
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-widest">{label}</h3>
        <div className={`text-3xl font-bold font-mono mt-1 ${getColor(value)}`}>
          {value > 0 ? '+' : ''}{(value * 100).toFixed(2)}%
        </div>
      </div>
      
      <div className="grid grid-cols-3 w-full mt-6 text-[10px] text-slate-500 font-mono uppercase">
        <div className="text-left">Short</div>
        <div className="text-center">Neutral</div>
        <div className="text-right">Long</div>
      </div>
    </div>
  );
};
