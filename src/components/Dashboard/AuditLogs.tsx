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
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-bold text-lg uppercase tracking-wider">On-Chain Audit Trail</h3>
        </div>
        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest bg-zinc-900 px-2 py-1 rounded">
          ERC-8004 Validation
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:bg-zinc-900/60 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-1">
                    {log.status === 'VALIDATED' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-200 font-bold text-sm tracking-tight">{log.action}</span>
                      <span className="text-zinc-600 text-[10px] font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-0.5">{log.details}</p>
                  </div>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${log.txHash}`}
                  target="_blank"
                  className="p-2 bg-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700"
                >
                  <ExternalLink className="w-3 h-3 text-zinc-300" />
                </a>
              </div>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-zinc-800/50">
                <span className="text-[10px] font-mono text-zinc-600">AUDIT_ID: {log.id}</span>
                <span className="text-[10px] font-mono text-zinc-600">{formatAddress(log.txHash)}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
