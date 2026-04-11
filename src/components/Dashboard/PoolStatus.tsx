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

import { OnyxCard } from '@/components/UI/EmberKit';

export const PoolStatus: React.FC<PoolStatusProps> = ({ poolName, apr, tvl, volatility }) => {
  return (
    <OnyxCard className="bg-background/60 transition-colors duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center border border-brand-orange/20">
            <Droplets className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-foreground font-bold text-lg font-outfit">{poolName}</h3>
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Base · Aerodrome Finance</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest leading-none">Active Harvesting</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-foreground/[0.03] rounded-2xl border border-border">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Fee APR</span>
          </div>
          <span className="text-2xl font-black text-foreground tabular-nums font-outfit">{apr.toFixed(2)}%</span>
        </div>

        <div className="p-6 bg-foreground/[0.03] rounded-2xl border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">TVL</span>
          </div>
          <span className="text-2xl font-black text-foreground tabular-nums font-outfit">{formatCurrency(tvl / 1_000_000)}M</span>
        </div>

        <div className="p-6 bg-foreground/[0.03] rounded-2xl border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Volatility</span>
          </div>
          <span className="text-2xl font-black text-foreground tabular-nums font-outfit">{(volatility * 100).toFixed(1)}%</span>
        </div>

        <div className="p-6 bg-brand-orange/5 rounded-2xl border border-brand-orange/20">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-brand-orange" />
            <span className="text-brand-orange text-[10px] font-black uppercase tracking-wider">Hedge Ratio</span>
          </div>
          <span className="text-2xl font-black text-brand-orange tabular-nums font-outfit">1:1</span>
        </div>
      </div>
    </OnyxCard>
  );
};

