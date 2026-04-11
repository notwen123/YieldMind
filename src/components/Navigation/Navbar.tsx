'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Menu, X, ArrowUpRight } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4",
      scrolled ? "pt-4" : "pt-8"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500",
        "glass-onyx",
        scrolled ? "shadow-xl border-border/20" : "bg-transparent border-transparent shadow-none"
      )}>
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(255,107,0,0.2)] group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-6 h-6 shrink-0" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-outfit font-black text-foreground text-lg tracking-tight">YieldMind</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Live Engine</span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/#market">Market</NavLink>
          <NavLink href="/#trust">Trust</NavLink>
          <NavLink href="/#strategy">Strategy</NavLink>
          <div className="w-px h-6 bg-border" />
          <Link href="/dashboard" className="text-zinc-500 hover:text-foreground transition-colors text-sm font-bold flex items-center gap-1 group">
            Terminal <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
          </Link>
        </div>

        {/* Auth / Toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="hidden sm:block scale-90 origin-right">
            <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
          </div>
        </div>
      </div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-24 left-6 right-6 p-6 rounded-[32px] glass-onyx md:hidden z-50"
          >
            <div className="flex flex-col gap-6 text-center">
              <MobileNavLink href="/#market" onClick={() => setIsMobileMenuOpen(false)}>Market</MobileNavLink>
              <MobileNavLink href="/#trust" onClick={() => setIsMobileMenuOpen(false)}>Trust</MobileNavLink>
              <MobileNavLink href="/#strategy" onClick={() => setIsMobileMenuOpen(false)}>Strategy</MobileNavLink>
              <Link href="/dashboard" className="text-brand-orange font-bold uppercase tracking-widest text-sm py-4 border-t border-border">
                Launch Terminal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-bold text-zinc-400 hover:text-foreground transition-colors tracking-wide uppercase">
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="text-lg font-bold text-foreground hover:text-brand-orange transition-colors uppercase tracking-[0.2em]"
    >
      {children}
    </Link>
  );
}

