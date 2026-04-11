'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { OnyxCard } from '@/components/UI/EmberKit';
import { AreaChart, Layers, PieChart } from 'lucide-react';

export const NarrativeSection = () => {
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

  const assetY = useTransform(smoothProgress, [0, 1], [-80, 80]);
  const assetRotate = useTransform(smoothProgress, [0, 1], [-5, 5]);

  return (
    <section ref={containerRef} className="py-32 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Visual Anchor: Asset 10.png */}
          <motion.div
            style={{ y: assetY, rotate: assetRotate }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-orange/10 blur-[120px] rounded-full" />
            <div className="relative z-10 p-12 glass-onyx rounded-[40px] border-border/50">
              <Image 
                src="/10.png" 
                alt="Yield Distribution Analysis" 
                width={800} 
                height={800}
                className="w-full h-auto drop-shadow-[0_0_50px_rgba(255,107,0,0.2)]"
              />
              {/* Overlay Stat */}
              <div className="absolute -bottom-6 -right-6 p-6 glass-onyx rounded-3xl border-brand-orange/30 shadow-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Optimization</span>
                </div>
                <div className="text-3xl font-black text-foreground font-outfit">98.4%</div>
                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Efficiency Delta</div>
              </div>
            </div>
          </motion.div>

          {/* Narrative Info */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <PieChart className="w-5 h-5 text-brand-orange" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">The Problem Space</span>
              </div>
              <h2 className="text-5xl font-black text-foreground font-outfit leading-tight mb-8">
                The Paradox of <br />
                <span className="text-brand-orange">Static Liquidity.</span>
              </h2>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed">
                In today&apos;s hyper-volatile markets, capital efficiency is a moving target. 
                Traditional yield strategies are either too rigid to capture transient alpha 
                or too exposed to systemic downside. We built YieldMind to solve the 
                institutional dilemma of risk versus return.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <OnyxCard className="p-8">
                <Layers className="w-6 h-6 text-brand-orange mb-4" />
                <h4 className="text-foreground font-black uppercase tracking-wider text-xs mb-3">Fragmentation</h4>
                <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                  Liquidity is trapped across isolated pools, leading to sub-optimal 
                  utilization and high opportunity costs for institutional treasuries.
                </p>
              </OnyxCard>

              <OnyxCard className="p-8">
                <AreaChart className="w-6 h-6 text-brand-orange mb-4" />
                <h4 className="text-foreground font-black uppercase tracking-wider text-xs mb-3">Volatility Risk</h4>
                <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                  Unhedged exposure in high-yield protocols often results in 
                  drawdowns that exceed the realized annual percentage rate.
                </p>
              </OnyxCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
