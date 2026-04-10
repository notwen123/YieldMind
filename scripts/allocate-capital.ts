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
  const vaultAddress = process.env.HACKATHON_VAULT_ADDRESS;
  const agentId = Number(process.env.AGENT_ID || 5);

  if (!privateKey || !vaultAddress) throw new Error('Missing env vars');

  const fetchReq = new ethers.FetchRequest(rpcUrl);
  fetchReq.timeout = 120000; // 2 minutes
  if (proxyUrl) {
    fetchReq.getUrlFunc = ethers.FetchRequest.createGetUrlFunc({
      agent: new HttpsProxyAgent(proxyUrl),
    });
  }

  const provider = new ethers.JsonRpcProvider(fetchReq, { name: 'sepolia', chainId: 11155111 }, { staticNetwork: true });
  const signer = new ethers.Wallet(privateKey, provider);
  
  const abi = [
    "function deposit() external payable",
    "function allocate(bytes32 agentId, uint256 amount) external",
    "function getBalance(bytes32 agentId) external view returns (uint256)",
    "function unallocatedBalance() external view returns (uint256)"
  ];

  const vault = new ethers.Contract(vaultAddress, abi, signer);

  console.log(`🏦 Vault Address: ${vaultAddress}`);
  console.log(`🤖 Target Agent: ${agentId}`);

  await runWithRetry(async () => {
    // 1. Check Unallocated Balance
    console.log("🔍 Checking vault liquidity...");
    const unallocated = await vault.unallocatedBalance();
    const allocationAmount = ethers.parseEther("0.001");

    if (unallocated < allocationAmount) {
      console.log("💰 Vault low. Depositing 0.002 ETH...");
      const depositTx = await vault.deposit({ value: ethers.parseEther("0.002") });
      await depositTx.wait();
      console.log("✅ Deposit confirmed.");
    }

    // 2. Allocate
    const agentIdBytes32 = ethers.toBeHex(agentId, 32);
    console.log(`⚙️ Allocating ${ethers.formatEther(allocationAmount)} ETH to Agent ${agentId}...`);
    
    const tx = await vault.allocate(agentIdBytes32, allocationAmount);
    console.log(`✅ Allocation Tx submitted: ${tx.hash}`);
    await tx.wait();
    console.log("✅ Allocation confirmed.");

    // 3. Verify
    const balance = await vault.getBalance(agentIdBytes32);
    console.log(`💎 Agent ${agentId} Final Balance: ${ethers.formatEther(balance)} ETH`);
  });
}

main().catch(console.error);
