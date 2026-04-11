'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { Fingerprint, Lock, ShieldAlert, ShieldCheck } from 'lucide-react';

export const SecurityFortress = () => {
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

  const shieldScale = useTransform(smoothProgress, [0, 0.5, 1], [0.8, 1, 0.9]);
  const shieldRotate = useTransform(smoothProgress, [0, 1], [-15, 15]);
  const shieldY = useTransform(smoothProgress, [0, 1], [-40, 40]);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden bg-mesh">
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Fortress Info */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-brand-orange" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Protocol Immunity</span>
            </div>
            <h2 className="text-5xl font-black text-foreground font-outfit leading-tight mb-8">
              The Fortress of <br />
              <span className="text-brand-orange">Sovereign Capital.</span>
            </h2>
            <p className="text-zinc-500 text-lg font-medium leading-relaxed mb-12">
              Security is not an overlay—it is the bedrock. YieldMind utilizes 
              EIP-1167 Minimal Proxy architecture to ensure every vault is 
              gas-efficient, immutable, and strictly decoupled from our 
              operational logic. Your capital, your sovereignty.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Fingerprint, label: "Biometric Proof", desc: "Multi-factor cryptographic signatures required for all treasury shifts." },
                { icon: ShieldCheck, label: "Vault Registry", desc: "Transparent, real-time auditability of every unit of capital on-chain." },
                { icon: ShieldAlert, label: "Anti-Drift Guard", desc: "Real-time circuit breakers that halt operations if variance exceeds 2%." },
                { icon: Lock, label: "Principal Lock", desc: "Automated hedging ensures the base currency never loses purchasing power." },
              ].map((feature, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-brand-orange" />
                    <h4 className="text-foreground font-black uppercase tracking-wider text-[10px]">{feature.label}</h4>
                  </div>
                  <p className="text-zinc-500 text-[10px] font-bold leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Anchor: Asset 4.png */}
          <motion.div
            style={{ scale: shieldScale, rotate: shieldRotate, y: shieldY }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-brand-orange/10 blur-[150px] rounded-full" />
              <div className="relative z-10 p-12 glass-onyx rounded-[60px] border-border/50">
                <Image 
                  src="/4.png" 
                  alt="Sovereign Shield of Capital" 
                  width={800} 
                  height={800}
                  className="w-full h-auto drop-shadow-[0_0_80px_rgba(255,107,0,0.3)]"
                />
                
                {/* Floating Tags */}
                <div className="absolute top-12 -left-8 p-4 glass-onyx rounded-2xl border-emerald-500/30 shadow-2xl">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Minimal Proxy</div>
                </div>
                <div className="absolute bottom-12 -right-8 p-4 glass-onyx rounded-2xl border-brand-orange/30 shadow-2xl">
                  <div className="text-[10px] font-black text-brand-orange uppercase tracking-widest">EIP-1167 Secure</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
