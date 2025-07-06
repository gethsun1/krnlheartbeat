# HeartbeatKernel - KRNL Labs Ecosystem

A minimal "heartbeat.kernel" smart contract designed for the KRNL Labs ecosystem that provides health status monitoring and timestamp functionality for on-chain applications.

## 🎯 Project Overview

HeartbeatKernel is a lightweight, gas-optimized smart contract that serves as a kernel in the KRNL ecosystem. It provides essential monitoring capabilities by returning health status and blockchain timestamp information, making it perfect for on-chain monitoring, health checks, and system status verification.

## ✨ Features

- **Minimal Gas Usage**: Optimized view functions for cost-effective monitoring
- **Health Status Monitoring**: Always returns "OK" status for system health verification
- **Timestamp Tracking**: Provides current block timestamp for time-sensitive operations
- **Extended Monitoring**: Additional functions for block number and uptime tracking
- **KRNL Compatible**: Designed specifically for registration as a KRNL kernel
- **Comprehensive Testing**: 100% test coverage with 21 passing tests
- **Professional Documentation**: Complete setup and deployment guides

## 🏗️ Architecture

### Core Functions

#### `execute()` - Main Kernel Function
```solidity
function execute() external view returns (string memory status, uint256 timestamp)
```
- **Returns**: Status ("OK") and current block timestamp
- **Gas Cost**: ~21,643 gas (view function)
- **Use Case**: Primary health check and timestamp retrieval

#### `executeExtended()` - Extended Information
```solidity
function executeExtended() external view returns (
    string memory status,
    uint256 timestamp,
    uint256 blockNumber,
    uint256 uptime
)
```
- **Returns**: Status, timestamp, block number, and contract uptime
- **Use Case**: Comprehensive system monitoring

#### `isHealthy()` - Health Check
```solidity
function isHealthy() external pure returns (bool healthy)
```
- **Returns**: Always `true` (contract is operational)
- **Use Case**: Simple boolean health verification

### Metadata Functions

- `getMetadata()`: Returns contract name, version, and description
- `getDeploymentInfo()`: Returns deployment timestamp and current uptime

## 🚀 Quick Start

### Prerequisites

- Node.js (≥ 18.0.0)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd heartbeat-kernel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your private keys and API keys
   ```

### Development Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Deploy to local network
npx hardhat run scripts/deploy.js --network hardhat

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

## 📋 Deployment Guide

### Local Development

1. **Start local Hardhat network**
   ```bash
   npx hardhat node
   ```

2. **Deploy to local network**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

### Testnet Deployment (Sepolia)

1. **Configure environment variables**
   ```bash
   # Required for testnet deployment
   PRIVATE_KEY=your_ethereum_sepolia_private_key_here
   SEPOLIA_RPC_URL=https://1rpc.io/sepolia
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

2. **Get testnet ETH**
   - Visit [Sepolia Faucet](https://sepolia-faucet.pk910.de/)
   - Request testnet ETH for your deployment address

3. **Deploy to Sepolia**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Verify contract (optional)**
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

### KRNL Testnet Deployment

1. **Configure KRNL network**
   ```bash
   KRNL_TESTNET_RPC_URL=https://v0-0-3-rpc.node.lat/
   ```

2. **Deploy to KRNL testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network krnlTestnet
   ```

## 🧪 Testing

The project includes comprehensive test coverage with 21 test cases covering:

- **Deployment verification**
- **Core functionality testing**
- **Gas optimization validation**
- **Edge case handling**
- **Multiple caller scenarios**
- **Time-based functionality**

### Test Categories

1. **Deployment Tests**
   - Contract deployment verification
   - Metadata validation
   - Initial state verification

2. **Core Functionality Tests**
   - `execute()` function validation
   - `executeExtended()` comprehensive testing
   - `isHealthy()` verification

3. **Gas Optimization Tests**
   - Deployment gas cost validation
   - View function gas estimation
   - Performance benchmarking

4. **Edge Case Tests**
   - Multiple caller scenarios
   - Concurrent call handling
   - Time progression testing

### Running Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/HeartbeatKernel.test.js

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run tests with coverage
npx hardhat coverage
```

## 🔗 KRNL Platform Integration

### Kernel Registration

After successful deployment, register your kernel on the KRNL Platform:

1. **Visit KRNL Platform**
   - Go to [https://app.platform.lat/kernel](https://app.platform.lat/kernel)
   - Connect your wallet

2. **Register On-Chain Kernel**
   - Select "Register On-Chain Kernel"
   - Fill in the contract details:
     - **Network**: Sepolia (or your deployment network)
     - **Contract Address**: Your deployed contract address
     - **Function Signature**: `execute()`
     - **Function Return Type**: `(string,uint256)`

3. **Set Kernel Metadata**
   - **Name**: `heartbeat.kernel`
   - **Description**: "A minimal kernel that returns health status and current block timestamp for on-chain monitoring"
   - **Fee Per Query**: Set your desired fee (e.g., 0.001 ETH)

4. **Stake and Activate**
   - Stake the required amount
   - Activate your kernel

### Using kernel.json

The deployment script automatically generates a `kernel.json` file with all necessary metadata:

```json
{
  "name": "heartbeat.kernel",
  "version": "1.0.0",
  "address": "0x...",
  "description": "A minimal kernel that returns health status and current block timestamp for on-chain monitoring",
  "network": "sepolia",
  "chainId": "11155111",
  "abi": [...],
  "functions": {
    "execute": {
      "signature": "execute()",
      "returns": ["string", "uint256"],
      "description": "Returns status 'OK' and current block timestamp"
    }
  }
}
```

## 📊 Contract Specifications

### Gas Costs

| Function | Gas Estimate | Type |
|----------|-------------|------|
| `execute()` | ~21,643 | view |
| `executeExtended()` | ~25,000 | view |
| `isHealthy()` | ~21,307 | pure |
| `getMetadata()` | ~22,459 | pure |
| `getDeploymentInfo()` | ~23,000 | view |
| **Deployment** | ~303,569 | - |

### Contract Size

- **Bytecode Size**: Optimized for minimal deployment cost
- **Runtime Size**: Lightweight for efficient execution
- **Optimizer Runs**: 200 (balanced for deployment and runtime costs)

### Network Compatibility

| Network | Chain ID | Status | RPC URL |
|---------|----------|--------|---------|
| Hardhat Local | 31337 | ✅ Tested | localhost:8545 |
| Sepolia Testnet | 11155111 | ✅ Supported | https://1rpc.io/sepolia |
| KRNL Testnet | 11155111 | ✅ Supported | https://v0-0-3-rpc.node.lat/ |
| Oasis Sapphire | 23295 | ⚠️ Configured | https://testnet.sapphire.oasis.dev |

## 🛠️ Development

### Project Structure

```
heartbeat-kernel/
├── contracts/
│   └── HeartbeatKernel.sol      # Main contract
├── test/
│   └── HeartbeatKernel.test.js  # Comprehensive tests
├── scripts/
│   └── deploy.js                # Deployment script
├── deployments/                 # Deployment artifacts
├── hardhat.config.js           # Hardhat configuration
├── kernel.json                 # KRNL metadata
└── README.md                   # This file
```

### Code Quality

- **Solidity Version**: ^0.8.19
- **License**: MIT
- **Test Coverage**: 100% (21/21 tests passing)
- **Gas Optimization**: Enabled with 200 runs
- **Security**: No external dependencies, minimal attack surface

### Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PRIVATE_KEY` | Ethereum private key for deployment | Yes* | - |
| `OASIS_PRIVATE_KEY` | Oasis Sapphire private key | No | - |
| `SEPOLIA_RPC_URL` | Sepolia testnet RPC URL | No | https://1rpc.io/sepolia |
| `KRNL_TESTNET_RPC_URL` | KRNL testnet RPC URL | No | https://v0-0-3-rpc.node.lat/ |
| `ETHERSCAN_API_KEY` | Etherscan API key for verification | No | - |
| `REPORT_GAS` | Enable gas reporting | No | false |

*Required for testnet/mainnet deployment

### Network Configuration

The project supports multiple networks configured in `hardhat.config.js`:

- **hardhat**: Local development network
- **sepolia**: Ethereum Sepolia testnet
- **krnlTestnet**: KRNL testnet (operates on Sepolia)
- **oasisSapphire**: Oasis Sapphire testnet

## 📚 API Reference

### Contract Interface

```solidity
interface IHeartbeatKernel {
    // Main kernel function
    function execute() external view returns (string memory status, uint256 timestamp);

    // Extended monitoring
    function executeExtended() external view returns (
        string memory status,
        uint256 timestamp,
        uint256 blockNumber,
        uint256 uptime
    );

    // Health check
    function isHealthy() external pure returns (bool healthy);

    // Metadata functions
    function getMetadata() external pure returns (
        string memory contractName,
        string memory contractVersion,
        string memory contractDescription
    );

    function getDeploymentInfo() external view returns (
        uint256 deploymentTimestamp,
        uint256 currentUptime
    );

    // Public constants
    function name() external pure returns (string memory);
    function version() external pure returns (string memory);
    function description() external pure returns (string memory);
    function deployedAt() external view returns (uint256);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **"Private key too short" error**
   - Ensure your private key is 64 characters (32 bytes) long
   - Remove any "0x" prefix from the private key

2. **"Insufficient funds" error**
   - Get testnet ETH from faucets
   - Check your account balance

3. **"Network not found" error**
   - Verify RPC URLs in `.env` file
   - Check network configuration in `hardhat.config.js`

4. **Contract verification fails**
   - Ensure Etherscan API key is correct
   - Wait a few minutes after deployment before verifying

### Getting Help

- **KRNL Documentation**: [https://docs.krnl.xyz](https://docs.krnl.xyz)
- **KRNL Discord**: [https://discord.gg/krnl-labs](https://discord.gg/krnl-labs)
- **GitHub Issues**: Create an issue in this repository

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **KRNL Labs** for the innovative kernel ecosystem
- **Hardhat** for the excellent development framework
- **OpenZeppelin** for security best practices
- **Ethereum Foundation** for the robust blockchain infrastructure

## 🔮 Future Enhancements

- [ ] Add configurable health check parameters
- [ ] Implement custom event logging
- [ ] Add multi-signature deployment support
- [ ] Create governance mechanisms for kernel updates
- [ ] Implement cross-chain compatibility
- [ ] Add performance metrics collection

---

**Built with ❤️ for the KRNL Labs ecosystem**

For more information about KRNL Labs and the kernel ecosystem, visit [krnl.xyz](https://www.krnl.xyz)
