import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { YieldMindOrchestrator } from '../src/lib/agent/orchestrator';

async function testMain() {
  console.log('🚀 Starting Agent Cycle Test...');
  const orchestrator = new YieldMindOrchestrator();

  try {
    const state = await orchestrator.runCycle();
    console.log('✅ Cycle Completed Successfully!');
    console.log('--- Agent State ---');
    console.log(`Pool: ${state.currentPool?.token0}/${state.currentPool?.token1}`);
    console.log(`Action: ${state.lastAction}`);
    console.log(`Cycle Count: ${state.cycleCount}`);
    
    if (state.hedgePosition) {
      console.log('--- Execution Details ---');
      console.log(`Kraken TXID: ${state.hedgePosition.txid || 'N/A'}`);
    }

  } catch (error: any) {
    console.error('❌ Cycle Failed:', error.message);
    if (error.stack) console.error(error.stack);
  }
}

testMain().catch(console.error);
