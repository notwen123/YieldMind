'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { OnyxCard } from '@/components/UI/EmberKit';

export function TrustArchitecture() {
  return (
    <section id="trust" className="py-40 px-6 relative bg-background overflow-hidden transition-colors duration-500">
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-orange/[0.05] rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-500 font-black uppercase tracking-[0.5em] text-[10px] mb-6"
          >
            Institutional Guardrails
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bebas font-black text-foreground tracking-wide leading-[0.9]"
          >
            TRUSTED BY CODE. <br />
            <span className="text-zinc-400/30">VERIFIED BY DESIGN.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <ArchitectureCard 
            icon={Cpu}
            title="Autonomous Logic"
            points={[
              "Real-time liquidity depth analysis",
              "Sentiment-aware rebalancing",
              "Latency-minimized LP management"
            ]}
            delay={0.1}
          />
          <ArchitectureCard 
            icon={Shield}
            title="Kraken-Native Sealing"
            points={[
              "Direct API directional hedging",
              "Isolation of delta-neutral risk",
              "Sub-second market neutrality"
            ]}
            delay={0.2}
            highlight
          />
          <ArchitectureCard 
            icon={Fingerprint}
            title="Verifiable Audits"
            points={[
              "ERC-8004 cryptographic proofs",
              "ValidationRegistry immutability",
              "Non-repudiable rebalance logs"
            ]}
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}

function ArchitectureCard({ icon: Icon, title, points, delay, highlight = false }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
    >
      <OnyxCard className={highlight ? "border-brand-orange/20 shadow-[0_20px_60px_rgba(255,107,0,0.12)] bg-background/60" : "border-border shadow-xl bg-background/60"}>
        <div className="w-20 h-20 rounded-[24px] bg-foreground/[0.03] border border-border flex items-center justify-center text-brand-orange mb-10 shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="w-10 h-10" />
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-8 font-bebas tracking-wide">{title}</h3>
        <ul className="space-y-6">
          {points.map((point: string, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <div className="w-5 h-5 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-brand-orange" />
              </div>
              <span className="text-zinc-500 text-sm font-semibold leading-snug">{point}</span>
            </li>
          ))}
        </ul>
      </OnyxCard>
    </motion.div>
  );
}


