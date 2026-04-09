import { ethers } from 'ethers';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const vaultAddress = process.env.HACKATHON_VAULT_ADDRESS;
  const agentId = Number(process.env.AGENT_ID || 5);

  if (!rpcUrl || !privateKey || !vaultAddress) {
    throw new Error('Missing env vars');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
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

  // 1. Ensure vault has funds
  const unallocated = await vault.unallocatedBalance();
  const allocationAmount = ethers.parseEther("1.0");

  if (unallocated < allocationAmount) {
    console.log("💰 Vault low on unallocated funds. Depositing 1.1 ETH...");
    const depositTx = await vault.deposit({ value: ethers.parseEther("1.1") });
    await depositTx.wait();
  }

  // 2. Allocate
  const agentIdBytes32 = ethers.toBeHex(agentId, 32);
  console.log(`⚙️ Allocating ${ethers.formatEther(allocationAmount)} ETH to Agent ${agentId}...`);
  
  const tx = await vault.allocate(agentIdBytes32, allocationAmount);
  console.log(`✅ Allocation Tx: ${tx.hash}`);
  await tx.wait();

  // 3. Verify
  const balance = await vault.getBalance(agentIdBytes32);
  console.log(`💎 Agent ${agentId} Final Balance: ${ethers.formatEther(balance)} ETH`);
}

main().catch(console.error);
