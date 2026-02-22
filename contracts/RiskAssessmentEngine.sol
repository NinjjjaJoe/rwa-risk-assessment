// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title RiskAssessmentEngine
 * @dev Core risk calculation engine with multi-oracle integration
 * Gas-optimized for real-time risk assessment
 */
contract RiskAssessmentEngine is AccessControl, ReentrancyGuard {
    bytes32 public constant RISK_ASSESSOR_ROLE = keccak256("RISK_ASSESSOR_ROLE");
    bytes32 public constant ORACLE_MANAGER_ROLE = keccak256("ORACLE_MANAGER_ROLE");

    // Custom errors for gas efficiency
    error InvalidRiskScore();
    error UnauthorizedAssessor();
    error AssetNotFound();
    error OracleUpdateFailed();
    error StaleData();

    struct RiskParameters {
        uint256 volatilityScore;      // 0-10000 (basis points)
        uint256 liquidityScore;        // 0-10000
        uint256 marketCapScore;        // 0-10000
        uint256 regulatoryScore;       // 0-10000
        uint256 aiConfidenceScore;     // 0-10000
        uint64 lastUpdated;
        bool isActive;
    }

    struct AssetRiskProfile {
        string assetId;
        uint256 aggregatedRiskScore;   // Weighted average of all parameters
        RiskParameters parameters;
        address[] oracleSources;
        uint64 assessmentCount;
        bool verified;
    }

    struct OracleSource {
        address oracleAddress;
        uint256 weight;                // Basis points (10000 = 100%)
        uint64 lastUpdate;
        bool isActive;
    }

    // Asset ID => Risk Profile
    mapping(bytes32 => AssetRiskProfile) public assetRiskProfiles;
    
    // Oracle source name => Oracle data
    mapping(string => OracleSource) public oracleSources;
    
    // Asset ID => Historical risk scores
    mapping(bytes32 => uint256[]) private historicalRiskScores;
    
    // Risk threshold alerts
    mapping(bytes32 => uint256) public riskThresholds;

    uint256 public constant MAX_RISK_SCORE = 10000;
    uint256 public constant RISK_PRECISION = 100;
    
    // Oracle configuration
    uint256 public constant MAX_DATA_STALENESS = 1 hours;
    uint256 public minOracleResponses = 2;

    event RiskAssessmentCompleted(
        bytes32 indexed assetId,
        uint256 riskScore,
        uint64 timestamp
    );
    
    event RiskThresholdBreached(
        bytes32 indexed assetId,
        uint256 currentScore,
        uint256 threshold
    );
    
    event OracleSourceAdded(
        string indexed sourceName,
        address oracleAddress,
        uint256 weight
    );
    
    event ParametersUpdated(
        bytes32 indexed assetId,
        RiskParameters parameters
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(RISK_ASSESSOR_ROLE, msg.sender);
        _grantRole(ORACLE_MANAGER_ROLE, msg.sender);
    }

    /**
     * @dev Perform comprehensive risk assessment for an asset
     * @param assetId Unique identifier for the asset
     * @param parameters Risk parameters from multiple sources
     */
    function assessRisk(
        string calldata assetId,
        RiskParameters calldata parameters
    ) external onlyRole(RISK_ASSESSOR_ROLE) nonReentrant returns (uint256) {
        bytes32 assetHash = keccak256(abi.encodePacked(assetId));
        
        if (parameters.lastUpdated < block.timestamp - MAX_DATA_STALENESS) {
            revert StaleData();
        }

        // Calculate weighted risk score
        uint256 aggregatedScore = _calculateAggregatedRisk(parameters);
        
        if (aggregatedScore > MAX_RISK_SCORE) {
            revert InvalidRiskScore();
        }

        // Update asset profile
        AssetRiskProfile storage profile = assetRiskProfiles[assetHash];
        profile.assetId = assetId;
        profile.aggregatedRiskScore = aggregatedScore;
        profile.parameters = parameters;
        profile.assessmentCount++;
        profile.verified = true;

        // Store historical data
        historicalRiskScores[assetHash].push(aggregatedScore);

        // Check threshold alerts
        if (riskThresholds[assetHash] > 0 && aggregatedScore >= riskThresholds[assetHash]) {
            emit RiskThresholdBreached(assetHash, aggregatedScore, riskThresholds[assetHash]);
        }

        emit RiskAssessmentCompleted(assetHash, aggregatedScore, uint64(block.timestamp));
        
        return aggregatedScore;
    }

    /**
     * @dev Calculate aggregated risk score from multiple parameters
     * Weighted calculation with AI confidence factored in
     */
    function _calculateAggregatedRisk(
        RiskParameters calldata params
    ) internal pure returns (uint256) {
        // Weighted average with configurable weights
        uint256 volatilityWeight = 3000;    // 30%
        uint256 liquidityWeight = 2500;     // 25%
        uint256 marketCapWeight = 2000;     // 20%
        uint256 regulatoryWeight = 1500;    // 15%
        uint256 aiWeight = 1000;            // 10%

        uint256 weightedSum = (
            (params.volatilityScore * volatilityWeight) +
            (params.liquidityScore * liquidityWeight) +
            (params.marketCapScore * marketCapWeight) +
            (params.regulatoryScore * regulatoryWeight) +
            (params.aiConfidenceScore * aiWeight)
        );

        return weightedSum / MAX_RISK_SCORE;
    }

    /**
     * @dev Add or update oracle source
     */
    function addOracleSource(
        string calldata sourceName,
        address oracleAddress,
        uint256 weight
    ) external onlyRole(ORACLE_MANAGER_ROLE) {
        if (weight > MAX_RISK_SCORE) revert InvalidRiskScore();
        
        oracleSources[sourceName] = OracleSource({
            oracleAddress: oracleAddress,
            weight: weight,
            lastUpdate: uint64(block.timestamp),
            isActive: true
        });

        emit OracleSourceAdded(sourceName, oracleAddress, weight);
    }

    /**
     * @dev Set risk alert threshold for an asset
     */
    function setRiskThreshold(
        string calldata assetId,
        uint256 threshold
    ) external onlyRole(RISK_ASSESSOR_ROLE) {
        bytes32 assetHash = keccak256(abi.encodePacked(assetId));
        riskThresholds[assetHash] = threshold;
    }

    /**
     * @dev Batch assessment for multiple assets (gas-optimized)
     */
    function batchAssessRisk(
        string[] calldata assetIds,
        RiskParameters[] calldata parametersArray
    ) external onlyRole(RISK_ASSESSOR_ROLE) nonReentrant returns (uint256[] memory) {
        if (assetIds.length != parametersArray.length) revert InvalidRiskScore();
        
        uint256[] memory scores = new uint256[](assetIds.length);
        
        for (uint256 i = 0; i < assetIds.length; i++) {
            bytes32 assetHash = keccak256(abi.encodePacked(assetIds[i]));
            uint256 score = _calculateAggregatedRisk(parametersArray[i]);
            
            assetRiskProfiles[assetHash].aggregatedRiskScore = score;
            assetRiskProfiles[assetHash].parameters = parametersArray[i];
            
            scores[i] = score;
            
            emit RiskAssessmentCompleted(assetHash, score, uint64(block.timestamp));
        }
        
        return scores;
    }

    /**
     * @dev Get risk profile for an asset
     */
    function getRiskProfile(string calldata assetId) 
        external 
        view 
        returns (AssetRiskProfile memory) 
    {
        bytes32 assetHash = keccak256(abi.encodePacked(assetId));
        return assetRiskProfiles[assetHash];
    }

    /**
     * @dev Get historical risk scores
     */
    function getHistoricalRiskScores(string calldata assetId, uint256 limit) 
        external 
        view 
        returns (uint256[] memory) 
    {
        bytes32 assetHash = keccak256(abi.encodePacked(assetId));
        uint256[] storage history = historicalRiskScores[assetHash];
        
        uint256 length = history.length > limit ? limit : history.length;
        uint256[] memory result = new uint256[](length);
        
        uint256 startIndex = history.length > limit ? history.length - limit : 0;
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = history[startIndex + i];
        }
        
        return result;
    }

    /**
     * @dev Calculate risk trend (increasing/decreasing)
     */
    function getRiskTrend(string calldata assetId) 
        external 
        view 
        returns (int256) 
    {
        bytes32 assetHash = keccak256(abi.encodePacked(assetId));
        uint256[] storage history = historicalRiskScores[assetHash];
        
        if (history.length < 2) return 0;
        
        uint256 recent = history[history.length - 1];
        uint256 previous = history[history.length - 2];
        
        if (recent > previous) {
            return int256(recent - previous);
        } else {
            return -int256(previous - recent);
        }
    }
}
