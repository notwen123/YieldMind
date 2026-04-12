'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Target, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { EmberButton } from '@/components/UI/EmberKit';

interface AgentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onForm: (agent: { name: string; engine: string; risk: string }) => void;
}

export const AgentCreationModal: React.FC<AgentCreationModalProps> = ({ isOpen, onClose, onForm }) => {
  const [name, setName] = useState('');
  const [engine, setEngine] = useState('Aerodrome Institutional');
  const [risk, setRisk] = useState('Balanced');
  const [step, setStep] = useState<'form' | 'provisioning' | 'complete'>('form');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const { sendTransaction, data: hash, isPending: isSigning } = useSendTransaction();
  const { isLoading: isWaitingForChain } = useWaitForTransactionReceipt({ hash });

  const addLog = (msg: string) => {
    setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startDeployment = async () => {
    if (!name) return;
    
    try {
      // Trigger Sovereign Signature
      sendTransaction({
        to: '0x000000000000000000000000000000000000dEaD' as `0x${string}`,
        value: parseEther('0.0001'),
        data: '0x594d5f464f524d4154494f4e' as `0x${string}`, // "YM_FORMATION"
      });
      
      setStep('provisioning');
      addLog("Initializing Sovereignty Protocol Alpha-7...");
      await new Promise(r => setTimeout(r, 1000));
      addLog("Requesting Institutional Handshake...");
    } catch (e) {
      console.error(e);
      setStep('form');
    }
  };

  // Deployment Logic Trigger
  useEffect(() => {
    if (hash && step === 'provisioning') {
      const finalize = async () => {
        addLog(`Chain Handshake Received: ${hash.slice(0, 10)}...`);
        await new Promise(r => setTimeout(r, 1200));
        addLog("Provisioning Neural Node on Sovereign Cluster...");
        await new Promise(r => setTimeout(r, 1500));
        addLog("Injecting Strategy: Delta-Neutral Yield Engine...");
        await new Promise(r => setTimeout(r, 1000));
        addLog("Finalizing Sovereign Record...");
        setStep('complete');
        onForm({ name, engine, risk });
      };
      finalize();
    }
  }, [hash, step, onForm, name, engine, risk]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-background border border-border shadow-2xl rounded-[32px] overflow-hidden glass-precision"
        >
          <div className="p-8 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-2xl flex items-center justify-center text-brand-orange border border-brand-orange/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground font-figtree tracking-wide uppercase">Agent Governance</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Formation Protocol Alpha-7</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-foreground/5 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          <div className="p-10 relative box-border min-h-[500px]">
            <AnimatePresence mode="wait">
              {step === 'form' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                        <Target className="w-3 h-3" /> Target Asset Label
                      </label>
                      <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. SOL, BTC-Hedged"
                        className="w-full bg-foreground/[0.03] border border-border rounded-2xl px-6 py-4 text-sm font-bold text-foreground placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition-all font-figtree"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Yield Engine</label>
                        <select 
                          value={engine}
                          onChange={(e) => setEngine(e.target.value)}
                          className="w-full bg-foreground/[0.03] border border-border rounded-2xl px-6 py-4 text-[11px] font-bold text-foreground focus:outline-none appearance-none font-figtree cursor-pointer"
                        >
                          <option>Aerodrome Institutional</option>
                          <option>Uniswap V3 Managed</option>
                          <option>Aave Credit Facade</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">Risk Profile</label>
                        <select 
                          value={risk}
                          onChange={(e) => setRisk(e.target.value)}
                          className="w-full bg-foreground/[0.03] border border-border rounded-2xl px-6 py-4 text-[11px] font-bold text-foreground focus:outline-none appearance-none font-figtree cursor-pointer"
                        >
                          <option>Surgical (Low)</option>
                          <option>Balanced (Med)</option>
                          <option>Aggressive (High)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-brand-orange/[0.03] rounded-2xl border border-brand-orange/10 flex gap-4">
                    <ShieldAlert className="w-5 h-5 text-brand-orange shrink-0" />
                    <p className="text-[11px] font-medium text-zinc-500 leading-relaxed italic">
                      Sovereign Notice: Forming this agent will allocate compute resources for continuous delta-neutral monitoring. Formation is irreversible once deployed to the execution layer.
                    </p>
                  </div>

                  <EmberButton 
                    className="w-full py-5 rounded-2xl text-[13px]"
                    onClick={startDeployment}
                    disabled={isSigning || !name}
                  >
                    {isSigning ? 'AWAITING SIGNATURE...' : 'FORM INSTITUTIONAL AGENT'}
                  </EmberButton>
                </motion.div>
              ) : step === 'provisioning' ? (
                <motion.div
                  key="provisioning"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-black rounded-2xl p-6 font-mono text-[11px] border border-border/20 shadow-inner h-[300px] overflow-hidden flex flex-col justify-end">
                    <div className="space-y-2">
                      {consoleLogs.map((log, i) => (
                        <div key={i} className="text-zinc-500">
                          <span className="text-brand-orange opacity-60 mr-2">&gt;</span> {log}
                        </div>
                      ))}
                      <div className="flex items-center gap-3 text-white">
                        <Loader2 className="w-3 h-3 animate-spin text-brand-orange" />
                        <span className="animate-pulse">EXECUTION IN PROGRESS...</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border border-border rounded-2xl bg-foreground/[0.02] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Network Handshake Status</span>
                    <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">{isWaitingForChain ? 'AWAITING CHAIN...' : 'TX BROADCASTED'}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-foreground font-figtree uppercase tracking-widest">Agent Formed</h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">Sovereign Asset provisioned successfully.</p>
                  </div>
                  <EmberButton className="px-10" onClick={onClose}>ACCESS TERMINAL</EmberButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
