'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  ChevronRight, 
  Maximize2, 
  X, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Hash,
  ArrowRight,
  Database
} from 'lucide-react';
import { useBlockNumber } from 'wagmi';
import { cn } from '@/lib/utils';
import { Portal } from '@/components/UI/Portal';

export interface TerminalLog {
  id: string;
  type: 'INFO' | 'SYSTEM' | 'DEPLOYING' | 'TX' | 'ERROR';
  message: string;
  timestamp: string;
}

interface AgentTerminalProps {
  logs: TerminalLog[];
  className?: string;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({ logs, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const expandedScrollRef = useRef<HTMLDivElement>(null);

  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  // Auto-scroll logic 
  useEffect(() => {
    const target = isExpanded ? expandedScrollRef.current : scrollRef.current;
    if (target) {
      target.scrollTo({
        top: target.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs, isExpanded]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const lastTx = logs.filter(l => l.type === 'TX').pop();

  return (
    <>
      {/* Inline Terminal (Mini-Audit) */}
      <motion.div 
        layoutId="terminal-container"
        className={cn(
          "bg-black/95 rounded-xl border border-white/5 overflow-hidden flex flex-col font-mono text-[10px] shadow-2xl group/term",
          className
        )}
      >
        <div className="px-3 py-2 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-[8px]">Agent_Console</span>
          </div>
          <button 
            onClick={() => setIsExpanded(true)}
            className="opacity-0 group-hover/term:opacity-100 p-1 rounded hover:bg-white/5 text-zinc-600 hover:text-brand-orange transition-all"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[120px] scrollbar-hide">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-zinc-700 shrink-0">[{log.timestamp.split(':').slice(0, 2).join(':')}]</span>
              <span className={cn(
                "shrink-0 font-bold",
                log.type === 'DEPLOYING' && "text-brand-orange",
                log.type === 'SYSTEM' && "text-emerald-500",
                log.type === 'TX' && "text-blue-400"
              )}>{log.type}:</span>
              <span className="text-zinc-400 truncate">{log.message}</span>
            </div>
          ))}
          {logs.length === 0 && <span className="text-zinc-800 italic">_ Awaiting handshake...</span>}
        </div>
      </motion.div>

      {/* SOVEREIGN FOCUS MODE overlay (Portaled to Body) */}
      <AnimatePresence>
        {isExpanded && (
          <Portal>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 lg:p-16">
              {/* Immersive Backdrop - No layoutId here to prevent coordinate locking */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsExpanded(false)}
                className="fixed inset-0 bg-black/95 backdrop-blur-[40px] cursor-zoom-out"
              />

              {/* Scanline / CRT Texture Overlay - Optimized for Total Authority */}
              <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,0,0.03),rgba(0,0,255,0.08))] bg-[length:100%_3px,4px_100%] animate-scanline" />

              {/* Full-Screen Workspace - Redesigned for High-End Production Glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  mass: 0.8
                }}
                className="relative w-full h-full z-20 overflow-hidden flex flex-col rounded-[24px] p-[1px] group"
              >
                {/* 
                  THE SPECTRAL GLOW ENGINE 
                  - Conic gradient rotating behind a masked border 
                  - Outer glow layer for atmospheric bleed
                */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-[24px]">
                  {/* Outer Glow Bleed */}
                  <div className="absolute inset-0 bg-brand-orange/20 blur-[120px] opacity-60" />
                  
                  {/* Static Gradient Frame (Non-Rotating) */}
                  <div className="absolute inset-0 bg-brand-orange shadow-[0_0_20px_rgba(249,115,22,0.4)] opacity-50" />
                  <div className="absolute inset-0 border border-brand-orange/30 rounded-[24px]" />
                </div>

                {/* Main Content Container (Sitting above the glow) */}
                <div className="relative z-10 w-full h-full bg-[#050505] rounded-[23px] overflow-hidden flex flex-col shadow-2xl">
                  {/* Institutional Header (Control Bar) */}
                  <div className="h-16 px-8 bg-white/[0.04] border-b border-white/[0.05] flex items-center justify-between backdrop-blur-xl">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-brand-orange" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">System State</span>
                          <span className="text-sm font-bold text-foreground font-bebas uppercase tracking-widest">Sovereign Focus: Active</span>
                        </div>
                      </div>
                      
                      <div className="h-8 w-[1px] bg-white/5" />

                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Network Vitals</span>
                          <span className="text-sm font-bold text-foreground font-bebas uppercase tracking-widest">Sepolia Node / Synced</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 group cursor-help">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-zinc-400 group-hover:text-foreground transition-colors uppercase tracking-[0.2em] font-mono">YM-PROTOCOL_v4.2</span>
                      </div>
                      <button 
                        onClick={() => setIsExpanded(false)}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white hover:border-white/20 transition-all flex items-center gap-3 px-5 group"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest group-hover:tracking-[0.2em] transition-all whitespace-nowrap">Close Handshake [ESC]</span>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

              {/* Main Content Area: Split Pane Layout */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: The Massive Terminal Stream */}
                <div className="flex-1 flex flex-col p-8 border-r border-white/5 bg-gradient-to-b from-transparent to-white/[0.01]">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TerminalIcon className="w-4 h-4 text-brand-orange" />
                      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Direct Audit Stream / Execution</h2>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600">Buffer_Size: {logs.length} Lines</div>
                  </div>

                  <div 
                    ref={expandedScrollRef}
                    className="flex-1 overflow-y-auto space-y-2 pr-4 scrollbar-hide font-mono text-sm"
                  >
                    {logs.map((log) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4 group hover:bg-white/[0.02] p-1 rounded transition-colors"
                      >
                        <span className="text-zinc-400 shrink-0 select-none font-bold">[{log.timestamp}]</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black shrink-0 uppercase tracking-widest h-fit mt-0.5 border",
                          log.type === 'DEPLOYING' ? "bg-brand-orange/20 border-brand-orange/40 text-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.2)]" :
                          log.type === 'SYSTEM' ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" :
                          log.type === 'TX' ? "bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]" :
                          "bg-white/10 border-white/20 text-white"
                        )}>
                          {log.type}
                        </div>
                        <span className={cn(
                          "leading-relaxed transition-colors font-medium",
                          log.type === 'ERROR' ? "text-rose-400 font-bold" : "text-white"
                        )}>
                          {log.message}
                        </span>
                      </motion.div>
                    ))}
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-white/5 mt-8">
                      <ChevronRight className="w-5 h-5 text-brand-orange animate-pulse" />
                      <div className="w-3 h-6 bg-brand-orange/40 animate-pulse" />
                      <span className="text-zinc-700 italic text-[10px] uppercase tracking-widest font-mono">Standing by for next block confirmation...</span>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Transaction Inspector & Sidebar */}
                <div className="w-[420px] bg-white/[0.01] p-8 flex flex-col gap-6 backdrop-blur-3xl border-l border-white/[0.03]">
                  
                  {/* Transaction Inspector Glass Card */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange mb-6 flex items-center gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" /> 
                       On-Chain_Inspector
                    </h3>
                    
                    {lastTx ? (
                      <div className="space-y-5">
                        <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.05] group hover:border-brand-orange/30 transition-all">
                          <span className="text-[9px] font-black text-zinc-500 block mb-3 uppercase tracking-widest">Active_Hash_Evidence</span>
                          <code className="text-[11px] text-blue-400 break-all leading-relaxed font-mono block">
                            {lastTx.message.split(': ').pop()}
                          </code>
                        </div>
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${lastTx.message.split(': ').pop()}`}
                          target="_blank"
                          className="w-full py-4 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 text-brand-orange font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-3 group shadow-lg shadow-orange-950/20"
                        >
                          Verify Settlement <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </div>
                    ) : (
                    <div className="py-8 px-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest font-mono">Sepolia_Pulse</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[10px] font-mono text-emerald-500">{(blockNumber || 0).toString()}</span>
                        </div>
                      </div>
                      
                      <div className="h-[1px] w-full bg-white/[0.03]" />
                      
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest font-mono">Live_Data_Sniffer</span>
                        <div className="font-mono text-[9px] text-zinc-500 space-y-1 overflow-hidden h-24">
                          <div className="opacity-40 select-none">0x{Math.random().toString(16).slice(2, 40)}...</div>
                          <div className="opacity-60 select-none">MATCHING_SIG_712: 0x8b32...</div>
                          <div className="text-emerald-500 animate-pulse">VAL_SYNC_SUCCESS :: TIER_0</div>
                          <div className="opacity-40 select-none">0x{Math.random().toString(16).slice(2, 40)}...</div>
                          <div className="opacity-30 select-none cursor-default">SCANNING_EPOCH_{Math.floor(Date.now()/10000)}...</div>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>

                  {/* Engine Vitals Glass Card */}
                  <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] shadow-xl">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-6 flex items-center gap-3">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       Engine_Vitals_Telemetry
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                      <VitalItem label="Logic_Mode" value="Institutional" status="Active" />
                      <VitalItem label="Risk_Offset" value="Balanced" status="Nominal" />
                      <VitalItem label="Delta_Skew" value="+0.04%" status="Stable" />
                      <VitalItem label="Gas_Limit" value="2.5M" status="Optimal" />
                    </div>
                  </div>

                  {/* Network Pulse Visualization */}
                  <div className="mt-auto rounded-3xl border border-white/[0.05] p-6 bg-white/[0.01] shadow-inner">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Telemetry</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Heartbeat_Live</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">12ms Latency</span>
                    </div>
                    <div className="h-14 flex items-end gap-1.5 overflow-hidden">
                      {Array.from({length: 24}).map((_, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: [15, 25 + Math.random() * 25, 15] }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.08 }}
                          className="flex-1 bg-gradient-to-t from-emerald-500/40 to-emerald-400 rounded-t-[2px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
                </div>
                
                {/* Bottom Decorative Edge */}
                <div className="h-1 bg-gradient-to-r from-transparent via-brand-orange/20 to-transparent" />
              </motion.div>
          </div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};

function VitalItem({ label, value, status }: { label: string, value: string, status?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">{label}</span>
        {status && (
          <span className="text-[7px] font-bold text-emerald-500/60 uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
            {status}
          </span>
        )}
      </div>
      <span className="text-[11px] font-black text-white uppercase tracking-[0.1em] font-mono leading-none">
        {value}
      </span>
      <div className="h-[1px] w-8 bg-zinc-800" />
    </div>
  );
}
