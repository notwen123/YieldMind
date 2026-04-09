'use client';

import React, { useState } from 'react';
import { Play, Pause, RefreshCcw, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface AgentControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
}

export const AgentControlPanel: React.FC<AgentControlPanelProps> = ({ isActive, onToggle }) => {
  const [isRebalancing, setIsRebalancing] = useState(false);

  const triggerRebalance = async () => {
    setIsRebalancing(true);
    // Trigger immediate API cycle
    await fetch('/api/agent/cycle');
    setIsRebalancing(false);
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group backdrop-blur-md">
      <div className="absolute top-0 right-0 p-6">
        <div className={cn(
          "w-3 h-3 rounded-full animate-pulse ring-4",
          isActive ? "bg-emerald-500 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-zinc-800 ring-transparent"
        )} />
      </div>

      <h3 className="text-white font-black text-xl mb-8 flex items-center gap-3 tracking-tight">
        <Zap className="w-6 h-6 text-amber-500 fill-amber-500/20" />
        Agent Command <span className="text-zinc-700 font-light">Center</span>
      </h3>

      <div className="space-y-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={cn(
            "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 border shadow-2xl",
            isActive 
              ? "bg-[#0c0c0c] border-rose-500/40 text-rose-500 hover:bg-rose-500/5" 
              : "bg-indigo-600 border-indigo-400/50 text-white hover:bg-indigo-700 shadow-indigo-600/30"
          )}
        >
          {isActive ? (
            <><Pause className="w-5 h-5 fill-current" /> Deactivate Agent</>
          ) : (
            <><Play className="w-5 h-5 fill-current" /> Initialize Operation</>
          )}
        </motion.button>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={triggerRebalance}
            disabled={!isActive || isRebalancing}
            className="py-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
          >
            <motion.div
              animate={isRebalancing ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <RefreshCcw className="w-4 h-4" />
            </motion.div>
            Sync Delta
          </button>

          <button
            disabled={!isActive}
            className="py-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Liquidate
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.25em]">Kraken CLI Engine</span>
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Operational
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.25em]">Aerodrome LP Feed</span>
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Synced
          </span>
        </div>
      </div>
    </div>
  );
};
