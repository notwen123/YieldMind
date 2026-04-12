import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

import { YieldMindOrchestrator } from '@/lib/agent/orchestrator';

// Singleton orchestrator — persists across hot-reloads in dev
const g = globalThis as any;
if (!g.__yieldmind_orchestrator) {
  g.__yieldmind_orchestrator = new YieldMindOrchestrator();
}
const orchestrator: YieldMindOrchestrator = g.__yieldmind_orchestrator;

export async function GET() {
  try {
    const state = await orchestrator.runCycle();
    return NextResponse.json(state);
  } catch (err: any) {
    console.error('[/api/agent/cycle]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
