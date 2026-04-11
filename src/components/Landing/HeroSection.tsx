'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { EmberButton } from '@/components/UI/EmberKit';
import { MousePointer2, ShieldCheck, Zap } from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export const HeroSection = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleEnterTerminal = () => {
    if (isConnected) {
      router.push('/dashboard');
    } else if (openConnectModal) {
      openConnectModal();
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
    restDelta: 0.001
  });

  // Parallax Layers
  const blobY1 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const blobY2 = useTransform(smoothProgress, [0, 1], [0, -50]);
  const textY = useTransform(smoothProgress, [0, 1], [0, -200]);
  const opacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-mesh pt-10"
    >
      {/* Cryptographic Grain Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      
      {/* Background Decorative Elements (Parallax) */}
      <motion.div 
        style={{ y: blobY1 }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-orange/5 blur-[120px] rounded-full" 
      />
      <motion.div 
        style={{ y: blobY2 }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full" 
      />

      <motion.div 
        style={{ y: textY, opacity }}
        className="container mx-auto px-6 relative z-10"
      >
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Typography Edge */}
          <motion.h1
            className="text-edge text-7xl md:text-[150px] leading-[0.85] mb-10 text-gradient"
          >
            Autonomous <br />
            <span className="text-brand-orange">Alpha.</span>
          </motion.h1>

          {/* Informative Subtitle */}
          <motion.p
            className="text-zinc-500 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed mb-12"
          >
            The world&apos;s first institutional-grade AI orchestrator for Delta-Neutral yield. 
            Engineered for clarity, transparency, and absolute cryptographic sovereignty.
          </motion.p>

          {/* CTA Complex */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <EmberButton 
              size="lg" 
              className="group"
              onClick={handleEnterTerminal}
            >
              Enter Terminal
              <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </EmberButton>
            
            <button className="px-10 py-5 rounded-[40px] font-black uppercase tracking-[0.2em] text-xs text-zinc-500 hover:text-foreground transition-all flex items-center gap-3 group">
              <ShieldCheck className="w-5 h-5 text-brand-orange/50 group-hover:text-brand-orange transition-colors" />
              Audit Reports
            </button>
          </div>
        </div>
      </motion.div>

      {/* Institutional Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-brand-orange/50 to-transparent" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 vertical-text">
          Mathematical Narrative
        </span>
      </motion.div>
    </div>
  );
};
