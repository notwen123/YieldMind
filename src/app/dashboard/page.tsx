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
  Search,
  ChevronRight
} from 'lucide-react';
import { OnyxCard, EmberButton, GlassStat } from '@/components/UI/EmberKit';
import { DeltaGauge } from '@/components/Dashboard/DeltaGauge';
import { PoolStatus } from '@/components/Dashboard/PoolStatus';
import { AuditLogs, AuditLog } from '@/components/Dashboard/AuditLogs';
import { AgentControlPanel } from '@/components/Dashboard/AgentCommandCenter';
import { cn, formatCurrency } from '@/lib/utils';
import { ThemeToggle } from '@/components/Navigation/ThemeToggle';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
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

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground/70 font-inter selection:bg-brand-orange/10 overflow-x-hidden transition-colors duration-200">
      
      {/* Clinical Sidebar - Horizontal Expansion */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border flex flex-col py-8 px-6 bg-background z-50">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="text-xl font-black text-foreground font-outfit uppercase tracking-tight">YieldMind</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <SidebarIcon icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarIcon icon={Wallet} label="Sovereign Wallet" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          <SidebarIcon icon={Terminal} label="Agent Terminal" active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} />
          <SidebarIcon icon={Settings} label="Engine Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <ThemeToggle />
          <SidebarIcon icon={Bell} label="Notifications" />
          <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-foreground/[0.02]">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-border flex items-center justify-center text-[10px] font-black text-zinc-500 shrink-0">
              YM
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-[10px] font-black text-foreground uppercase truncate">Admin Core</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Sepolia Node</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Body - Adjusted for wider sidebar */}
      <main className="ml-64 p-8 max-w-[1600px] mx-auto">
        
        {/* Compact Header */}
        <header className="flex items-center justify-between mb-12 border-b border-border pb-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2 font-outfit uppercase">
                YieldMind <span className="text-zinc-600">/</span> <span className="text-brand-orange">{activeTab}</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Functional // Sepolia</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 text-right">
              <div>
                <span className="block text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Managed Equity</span>
                <span className="block text-xl font-black text-foreground tabular-nums font-outfit">$245,800.00</span>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <span className="block text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Session Yield</span>
                <span className="block text-xl font-black text-emerald-600 tabular-nums font-outfit">+$12,450.22</span>
              </div>
            </div>
            <ConnectButton chainStatus="none" showBalance={false} accountStatus="avatar" />
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab logs={logs} />}
            {activeTab === 'terminal' && <TerminalTab logs={logs} isAuto={isAuto} onToggle={() => setIsAuto(!isAuto)} />}
            {activeTab === 'wallet' && <WalletTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- SUB-VIEWS (Clinical & Efficient) ---

function OverviewTab({ logs }: { logs: any[] }) {
  return (
    <div className="grid grid-cols-12 gap-8 mt-4">
      <div className="col-span-12 lg:col-span-8 space-y-8">
        <PoolStatus 
          poolName="ETH / USDC"
          apr={42.85}
          tvl={125000000}
          volatility={0.18}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCompact title="Protocol Reputation" value="98.2" color="text-brand-orange" />
          <StatCompact title="Hedge Accuracy" value="99.8%" trend="+0.1%" />
          <StatCompact title="Total Vaults" value="42" />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <OnyxCard className="h-full">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground mb-8 flex items-center gap-2">
            <Cpu className="w-3 h-3 text-brand-orange" /> AI Cognition
          </h3>
          <div className="space-y-8">
            <IntelligenceItem time="12:45" status="SCAN" text="Analyzing Aerodrome/Base APR spread." />
            <IntelligenceItem time="12:44" status="HEDGE" text="Balancing delta via Kraken engine." />
            <IntelligenceItem time="12:42" status="AUDIT" text="Trade checkpoint verified on-chain." />
            <IntelligenceItem time="12:40" status="SYNC" text="Node health verified at 99.9%." />
          </div>
        </OnyxCard>
      </div>
    </div>
  );
}

function TerminalTab({ logs, isAuto, onToggle }: { logs: any[], isAuto: boolean, onToggle: () => void }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-4">
        <AgentControlPanel isActive={isAuto} onToggle={onToggle} />
      </div>
      <div className="col-span-12 lg:col-span-8">
        <OnyxCard>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-orange" /> Auditor Execution Stream
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Live Trace</span>
            </div>
          </div>
          <AuditLogs logs={logs} />
        </OnyxCard>
      </div>
    </div>
  );
}

function WalletTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <OnyxCard className="p-10">
        <GlassStat label="Sovereign Asset: ETH" value="12.45 ETH" trend="$30.5K" />
      </OnyxCard>
      <OnyxCard className="p-10">
        <GlassStat label="Sovereign Asset: USDC" value="50,000.00" trend="$50K" />
      </OnyxCard>
      <OnyxCard className="p-10 border-dashed border-border/20 flex items-center justify-center group cursor-pointer hover:border-brand-orange/40 transition-colors duration-500">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 group-hover:text-brand-orange">+ Add Network Asset</span>
      </OnyxCard>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-8">
      <OnyxCard>
        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground mb-10">Autonomous Engine Configuration</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 border border-border/10 rounded-2xl bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors group cursor-default">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground mb-1">Delta Drift Tolerance</span>
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Max variance before rebalance</span>
            </div>
            <span className="text-lg font-black text-brand-orange font-outfit">0.05%</span>
          </div>
          <div className="flex items-center justify-between p-6 border border-border/10 rounded-2xl bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors group cursor-default">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground mb-1">Auto-Compound Interval</span>
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Harvest & Restake Frequency</span>
            </div>
            <span className="text-lg font-black text-foreground font-outfit uppercase tracking-tighter">6 HOURS</span>
          </div>
        </div>
      </OnyxCard>
    </div>
  );
}

// --- SHARED REFINED COMPONENTS ---

function SidebarIcon({ icon: Icon, label, active = false, onClick }: { icon: React.ElementType, label?: string, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent",
        active 
          ? "bg-foreground text-background border-foreground shadow-[0_8px_20px_rgba(0,0,0,0.1)] scale-[1.02]" 
          : "text-zinc-500 hover:bg-foreground/5 hover:border-border/40 hover:text-foreground"
    )}>
      <Icon className="w-5 h-5 shrink-0" />
      {label && <span className="text-[11px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">{label}</span>}
    </div>
  );
}

function IntelligenceItem({ time, status, text }: { time: string, status: string, text: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="text-[10px] text-zinc-600 font-mono font-bold pt-1">{time}</div>
      <div className="flex flex-col">
        <div className="text-[9px] font-extrabold text-brand-orange tracking-[0.3em] uppercase mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">{status}</div>
        <div className="text-[13px] text-zinc-400 font-medium leading-relaxed group-hover:text-foreground transition-colors">{text}</div>
      </div>
    </div>
  );
}

function StatCompact({ title, value, color = "text-foreground", trend }: { title: string, value: string, color?: string, trend?: string }) {
  return (
    <OnyxCard className="p-8">
      <GlassStat label={title} value={value} trend={trend} />
    </OnyxCard>
  );
}

