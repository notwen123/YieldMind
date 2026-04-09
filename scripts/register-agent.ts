import { ethers } from "ethers";
import * as dotenv from "dotenv";

import { HttpsProxyAgent } from "https-proxy-agent";

dotenv.config({ path: ".env.local" });

const AGENT_REGISTRY_ABI = [
  "function register(address agentWallet, string name, string description, string[] capabilities, string agentURI) external returns (uint256 agentId)",
  "event AgentRegistered(uint256 indexed agentId, address indexed operatorWallet, address indexed agentWallet, string name)"
];

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.ankr.com/eth_sepolia";
  const proxyUrl = process.env.HTTPS_PROXY;
  
  console.log(`🌐 Connecting to: ${rpcUrl}`);
  if (proxyUrl) console.log(`🔒 Using Proxy: ${proxyUrl}`);

  // Configure Fetch with Proxy if available
  const fetchReq = new ethers.FetchRequest(rpcUrl);
  fetchReq.timeout = 120000; // 2 minute timeout

  if (proxyUrl) {
    fetchReq.getUrlFunc = ethers.FetchRequest.createGetUrlFunc({
      agent: new HttpsProxyAgent(proxyUrl)
    });
  }

  const provider = new ethers.JsonRpcProvider(
    fetchReq,
    { name: "sepolia", chainId: 11155111 },
    { staticNetwork: true }
  );
  
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) throw new Error("PRIVATE_KEY missing");

  const wallet = new ethers.Wallet(privateKey, provider);
  
  // 💰 QUICK BALANCE CHECK
  console.log("💰 Checking balance...");
  try {
    const balance = await provider.getBalance(wallet.address);
    const ethBalance = ethers.formatEther(balance);
    console.log(`Account Balance: ${ethBalance} SepoliaETH`);
    
    if (balance === BigInt(0)) {
      console.error("❌ ERROR: Your account has 0 ETH. You cannot register without some SepoliaETH for gas.");
      process.exit(1);
    }
  } catch (e: any) {
    console.warn("⚠️ Balance check timed out, but proceeding anyway...");
  }

  const registryAddress = process.env.AGENT_REGISTRY_ADDRESS;
  if (!registryAddress) throw new Error("AGENT_REGISTRY_ADDRESS missing");

  console.log(`Using Registry: ${registryAddress}`);
  console.log(`Operator Account: ${wallet.address}`);

  const registry = new ethers.Contract(registryAddress, AGENT_REGISTRY_ABI, wallet);

  // Agent Metadata
  const agentWallet = wallet.address; // Using same wallet for demo, in prod use separate hot wallet
  const name = "YieldMind Prime";
  const description = "Autonomous Delta-Neutral Liquidity Manager";
  const capabilities = ["trading", "hedging", "erc8004-signing"];
  const agentURI = "https://yieldmind.ai/api/agent/metadata";

  console.log("Registering agent...");
  
  try {
    const tx = await registry.register(
      agentWallet,
      name,
      description,
      capabilities,
      agentURI
    );

    console.log(`Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();
    
    // Find event
    const event = receipt.logs.map((log: any) => {
        try { return registry.interface.parseLog(log); } catch (e) { return null; }
    }).find((e: any) => e && e.name === "AgentRegistered");

    if (event) {
      console.log(`✅ Agent Registered successfully!`);
      console.log(`Agent ID: ${event.args.agentId}`);
    }
  } catch (error: any) {
    console.error("Registration failed:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
