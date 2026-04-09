'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Settings, 
  Bell, 
  Search,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { DeltaGauge } from '@/components/Dashboard/DeltaGauge';
import { PoolStatus } from '@/components/Dashboard/PoolStatus';
import { AuditLogs, AuditLog } from '@/components/Dashboard/AuditLogs';
import { AgentControlPanel } from '@/components/Dashboard/AgentCommandCenter';
import { cn, formatCurrency } from '@/lib/utils';

export default function Dashboard() {
  const [delta, setDelta] = useState(0.012);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate delta drift
    const interval = setInterval(() => {
      setDelta(d => d + (Math.random() - 0.5) * 0.005);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const mockLogs: AuditLog[] = [
    {
      id: "LOG-8821",
      action: "REBALANCE",
      timestamp: "2 mins ago",
      txHash: "0x8e575a59c6a7ba3fb714e726e4a24e4ba10b1eda",
      status: "VALIDATED",
      details: "Neutralized 5.2% delta drift by increasing ETH short on Kraken."
    },
    {
      id: "LOG-8819",
      action: "DEPOSIT_LP",
      timestamp: "4 hours ago",
      txHash: "0xef7bf90afd82ca2fc0d09acbdd41b22038b04f1f",
      status: "VALIDATED",
      details: "Deposited 50 WETH / 125,000 USDC into Aerodrome ETH/USDC pool."
    },
    {
      id: "LOG-8818",
      action: "OPEN_HEDGE",
      timestamp: "4 hours ago",
      txHash: "0x7c9f58a1f5ed4d654a7e63a0142bb6912dcbb121",
      status: "VALIDATED",
      details: "Opened $125,000 short on ETH/USD via Kraken CLI."
    }
  ];

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-zinc-800 flex flex-col items-center py-8 gap-10 bg-zinc-950/50 backdrop-blur-xl z-50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]">
          <BrainCircuit className="w-8 h-8" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <SidebarIcon icon={<LayoutDashboard />} active />
          <SidebarIcon icon={<Wallet />} />
          <SidebarIcon icon={<History />} />
          <SidebarIcon icon={<Settings />} />
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <SidebarIcon icon={<Bell />} />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-zinc-800" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-20 p-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              YieldMind <span className="text-zinc-700 font-normal">/</span> <span className="text-zinc-500">Overview</span>
            </h1>
            <p className="text-zinc-500 mt-1 font-medium italic">Autonomous Delta-Neutral Liquidity Management</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Managed Capital</span>
              <span className="text-2xl font-bold text-white tabular-nums">{formatCurrency(245800)}</span>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Net Realized PnL</span>
              <span className="text-2xl font-bold text-green-500 tabular-nums">+{formatCurrency(12450.22)}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Top Row: Important Gauges */}
          <div className="col-span-12 lg:col-span-4 h-full">
            <DeltaGauge delta={delta} />
          </div>

          <div className="col-span-12 lg:col-span-8">
            <PoolStatus 
              poolName="ETH / USDC"
              apr={42.85}
              tvl={125000000}
              volatility={0.18}
            />
          </div>

          {/* Bottom Row: Controls & Logs */}
          <div className="col-span-12 lg:col-span-4">
            <AgentControlPanel />
          </div>

          <div className="col-span-12 lg:col-span-8">
            <div className="h-[400px]">
              <AuditLogs logs={mockLogs} />
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-4 gap-6">
          <StatCard title="Total Harvested" value="$42,102" change="+12.5%" />
          <StatCard title="Kraken Fees Paid" value="$2,451" change="-2.1%" />
          <StatCard title="Network Cost" value="$81.22" change="+0.5%" />
          <StatCard title="Reputation Score" value="98.2 / 100" color="text-indigo-400" />
        </div>
      </main>
    </div>
  );
}

function SidebarIcon({ icon, active = false }: { icon: React.ReactNode, active?: boolean }) {
  return (
    <div className={cn(
      "p-3 rounded-xl transition-all cursor-pointer group hover:bg-zinc-900",
      active ? "text-white bg-zinc-900" : "text-zinc-600 hover:text-zinc-300"
    )}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    </div>
  );
}

function StatCard({ title, value, change, color = "text-white" }: { title: string, value: string, change?: string, color?: string }) {
  return (
    <div className="bg-zinc-950/30 border border-zinc-900 rounded-2xl p-6">
      <h4 className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-2">{title}</h4>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-bold tabular-nums", color)}>{value}</span>
        {change && (
          <span className={cn(
            "text-[10px] font-bold tabular-nums",
            change.startsWith('+') ? "text-green-500" : "text-red-500"
          )}>{change}</span>
        )}
      </div>
    </div>
  );
}
