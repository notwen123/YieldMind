'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ConnectButton 
} from '@rainbow-me/rainbowkit';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Settings, 
  Bell, 
  BrainCircuit,
  Terminal,
  Activity,
  Cpu,
  Shield,
  Search
} from 'lucide-react';
import { OnyxCard, EmberButton } from '@/components/UI/EmberKit';
import { DeltaGauge } from '@/components/Dashboard/DeltaGauge';
import { PoolStatus } from '@/components/Dashboard/PoolStatus';
import { AuditLogs, AuditLog } from '@/components/Dashboard/AuditLogs';
import { AgentControlPanel } from '@/components/Dashboard/AgentCommandCenter';
import { cn, formatCurrency } from '@/lib/utils';
import { ThemeToggle } from '@/components/Navigation/ThemeToggle';

export default function Dashboard() {
  const [agentState, setAgentState] = useState<any>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isAuto, setIsAuto] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/agent/logs')
      .then(r => r.json())
      .then(setLogs)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuto) return;
    let interval: any;

    const fetchCycle = async () => {
      try {
        const res = await fetch('/api/agent/cycle');
        const state = await res.json();
        setAgentState(state);

        if (state.lastAction && state.lastAction !== 'MONITOR_IDLE' && state.lastAction !== 'IDLE') {
          fetch('/api/agent/logs')
            .then(r => r.json())
            .then(setLogs)
            .catch(() => {});
        }
      } catch (e) {
        console.error('Dashboard fetch failed:', e);
      }
    };

    fetchCycle();
    interval = setInterval(fetchCycle, 10000);
    return () => clearInterval(interval);
  }, [isAuto]);

  if (!isMounted) return null;

  const currentPool = agentState?.currentPool || {
    token0: 'ETH',
    token1: 'USDC',
    apr: 42.85,
    tvl: 125000000,
    score: 88,
    price: 2450
  };

  return (
    <div className="min-h-screen bg-background text-foreground/70 font-inter selection:bg-brand-orange/10 overflow-x-hidden transition-colors duration-500">
      {/* Sidebar - Pearl Frost */}
      <aside className="fixed left-0 top-0 bottom-0 w-24 border-r border-border flex flex-col items-center py-10 gap-12 bg-background/60 backdrop-blur-3xl z-50 shadow-sm transition-colors duration-500">
        <div className="w-14 h-14 bg-brand-orange rounded-2xl flex items-center justify-center text-white shadow-[0_8px_24px_rgba(255,107,0,0.2)]">
          <BrainCircuit className="w-8 h-8" />
        </div>
        
        <nav className="flex flex-col gap-8">
          <SidebarIcon icon={LayoutDashboard} active />
          <SidebarIcon icon={Wallet} />
          <SidebarIcon icon={Terminal} />
          <SidebarIcon icon={Settings} />
        </nav>

        <div className="mt-auto flex flex-col gap-8 items-center">
          <ThemeToggle />
          <SidebarIcon icon={Bell} />
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-orange to-orange-400 border border-border p-[2px] shadow-sm">
            <div className="w-full h-full bg-foreground/10 rounded-full" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-24 p-12 max-w-[1700px] mx-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] bg-foreground/5 text-brand-orange border border-border font-black uppercase tracking-[0.2em] leading-none h-fit">Network: Sepolia</span>
              <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3 font-outfit">
                YieldMind <span className="text-zinc-200 font-light">/</span> <span className="text-zinc-400 font-medium">Alpha Terminal</span>
              </h1>
            </div>
            <p className="text-zinc-400 text-sm font-semibold tracking-wide">Autonomous Delta-Neutral Liquidity via Kraken CLI</p>
          </div>

          <div className="flex items-center gap-10 bg-background/40 p-6 rounded-[40px] border border-border shadow-sm backdrop-blur-3xl transition-colors duration-500">
            <div className="flex flex-col items-end">
              <span className="text-zinc-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Managed Equity</span>
              <span className="text-3xl font-black text-foreground tabular-nums font-outfit">{formatCurrency(agentState?.portfolioValue || 245800)}</span>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="flex flex-col items-end">
              <span className="text-zinc-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Total Yield</span>
              <span className="text-3xl font-black text-emerald-600 tabular-nums font-outfit">+{formatCurrency(12450.22)}</span>
            </div>
            <div className="scale-110">
              <ConnectButton chainStatus="icon" showBalance={false} accountStatus="avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-10">
          
          {/* Intelligence Feed */}
          <div className="col-span-12 lg:col-span-4">
            <OnyxCard className="h-full bg-background/60">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground font-outfit tracking-tight">AI Cognition</h3>
              </div>
              <div className="space-y-6">
                <IntelligenceItem time="12:45:01" status="SCANNING" text="Evaluating Aerodrome/Base APR spread..." />
                <IntelligenceItem time="12:44:22" status="HEDGING" text="Rebalancing delta via Kraken engine." />
                <IntelligenceItem time="12:42:15" status="AUDIT" text="Post-trade checkpoint verified on Sepolia." />
                <IntelligenceItem time="12:40:00" status="IDLE" text="Monitoring liquidity depth for WETH/USDC." />
              </div>
            </OnyxCard>
          </div>

          <div className="col-span-12 lg:col-span-8">
            <PoolStatus 
              poolName={`${currentPool.token0} / ${currentPool.token1}`}
              apr={currentPool.apr}
              tvl={currentPool.tvl}
              volatility={0.18}
            />
          </div>

          {/* Controls */}
          <div className="col-span-12 lg:col-span-4">
            <AgentControlPanel 
              isActive={isAuto} 
              onToggle={() => setIsAuto(!isAuto)} 
            />
          </div>

          {/* Logs */}
          <div className="col-span-12 lg:col-span-8">
            <OnyxCard className="h-full bg-background/60">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground tracking-tight font-outfit">Auditor Execution Stream</h3>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">Trust Engine: Active</span>
                </div>
              </div>
              <AuditLogs logs={logs} />
            </OnyxCard>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard title="Protocol Reputation" value="98.2 / 100" change="+2.4" color="text-brand-orange" />
          <StatCard title="Hedge Accuracy" value="99.8%" change="+0.1%" />
          <StatCard title="Market Depth" value="$1.2M" change="+14%" />
          <StatCard title="Trust Artifacts" value={logs.length.toString()} color="text-emerald-600" />
        </div>
      </main>
    </div>
  );
}

function IntelligenceItem({ time, status, text }: { time: string, status: string, text: string }) {
  return (
    <div className="flex gap-5 group">
      <div className="text-[10px] text-zinc-400 font-mono pt-1.5 font-bold">{time}</div>
      <div className="flex flex-col">
        <div className="text-[9px] font-black text-brand-orange tracking-[0.2em] mb-1">{status}</div>
        <div className="text-sm text-zinc-500 group-hover:text-foreground transition-colors font-medium">{text}</div>
      </div>
    </div>
  );
}

function SidebarIcon({ icon: Icon, active = false }: { icon: React.ElementType, active?: boolean }) {
  return (
    <div className={cn(
      "p-5 rounded-3xl transition-all duration-500 cursor-pointer group border-2",
      active ? "text-white bg-zinc-950 dark:bg-zinc-100 dark:text-black border-zinc-950 dark:border-zinc-100 shadow-xl scale-110" : "text-zinc-300 hover:text-foreground border-transparent hover:bg-foreground/5"
    )}>
      <Icon className="w-7 h-7" />
    </div>
  );
}

function StatCard({ title, value, change, color = "text-foreground" }: { title: string, value: string, change?: string, color?: string }) {
  return (
    <OnyxCard className="p-8 bg-foreground/[0.02] border-border flex flex-col justify-between">
      <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">{title}</h4>
      <div className="flex items-baseline justify-between gap-4">
        <span className={cn("text-3xl font-black tabular-nums tracking-tighter font-outfit", color)}>{value}</span>
        {change && (
          <span className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full",
            change.startsWith('+') ? "text-emerald-600 bg-emerald-500/10" : "text-rose-600 bg-rose-500/10"
          )}>{change}</span>
        )}
      </div>
    </OnyxCard>
  );
}

