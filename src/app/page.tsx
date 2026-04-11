'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-black text-white selection:bg-brand-orange/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        {/* Animated Accent Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] animate-pulse delay-700" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange mb-8"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Autonomous Alpha Generation</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-outfit font-black tracking-tight mb-8 leading-[0.9]"
          >
            THE SOVEREIGN <br /> 
            <span className="text-brand-orange ember-text-glow">EDGE</span> OF FINANCE.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl font-medium leading-relaxed mb-12"
          >
            Institutional-grade Delta-Neutral LP strategies, powered by AI and secured by on-chain audit trails. 
            Welcome to the future of autonomous liquidity management.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/dashboard" className="btn-premium flex items-center gap-3">
              Enter Terminal <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://github.com/notwen123/YieldMind" target="_blank" className="btn-ghost-premium">
              View Repository
            </a>
          </motion.div>
        </div>

        {/* Floating Stat Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-px h-12 bg-gradient-to-b from-brand-orange/0 via-brand-orange to-brand-orange/0" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Scroll to Explore</span>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BrainCircuit}
              title="Autonomous Intelligence"
              desc="Real-time multi-pool scanning and sentiment analysis via PRISM API and LangGraph."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Verifiable Audits"
              desc="Every rebalance is cryptographically signed and posted to the ERC-8004 Validation Registry."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Delta-Neutral Hedge"
              desc="Seamless integration with Kraken-CLI ensures directional risk is always neutralized."
            />
          </div>
        </div>
      </section>

      {/* Social Verification Footer */}
      <footer className="py-20 border-t border-onyx-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-black">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white tracking-tight">YieldMind AI</h4>
              <p className="text-xs text-zinc-600 uppercase tracking-widest font-black">Production Layer 0.1</p>
            </div>
          </div>
          <div className="text-zinc-500 text-sm">
            © 2026 YieldMind. Built for the Surge Hackathon. 
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
      className="p-10 rounded-[40px] bg-zinc-950/40 border border-white/5 backdrop-blur-sm group hover:border-brand-orange/20 transition-all duration-500"
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-8 group-hover:bg-brand-orange group-hover:text-black transition-all duration-500">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 font-outfit leading-none">{title}</h3>
      <p className="text-zinc-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}
