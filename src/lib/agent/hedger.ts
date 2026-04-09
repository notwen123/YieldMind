import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface HedgePosition {
  pair: string;
  side: 'buy' | 'sell';
  volume: number;
  price?: number;
}

export class DeltaHedger {
  private cliPath: string;
  private isSandbox: boolean;

  constructor() {
    this.cliPath = process.env.KRAKEN_CLI_PATH || 'kraken';
    this.isSandbox = process.env.KRAKEN_SANDBOX === 'true';
  }

  /**
   * Calculate required hedge size to neutralize delta
   * For a 50/50 LP pool: hedge = 50% of total position in token0
   */
  calculateHedgeSize(token0UsdValue: number, currentPrice: number): number {
    // Delta = amount of token0 in pool (in base units)
    return token0UsdValue / currentPrice;
  }

  async openShortHedge(asset: string, sizeUsd: number): Promise<any> {
    const pair = `${asset}USD`;
    const mode = this.isSandbox ? 'paper' : 'order';
    
    // Command: kraken [paper] sell <PAIR> <VOL> --type market -o json
    // Note: volume in asset units, but for simplicity we'll assume sizeUsd is converted or handled
    const cmd = `${this.cliPath} ${mode} sell ${pair} ${sizeUsd} --type market -o json`;

    try {
      const { stdout, stderr } = await execAsync(cmd, {
        env: {
          ...process.env,
          KRAKEN_API_KEY: process.env.KRAKEN_API_KEY,
          KRAKEN_API_SECRET: process.env.KRAKEN_API_SECRET,
        }
      });

      if (stderr && !stdout) {
        throw new Error(stderr);
      }

      return JSON.parse(stdout);
    } catch (error: any) {
      console.error('Kraken CLI Error:', error.message);
      throw error;
    }
  }

  async getStatus(): Promise<any> {
    const mode = this.isSandbox ? 'paper' : 'status';
    const cmd = `${this.cliPath} ${mode} status -o json`;

    try {
      const { stdout } = await execAsync(cmd);
      return JSON.parse(stdout);
    } catch (error) {
      return { error: 'Could not fetch Kraken status' };
    }
  }

  async rebalanceHedge(currentDelta: number, targetDelta: number): Promise<void> {
    const drift = Math.abs(currentDelta - targetDelta);
    
    if (drift > 0.05) { // 5% drift threshold
      const adjustment = targetDelta - currentDelta;
      if (adjustment > 0) {
        // Close some short (buy)
        // await this.closeShortPartial(...)
      } else {
        // Open more short (sell)
        await this.openShortHedge('ETH', Math.abs(adjustment));
      }
    }
  }
}
