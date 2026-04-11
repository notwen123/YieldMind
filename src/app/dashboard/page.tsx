'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export default function Dashboard() {
  const [agentState, setAgentState] = useState<any>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isAuto, setIsAuto] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load persisted logs on mount
  useEffect(() => {
    setIsMounted(true);
    fetch('/api/agent/logs')
      .then(r => r.json())
      .then(setLogs)
      .catch(() => {});
  }, []);

  // Polling logic for autonomous mode
  useEffect(() => {
    if (!isAuto) return;
    let interval: any;

    const fetchCycle = async () => {
      try {
        const res = await fetch('/api/agent/cycle');
        const state = await res.json();
        setAgentState(state);

        if (state.lastAction && state.lastAction !== 'MONITOR_IDLE' && state.lastAction !== 'IDLE') {
          // Refresh logs from DB after each action
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

  useEffect(() => { setIsMounted(true); }, []);
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
    <div className="min-h-screen bg-black text-zinc-400 font-inter selection:bg-brand-orange/30 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-onyx-border flex flex-col items-center py-8 gap-10 bg-black/40 backdrop-blur-3xl z-50">
        <div className="w-12 h-12 bg-brand-orange rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,107,0,0.3)] border border-white/10">
          <BrainCircuit className="w-8 h-8" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <SidebarIcon icon={LayoutDashboard} active />
          <SidebarIcon icon={Wallet} />
          <SidebarIcon icon={Terminal} />
          <SidebarIcon icon={Settings} />
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <SidebarIcon icon={Bell} />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-orange to-orange-400 border border-white/20 p-[2px]">
            <div className="w-full h-full bg-zinc-900 rounded-full" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-20 p-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 font-bold tracking-tighter uppercase leading-none h-fit">Sepolia Layer</span>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 font-outfit">
                YieldMind <span className="text-zinc-800 font-light">/</span> <span className="text-zinc-500 font-medium">Dashboard</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-sm font-medium italic opacity-70">Autonomous Delta-Neutral LP via Kraken CLI</p>
          </div>

          <div className="flex items-center gap-8 bg-zinc-950/40 p-5 rounded-2xl border border-white/5 ring-1 ring-white/5">
            <div className="flex flex-col items-end">
              <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">Managed Equity</span>
              <span className="text-2xl font-black text-white tabular-nums drop-shadow-sm">{formatCurrency(agentState?.portfolioValue || 245800)}</span>
            </div>
            <div className="h-10 w-px bg-zinc-800/50" />
            <div className="flex flex-col items-end">
              <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">Total Realized PnL</span>
              <span className="text-2xl font-black text-emerald-500 tabular-nums">+{formatCurrency(12450.22)}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Intelligence Feed */}
          <div className="col-span-12 lg:col-span-4 translate-y-[-1px]">
            <OnyxCard className="h-full border-brand-orange/10" glow>
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="w-5 h-5 text-brand-orange" />
                <h3 className="text-lg font-bold text-white font-outfit">AI Cognition Stream</h3>
              </div>
              <div className="space-y-4">
                <IntelligenceItem time="12:45:01" status="SCANNING" text="Evaluating Aerodrome/Base APR spread..." />
                <IntelligenceItem time="12:44:22" status="HEDGING" text="Rebalancing delta via Kraken paper-trade engine." />
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
            <OnyxCard className="min-h-[460px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-brand-orange" />
                  <h3 className="text-lg font-bold text-white tracking-tight font-outfit">Verifiable Execution Logs</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-brand-orange/10 border border-brand-orange/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest leading-none">On-Chain Auditor: Active</span>
                </div>
              </div>
              <AuditLogs logs={logs} />
            </OnyxCard>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-4 gap-6">
          <StatCard title="Accumulated Reputation" value="98.2 / 100" change="+2.4" color="text-brand-orange" />
          <StatCard title="Hedge Success Rate" value="99.8%" change="+0.1%" />
          <StatCard title="Kraken Volume" value="$1.2M" change="+14%" />
          <StatCard title="Audit Artifacts" value={logs.length.toString()} color="text-emerald-400" />
        </div>
      </main>
    </div>
  );
}

function IntelligenceItem({ time, status, text }: { time: string, status: string, text: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="text-[10px] text-zinc-600 font-mono pt-1">{time}</div>
      <div className="flex flex-col">
        <div className="text-[10px] font-black text-brand-orange tracking-widest mb-1">{status}</div>
        <div className="text-sm text-zinc-400 group-hover:text-white transition-colors">{text}</div>
      </div>
    </div>
  );
}

function SidebarIcon({ icon: Icon, active = false }: { icon: React.ElementType, active?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl transition-all cursor-pointer group hover:bg-zinc-900 border border-transparent",
      active ? "text-black bg-brand-orange border-white/20 shadow-inner" : "text-zinc-600 hover:text-zinc-300"
    )}>
      <Icon className="w-6 h-6" />
    </div>
  );
}

function StatCard({ title, value, change, color = "text-white" }: { title: string, value: string, change?: string, color?: string }) {
  return (
    <OnyxCard className="p-8">
      <h4 className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">{title}</h4>
      <div className="flex items-baseline gap-3">
        <span className={cn("text-3xl font-black tabular-nums tracking-tighter", color)}>{value}</span>
        {change && (
          <span className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
            change.startsWith('+') ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
          )}>{change}</span>
        )}
      </div>
    </OnyxCard>
  );
}
