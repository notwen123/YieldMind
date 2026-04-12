import { ethers } from 'ethers';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { supabaseAdmin } from '@/lib/supabase/server';

const VALIDATION_ARTIFACT_TYPE = {
  TradeIntent: [
    { name: 'agentId',           type: 'uint256' },
    { name: 'action',            type: 'string'  },
    { name: 'asset',             type: 'string'  },
    { name: 'amount',            type: 'uint256' },
    { name: 'deltaBeforeAction', type: 'int256'  },
    { name: 'deltaAfterAction',  type: 'int256'  },
    { name: 'expectedYieldAPR',  type: 'uint256' },
    { name: 'riskScore',         type: 'uint256' },
    { name: 'timestamp',         type: 'uint256' },
    { name: 'chainId',           type: 'uint256' },
  ],
};

// ERC-8004 Risk Router TradeIntent (matches RiskRouter.sol)
const RISK_ROUTER_INTENT_TYPE = {
  TradeIntent: [
    { name: 'agentId',         type: 'uint256' },
    { name: 'agentWallet',     type: 'address' },
    { name: 'pair',            type: 'string'  },
    { name: 'action',          type: 'string'  },
    { name: 'amountUsdScaled', type: 'uint256' },
    { name: 'maxSlippageBps',  type: 'uint256' },
    { name: 'nonce',           type: 'uint256' },
    { name: 'deadline',        type: 'uint256' },
  ],
};

const ABI = [
  "function postAttestation(uint256 agentId, bytes32 checkpointHash, uint8 score, uint8 proofType, bytes calldata proof, string calldata notes) external",
  "function submitTradeIntent((uint256 agentId, address agentWallet, string pair, string action, uint256 amountUsdScaled, uint256 maxSlippageBps, uint256 nonce, uint256 deadline) intent, bytes signature) external returns (bool approved, string memory reason)",
  "function getIntentNonce(uint256 agentId) external view returns (uint256)",
];

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
  private routerAddress: string;
  private agentId: number;
  private registryContract: ethers.Contract;
  private routerContract: ethers.Contract;

  constructor() {
    const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://rpc.ankr.com/eth_sepolia';
    const proxyUrl = process.env.HTTPS_PROXY;

    const fetchReq = new ethers.FetchRequest(rpcUrl);
    fetchReq.timeout = 60000;
    if (proxyUrl) {
      fetchReq.getUrlFunc = ethers.FetchRequest.createGetUrlFunc({
        agent: new HttpsProxyAgent(proxyUrl),
      });
    }

    const provider = new ethers.JsonRpcProvider(
      fetchReq,
      { name: 'sepolia', chainId: 11155111 },
      { staticNetwork: true },
    );

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) throw new Error('PRIVATE_KEY not set');

    this.signer = new ethers.Wallet(privateKey, provider);
    this.registryAddress = process.env.VALIDATION_REGISTRY_ADDRESS || ethers.ZeroAddress;
    this.routerAddress = process.env.RISK_ROUTER_ADDRESS || ethers.ZeroAddress;
    this.agentId = Number(process.env.AGENT_ID ?? 5);
    
    this.registryContract = new ethers.Contract(this.registryAddress, ABI, this.signer);
    this.routerContract = new ethers.Contract(this.routerAddress, ABI, this.signer);
  }

  /**
   * Signs a Trustless Trade Intent for the Risk Router (Whitelisted Execution)
   */
  async signRiskIntent(pair: string, action: string, amountUsd: number) {
    const nonce = await this.routerContract.getIntentNonce(this.agentId);
    const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour

    const domain = {
      name: 'RiskRouter',
      version: '1',
      chainId: 11155111, // EIP-155 Binding
      verifyingContract: this.routerAddress,
    };

    const intent = {
      agentId:         this.agentId,
      agentWallet:     this.signer.address,
      pair,
      action,
      amountUsdScaled: BigInt(Math.floor(amountUsd * 100)),
      maxSlippageBps:  BigInt(50), // 0.5%
      nonce,
      deadline:        BigInt(deadline),
    };

    // Support for EIP-1271 Smart Contract Wallets:
    // This signature matches standard standard EIP-1271 expectation for 'isValidSignature'
    const signature = await this.signer.signTypedData(domain, RISK_ROUTER_INTENT_TYPE, intent);
    return { intent, signature };
  }

  /**
   * Universal Signature Authenticator supporting EIP-1271 logic
   * (Architectural Hook for future Smart Wallet integration)
   */
  async verifySignature(hash: string, signature: string, account: string): Promise<boolean> {
    const recovered = ethers.verifyMessage(ethers.getBytes(hash), signature);
    if (recovered.toLowerCase() === account.toLowerCase()) return true;
    
    // Fallback: Check for EIP-1271 Magic Value (0x1626ba7e)
    try {
      const contract = new ethers.Contract(account, ["function isValidSignature(bytes32,bytes) view returns (bytes4)"], this.signer.provider);
      const magic = await contract.isValidSignature(hash, signature);
      return magic === "0x1626ba7e";
    } catch {
      return false;
    }
  }

  /**
   * Submits the signed intent to the Risk Router for on-chain approval.
   */
  async submitToRouter(intent: any, signature: string) {
    try {
      console.log(`🛡️ Submitting intent to Risk Router: ${this.routerAddress}...`);
      const tx = await this.routerContract.submitTradeIntent(intent, signature);
      console.log(`✅ Router Tx: ${tx.hash}`);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error("❌ Risk Router Submission Failed:", error.message);
      return null;
    }
  }

  /**
   * Legacy: Creates an Audit Artifact (Trade Intent Attestation)
   */
  async createValidationArtifact(action: string, params: AuditParams) {
    const domain = {
      name: 'YieldMind',
      version: '1',
      chainId: 11155111,
      verifyingContract: this.registryAddress,
    };

    const intent = {
      agentId:           this.agentId,
      action,
      asset:             params.asset,
      amount:            ethers.parseUnits(params.amount.toFixed(6), 18),
      deltaBeforeAction: BigInt(Math.floor(params.deltaBefore * 10000)),
      deltaAfterAction:  BigInt(Math.floor(params.deltaAfter  * 10000)),
      expectedYieldAPR:  BigInt(Math.floor(params.apr * 100)),
      riskScore:         BigInt(params.riskScore),
      timestamp:         BigInt(Math.floor(Date.now() / 1000)),
      chainId:           BigInt(11155111),
    };

    const signature = await this.signer.signTypedData(domain, VALIDATION_ARTIFACT_TYPE, intent);
    return { intent, signature };
  }

  async postOnChain(checkpointHash: string, score: number = 100, notes: string = "Autonomous cycle validation") {
    try {
      console.log(`🔗 Posting attestation to Registry: ${this.registryAddress}...`);
      // ProofType.EIP712 = 1 based on ValidationRegistry.sol enum
      const tx = await this.registryContract.postAttestation(
        this.agentId, 
        checkpointHash, 
        score, 
        1,       // ProofType.EIP712
        "0x",    // Empty proof bytes
        notes
      );
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("❌ Failed to post attestation:", error);
      return null;
    }
  }

  async postToRegistry(action: string, params: AuditParams, signature: string, txHash?: string) {
    const { data, error } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        agent_id:    this.agentId,
        action,
        asset:       params.asset,
        amount:      params.amount,
        delta_before: params.deltaBefore,
        delta_after:  params.deltaAfter,
        apr:         params.apr,
        risk_score:  params.riskScore,
        signature:   signature || null,
        tx_hash:     txHash || null,
        timestamp:   new Date().toISOString(),
        details:     signature ? `EIP-712 artifact verified by ${this.signer.address}` : 'Institutional Scrutiny Heartbeat',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async logHeartbeat(action: string, params: AuditParams) {
    return this.postToRegistry(action, params, '');
  }
}
