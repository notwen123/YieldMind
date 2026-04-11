'use client';

import React from 'react';
import { Droplets } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { OnyxCard, GlassStat } from '@/components/UI/EmberKit';

interface PoolStatusProps {
  poolName: string;
  apr: number;
  tvl: number;
  volatility: number;
}

export const PoolStatus: React.FC<PoolStatusProps> = ({ poolName, apr, tvl, volatility }) => {
  return (
    <OnyxCard className="relative overflow-hidden group border-border shadow-none">
      {/* Dynamic Status Header */}
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-foreground/[0.03] rounded-2xl flex items-center justify-center border border-border/10 shadow-inner group-hover:border-brand-orange/30 transition-colors duration-500">
            <Droplets className="w-6 h-6 text-brand-orange" />
          </div>
          <div>
            <h3 className="text-foreground font-black text-xl font-outfit uppercase tracking-tighter">{poolName}</h3>
            <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.25em]">Base · Aerodrome Institutional</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest leading-none">Live Harvesting</span>
        </div>
      </div>

      {/* Institutional Diagnostic Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <GlassStat 
          label="Incentive APR" 
          value={`${apr.toFixed(2)}%`} 
          trend="+2.4%" 
        />
        <GlassStat 
          label="Active TVL" 
          value={`${formatCurrency(tvl / 1_000_000)}M`} 
          trend="$125M Cap" 
        />
        <GlassStat 
          label="Risk Offset" 
          value={`${(volatility * 100).toFixed(1)}%`} 
          trend="0.18σ (99%)" 
        />
        <GlassStat 
          label="Hedge Ratio" 
          value="1:1 DELTA" 
          trend="0.18σ (99%)" 
        />
      </div>

      {/* Internal Atmospheric Trace */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/[0.02] blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    </OnyxCard>
  );
};

