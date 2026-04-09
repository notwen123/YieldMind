'use client';

import React, { useState } from 'react';
import { Play, Pause, RefreshCcw, Power, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const AgentControlPanel = () => {
  const [isActive, setIsActive] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);

  const toggleAgent = () => setIsActive(!isActive);
  
  const triggerRebalance = async () => {
    setIsRebalancing(true);
    // Simulate rebalance
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRebalancing(false);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4">
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          isActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" : "bg-zinc-700"
        )} />
      </div>

      <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-amber-500" />
        Agent Command Center
      </h3>

      <div className="space-y-4">
        <button
          onClick={toggleAgent}
          className={cn(
            "w-full py-4 rounded-xl font-bold text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border shadow-lg",
            isActive 
              ? "bg-zinc-900 border-red-500/50 text-red-500 hover:bg-red-500/10" 
              : "bg-indigo-500 border-indigo-400 text-white hover:bg-indigo-600 shadow-indigo-500/20"
          )}
        >
          {isActive ? (
            <><Pause className="w-5 h-5 fill-current" /> Stop Agent</>
          ) : (
            <><Play className="w-5 h-5 fill-current" /> Initialize Agent</>
          )}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={triggerRebalance}
            disabled={!isActive || isRebalancing}
            className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <motion.div
              animate={isRebalancing ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCcw className="w-4 h-4" />
            </motion.div>
            Rebalance
          </button>

          <button
            disabled={!isActive}
            className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            Emergency Exit
          </button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Kraken Connectivity</span>
          <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Active</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Aerodrome LP Feed</span>
          <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">Healthy</span>
        </div>
      </div>
    </div>
  );
};
