'use client';

import React from 'react';
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
  return (
    <div className="bg-transparent h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-foreground/5 overflow-x-hidden">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 glass-precision glass-precision-hover group relative overflow-hidden flex flex-col gap-4"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center border shadow-inner",
                    log.status === 'VALIDATED' 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                      : "bg-brand-orange/10 border-brand-orange/20 text-brand-orange"
                  )}>
                    {log.status === 'VALIDATED' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-black text-xs uppercase tracking-widest font-outfit">{log.action}</span>
                      <span className="text-zinc-600 text-[9px] font-mono font-bold tracking-tighter bg-foreground/5 px-1.5 py-0.5 rounded uppercase">{log.timestamp}</span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1 font-medium leading-relaxed">{log.details}</p>
                  </div>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                  target="_blank"
                  className="p-3 bg-foreground/[0.03] border border-border rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-orange hover:text-white hover:border-brand-orange active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border/5 relative z-10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-0.5">Audit ID</span>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-tighter">{log.id}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-0.5">Trace Hash</span>
                  <span className="text-[10px] font-mono text-brand-orange font-bold uppercase tracking-tighter">{formatAddress(log.txHash)}</span>
                </div>
              </div>

              {/* Atmospheric internal glow */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-orange/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

