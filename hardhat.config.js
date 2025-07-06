require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://1rpc.io/sepolia",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_ethereum_sepolia_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
    krnlTestnet: {
      url: process.env.KRNL_TESTNET_RPC_URL || "https://v0-0-3-rpc.node.lat/",
      accounts: (process.env.PRIVATE_KEY && process.env.PRIVATE_KEY !== "your_ethereum_sepolia_private_key_here") ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111, // Using Sepolia chain ID as KRNL operates on Sepolia
    },
    oasisSapphire: {
      url: process.env.OASIS_SAPPHIRE_RPC_URL || "https://testnet.sapphire.oasis.dev",
      accounts: (process.env.OASIS_PRIVATE_KEY && process.env.OASIS_PRIVATE_KEY !== "your_oasis_sapphire_private_key_here") ? [process.env.OASIS_PRIVATE_KEY] : [],
      chainId: 23295,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
