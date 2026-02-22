// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title RiskToken
 * @dev ERC-20 token representing risk scores as tradeable/transferable assets
 * Allows risk scoring to be tokenized and transferred
 */
contract RiskToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    mapping(uint256 => string) public tokenIdToAsset;
    mapping(string => uint256) public assetToRiskScore;

    uint256 private _nextTokenId;

    event RiskTokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string assetId,
        uint256 riskScore
    );

    constructor() ERC20("RiskScore Token", "RISK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Mint risk tokens representing an asset's risk score
     */
    function mintRiskToken(
        address to,
        string calldata assetId,
        uint256 riskScore
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        tokenIdToAsset[tokenId] = assetId;
        assetToRiskScore[assetId] = riskScore;
        
        // Mint tokens proportional to risk score
        _mint(to, riskScore);

        emit RiskTokenMinted(to, tokenId, assetId, riskScore);
        
        return tokenId;
    }

    /**
     * @dev Update risk score for an asset
     */
    function updateRiskScore(
        string calldata assetId,
        uint256 newRiskScore
    ) external onlyRole(MINTER_ROLE) {
        assetToRiskScore[assetId] = newRiskScore;
    }

    /**
     * @dev Get risk score for asset
     */
    function getRiskScore(string calldata assetId) 
        external 
        view 
        returns (uint256) 
    {
        return assetToRiskScore[assetId];
    }
}
