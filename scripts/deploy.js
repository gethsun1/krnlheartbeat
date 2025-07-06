const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting HeartbeatKernel deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH\n");

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name);
  console.log("🔗 Chain ID:", network.chainId.toString());
  console.log("⛽ Gas Price:", ethers.formatUnits(await ethers.provider.getFeeData().then(f => f.gasPrice), "gwei"), "gwei\n");

  // Deploy the contract
  console.log("📦 Deploying HeartbeatKernel contract...");
  const HeartbeatKernel = await ethers.getContractFactory("HeartbeatKernel");
  
  // Estimate gas for deployment
  const deployTx = await HeartbeatKernel.getDeployTransaction();
  const gasEstimate = await ethers.provider.estimateGas(deployTx);
  console.log("⛽ Estimated gas for deployment:", gasEstimate.toString());

  // Deploy the contract
  const heartbeatKernel = await HeartbeatKernel.deploy();
  await heartbeatKernel.waitForDeployment();

  const contractAddress = await heartbeatKernel.getAddress();
  console.log("✅ HeartbeatKernel deployed to:", contractAddress);

  // Get deployment transaction details
  const deploymentTx = heartbeatKernel.deploymentTransaction();
  console.log("📋 Transaction hash:", deploymentTx.hash);
  console.log("🧱 Block number:", deploymentTx.blockNumber);

  // Wait for confirmations (adjust based on network)
  const confirmations = network.chainId === 31337n ? 1 : 2; // Local network needs only 1 confirmation
  console.log(`\n⏳ Waiting for ${confirmations} confirmation(s)...`);
  await deploymentTx.wait(confirmations);
  console.log(`✅ Contract confirmed with ${confirmations} confirmation(s)`);

  // Test the deployed contract
  console.log("\n🧪 Testing deployed contract...");
  try {
    const result = await heartbeatKernel.execute();
    console.log("✅ execute() test successful:");
    console.log("   Status:", result[0]);
    console.log("   Timestamp:", result[1].toString());

    const metadata = await heartbeatKernel.getMetadata();
    console.log("✅ getMetadata() test successful:");
    console.log("   Name:", metadata[0]);
    console.log("   Version:", metadata[1]);
    console.log("   Description:", metadata[2]);

    const isHealthy = await heartbeatKernel.isHealthy();
    console.log("✅ isHealthy() test successful:", isHealthy);
  } catch (error) {
    console.error("❌ Contract testing failed:", error.message);
  }

  // Create deployment information object
  const deploymentInfo = {
    contractName: "HeartbeatKernel",
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    network: network.name,
    chainId: network.chainId.toString(),
    transactionHash: deploymentTx.hash,
    blockNumber: deploymentTx.blockNumber,
    gasUsed: deploymentTx.gasLimit?.toString() || "N/A",
    timestamp: new Date().toISOString(),
    abi: HeartbeatKernel.interface.formatJson(),
    bytecode: HeartbeatKernel.bytecode,
    metadata: {
      name: "heartbeat.kernel",
      version: "1.0.0",
      description: "A minimal kernel that returns health status and current block timestamp for on-chain monitoring"
    }
  };

  // Save deployment information
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network.name}-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentFile);

  // Save latest deployment info
  const latestFile = path.join(deploymentsDir, "latest.json");
  fs.writeFileSync(latestFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Latest deployment info saved to:", latestFile);

  // Create kernel.json metadata file for KRNL registration
  const kernelMetadata = {
    name: "heartbeat.kernel",
    version: "1.0.0",
    address: contractAddress,
    description: "A minimal kernel that returns health status and current block timestamp for on-chain monitoring",
    network: network.name,
    chainId: network.chainId.toString(),
    abi: JSON.parse(HeartbeatKernel.interface.formatJson()),
    functions: {
      execute: {
        signature: "execute()",
        returns: ["string", "uint256"],
        description: "Returns status 'OK' and current block timestamp"
      },
      executeExtended: {
        signature: "executeExtended()",
        returns: ["string", "uint256", "uint256", "uint256"],
        description: "Returns status, timestamp, block number, and uptime"
      },
      isHealthy: {
        signature: "isHealthy()",
        returns: ["bool"],
        description: "Returns true if the contract is healthy"
      }
    },
    deploymentInfo: {
      deployer: deployer.address,
      transactionHash: deploymentTx.hash,
      blockNumber: deploymentTx.blockNumber,
      timestamp: new Date().toISOString()
    }
  };

  const kernelFile = path.join(__dirname, "..", "kernel.json");
  fs.writeFileSync(kernelFile, JSON.stringify(kernelMetadata, null, 2));
  console.log("💾 Kernel metadata saved to:", kernelFile);

  // Display summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Contract Name:     HeartbeatKernel");
  console.log("Contract Address:  " + contractAddress);
  console.log("Network:           " + network.name);
  console.log("Chain ID:          " + network.chainId.toString());
  console.log("Transaction Hash:  " + deploymentTx.hash);
  console.log("Block Number:      " + deploymentTx.blockNumber);
  console.log("Deployer:          " + deployer.address);
  console.log("Gas Used:          " + (deploymentTx.gasLimit?.toString() || "N/A"));
  console.log("Timestamp:         " + new Date().toISOString());
  console.log("=".repeat(60));

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Verify the contract on Etherscan (if on a public network)");
  console.log("2. Register the kernel on KRNL Platform: https://app.platform.lat/kernel");
  console.log("3. Use the kernel.json file for registration");
  console.log("4. Test the kernel functionality through KRNL platform");

  console.log("\n✅ Deployment completed successfully!");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
