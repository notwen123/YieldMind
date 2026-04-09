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
  Activity
} from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-zinc-900 flex flex-col items-center py-8 gap-10 bg-black/40 backdrop-blur-3xl z-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-white/10">
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
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/20 p-[2px]">
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
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold tracking-tighter uppercase leading-none h-fit">Sepolia Layer</span>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
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
          
          {/* Top Row */}
          <div className="col-span-12 lg:col-span-4 h-full">
            <DeltaGauge value={agentState?.portfolioDelta || 0} />
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
            <div className="min-h-[460px] bg-zinc-950/20 rounded-3xl border border-white/5 p-8 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight">Verifiable Execution Logs</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">On-Chain Auditor: Active</span>
                </div>
              </div>
              <AuditLogs logs={logs} />
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-4 gap-6">
          <StatCard title="Accumulated Reputation" value="98.2 / 100" change="+2.4" color="text-indigo-400" />
          <StatCard title="Hedge Success Rate" value="99.8%" change="+0.1%" />
          <StatCard title="Kraken Volume" value="$1.2M" change="+14%" />
          <StatCard title="Audit Artifacts" value={logs.length.toString()} color="text-emerald-400" />
        </div>
      </main>
    </div>
  );
}

function SidebarIcon({ icon: Icon, active = false }: { icon: React.ElementType, active?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-2xl transition-all cursor-pointer group hover:bg-zinc-900 border border-transparent",
      active ? "text-white bg-indigo-600/10 border-indigo-500/20 shadow-inner" : "text-zinc-600 hover:text-zinc-300"
    )}>
      <Icon className="w-6 h-6" />
    </div>
  );
}

function StatCard({ title, value, change, color = "text-white" }: { title: string, value: string, change?: string, color?: string }) {
  return (
    <div className="bg-zinc-950/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm hover:border-white/10 transition-colors">
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
    </div>
  );
}
