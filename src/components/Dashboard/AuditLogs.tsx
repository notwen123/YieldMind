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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-brand-orange" />
          <h3 className="text-foreground font-bold text-lg uppercase tracking-wider font-outfit">On-Chain Audit Trail</h3>
        </div>
        <div className="text-zinc-500 text-[10px] uppercase font-black tracking-widest bg-foreground/[0.05] border border-border px-2 py-1 rounded">
          ERC-8004 Validation
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-border">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-foreground/[0.02] border border-border rounded-xl hover:bg-foreground/[0.04] transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-1">
                    {log.status === 'VALIDATED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-brand-orange" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold text-sm tracking-tight">{log.action}</span>
                      <span className="text-zinc-500 text-[10px] font-mono font-bold">{log.timestamp}</span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-0.5 font-medium">{log.details}</p>
                  </div>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                  target="_blank"
                  className="p-2 bg-foreground/[0.05] border border-border rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-foreground/[0.1]"
                >
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </div>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-border">
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-tighter">AUDIT_ID: {log.id}</span>
                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-tighter">{formatAddress(log.txHash)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

