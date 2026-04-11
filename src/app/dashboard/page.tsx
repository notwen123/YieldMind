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
import { OnyxCard, EmberButton } from '@/components/UI/EmberKit';
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
      
      {/* Clinical Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-border flex flex-col items-center py-8 gap-10 bg-background z-50">
        <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white shadow-lg">
          <BrainCircuit className="w-6 h-6" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <SidebarIcon icon={LayoutDashboard} active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarIcon icon={Wallet} active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} />
          <SidebarIcon icon={Terminal} active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} />
          <SidebarIcon icon={Settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto flex flex-col gap-6 items-center">
          <ThemeToggle />
          <SidebarIcon icon={Bell} />
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-border flex items-center justify-center text-[10px] font-black text-zinc-500">
            YM
          </div>
        </div>
      </aside>

      {/* Main Body */}
      <main className="ml-20 p-8 max-w-[1600px] mx-auto">
        
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
          <StatCompact title="Hedge Accuracy" value="99.8%" color="text-emerald-500" />
          <StatCompact title="Total Vaults" value="42" />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <OnyxCard className="h-full border-border bg-transparent shadow-none">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
            <Cpu className="w-3 h-3 text-brand-orange" /> AI Cognition
          </h3>
          <div className="space-y-6">
            <IntelligenceItem time="12:45" status="SCAN" text="Analyzing Aerodrome/Base APR spread." />
            <IntelligenceItem time="12:44" status="HEDGE" text="Balancing delta via Kraken engine." />
            <IntelligenceItem time="12:42" status="AUDIT" text="Trade checkpoint verified on-chain." />
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
        <OnyxCard className="border-border bg-transparent shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
              <Terminal className="w-3 h-3" /> Auditor Execution Stream
            </h3>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Live On-Chain Trace</span>
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
      <OnyxCard className="p-8 border-border bg-transparent shadow-none">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 font-outfit">Sovereign Asset: ETH</h4>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-black text-foreground font-outfit tabular-nums tracking-tighter">12.45 ETH</span>
          <span className="text-xs font-bold text-zinc-400">$30,502.50</span>
        </div>
      </OnyxCard>
      <OnyxCard className="p-8 border-border bg-transparent shadow-none">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 font-outfit">Sovereign Asset: USDC</h4>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-black text-foreground font-outfit tabular-nums tracking-tighter">50,000.00</span>
          <span className="text-xs font-bold text-zinc-400">$50,000.00</span>
        </div>
      </OnyxCard>
      <OnyxCard className="p-8 border-border bg-transparent shadow-none border-dashed flex items-center justify-center opacity-40">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">+ Add Network Asset</span>
      </OnyxCard>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-xl space-y-8">
      <OnyxCard className="border-border bg-transparent shadow-none">
        <h3 className="text-xs font-black uppercase tracking-widest text-foreground mb-6">Autonomous Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-xl">
            <span className="text-sm font-bold text-zinc-500">Delta Drift Tolerance</span>
            <span className="text-sm font-black text-brand-orange">0.05%</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-xl">
            <span className="text-sm font-bold text-zinc-500">Auto-Compound Interval</span>
            <span className="text-sm font-black text-foreground tracking-tighter">6 HOURS</span>
          </div>
        </div>
      </OnyxCard>
    </div>
  );
}

// --- SHARED REFINED COMPONENTS ---

function SidebarIcon({ icon: Icon, active = false, onClick }: { icon: React.ElementType, active?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl transition-all duration-200 cursor-pointer group border",
        active 
          ? "bg-foreground text-background border-foreground shadow-sm" 
          : "text-zinc-500 hover:bg-foreground/5 border-transparent"
    )}>
      <Icon className="w-5 h-5" />
    </div>
  );
}

function IntelligenceItem({ time, status, text }: { time: string, status: string, text: string }) {
  return (
    <div className="flex gap-4 border-b border-border/10 pb-4 last:border-0 last:pb-0">
      <div className="text-[9px] text-zinc-500 font-mono font-bold">{time}</div>
      <div>
        <div className="text-[8px] font-black text-brand-orange tracking-widest uppercase mb-0.5">{status}</div>
        <div className="text-xs text-zinc-400 font-medium leading-relaxed">{text}</div>
      </div>
    </div>
  );
}

function StatCompact({ title, value, color = "text-foreground" }: { title: string, value: string, color?: string }) {
  return (
    <OnyxCard className="p-6 border-border bg-transparent shadow-none">
      <h4 className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">{title}</h4>
      <span className={cn("text-2xl font-black tabular-nums font-outfit tracking-tighter", color)}>{value}</span>
    </OnyxCard>
  );
}

