import { PoolScanner, PoolInfo } from './scanner';
import { DeltaHedger } from './hedger';
import { Auditor } from './auditor';

export interface AgentState {
  currentPool: PoolInfo | null;
  lpPosition: any;
  hedgePosition: any;
  portfolioDelta: number;
  totalPnl: number;
  cycleCount: number;
  lastAction: string;
}

export class YieldMindOrchestrator {
  private scanner: PoolScanner;
  private hedger: DeltaHedger;
  private auditor: Auditor;
  private state: AgentState;

  constructor() {
    this.scanner = new PoolScanner();
    this.hedger = new DeltaHedger();
    this.auditor = new Auditor();
    this.state = {
      currentPool: null,
      lpPosition: null,
      hedgePosition: null,
      portfolioDelta: 0,
      totalPnl: 0,
      cycleCount: 0,
      lastAction: 'IDLE'
    };
  }

  async runCycle() {
    console.log(`Starting Cycle #${this.state.cycleCount + 1}`);
    
    // 1. Scan for opportunities
    const pools = await this.scanner.getTopPools();
    const bestPool = pools[0];
    
    if (!this.state.currentPool || bestPool.score > this.state.currentPool.score * 1.2) {
      await this.transitionToPool(bestPool);
    } else {
      await this.monitorAndRebalance();
    }

    this.state.cycleCount++;
    return this.state;
  }

  private async transitionToPool(pool: PoolInfo) {
    console.log(`Transitioning to pool: ${pool.token0}/${pool.token1}`);
    
    // In a real agent, we would exit the old position first
    
    // 1. Enter LP position (Mock/Logic)
    this.state.currentPool = pool;
    this.state.lastAction = 'DEPOSIT_LP';

    // 2. Hedge immediately
    const hedgeSize = pool.tvl * 0.5; // Example: hedge 50%
    const hedgeResult = await this.hedger.openShortHedge(pool.token0, hedgeSize);
    this.state.hedgePosition = hedgeResult;

    // 3. Audit
    const artifact = await this.auditor.createValidationArtifact('DEPOSIT_LP', {
      asset: pool.token0,
      amount: hedgeSize,
      deltaBefore: 0,
      deltaAfter: 0.5, // example delta
      apr: pool.apr,
      riskScore: Math.floor(pool.score)
    });

    await this.auditor.postToRegistry(artifact.intent, artifact.signature);
  }

  private async monitorAndRebalance() {
    if (!this.state.currentPool) return;

    console.log("Monitoring current position...");
    const currentDelta = 0.08; // Example: delta drifted to 8%
    const targetDelta = 0.0;
    
    if (Math.abs(currentDelta - targetDelta) > 0.05) {
      console.log("Drift detected. Rebalancing...");
      await this.hedger.rebalanceHedge(currentDelta, targetDelta);
      this.state.lastAction = 'REBALANCE';
      
      // Audit rebalance
      const artifact = await this.auditor.createValidationArtifact('REBALANCE', {
        asset: this.state.currentPool.token0,
        amount: 0, // adjustment amount
        deltaBefore: currentDelta,
        deltaAfter: targetDelta,
        apr: this.state.currentPool.apr,
        riskScore: Math.floor(this.state.currentPool.score)
      });
      await this.auditor.postToRegistry(artifact.intent, artifact.signature);
    }
  }

  getState() {
    return this.state;
  }
}
