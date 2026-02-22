// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AIResultVerifier
 * @dev Verifies off-chain AI model results using cryptographic proofs
 * Implements verifiable computation pattern for AI predictions
 */
contract AIResultVerifier is AccessControl {
    bytes32 public constant AI_OPERATOR_ROLE = keccak256("AI_OPERATOR_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    error InvalidProof();
    error ModelNotRegistered();
    error ResultExpired();

    struct AIModel {
        string modelId;
        string modelHash;          // IPFS hash of model weights
        address operator;
        uint64 registeredAt;
        bool isActive;
        uint256 predictionCount;
    }

    struct AIResult {
        bytes32 resultHash;
        uint256 riskScore;
        uint256 confidence;
        bytes proof;               // Cryptographic proof (can be zk-SNARK)
        uint64 computedAt;
        bool verified;
    }

    // Model ID => Model data
    mapping(string => AIModel) public aiModels;
    
    // Result hash => Result data
    mapping(bytes32 => AIResult) public aiResults;
    
    // Reward pool for accurate predictions
    mapping(address => uint256) public operatorRewards;

    uint256 public constant RESULT_VALIDITY_PERIOD = 30 minutes;
    uint256 public rewardPool;

    event ModelRegistered(
        string indexed modelId,
        address indexed operator,
        string modelHash
    );
    
    event ResultSubmitted(
        bytes32 indexed resultHash,
        string indexed modelId,
        uint256 riskScore,
        uint256 confidence
    );
    
    event ResultVerified(
        bytes32 indexed resultHash,
        bool isValid
    );
    
    event RewardDistributed(
        address indexed operator,
        uint256 amount
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    /**
     * @dev Register a new AI model
     */
    function registerModel(
        string calldata modelId,
        string calldata modelHash
    ) external onlyRole(AI_OPERATOR_ROLE) {
        aiModels[modelId] = AIModel({
            modelId: modelId,
            modelHash: modelHash,
            operator: msg.sender,
            registeredAt: uint64(block.timestamp),
            isActive: true,
            predictionCount: 0
        });

        emit ModelRegistered(modelId, msg.sender, modelHash);
    }

    /**
     * @dev Submit AI-computed risk result with proof
     * @param modelId ID of the AI model used
     * @param assetId Asset being assessed
     * @param riskScore Computed risk score (0-10000)
     * @param confidence AI confidence level (0-10000)
     * @param proof Cryptographic proof of computation
     */
    function submitAIResult(
        string calldata modelId,
        string calldata assetId,
        uint256 riskScore,
        uint256 confidence,
        bytes calldata proof
    ) external onlyRole(AI_OPERATOR_ROLE) returns (bytes32) {
        if (!aiModels[modelId].isActive) revert ModelNotRegistered();
        
        // Create unique result hash
        bytes32 resultHash = keccak256(
            abi.encodePacked(modelId, assetId, riskScore, block.timestamp)
        );

        aiResults[resultHash] = AIResult({
            resultHash: resultHash,
            riskScore: riskScore,
            confidence: confidence,
            proof: proof,
            computedAt: uint64(block.timestamp),
            verified: false
        });

        aiModels[modelId].predictionCount++;

        emit ResultSubmitted(resultHash, modelId, riskScore, confidence);
        
        return resultHash;
    }

    /**
     * @dev Verify AI result proof
     * Simplified verification - in production, use zk-SNARKs
     */
    function verifyResult(bytes32 resultHash) 
        external 
        onlyRole(VERIFIER_ROLE) 
        returns (bool) 
    {
        AIResult storage result = aiResults[resultHash];
        
        if (result.computedAt == 0) revert InvalidProof();
        if (block.timestamp > result.computedAt + RESULT_VALIDITY_PERIOD) {
            revert ResultExpired();
        }

        // Simplified proof verification
        // In production: verify zk-SNARK proof using Groth16 or PLONK
        bool isValid = _verifyProof(result.proof);
        
        result.verified = isValid;

        emit ResultVerified(resultHash, isValid);
        
        return isValid;
    }

    /**
     * @dev Internal proof verification logic
     * Placeholder for actual zk-SNARK verification
     */
    function _verifyProof(bytes memory proof) internal pure returns (bool) {
        // In production, implement actual cryptographic verification
        // For now, check proof is not empty
        return proof.length > 0;
    }

    /**
     * @dev Distribute rewards to accurate AI operators
     */
    function distributeReward(address operator, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(amount <= rewardPool, "Insufficient reward pool");
        
        operatorRewards[operator] += amount;
        rewardPool -= amount;

        emit RewardDistributed(operator, amount);
    }

    /**
     * @dev Fund the reward pool
     */
    function fundRewardPool() external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        rewardPool += msg.value;
    }

    /**
     * @dev Claim accumulated rewards
     */
    function claimRewards() external nonReentrant {
        uint256 reward = operatorRewards[msg.sender];
        require(reward > 0, "No rewards to claim");
        
        operatorRewards[msg.sender] = 0;
        
        (bool success, ) = msg.sender.call{value: reward}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Get AI result details
     */
    function getResult(bytes32 resultHash) 
        external 
        view 
        returns (AIResult memory) 
    {
        return aiResults[resultHash];
    }

    /**
     * @dev Check if result is still valid
     */
    function isResultValid(bytes32 resultHash) external view returns (bool) {
        AIResult memory result = aiResults[resultHash];
        return result.verified && 
               block.timestamp <= result.computedAt + RESULT_VALIDITY_PERIOD;
    }
}
