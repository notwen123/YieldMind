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
   * Fetches the current price for a pair via Kraken CLI
   */
  async getTicker(asset: string): Promise<number> {
    const pair = `${asset}USD`;
    const cmd = `${this.cliPath} ticker ${pair} -o json`;
    
    try {
      const { stdout } = await execAsync(cmd);
      const data = JSON.parse(stdout);
      // Handle array or object response depending on CLI version
      const ticker = Array.isArray(data) ? data[0] : data;
      return parseFloat(ticker.ask || ticker.a?.[0] || '0');
    } catch (e) {
      console.error(`Failed to fetch ticker for ${pair}:`, e);
      return 0;
    }
  }

  /**
   * Calculate required hedge size to neutralize delta
   * For a 50/50 LP pool: hedge = 50% of total position in token0
   */
  calculateHedgeSize(token0UsdValue: number, currentPrice: number): number {
    if (currentPrice <= 0) return 0;
    // Delta = amount of token0 in pool (in base units)
    return token0UsdValue / currentPrice;
  }

  async openShortHedge(asset: string, sizeUsd: number): Promise<any> {
    const pair = `${asset}USD`;
    const price = await this.getTicker(asset);
    
    if (price <= 0) throw new Error(`Invalid price for ${pair}`);
    
    const volume = (sizeUsd / price).toFixed(6);
    const mode = this.isSandbox ? 'paper' : 'order';
    
    // Command: kraken [paper|order] sell <PAIR> <VOLUME> --type market -o json
    const cmd = `${this.cliPath} ${mode} sell ${pair} ${volume} --ordertype market -o json`;

    console.log(`Executing Hedge: ${cmd}`);

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
    const mode = this.isSandbox ? 'paper' : 'balance';
    const cmd = `${this.cliPath} ${mode} ${this.isSandbox ? 'status' : ''} -o json`;

    try {
      const { stdout } = await execAsync(cmd);
      return JSON.parse(stdout);
    } catch (error) {
      return { error: 'Could not fetch Kraken status' };
    }
  }

  async rebalanceHedge(asset: string, currentDelta: number, targetDelta: number): Promise<void> {
    const drift = Math.abs(currentDelta - targetDelta);
    
    if (drift > 0.05) { // 5% drift threshold
      const adjustmentUsd = (targetDelta - currentDelta) * 1000; // Normalized to $1000 for this example
      if (adjustmentUsd > 0) {
        // Close some short (buy)
        const mode = this.isSandbox ? 'paper' : 'order';
        const volume = Math.abs(adjustmentUsd / (await this.getTicker(asset))).toFixed(6);
        const cmd = `${this.cliPath} ${mode} buy ${asset}USD ${volume} --ordertype market -o json`;
        await execAsync(cmd);
      } else {
        // Open more short (sell)
        await this.openShortHedge(asset, Math.abs(adjustmentUsd));
      }
    }
  }
}
