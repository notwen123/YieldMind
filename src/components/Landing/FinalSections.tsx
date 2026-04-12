'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { EmberButton } from '@/components/UI/EmberKit';
import { ArrowUpRight, Globe, Activity, Zap } from 'lucide-react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export const SovereignCTA = () => {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  const router = useRouter();

  const handleInitialize = () => {
    if (isConnected) {
      router.push('/dashboard');
    } else if (openConnectModal) {
      openConnectModal();
    }
  };

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

  const nodeY = useTransform(smoothProgress, [0, 1], [-60, 60]);
  const nodeRotate = useTransform(smoothProgress, [0, 1], [-10, 10]);

  return (
    <section ref={containerRef} className="py-40 relative bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="relative glass-onyx rounded-[60px] border-border/50 p-20 overflow-hidden group">
          {/* Abstract Wave Anchor: Asset 2.png */}
          <motion.div 
            style={{ y: nodeY, rotate: nodeRotate }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-30 group-hover:opacity-60 transition-opacity duration-1000 grayscale group-hover:grayscale-0"
          >
            <Image 
              src="/2.png" 
              alt="The Yield Stream" 
              width={1000} 
              height={1000}
              className="w-full h-auto"
            />
          </motion.div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
              <Zap className="w-6 h-6 text-brand-orange fill-brand-orange" />
              <span className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-500">Immediate Access</span>
            </div>
            <h2 className="text-edge text-6xl md:text-8xl leading-[0.85] mb-12 text-gradient">
              The Future is <br />
              <span className="text-brand-orange">Sovereign.</span>
            </h2>
            <p className="text-zinc-500 text-xl font-medium leading-relaxed mb-12">
              The age of manual liquidity management is over. Join the 
              institutional core and let YieldMind orchestrate your capital with 
              cryptographic precision.
            </p>
            <EmberButton 
              size="lg" 
              className="w-full md:w-auto"
              onClick={handleInitialize}
            >
              Initialize Operations
            </EmberButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export const MegaFooter = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20
  });

  const monolithY = useTransform(smoothProgress, [0, 1], [100, -100]);

  return (
    <footer ref={containerRef} className="relative pt-40 pb-20 bg-background overflow-hidden border-t border-border/30">
      {/* Background Monolith Typography */}
      <motion.div 
        style={{ y: monolithY }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 pointer-events-none select-none opacity-[0.03] whitespace-nowrap"
      >
        <span className="text-[300px] md:text-[500px] font-black text-foreground font-bebas uppercase tracking-widest">
          YieldMind
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Brand Identity / Left Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-orange">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-black text-foreground font-bebas tracking-wide">YieldMind</span>
            </div>
            
            <p className="text-zinc-500 text-sm font-bold leading-relaxed max-w-xs uppercase tracking-widest opacity-70">
              © copyright YieldMind 2026. <br /> All institutional alpha reserved.
            </p>
          </div>

          {/* Links Grid / Right Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { title: "Pages", links: ["Yield Engine", "Institutional", "Governance", "Audits", "Documentation"] },
              { title: "Socials", links: ["Twitter / X", "Instagram", "GitHub", "LinkedIn"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
              { title: "Account", links: ["Connect Wallet", "Agent Login", "Forgot Passcode"] },
            ].map((cat, i) => (
              <div key={i} className="space-y-6">
                <h4 className="text-foreground font-black uppercase tracking-widest text-[11px] mb-8">{cat.title}</h4>
                <ul className="space-y-4">
                  {cat.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-zinc-500 hover:text-foreground text-sm font-bold transition-all flex items-center gap-1 group">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
