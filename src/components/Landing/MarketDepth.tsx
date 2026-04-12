'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { BarChart3, Globe, LineChart, MoveUpRight, Zap } from 'lucide-react';
import { YieldMarket } from './YieldMarket';

export const MarketDepth = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const terminalY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const sidecarY = useTransform(smoothProgress, [0, 1], [40, -40]);

  return (
    <section ref={containerRef} className="py-32 relative bg-background border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          {/* Market Intel Column */}
          <div className="xl:col-span-5 pt-12">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-brand-orange" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Global Liquidity Pulse</span>
            </div>
            <h2 className="text-5xl font-black text-foreground font-bebas leading-[1.1] mb-8">
              Navigating the <br />
              <span className="text-brand-orange">Institutional Stream.</span>
            </h2>
            <p className="text-zinc-500 text-lg font-medium leading-relaxed mb-12">
              YieldMind scans the cryptographic horizon across 40+ chains and 
              1,200+ liquidity venues. Our agent identifies depth before the 
              market reacts, ensuring your capital is always positioned in the 
              highest-velocity alpha streams.
            </p>

            <div className="space-y-6">
              {[
                { icon: LineChart, label: "Predictive Variance", value: "0.02%", desc: "Mean deviation from neural price targets" },
                { icon: BarChart3, label: "Execution Depth", value: "$4.2B", desc: "Available liquidity across integrated pools" },
              ].map((stat, i) => (
                <div key={i} className="flex gap-6 p-6 glass-onyx rounded-[32px] border-border/50 group hover:border-brand-orange/30 transition-all">
                  <div className="p-4 rounded-2xl bg-brand-orange/5 text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-foreground font-black uppercase tracking-wider text-xs">{stat.label}</span>
                      <span className="text-brand-orange font-bold text-lg">{stat.value}</span>
                    </div>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wide">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Asset 13.png Sidecar */}
            <motion.div
              style={{ y: sidecarY }}
              className="mt-12 relative h-40 w-full glass-onyx rounded-[32px] border-border/50 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-orange/5 to-transparent z-10" />
              <Image 
                src="/13.png" 
                alt="Institutional Candlestick Analysis" 
                fill
                className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 uppercase font-black text-[9px] tracking-widest text-zinc-400">
                  <Zap className="w-3 h-3 text-brand-orange fill-brand-orange" />
                  Real-Time Engine Sync
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Data Terminal Column */}
          <div className="xl:col-span-7">
            <motion.div
              style={{ y: terminalY }}
              className="relative p-1 glass-onyx rounded-[40px] border-border/30 shadow-2xl overflow-hidden"
            >
              {/* Terminal Label */}
              <div className="absolute top-8 left-8 z-30 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-white/5">
                  <LineChart className="w-4 h-4 text-brand-orange" />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-[9px]">Execution Terminal v2.4</h4>
                  <p className="text-zinc-500 font-bold text-[8px] uppercase tracking-widest">Verified On-Chain Oracle</p>
                </div>
              </div>

              {/* Data Component */}
              <div className="relative z-20 pt-20 pb-8 px-4 h-[700px] overflow-hide scrollbar-none">
                <YieldMarket />
                {/* Visual Depth Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
              
              {/* Institutional Legend */}
              <div className="absolute bottom-8 right-8 z-30">
                <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-border">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-white font-black text-[9px] uppercase tracking-widest">Low Latency</span>
                  </div>
                  <div className="w-[1px] h-4 bg-border" />
                  <MoveUpRight className="w-4 h-4 text-brand-orange" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
