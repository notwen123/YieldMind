'use client';

import React, { useState } from 'react';
import { Play, Pause, RefreshCcw, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface AgentControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
}

import { OnyxCard } from '@/components/UI/EmberKit';

export const AgentControlPanel: React.FC<AgentControlPanelProps> = ({ isActive, onToggle }) => {
  const [isRebalancing, setIsRebalancing] = useState(false);

  const triggerRebalance = async () => {
    setIsRebalancing(true);
    // Trigger immediate API cycle
    await fetch('/api/agent/cycle');
    setIsRebalancing(false);
  };

  return (
    <OnyxCard className="bg-background/60 transition-colors duration-500 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6">
        <div className={cn(
          "w-3 h-3 rounded-full animate-pulse ring-4 transition-all duration-1000",
          isActive ? "bg-emerald-500 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-zinc-500 ring-transparent"
        )} />
      </div>

      <h3 className="text-foreground font-black text-xl mb-8 flex items-center gap-3 tracking-tight font-outfit">
        <Zap className="w-6 h-6 text-brand-orange fill-brand-orange/20" />
        Agent Command <span className="text-zinc-500/30 font-light">Center</span>
      </h3>

      <div className="space-y-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={cn(
            "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 border shadow-2xl",
            isActive 
              ? "bg-foreground/5 border-rose-500/40 text-rose-500 hover:bg-rose-500/5" 
              : "bg-brand-orange border-brand-orange/50 text-white hover:bg-brand-orange/90 shadow-brand-orange/30"
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
            className="py-4 rounded-2xl bg-foreground/[0.05] border border-border text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-foreground/[0.08] hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
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
            className="py-4 rounded-2xl bg-foreground/[0.05] border border-border text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            Liquidate
          </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.25em]">Kraken CLI Engine</span>
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Operational
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.25em]">Aerodrome LP Feed</span>
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Synced
          </span>
        </div>
      </div>
    </OnyxCard>
  );
};

