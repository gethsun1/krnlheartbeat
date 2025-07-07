const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting KRNL-integrated HeartbeatKernel deployment...");
  console.log("=" .repeat(60));

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Get account balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Network information
  const networkInfo = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", networkInfo.chainId.toString());

  // Get gas price
  const gasPrice = await ethers.provider.getFeeData();
  console.log("⛽ Gas Price:", ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei");

  // Generic Token Authority public key from KRNL documentation
  const TOKEN_AUTHORITY_PUBLIC_KEY = "0x493f395c80C178Ae32Ef3b88325739E80073118A";
  console.log("🔐 Using Generic Token Authority Public Key:", TOKEN_AUTHORITY_PUBLIC_KEY);

  // Deploy the contract
  console.log("\n📦 Deploying HeartbeatKernelKRNL contract...");
  const HeartbeatKernelKRNL = await ethers.getContractFactory("HeartbeatKernelKRNL");
  
  // Estimate gas for deployment
  const deployTx = await HeartbeatKernelKRNL.getDeployTransaction(TOKEN_AUTHORITY_PUBLIC_KEY);
  const gasEstimate = await ethers.provider.estimateGas(deployTx);
  console.log("⛽ Estimated gas for deployment:", gasEstimate.toString());

  // Deploy the contract
  const heartbeatKernelKRNL = await HeartbeatKernelKRNL.deploy(TOKEN_AUTHORITY_PUBLIC_KEY);
  await heartbeatKernelKRNL.waitForDeployment();

  const contractAddress = await heartbeatKernelKRNL.getAddress();
  console.log("✅ HeartbeatKernelKRNL deployed to:", contractAddress);

  // Get deployment transaction details
  const deploymentTx = heartbeatKernelKRNL.deploymentTransaction();
  console.log("📋 Transaction hash:", deploymentTx.hash);
  console.log("🧱 Block number:", deploymentTx.blockNumber);

  // Wait for confirmations (adjust based on network)
  const confirmations = networkInfo.chainId === 31337n ? 1 : 2; // Local network needs only 1 confirmation
  console.log(`\n⏳ Waiting for ${confirmations} confirmation(s)...`);
  await deploymentTx.wait(confirmations);
  console.log(`✅ Contract confirmed with ${confirmations} confirmation(s)`);

  // Test the deployed contract
  console.log("\n🧪 Testing deployed contract...");
  try {
    const result = await heartbeatKernelKRNL.execute();
    console.log("✅ execute() test successful:");
    console.log("   Status:", result[0]);
    console.log("   Timestamp:", result[1].toString());

    const metadata = await heartbeatKernelKRNL.getMetadata();
    console.log("✅ getMetadata() test successful:");
    console.log("   Name:", metadata[0]);
    console.log("   Version:", metadata[1]);
    console.log("   Description:", metadata[2]);

    const isHealthy = await heartbeatKernelKRNL.isHealthy();
    console.log("✅ isHealthy() test successful:", isHealthy);

    const tokenAuthority = await heartbeatKernelKRNL.tokenAuthorityPublicKey();
    console.log("✅ tokenAuthorityPublicKey() test successful:", tokenAuthority);
  } catch (error) {
    console.error("❌ Contract testing failed:", error.message);
  }

  // Create deployment information object
  const deploymentInfo = {
    contractName: "HeartbeatKernelKRNL",
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    network: network.name,
    chainId: networkInfo.chainId.toString(),
    transactionHash: deploymentTx.hash,
    blockNumber: deploymentTx.blockNumber,
    gasUsed: deploymentTx.gasLimit?.toString() || "N/A",
    timestamp: new Date().toISOString(),
    tokenAuthorityPublicKey: TOKEN_AUTHORITY_PUBLIC_KEY,
    tokenAuthorityContract: "0xC959e1A9c3dE5949A0Ec1d5Df9555C27e2357257", // Generic Token Authority
    abi: HeartbeatKernelKRNL.interface.formatJson(),
    bytecode: HeartbeatKernelKRNL.bytecode,
    metadata: {
      name: "heartbeat.kernel",
      version: "1.0.0",
      description: "A KRNL-integrated kernel that returns health status and current block timestamp for on-chain monitoring"
    }
  };

  // Save deployment information
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network.name}-krnl-deployment.json`);
  
  // Ensure deployments directory exists
  const deploymentsDir = path.dirname(deploymentFile);
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Create kernel.json metadata file for KRNL registration
  const kernelMetadata = {
    name: "heartbeat.kernel",
    version: "1.0.0",
    address: contractAddress,
    description: "A KRNL-integrated kernel that returns health status and current block timestamp for on-chain monitoring",
    network: network.name,
    chainId: networkInfo.chainId.toString(),
    tokenAuthorityAddress: "0xC959e1A9c3dE5949A0Ec1d5Df9555C27e2357257",
    tokenAuthorityPublicKey: TOKEN_AUTHORITY_PUBLIC_KEY,
    abi: JSON.parse(HeartbeatKernelKRNL.interface.formatJson()),
    functions: {
      execute: {
        signature: "execute()",
        returns: ["string", "uint256"],
        description: "Returns status 'OK' and current block timestamp",
        protected: false
      },
      protectedHeartbeat: {
        signature: "protectedHeartbeat((bytes,bytes,bytes),string)",
        returns: [],
        description: "KRNL-protected heartbeat function with kernel integration",
        protected: true
      },
      executeExtended: {
        signature: "executeExtended()",
        returns: ["string", "uint256", "uint256", "uint256"],
        description: "Returns status, timestamp, block number, and uptime",
        protected: false
      },
      isHealthy: {
        signature: "isHealthy()",
        returns: ["bool"],
        description: "Returns true if the contract is healthy",
        protected: false
      }
    },
    deploymentInfo: {
      deployer: deployer.address,
      transactionHash: deploymentTx.hash,
      blockNumber: deploymentTx.blockNumber,
      timestamp: new Date().toISOString()
    }
  };

  const kernelFile = path.join(__dirname, "..", "kernel-krnl.json");
  fs.writeFileSync(kernelFile, JSON.stringify(kernelMetadata, null, 2));
  console.log("💾 KRNL Kernel metadata saved to:", kernelFile);

  console.log("\n" + "=" .repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY:");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔐 Token Authority (Generic):", "0xC959e1A9c3dE5949A0Ec1d5Df9555C27e2357257");
  console.log("🔑 Token Authority Public Key:", TOKEN_AUTHORITY_PUBLIC_KEY);
  console.log("🌐 Network:", network.name);
  console.log("⛽ Gas Used:", gasEstimate.toString());

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Verify the contract on Etherscan (if on a public network)");
  console.log("2. Register the smart contract on KRNL Platform: https://app.platform.lat/contract");
  console.log("3. Use the kernel-krnl.json file for registration");
  console.log("4. Register as a kernel on KRNL Platform: https://app.platform.lat/kernel");
  console.log("5. Test the kernel functionality through KRNL platform");

  console.log("\n✅ KRNL-integrated deployment completed successfully!");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
