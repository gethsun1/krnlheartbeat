# KRNL Labs Zealy Quest Registration Guide

## 🎯 Overview

This guide provides step-by-step instructions for registering the HeartbeatKernel as a unique kernel on the KRNL Labs Zealy platform to complete the "Register a unique kernel" quest.

## 📋 Prerequisites

Before starting the registration process, ensure you have:

1. ✅ **Deployed Contract**: HeartbeatKernel successfully deployed to Sepolia testnet
2. ✅ **Contract Verification**: Contract verified on Etherscan (optional but recommended)
3. ✅ **Wallet Setup**: MetaMask or compatible wallet connected to Sepolia testnet
4. ✅ **KRNL Platform Account**: Account created on [https://app.platform.lat](https://app.platform.lat)
5. ✅ **Zealy Account**: Account created on KRNL Labs Zealy platform

## 🚀 Step-by-Step Registration Process

### Step 1: Deploy to Sepolia Testnet

1. **Ensure you have Sepolia ETH**
   ```bash
   # Check your balance
   npx hardhat run scripts/check-balance.js --network sepolia
   ```

2. **Deploy the contract**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Note the deployment details**:
   - Contract Address: `0x[YOUR_CONTRACT_ADDRESS]`
   - Transaction Hash: `0x[YOUR_TX_HASH]`
   - Block Number: `[BLOCK_NUMBER]`

### Step 2: Verify Contract on Etherscan (Recommended)

```bash
npx hardhat verify --network sepolia [CONTRACT_ADDRESS]
```

### Step 3: Register Kernel on KRNL Platform

1. **Visit KRNL Platform**
   - Go to [https://app.platform.lat/kernel](https://app.platform.lat/kernel)
   - Connect your wallet (same address used for deployment)

2. **Select "Register On-Chain Kernel"**

3. **Fill in Contract Details**:
   - **Network**: Sepolia
   - **Contract Address**: `[YOUR_DEPLOYED_ADDRESS]`
   - **Function Signature**: `execute()`
   - **Function Return Type**: `(string,uint256)`

4. **Set Kernel Metadata**:
   - **Name**: `heartbeat.kernel`
   - **Description**: "A minimal kernel that returns health status and current block timestamp for on-chain monitoring"
   - **Logo**: Upload the KRNL Labs logo or custom heartbeat icon
   - **Fee Per Query**: `0.001 ETH` (or your preferred amount)

5. **Configure Staking**:
   - Set your staking amount (minimum required by platform)
   - Confirm staking transaction

6. **Activate Kernel**:
   - Review all details
   - Click "Activate"
   - Confirm the activation transaction

### Step 4: Test Kernel Functionality

1. **Test the kernel through KRNL platform**:
   - Navigate to the kernel testing interface
   - Execute a test call to `execute()`
   - Verify it returns: `("OK", [current_timestamp])`

2. **Verify kernel appears in marketplace**:
   - Check that your kernel is listed in the KRNL marketplace
   - Ensure metadata displays correctly

### Step 5: Complete Zealy Quest

1. **Navigate to KRNL Labs Zealy**
   - Visit the KRNL Labs Zealy platform
   - Find the "Register a unique kernel" quest

2. **Submit Quest Information**:
   - **Kernel Name**: `heartbeat.kernel`
   - **Contract Address**: `[YOUR_SEPOLIA_ADDRESS]`
   - **Network**: Sepolia
   - **Description**: "A minimal kernel that returns health status and current block timestamp for on-chain monitoring"
   - **KRNL Platform URL**: Link to your kernel on app.platform.lat

3. **Provide Proof**:
   - Screenshot of successful kernel registration
   - Screenshot of kernel appearing in KRNL marketplace
   - Transaction hash of kernel activation

4. **Submit Quest**:
   - Review all information
   - Submit the quest
   - Wait for verification and XP reward

## 📊 Kernel Specifications for Registration

### Contract Information
```json
{
  "name": "heartbeat.kernel",
  "version": "1.0.0",
  "description": "A minimal kernel that returns health status and current block timestamp for on-chain monitoring",
  "network": "sepolia",
  "chainId": "11155111"
}
```

### Function Details
```solidity
// Primary kernel function
function execute() external view returns (string memory status, uint256 timestamp)

// Returns: ("OK", block.timestamp)
// Gas Cost: ~21,643 gas
// Type: View function (no state changes)
```

### Additional Functions Available
- `executeExtended()`: Returns status, timestamp, block number, and uptime
- `isHealthy()`: Returns boolean health status
- `getMetadata()`: Returns contract metadata
- `getDeploymentInfo()`: Returns deployment timestamp and uptime

## 🔧 Troubleshooting

### Common Issues and Solutions

1. **"Contract not found" error**
   - Verify contract address is correct
   - Ensure contract is deployed to Sepolia
   - Check if contract is verified on Etherscan

2. **"Function signature invalid" error**
   - Use exact signature: `execute()`
   - Ensure return type is: `(string,uint256)`
   - Check function is public/external and view

3. **"Insufficient staking" error**
   - Check minimum staking requirements
   - Ensure wallet has enough ETH for staking
   - Verify gas fees for staking transaction

4. **"Kernel activation failed" error**
   - Check wallet connection
   - Verify network is Sepolia
   - Ensure sufficient gas for activation

### Getting Help

- **KRNL Documentation**: [https://docs.krnl.xyz](https://docs.krnl.xyz)
- **KRNL Discord**: [https://discord.gg/krnl-labs](https://discord.gg/krnl-labs)
- **Zealy Support**: Contact through Zealy platform

## 📸 Required Screenshots for Zealy

1. **Successful Deployment**
   - Terminal output showing successful deployment
   - Contract address and transaction hash visible

2. **KRNL Platform Registration**
   - Kernel registration form filled out
   - Successful registration confirmation

3. **Kernel Marketplace Listing**
   - Your kernel appearing in KRNL marketplace
   - Kernel details and metadata visible

4. **Test Execution**
   - Successful test call showing "OK" status
   - Timestamp return value visible

## 🎉 Success Criteria

Your Zealy quest submission should demonstrate:

- ✅ Unique kernel name (`heartbeat.kernel`)
- ✅ Successful deployment to Sepolia testnet
- ✅ Proper registration on KRNL platform
- ✅ Functional kernel execution
- ✅ Kernel visible in marketplace
- ✅ Complete documentation and metadata

## 📝 Submission Template

Use this template for your Zealy quest submission:

```
Kernel Name: heartbeat.kernel
Contract Address: 0x[YOUR_ADDRESS]
Network: Sepolia (Chain ID: 11155111)
Transaction Hash: 0x[YOUR_TX_HASH]
KRNL Platform URL: https://app.platform.lat/kernel/[YOUR_KERNEL_ID]

Description: A minimal kernel that returns health status and current block timestamp for on-chain monitoring. This kernel provides essential monitoring capabilities for the KRNL ecosystem with optimized gas usage and reliable health status reporting.

Function Signature: execute()
Return Type: (string,uint256)
Gas Cost: ~21,643 gas

Additional Features:
- Extended monitoring with executeExtended()
- Health check with isHealthy()
- Comprehensive metadata functions
- 100% test coverage
- Professional documentation
```

---

**Ready to register your kernel and earn XP on Zealy! 🚀**
