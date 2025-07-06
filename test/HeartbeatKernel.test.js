const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HeartbeatKernel", function () {
  let heartbeatKernel;
  let owner;
  let addr1;
  let addr2;
  let deploymentTimestamp;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const HeartbeatKernel = await ethers.getContractFactory("HeartbeatKernel");
    heartbeatKernel = await HeartbeatKernel.deploy();
    await heartbeatKernel.waitForDeployment();

    // Get deployment timestamp (approximate)
    const block = await ethers.provider.getBlock("latest");
    deploymentTimestamp = block.timestamp;
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await heartbeatKernel.getAddress()).to.be.properAddress;
    });

    it("Should set the correct deployment timestamp", async function () {
      const contractDeployedAt = await heartbeatKernel.deployedAt();
      expect(contractDeployedAt).to.be.closeTo(deploymentTimestamp, 5); // Allow 5 seconds tolerance
    });

    it("Should have correct contract metadata", async function () {
      expect(await heartbeatKernel.name()).to.equal("heartbeat.kernel");
      expect(await heartbeatKernel.version()).to.equal("1.0.0");
      expect(await heartbeatKernel.description()).to.include("minimal kernel");
    });
  });

  describe("Core Functionality", function () {
    describe("execute() function", function () {
      it("Should return correct status and timestamp", async function () {
        const result = await heartbeatKernel.execute();
        expect(result[0]).to.equal("OK"); // status
        expect(result[1]).to.be.a("bigint"); // timestamp
        expect(result[1]).to.be.greaterThan(0);
      });

      it("Should return current block timestamp", async function () {
        const result = await heartbeatKernel.execute();
        const currentBlock = await ethers.provider.getBlock("latest");
        expect(result[1]).to.be.closeTo(currentBlock.timestamp, 5);
      });

      it("Should be a view function (reasonable gas estimate)", async function () {
        const gasEstimate = await heartbeatKernel.execute.estimateGas();
        expect(gasEstimate).to.be.lessThan(50000n); // View functions should have low gas estimates
      });
    });

    describe("executeExtended() function", function () {
      it("Should return all expected values", async function () {
        const result = await heartbeatKernel.executeExtended();
        expect(result[0]).to.equal("OK"); // status
        expect(result[1]).to.be.a("bigint"); // timestamp
        expect(result[2]).to.be.a("bigint"); // blockNumber
        expect(result[3]).to.be.a("bigint"); // uptime
      });

      it("Should return correct uptime calculation", async function () {
        const result = await heartbeatKernel.executeExtended();
        const deployedAt = await heartbeatKernel.deployedAt();
        const expectedUptime = result[1] - deployedAt; // timestamp - deployedAt
        expect(result[3]).to.equal(expectedUptime);
      });

      it("Should return current block number", async function () {
        const result = await heartbeatKernel.executeExtended();
        const currentBlock = await ethers.provider.getBlock("latest");
        expect(result[2]).to.be.closeTo(currentBlock.number, 2);
      });
    });

    describe("isHealthy() function", function () {
      it("Should always return true", async function () {
        expect(await heartbeatKernel.isHealthy()).to.be.true;
      });

      it("Should be a pure function (reasonable gas estimate)", async function () {
        const gasEstimate = await heartbeatKernel.isHealthy.estimateGas();
        expect(gasEstimate).to.be.lessThan(50000n);
      });
    });
  });

  describe("Metadata Functions", function () {
    describe("getMetadata() function", function () {
      it("Should return correct metadata", async function () {
        const result = await heartbeatKernel.getMetadata();
        expect(result[0]).to.equal("heartbeat.kernel"); // name
        expect(result[1]).to.equal("1.0.0"); // version
        expect(result[2]).to.include("minimal kernel"); // description
      });

      it("Should be a pure function (reasonable gas estimate)", async function () {
        const gasEstimate = await heartbeatKernel.getMetadata.estimateGas();
        expect(gasEstimate).to.be.lessThan(50000n);
      });
    });

    describe("getDeploymentInfo() function", function () {
      it("Should return correct deployment information", async function () {
        const result = await heartbeatKernel.getDeploymentInfo();
        const deployedAt = await heartbeatKernel.deployedAt();

        expect(result[0]).to.equal(deployedAt); // deploymentTimestamp
        expect(result[1]).to.be.greaterThanOrEqual(0); // currentUptime (can be 0 in same block)
      });

      it("Should calculate uptime correctly", async function () {
        // Mine a new block to ensure time progression
        await ethers.provider.send("evm_increaseTime", [1]);
        await ethers.provider.send("evm_mine");

        const result = await heartbeatKernel.getDeploymentInfo();
        expect(result[1]).to.be.greaterThan(0); // uptime should be > 0 after time increase
      });
    });
  });

  describe("Gas Optimization", function () {
    it("Should have reasonable gas costs for deployment", async function () {
      const HeartbeatKernel = await ethers.getContractFactory("HeartbeatKernel");
      const deployTx = await HeartbeatKernel.getDeployTransaction();
      const gasEstimate = await ethers.provider.estimateGas(deployTx);
      
      // Should be under 500k gas for deployment
      expect(gasEstimate).to.be.lessThan(500000n);
    });

    it("All view functions should have reasonable gas estimates", async function () {
      expect(await heartbeatKernel.execute.estimateGas()).to.be.lessThan(50000n);
      expect(await heartbeatKernel.executeExtended.estimateGas()).to.be.lessThan(50000n);
      expect(await heartbeatKernel.isHealthy.estimateGas()).to.be.lessThan(50000n);
      expect(await heartbeatKernel.getMetadata.estimateGas()).to.be.lessThan(50000n);
      expect(await heartbeatKernel.getDeploymentInfo.estimateGas()).to.be.lessThan(50000n);
    });
  });

  describe("Multiple Calls Consistency", function () {
    it("Should return consistent results across multiple calls", async function () {
      const result1 = await heartbeatKernel.execute();
      const result2 = await heartbeatKernel.execute();
      
      expect(result1[0]).to.equal(result2[0]); // status should be same
      // Timestamps might differ slightly due to block progression
      expect(result2[1]).to.be.greaterThanOrEqual(result1[1]);
    });

    it("Should handle concurrent calls properly", async function () {
      const promises = Array(5).fill().map(() => heartbeatKernel.execute());
      const results = await Promise.all(promises);
      
      // All should return "OK" status
      results.forEach(result => {
        expect(result[0]).to.equal("OK");
        expect(result[1]).to.be.greaterThan(0);
      });
    });
  });

  describe("Edge Cases", function () {
    it("Should work with different callers", async function () {
      const result1 = await heartbeatKernel.connect(owner).execute();
      const result2 = await heartbeatKernel.connect(addr1).execute();
      const result3 = await heartbeatKernel.connect(addr2).execute();
      
      expect(result1[0]).to.equal("OK");
      expect(result2[0]).to.equal("OK");
      expect(result3[0]).to.equal("OK");
    });

    it("Should maintain state correctly over time", async function () {
      const initialUptime = await heartbeatKernel.getDeploymentInfo();
      
      // Simulate some time passing by mining blocks
      await ethers.provider.send("evm_increaseTime", [10]);
      await ethers.provider.send("evm_mine");
      
      const laterUptime = await heartbeatKernel.getDeploymentInfo();
      expect(laterUptime[1]).to.be.greaterThan(initialUptime[1]);
    });
  });
});
