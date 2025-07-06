// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title HeartbeatKernel
 * @dev A minimal kernel that returns health status and current block timestamp for on-chain monitoring
 * @notice This contract provides a simple heartbeat function that can be registered as a KRNL kernel
 */
contract HeartbeatKernel {
    
    // Events for monitoring
    event HeartbeatChecked(address indexed caller, uint256 timestamp, string status);
    
    // Contract metadata
    string public constant name = "heartbeat.kernel";
    string public constant version = "1.0.0";
    string public constant description = "A minimal kernel that returns health status and current block timestamp for on-chain monitoring";
    
    // Deployment timestamp for uptime calculation
    uint256 public immutable deployedAt;
    
    constructor() {
        deployedAt = block.timestamp;
    }
    
    /**
     * @dev Main heartbeat function that returns status and timestamp
     * @return status Always returns "OK" indicating the contract is operational
     * @return timestamp Current block timestamp
     */
    function execute() external view returns (string memory status, uint256 timestamp) {
        return ("OK", block.timestamp);
    }
    
    /**
     * @dev Extended heartbeat function with additional information
     * @return status Always returns "OK" indicating the contract is operational
     * @return timestamp Current block timestamp
     * @return blockNumber Current block number
     * @return uptime Time elapsed since contract deployment
     */
    function executeExtended() external view returns (
        string memory status, 
        uint256 timestamp, 
        uint256 blockNumber, 
        uint256 uptime
    ) {
        return (
            "OK", 
            block.timestamp, 
            block.number, 
            block.timestamp - deployedAt
        );
    }
    
    /**
     * @dev Get contract metadata
     * @return contractName The name of the kernel
     * @return contractVersion The version of the kernel
     * @return contractDescription The description of the kernel
     */
    function getMetadata() external pure returns (
        string memory contractName,
        string memory contractVersion,
        string memory contractDescription
    ) {
        return (name, version, description);
    }
    
    /**
     * @dev Check if the contract is healthy (always returns true for this simple implementation)
     * @return healthy Always returns true
     */
    function isHealthy() external pure returns (bool healthy) {
        return true;
    }
    
    /**
     * @dev Get deployment information
     * @return deploymentTimestamp When the contract was deployed
     * @return currentUptime Current uptime in seconds
     */
    function getDeploymentInfo() external view returns (
        uint256 deploymentTimestamp,
        uint256 currentUptime
    ) {
        return (deployedAt, block.timestamp - deployedAt);
    }
}
