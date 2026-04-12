'use client';

import React, { useState } from 'react';
import { Play, Pause, RefreshCcw, ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TerminalLog } from './AgentTerminal';

export interface AgentControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
  terminalLogs: TerminalLog[];
}

import { OnyxCard } from '@/components/UI/EmberKit';

export const AgentControlPanel: React.FC<AgentControlPanelProps> = ({ isActive, onToggle, terminalLogs }) => {
  const [isRebalancing, setIsRebalancing] = useState(false);

  const triggerRebalance = async () => {
    setIsRebalancing(true);
    // Trigger immediate API cycle
    await fetch('/api/agent/cycle');
    setIsRebalancing(false);
  };

  return (
    <OnyxCard className="relative overflow-hidden group border-border shadow-none">
      {/* Precision Vital Sign */}
      <div className="absolute top-8 right-8 flex items-center gap-2">
        <span className={cn(
          "text-[8px] font-black uppercase tracking-[0.2em] transition-colors duration-500",
          isActive ? "text-emerald-500" : "text-zinc-600"
        )}>
          {isActive ? "Engine Active" : "Standby"}
        </span>
        <div className={cn(
          "w-2 h-2 rounded-full transition-all duration-1000",
          isActive ? "bg-emerald-500 shadow-[0_0_12px_var(--glow-ember)] animate-pulse" : "bg-zinc-800"
        )} />
      </div>

      <h3 className="text-foreground font-black text-xl mb-10 flex items-center gap-3 tracking-widest font-bebas uppercase">
        <Zap className={cn("w-5 h-5 transition-colors duration-500", isActive ? "text-brand-orange" : "text-zinc-600")} />
        Agent Command <span className="text-zinc-700">Center</span>
      </h3>

      <div className="space-y-6">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={cn(
            "w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 border",
            isActive 
              ? "bg-foreground/[0.03] border-rose-500/30 text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/50" 
              : "bg-brand-orange border-brand-orange/20 text-white hover:bg-brand-orange/90 glow-gate"
          )}
        >
          {isActive ? (
            <><Pause className="w-4 h-4 fill-current" /> Terminate Operation</>
          ) : (
            <><Play className="w-4 h-4 fill-current" /> Initialize Sequence</>
          )}
        </motion.button>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={triggerRebalance}
            disabled={!isActive || isRebalancing}
            className="py-4 rounded-xl bg-foreground/[0.07] border border-border/40 text-foreground/70 font-black text-[9px] uppercase tracking-[0.25em] hover:bg-foreground/[0.1] hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all group/btn"
          >
            <motion.div
              animate={isRebalancing ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-brand-orange"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </motion.div>
            Delta Sync
          </button>

          <button
            disabled={!isActive}
            className="py-4 rounded-xl bg-foreground/[0.07] border border-border/40 text-foreground/70 font-black text-[9px] uppercase tracking-[0.25em] hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500/70" />
            Liquidate
          </button>
        </div>
      </div>

      <div className="mt-10 pt-10 border-t border-border/5 space-y-4">
        <div className="flex items-center justify-between group/status">
          <div className="flex flex-col">
            <span className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.25em] mb-1">Compute Environment</span>
            <span className="text-[10px] font-bold text-foreground font-bebas uppercase">Kraken CLI Engine v4</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between group/status">
          <div className="flex flex-col">
            <span className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.25em] mb-1">Liquidity Feed</span>
            <span className="text-[10px] font-bold text-foreground font-bebas uppercase">Aerodrome Base LP</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
          </div>
        </div>
      </div>

      {/* Internal Atmos Glow */}
      <div className={cn(
        "absolute -left-20 -bottom-20 w-48 h-48 blur-[100px] rounded-full transition-all duration-[2000ms] pointer-events-none",
        isActive ? "bg-emerald-500/10 opacity-100" : "bg-brand-orange/5 opacity-0"
      )} />
    </OnyxCard>
  );
};

