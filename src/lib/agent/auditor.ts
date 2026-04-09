import { ethers } from 'ethers';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { supabaseAdmin } from '@/lib/supabase/client';

const TRADE_INTENT_TYPE = {
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

const VALIDATION_REGISTRY_ABI = [
  "function postEIP712Attestation(uint256 agentId, bytes32 checkpointHash, uint8 score, string calldata notes) external",
  "function postAttestation(uint256 agentId, bytes32 checkpointHash, uint8 score, uint8 proofType, bytes calldata proof, string calldata notes) external",
  "event AttestationPosted(uint256 indexed agentId, address indexed validator, bytes32 indexed checkpointHash, uint8 score, uint8 proofType)"
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
  private agentId: number;
  private contract: ethers.Contract;

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
    this.agentId = Number(process.env.AGENT_ID ?? 5);
    
    this.contract = new ethers.Contract(this.registryAddress, VALIDATION_REGISTRY_ABI, this.signer);
  }

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

    const signature = await this.signer.signTypedData(domain, TRADE_INTENT_TYPE, intent);
    return { intent, signature };
  }

  /**
   * Post the signed artifact to the on-chain Registry.
   * This is the "Truth" part of ERC-8004.
   */
  async postOnChain(checkpointHash: string, score: number = 100, notes: string = "Autonomous cycle validation") {
    try {
      console.log(`🔗 Posting attestation to Registry: ${this.registryAddress}...`);
      const tx = await this.contract.postEIP712Attestation(
        this.agentId,
        checkpointHash,
        score,
        notes
      );
      console.log(`✅ Transaction sent: ${tx.hash}`);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error("❌ Failed to post on-chain:", error);
      return null;
    }
  }

  /**
   * Persist the signed artifact to Supabase audit_logs and optionally on-chain.
   */
  async postToRegistry(
    action: string,
    params: AuditParams,
    signature: string,
    txHash?: string,
  ) {
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
        signature,
        tx_hash:     txHash,
        details:     `EIP-712 artifact verified by ${this.signer.address}`,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
