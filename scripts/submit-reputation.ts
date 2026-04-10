import { ethers } from 'ethers';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runWithRetry(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      if (i === maxRetries - 1) throw e;
      console.warn(`⚠️ Attempt ${i + 1} failed, retrying in 5s... [${e.message}]`);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.public.blastapi.io';
  const proxyUrl = process.env.HTTPS_PROXY;
  const privateKey = process.env.PRIVATE_KEY;
  const repoAddress = process.env.REPUTATION_REGISTRY_ADDRESS;
  const agentId = Number(process.env.AGENT_ID || 5);

  if (!privateKey || !repoAddress) throw new Error('Missing env vars');

  const fetchReq = new ethers.FetchRequest(rpcUrl);
  fetchReq.timeout = 120000;
  if (proxyUrl) {
    fetchReq.getUrlFunc = ethers.FetchRequest.createGetUrlFunc({
      agent: new HttpsProxyAgent(proxyUrl),
    });
  }

  const provider = new ethers.JsonRpcProvider(fetchReq, { name: 'sepolia', chainId: 11155111 }, { staticNetwork: true });
  const funder = new ethers.Wallet(privateKey, provider);
  const validator = ethers.Wallet.createRandom().connect(provider);

  console.log(`🌟 Validator simulated as: ${validator.address}`);
  
  await runWithRetry(async () => {
    // 1. Fund Validator
    console.log("⚓ Funding validator for gas...");
    const fundTx = await funder.sendTransaction({
      to: validator.address,
      value: ethers.parseEther("0.005")
    });
    await fundTx.wait();
    console.log("✅ Validator funded.");

    // 2. Submit Feedback
    const abi = [
      "function submitFeedback(uint256 agentId, uint8 score, bytes32 outcomeRef, string calldata comment, uint8 feedbackType) external"
    ];
    const registry = new ethers.Contract(repoAddress, abi, validator);
    const dummyOutcome = ethers.id("TRADE_SUCCESS_" + Date.now());

    console.log(`📈 Submitting 98/100 score for Agent ${agentId}...`);
    const tx = await registry.submitFeedback(
      agentId,
      98, 
      dummyOutcome,
      "Excellent delta-neutral performance in WETH/USDC sandbox.",
      0 // FeedbackType.TRADE_EXECUTION
    );

    console.log(`✅ Feedback Transaction submitted: ${tx.hash}`);
    await tx.wait();
    console.log("⭐⭐⭐⭐⭐ Reputation successfully updated!");
  });
}

main().catch(console.error);
