import { ethers } from 'ethers';

const TRADE_INTENT_TYPE = {
  TradeIntent: [
    { name: "agentId", type: "uint256" },
    { name: "action", type: "string" },      // "DEPOSIT_LP" | "OPEN_HEDGE" | "REBALANCE"
    { name: "asset", type: "string" },
    { name: "amount", type: "uint256" },
    { name: "deltaBeforeAction", type: "int256" },
    { name: "deltaAfterAction", type: "int256" },
    { name: "expectedYieldAPR", type: "uint256" },
    { name: "riskScore", type: "uint256" },
    { name: "timestamp", type: "uint256" },
    { name: "chainId", type: "uint256" }
  ]
};

export interface AuditParams {
  asset: string;
  amount: number;
  deltaBefore: number;
  deltaAfter: number;
  apr: number;
  riskScore: number;
}

export class Auditor {
  private signer: ethers.Wallet;
  private registryAddress: string;

  constructor() {
    const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org");
    const privateKey = process.env.PRIVATE_KEY || '';
    if (!privateKey) {
      throw new Error("PRIVATE_KEY not found in environment");
    }
    this.signer = new ethers.Wallet(privateKey, provider);
    this.registryAddress = process.env.VALIDATION_REGISTRY_ADDRESS || ethers.ZeroAddress;
  }

  async createValidationArtifact(action: string, params: AuditParams) {
    const domain = {
      name: "YieldMind",
      version: "1",
      chainId: 11155111, // Sepolia
      verifyingContract: this.registryAddress
    };

    const intent = {
      agentId: process.env.AGENT_ID || 0,
      action: action,
      asset: params.asset,
      amount: ethers.parseUnits(params.amount.toString(), 18),
      deltaBeforeAction: Math.floor(params.deltaBefore * 10000), // Scale for safe uint transfer
      deltaAfterAction: Math.floor(params.deltaAfter * 10000),
      expectedYieldAPR: Math.floor(params.apr * 100), // basis points
      riskScore: params.riskScore,
      timestamp: Math.floor(Date.now() / 1000),
      chainId: 11155111
    };

    // EIP-712 signed artifact
    const signature = await this.signer.signTypedData(domain, TRADE_INTENT_TYPE, intent);

    return { intent, signature };
  }

  async postToRegistry(intent: any, signature: string) {
    // In a full implementation, this would call the ValidationRegistry contract
    // For now, we'll log it and prepare for Supabase persistence
    console.log("Posting validation artifact to registry...");
    return { success: true, txHash: "0x..." };
  }
}
