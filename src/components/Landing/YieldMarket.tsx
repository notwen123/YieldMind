'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { OnyxCard } from '@/components/UI/EmberKit';
import { cn } from '@/lib/utils';

export function YieldMarket() {
  return (
    <section id="market" className="py-40 px-6 bg-background relative transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-brand-orange font-black uppercase tracking-[0.5em] text-[10px] mb-6"
            >
              Liquidity Engine
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bebas font-black text-foreground tracking-wide leading-[0.9]"
            >
              REAL-TIME <br />
              <span className="text-zinc-400/30">ALPHA STREAMS.</span>
            </motion.h2>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-end"
          >
            <span className="text-zinc-500 text-sm font-semibold mb-2">Total Managed Capacity</span>
            <span className="text-5xl font-black text-foreground font-bebas">$48.2M</span>
          </motion.div>
        </div>

        <OnyxCard className="overflow-hidden border-border transition-colors duration-500 !p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-foreground/[0.02]">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Strategy / Pool</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Target APR</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">TVL Capacity</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Risk Profile</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <MarketRow pool="WETH / USDC" apr="18.4%" tvl="$12.5M" risk="Delta-Neutral" active />
                <MarketRow pool="cbBTC / USDC" apr="14.2%" tvl="$8.2M" risk="Delta-Neutral" />
                <MarketRow pool="AERO / USDC" apr="42.8%" tvl="$4.1M" risk="Hedged-LP" />
                <MarketRow pool="DAI / USDS" apr="8.1%" tvl="$23.4M" risk="Stables-Only" />
              </tbody>
            </table>
          </div>
        </OnyxCard>
      </div>
    </section>
  );
}

function MarketRow({ pool, apr, tvl, risk, active = false }: { pool: string, apr: string, tvl: string, risk: string, active?: boolean }) {
  return (
    <motion.tr 
      whileHover={{ backgroundColor: "var(--color-brand-orange-alpha)" }}
      className="group transition-colors cursor-pointer"
    >
      <td className="px-10 py-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] border border-border flex items-center justify-center">
            <BarChart3 className={cn("w-5 h-5", active ? "text-brand-orange" : "text-zinc-500")} />
          </div>
          <span className="text-lg font-bold text-foreground font-bebas">{pool}</span>
        </div>
      </td>
      <td className="px-10 py-8">
        <span className="text-2xl font-black text-emerald-600 font-bebas">{apr}</span>
      </td>
      <td className="px-10 py-8">
        <span className="text-zinc-500 font-bold">{tvl}</span>
      </td>
      <td className="px-10 py-8">
        <span className="px-4 py-1.5 rounded-full bg-foreground/[0.05] text-zinc-500 text-[10px] font-black uppercase tracking-[0.1em]">
          {risk}
        </span>
      </td>
      <td className="px-10 py-8 text-right">
        <button className="text-zinc-500 group-hover:text-brand-orange transition-colors">
          <ArrowRight className="w-6 h-6" />
        </button>
      </td>
    </motion.tr>
  );
}

