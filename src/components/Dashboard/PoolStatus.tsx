'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Activity, Droplets } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface PoolStatusProps {
  poolName: string;
  apr: number;
  tvl: number;
  volatility: number;
}

export const PoolStatus: React.FC<PoolStatusProps> = ({ poolName, apr, tvl, volatility }) => {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30">
            <Droplets className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{poolName}</h3>
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Base · Aerodrome Finance</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
          <span className="text-green-400 text-xs font-bold uppercase tracking-widest">Active Harvesting</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Fee APR</span>
          </div>
          <span className="text-2xl font-bold text-white tabular-nums">{apr.toFixed(2)}%</span>
        </div>

        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">TVL</span>
          </div>
          <span className="text-2xl font-bold text-white tabular-nums">{formatCurrency(tvl / 1_000_000)}M</span>
        </div>

        <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Volatility</span>
          </div>
          <span className="text-2xl font-bold text-white tabular-nums">{(volatility * 100).toFixed(1)}%</span>
        </div>

        <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-400 text-xs font-medium uppercase tracking-wider">Hedge Ratio</span>
          </div>
          <span className="text-2xl font-bold text-indigo-400 tabular-nums">1:1</span>
        </div>
      </div>
    </div>
  );
};
