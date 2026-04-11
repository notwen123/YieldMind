/**
 * deploy-proxy-vault.ts
 *
 * This uses a Minimal Proxy (EIP-1167) to deploy a storage-sovereign 
 * HackathonVault instance owned by you, pointing to the original logic.
 */

import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { HttpsProxyAgent } from 'https-proxy-agent';

dotenv.config({ path: '.env.local' });

const ABI = [
  "function deposit() external payable",
  "function allocate(bytes32 agentId, uint256 amount) external",
  "function getBalance(bytes32 agentId) external view returns (uint256)",
  "function owner() external view returns (address)"
];

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl) throw new Error('SEPOLIA_RPC_URL missing');

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // The "Implementation" address (the original vault whose logic we use)
  const implementation = "0xEf7BF90aFD82cA2fc0d09aCbDD41B22038B04f1F";

  console.log(`🚀 Deploying Minimal Proxy Vault...`);
  console.log(`🔗 Logic Address: ${implementation}`);

  /**
   * EIP-1167 Minimal Proxy Bytecode Pattern:
   * 363d3d373d3d3d363d73 + [BE-ADDR] + 5af43d82803e903d91602b57fd5bf3
   */
  const addressHex = implementation.replace('0x', '').toLowerCase();
  const bytecode = `0x363d3d373d3d3d363d73${addressHex}5af43d82803e903d91602b57fd5bf3`;

  console.log(`📦 Sending deployment transaction...`);
  const tx = await wallet.sendTransaction({ data: bytecode });
  console.log(`⏳ Pending: ${tx.hash}`);
  
  const receipt = await tx.wait();
  const proxyAddress = receipt?.contractAddress;

  if (!proxyAddress) throw new Error("Deployment failed - no contract address.");
  console.log(`✅ Proxy Vault deployed at: ${proxyAddress}`);

  // Update .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/HACKATHON_VAULT_ADDRESS=.*/, `HACKATHON_VAULT_ADDRESS=${proxyAddress}`);
  fs.writeFileSync(envPath, envContent);
  console.log(`✅ .env.local synchronized.`);

  // Seeding & Allocation
  const agentId = 5;
  const agentIdBytes32 = ethers.zeroPadValue(ethers.toBeHex(agentId), 32);

  console.log(`\n💸 Seeding Vault with 0.03 ETH...`);
  const seedTx = await wallet.sendTransaction({ to: proxyAddress, value: ethers.parseEther('0.03') });
  await seedTx.wait();

  console.log(`📋 Allocating 0.02 ETH to Agent ${agentId}...`);
  const vault = new ethers.Contract(proxyAddress, ABI, wallet);
  const allocTx = await vault.allocate(agentIdBytes32, ethers.parseEther('0.02'));
  await allocTx.wait();

  console.log(`\n🎉 Goal Achieved: Agent 5 is now autonomously backed by your sovereign proxy vault.`);
}

main().catch(console.error);
