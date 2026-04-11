/**
 * fund-vault.ts
 * Deposits ETH into HackathonVault and allocates capital to Agent 5.
 *
 * Run: npx tsx --env-file=.env.local scripts/fund-vault.ts
 */
import { ethers } from 'ethers';
import { HttpsProxyAgent } from 'https-proxy-agent';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const VAULT_ABI = [
  'function deposit() external payable',
  'function allocate(bytes32 agentId, uint256 amount) external',
  'function totalVaultBalance() external view returns (uint256)',
  'function unallocatedBalance() external view returns (uint256)',
  'function getBalance(bytes32 agentId) external view returns (uint256)',
  'event Deposited(address indexed from, uint256 amount)',
  'event CapitalAllocated(bytes32 indexed agentId, uint256 amount)',
];

async function main() {
  const rpcUrl  = process.env.SEPOLIA_RPC_URL || 'https://rpc.ankr.com/eth_sepolia';
  const proxyUrl = process.env.HTTPS_PROXY;

  const fetchReq = new ethers.FetchRequest(rpcUrl);
  fetchReq.timeout = 120_000;
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
  if (!privateKey) throw new Error('PRIVATE_KEY missing');
  const wallet = new ethers.Wallet(privateKey, provider);

  const vaultAddress = process.env.HACKATHON_VAULT_ADDRESS;
  if (!vaultAddress) throw new Error('HACKATHON_VAULT_ADDRESS missing');

  const agentId = Number(process.env.AGENT_ID ?? 5);

  console.log(`\n🏦 HackathonVault: ${vaultAddress}`);
  console.log(`👤 Operator:       ${wallet.address}`);
  console.log(`🤖 Agent ID:       ${agentId}\n`);

  const vault = new ethers.Contract(vaultAddress, VAULT_ABI, wallet);

  // ── Check current balance ──────────────────────────────────────────────────
  const before = await vault.totalVaultBalance();
  console.log(`Vault balance before: ${ethers.formatEther(before)} ETH`);

  // ── Step 1: Deposit 0.05 ETH into vault ───────────────────────────────────
  const depositAmount = ethers.parseEther('0.05');
  console.log(`\n💸 Depositing ${ethers.formatEther(depositAmount)} ETH...`);

  const depositTx = await vault.deposit({ value: depositAmount });
  console.log(`   Tx sent: ${depositTx.hash}`);
  await depositTx.wait();
  console.log(`   ✅ Deposit confirmed.`);

  // ── Step 2: Allocate capital to Agent 5 ───────────────────────────────────
  // agentId as bytes32 (left-padded)
  const agentIdBytes32 = ethers.zeroPadValue(ethers.toBeHex(agentId), 32);
  const allocateAmount = ethers.parseEther('0.04'); // allocate 0.04 of the 0.05

  console.log(`\n📋 Allocating ${ethers.formatEther(allocateAmount)} ETH to Agent ${agentId}...`);

  const allocTx = await vault.allocate(agentIdBytes32, allocateAmount);
  console.log(`   Tx sent: ${allocTx.hash}`);
  await allocTx.wait();
  console.log(`   ✅ Allocation confirmed.`);

  // ── Final state ───────────────────────────────────────────────────────────
  const totalBal    = await vault.totalVaultBalance();
  const unallocated = await vault.unallocatedBalance();
  const agentBal    = await vault.getBalance(agentIdBytes32);

  console.log(`\n📊 Vault State:`);
  console.log(`   Total balance:      ${ethers.formatEther(totalBal)} ETH`);
  console.log(`   Unallocated:        ${ethers.formatEther(unallocated)} ETH`);
  console.log(`   Agent ${agentId} allocation: ${ethers.formatEther(agentBal)} ETH`);
  console.log(`\n🎉 Done! Agent ${agentId} is funded and ready for on-chain PnL measurement.`);
  console.log(`\n🔗 Deposit tx:  https://sepolia.etherscan.io/tx/${depositTx.hash}`);
  console.log(`🔗 Allocate tx: https://sepolia.etherscan.io/tx/${allocTx.hash}`);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
