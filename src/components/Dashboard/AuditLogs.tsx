'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSearch, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { cn, formatAddress } from '@/lib/utils';

export interface AuditLog {
  id: string;
  action: 'DEPOSIT_LP' | 'OPEN_HEDGE' | 'REBALANCE' | 'EXIT';
  timestamp: string;
  txHash: string;
  status: 'VALIDATED' | 'PENDING' | 'FAILED';
  details: string;
}

interface AuditLogsProps {
  logs: AuditLog[];
}

export const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive (Live Feed physics)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [logs]);

  return (
    <div className="bg-transparent h-[450px] flex flex-col relative overflow-hidden">
      {/* Scroll indicator - Top/Bottom fades */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-20" />
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 py-12 pr-2 scrollbar-hide overflow-x-hidden"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-20">
              <FileSearch className="w-8 h-8 mb-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Institutional Trace...</span>
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                className="p-4 glass-precision border-l-2 border-l-brand-orange/30 hover:border-l-brand-orange transition-all group flex items-center justify-between gap-4 bg-foreground/[0.01] hover:bg-foreground/[0.03] active:scale-[0.99]"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500",
                    log.status === 'VALIDATED' 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                      : "bg-brand-orange/10 border-brand-orange/20 text-brand-orange shadow-[0_0_20px_rgba(255,107,0,0.05)]"
                  )}>
                    {log.status === 'VALIDATED' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-foreground font-bold text-[13px] uppercase tracking-widest truncate font-figtree">{log.action}</span>
                      <span className="text-zinc-600 dark:text-zinc-400 text-[10px] font-mono font-bold bg-foreground/10 px-2 py-0.5 rounded-full shrink-0 border border-border/50">{log.timestamp}</span>
                    </div>
                    <p className="text-zinc-700 dark:text-zinc-400 text-[12px] font-semibold truncate max-w-[380px] leading-tight group-hover:text-foreground transition-colors font-figtree">{log.details}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-zinc-700 dark:text-zinc-500 uppercase tracking-[0.25em] mb-1">Trace Hash</span>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 font-bold tracking-widest hover:text-brand-orange transition-colors cursor-help">
                      {formatAddress(log.txHash)}
                    </span>
                  </div>
                  
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                    target="_blank"
                    className="w-9 h-9 flex items-center justify-center bg-foreground/[0.03] border border-border rounded-xl text-zinc-500 hover:bg-brand-orange hover:text-white hover:border-brand-orange transition-all active:scale-90 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-20" />
    </div>
  );
};
