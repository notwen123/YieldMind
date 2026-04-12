'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Bot, Cpu, Orbit, Sparkles } from 'lucide-react';

export const EngineBlueprint = () => {
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

  const coreRotate = useTransform(smoothProgress, [0, 1], [0, 90]);
  const coreY = useTransform(smoothProgress, [0, 1], [-50, 50]);
  
  const callout1Y = useTransform(smoothProgress, [0, 1], [-30, 30]);
  const callout2Y = useTransform(smoothProgress, [0, 1], [40, -40]);
  const callout3Y = useTransform(smoothProgress, [0, 1], [20, -20]);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.02]" />
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Cpu className="w-5 h-5 text-brand-orange" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Core Infrastructure</span>
          </div>
          <h2 className="text-5xl font-black text-foreground font-bebas leading-tight mb-8">
            The YieldMind <br />
            <span className="text-brand-orange">Sovereign Engine.</span>
          </h2>
          <p className="text-zinc-500 text-lg font-medium leading-relaxed">
            A multi-agent neural orchestrator designed for absolute precision. 
            By decoupling alpha generation from liquidity management, we achieve 
            unprecedented stability across all market regimes.
          </p>
        </div>

        <div className="relative flex justify-center items-center py-20">
          {/* Central Visual: Asset 5.png (Static Popup Entrance) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1.2, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2 
            }}
            className="relative z-10 w-full max-w-2xl"
          >
            <div className="absolute inset-0 bg-brand-orange/5 blur-[150px] rounded-full" />
            <Image 
              src="/5.png" 
              alt="Sovereign AI Core" 
              width={1000} 
              height={1000}
              className="w-full h-auto drop-shadow-[0_0_100px_rgba(255,107,0,0.1)]"
            />
          </motion.div>

          {/* Callout Features (Blueprint Style) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Callout 1: Neural Logic */}
            <motion.div 
              style={{ y: callout1Y }}
              className="absolute top-1/4 left-0 md:left-20 max-w-[240px] pointer-events-auto"
            >
              <div className="p-6 glass-onyx rounded-3xl border-border/50 group hover:border-brand-orange/50 transition-colors">
                <Bot className="w-6 h-6 text-brand-orange mb-4" />
                <h4 className="text-foreground font-black uppercase tracking-wider text-[10px] mb-2">Neural Orchestrator</h4>
                <p className="text-zinc-500 text-[10px] font-bold leading-relaxed">
                  Real-time pattern recognition across 40+ yield venues, scanning for arbitrage delta and liquidity shifts.
                </p>
              </div>
            </motion.div>

            {/* Callout 2: Execution Layer */}
            <motion.div 
              style={{ y: callout2Y }}
              className="absolute bottom-1/4 right-0 md:right-20 max-w-[240px] pointer-events-auto"
            >
              <div className="p-6 glass-onyx rounded-3xl border-border/50 group hover:border-brand-orange/50 transition-colors">
                <Sparkles className="w-6 h-6 text-brand-orange mb-4" />
                <h4 className="text-foreground font-black uppercase tracking-wider text-[10px] mb-2">Flash-Sync Protocol</h4>
                <p className="text-zinc-500 text-[10px] font-bold leading-relaxed">
                  Sub-millisecond trade execution powered by high-throughput RPC nodes directly integrated with the vault logic.
                </p>
              </div>
            </motion.div>

            {/* Callout 3: Risk Shield */}
            <motion.div 
              style={{ y: callout3Y }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[280px] max-w-[280px] pointer-events-auto"
            >
              <div className="p-6 glass-onyx rounded-3xl border-border/50 group hover:border-brand-orange/50 transition-colors flex items-center gap-6">
                <Orbit className="w-10 h-10 text-brand-orange flex-shrink-0" />
                <div>
                  <h4 className="text-foreground font-black uppercase tracking-wider text-[10px] mb-1">Delta-Neutral Guard</h4>
                  <p className="text-zinc-500 text-[10px] font-bold leading-relaxed">
                    Automated hedging cycles ensure the principal balance remains decoupled from underlying asset volatility.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
