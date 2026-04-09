'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DeltaGaugeProps {
  delta: number;
}

export const DeltaGauge: React.FC<DeltaGaugeProps> = ({ delta }) => {
  // Normalize delta from -1 to 1 to 0 to 100
  const normalizedValue = ((delta + 1) / 2) * 100;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
      
      <h3 className="text-zinc-400 text-sm font-medium mb-4 uppercase tracking-widest">Portfolio Delta</h3>
      
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Gauge Background */}
        <div className="absolute bottom-0 w-48 h-48 border-[12px] border-zinc-800 rounded-full" />
        
        {/* Gauge Value */}
        <motion.div 
          className="absolute bottom-0 w-48 h-48 border-[12px] border-transparent rounded-full border-t-indigo-500 border-r-indigo-500"
          initial={{ rotate: -45 }}
          animate={{ rotate: -45 + (delta * 90) }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ transformOrigin: 'center' }}
        />

        {/* Needle */}
        <motion.div 
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom -translate-x-1/2 rounded-full"
          initial={{ rotate: -90 }}
          animate={{ rotate: delta * 90 }}
          transition={{ type: 'spring', damping: 15, stiffness: 80 }}
        />

        {/* Center Point */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-2 border-zinc-700 rounded-full z-10" />
      </div>

      <div className="mt-4 flex flex-col items-center">
        <span className="text-4xl font-bold text-white tabular-nums">
          {delta > 0 ? '+' : ''}{delta.toFixed(3)}
        </span>
        <span className={cn(
          "text-xs font-semibold mt-1 px-2 py-0.5 rounded-full",
          Math.abs(delta) < 0.05 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        )}>
          {Math.abs(delta) < 0.05 ? 'HEUTRAL' : 'DRIFTING'}
        </span>
      </div>
      
      <div className="absolute bottom-2 left-6 right-6 flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
        <span>Short Bias</span>
        <span>Neutral</span>
        <span>Long Bias</span>
      </div>
    </div>
  );
};
