import { YieldMindOrchestrator } from '../src/lib/agent/orchestrator';
import { PoolScanner, PoolInfo } from '../src/lib/agent/scanner';
import { DeltaHedger } from '../src/lib/agent/hedger';

async function verifyProduction() {
  console.log("🏺 YieldMind Production Verification Sequence 🏺");
  
  const scanner = new PoolScanner();
  const hedger = new DeltaHedger();
  const orchestrator = new YieldMindOrchestrator();

  console.log("\n1. Testing Scanner Core (Live On-Chain Request)...");
  try {
    const pools = await scanner.getTopPools();
    console.log(`✅ Scanner OK. Fetched ${pools.length} live pools.`);
    pools.forEach((p: PoolInfo) => {
      console.log(`   - ${p.token0}/${p.token1}: Price ${p.price?.toFixed(4)}, Score ${p.score.toFixed(2)}`);
    });
  } catch (e) {
    console.error("❌ Scanner Failed:", e);
  }

  console.log("\n2. Testing Hedger Connectivity (Binance/Kraken Fallback)...");
  try {
    const ticker = await hedger.getTicker('ETH');
    console.log(`✅ Hedger OK. Live ETH Price: $${ticker}`);
  } catch (e) {
    console.error("❌ Hedger Failed:", e);
  }

  console.log("\n3. Testing Orchestrator Heartbeat...");
  try {
    const state = await orchestrator.getState();
    console.log(`✅ Orchestrator State Initialized: ${state.lastAction}`);
  } catch (e) {
    console.error("❌ Orchestrator Failed:", e);
  }

  console.log("\n--- Verification Complete ---");
}

verifyProduction().catch(console.error);
