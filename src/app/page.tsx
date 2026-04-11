'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  BrainCircuit, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Wallet 
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EmberButton, OnyxCard } from '@/components/UI/EmberKit';

import { Navbar } from '@/components/Navigation/Navbar';
import { TrustArchitecture } from '@/components/Landing/TrustArchitecture';
import { YieldMarket } from '@/components/Landing/YieldMarket';

export default function LandingPage() {
  return (
    <div className="relative bg-background text-foreground transition-colors duration-500 selection:bg-brand-orange/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-6 pt-32 overflow-hidden">
        {/* Animated Theme-Aware Blobs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground/5 border border-border text-zinc-500 mb-10 shadow-sm"
          >
            <Zap className="w-4 h-4 fill-brand-orange text-brand-orange" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase leading-none">Institutional Protocol v2.5</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-outfit font-black tracking-tight mb-10 leading-[0.8] text-foreground"
          >
            PURE <br /> 
            <span className="text-brand-orange ember-text-glow">LIQUIDITY.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-2xl font-medium leading-relaxed mb-16"
          >
            The world's most lovable autonomous hedge fund. <br />
            Ultra-smooth Delta-Neutral strategies for the elite LP.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <div className="scale-110">
              <ConnectButton label="Begin Investement" />
            </div>
            <Link href="/dashboard">
              <EmberButton variant="ghost" className="flex items-center gap-3">
                Trading Terminal <ArrowRight className="w-5 h-5" />
              </EmberButton>
            </Link>
          </motion.div>
        </div>


        {/* Floating Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 hidden md:flex"
        >
          <div className="w-px h-12 bg-gradient-to-b from-brand-orange/0 via-brand-orange to-brand-orange/0" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Institutional Protocol</span>
        </motion.div>
      </section>

      {/* Expanded Sections */}
      <YieldMarket />
      <TrustArchitecture />

      {/* Feature Grid (Condensed) */}
      <section className="py-32 px-6 relative border-t border-border/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BrainCircuit}
              title="Intelligence"
              desc="Real-time multi-pool scanning via PRISM API."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Verification"
              desc="ERC-8004 cryptographic proofs on Sepolia."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Neutrality"
              desc="Kraken-Native directional risk hedging."
            />
          </div>
        </div>
      </section>

      {/* Social Verification Footer */}
      <footer className="py-20 border-t border-border bg-background transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,107,0,0.2)]">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-foreground tracking-tight">YieldMind Corp.</h4>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-black leading-none mt-1">Sovereign Layer 0.1</p>
            </div>
          </div>
          <div className="text-zinc-500 text-sm font-medium">
            © 2026 YieldMind. Verifiable Autonomous Liquidity.
          </div>
        </div>
      </footer>
    </div>
  );
}


function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-10 rounded-[40px] bg-foreground/[0.02] border border-border backdrop-blur-sm group hover:border-brand-orange/20 transition-all duration-500"
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-8 group-hover:bg-brand-orange group-hover:text-white transition-all duration-500">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-4 font-outfit leading-none">{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

