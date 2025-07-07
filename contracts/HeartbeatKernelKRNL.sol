// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {KRNL, KrnlPayload, KernelParameter, KernelResponse} from "./KRNL.sol";

/**
 * @title HeartbeatKernelKRNL
 * @dev A KRNL-integrated heartbeat kernel that provides health status and timestamp monitoring
 * @notice This contract integrates with the KRNL ecosystem and can be used as both a kernel and a protected smart contract
 */
contract HeartbeatKernelKRNL is KRNL {
    
    // Events for monitoring
    event HeartbeatChecked(address indexed caller, uint256 timestamp, string status, uint256 kernelScore);
    event KernelResponseReceived(address indexed caller, uint256 kernelId, bytes result);
    
    // Contract metadata
    string public constant name = "heartbeat.kernel";
    string public constant version = "1.0.0";
    string public constant description = "A KRNL-integrated kernel that returns health status and current block timestamp for on-chain monitoring";
    
    // Deployment timestamp for uptime calculation
    uint256 public immutable deployedAt;
    
    // Heartbeat data
    struct HeartbeatData {
        string status;
        uint256 timestamp;
        uint256 blockNumber;
        uint256 uptime;
        uint256 kernelScore;
    }
    
    constructor(address _tokenAuthorityPublicKey) KRNL(_tokenAuthorityPublicKey) {
        deployedAt = block.timestamp;
    }
    
    /**
     * @dev Main heartbeat function that returns status and timestamp (view function, no KRNL protection needed)
     * @return status Always returns "OK" indicating the contract is operational
     * @return timestamp Current block timestamp
     */
    function execute() external view returns (string memory status, uint256 timestamp) {
        return ("OK", block.timestamp);
    }
    
    /**
     * @dev Protected heartbeat function that integrates with KRNL ecosystem
     * @param krnlPayload The KRNL payload containing auth, kernel responses, and kernel params
     * @param input Optional input message for the heartbeat
     */
    function protectedHeartbeat(
        KrnlPayload memory krnlPayload,
        string memory input
    )
        external
        onlyAuthorized(krnlPayload, abi.encode(input))
    {
        // Decode response from kernel(s)
        KernelResponse[] memory kernelResponses = abi.decode(krnlPayload.kernelResponses, (KernelResponse[]));
        uint256 kernelScore = 0;
        
        for (uint i = 0; i < kernelResponses.length; i++) {
            // Emit event for each kernel response received
            emit KernelResponseReceived(msg.sender, kernelResponses[i].kernelId, kernelResponses[i].result);
            
            // Example: Handle kernel ID 337 (Prohibited List kernel)
            if (kernelResponses[i].kernelId == 337) {
                kernelScore = abi.decode(kernelResponses[i].result, (uint256));
            }
            // Add more kernel handling as needed
        }
        
        // Emit heartbeat event with kernel score
        emit HeartbeatChecked(msg.sender, block.timestamp, "OK", kernelScore);
    }
    
    /**
     * @dev Extended heartbeat function with additional information (view function)
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
    
    /**
     * @dev Get comprehensive heartbeat data
     * @return data HeartbeatData struct containing all relevant information
     */
    function getHeartbeatData() external view returns (HeartbeatData memory data) {
        return HeartbeatData({
            status: "OK",
            timestamp: block.timestamp,
            blockNumber: block.number,
            uptime: block.timestamp - deployedAt,
            kernelScore: 0 // This would be populated in protected functions
        });
    }
}
