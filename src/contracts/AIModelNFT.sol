// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FLYToken.sol";

/**
 * @title AI Model NFT
 * @dev NFT contract for AI models with usage tracking and royalty distribution
 * @author MetisAI Team
 */
contract AIModelNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Model structures
    struct Model {
        uint256 id;
        string name;
        string description;
        string ipfsHash;
        uint256 trainingCost;
        uint256 accuracy;
        address creator;
        uint256 royaltyPercentage;
        uint256 totalUsage;
        uint256 totalRevenue;
        bool verified;
        bool active;
        uint256 createdAt;
        string[] tags;
    }
    
    struct UsageRecord {
        address user;
        uint256 timestamp;
        uint256 cost;
        string purpose;
    }
    
    // State variables
    Counters.Counter private _tokenIdCounter;
    FLYToken public flyToken;
    
    mapping(uint256 => Model) public models;
    mapping(uint256 => UsageRecord[]) public usageHistory;
    mapping(address => uint256[]) public creatorModels;
    mapping(address => bool) public isVerifier;
    mapping(address => uint256) public creatorRevenue;
    
    uint256 public constant MAX_ROYALTY = 1000; // 10% max royalty
    uint256 public constant PLATFORM_FEE = 250; // 2.5% platform fee
    uint256 public constant VERIFICATION_FEE = 100 * 10**18; // 100 FLY verification fee
    
    // Events
    event ModelMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string name,
        uint256 trainingCost,
        uint256 accuracy
    );
    
    event ModelUsed(
        uint256 indexed tokenId,
        address indexed user,
        uint256 cost,
        string purpose
    );
    
    event ModelVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        bool verified
    );
    
    event RoyaltyPaid(
        uint256 indexed tokenId,
        address indexed creator,
        uint256 amount
    );
    
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    constructor(address _flyToken) ERC721("AI Model NFT", "AIMODEL") {
        flyToken = FLYToken(_flyToken);
    }
    
    /**
     * @dev Mint a new AI model NFT
     * @param name Model name
     * @param description Model description
     * @param ipfsHash IPFS hash for model data
     * @param trainingCost Cost to use the model
     * @param accuracy Model accuracy percentage
     * @param royaltyPercentage Royalty percentage (0-1000)
     * @param tags Model tags
     */
    function mintModel(
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint256 trainingCost,
        uint256 accuracy,
        uint256 royaltyPercentage,
        string[] memory tags
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(trainingCost > 0, "Training cost must be greater than 0");
        require(accuracy <= 10000, "Accuracy cannot exceed 100%");
        require(royaltyPercentage <= MAX_ROYALTY, "Royalty too high");
        require(tags.length > 0, "At least one tag required");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        models[tokenId] = Model({
            id: tokenId,
            name: name,
            description: description,
            ipfsHash: ipfsHash,
            trainingCost: trainingCost,
            accuracy: accuracy,
            creator: msg.sender,
            royaltyPercentage: royaltyPercentage,
            totalUsage: 0,
            totalRevenue: 0,
            verified: false,
            active: true,
            createdAt: block.timestamp,
            tags: tags
        });
        
        creatorModels[msg.sender].push(tokenId);
        
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, ipfsHash);
        
        emit ModelMinted(tokenId, msg.sender, name, trainingCost, accuracy);
        
        return tokenId;
    }
    
    /**
     * @dev Use an AI model
     * @param tokenId Model token ID
     * @param purpose Purpose of usage
     */
    function useModel(uint256 tokenId, string memory purpose) external payable nonReentrant {
        require(_exists(tokenId), "Model does not exist");
        require(models[tokenId].active, "Model not active");
        require(msg.value >= models[tokenId].trainingCost, "Insufficient payment");
        
        Model storage model = models[tokenId];
        
        // Record usage
        usageHistory[tokenId].push(UsageRecord({
            user: msg.sender,
            timestamp: block.timestamp,
            cost: msg.value,
            purpose: purpose
        }));
        
        model.totalUsage++;
        model.totalRevenue += msg.value;
        
        // Calculate fees and royalties
        uint256 platformFee = (msg.value * PLATFORM_FEE) / 10000;
        uint256 royalty = (msg.value * model.royaltyPercentage) / 10000;
        uint256 creatorAmount = msg.value - platformFee - royalty;
        
        // Distribute payments
        if (royalty > 0) {
            creatorRevenue[model.creator] += royalty;
            payable(model.creator).transfer(royalty);
            emit RoyaltyPaid(tokenId, model.creator, royalty);
        }
        
        if (creatorAmount > 0) {
            creatorRevenue[model.creator] += creatorAmount;
            payable(model.creator).transfer(creatorAmount);
        }
        
        // Platform fee goes to contract owner
        if (platformFee > 0) {
            payable(owner()).transfer(platformFee);
        }
        
        emit ModelUsed(tokenId, msg.sender, msg.value, purpose);
    }
    
    /**
     * @dev Verify an AI model
     * @param tokenId Model token ID
     * @param verified Verification status
     */
    function verifyModel(uint256 tokenId, bool verified) external {
        require(isVerifier[msg.sender], "Not a verifier");
        require(_exists(tokenId), "Model does not exist");
        
        models[tokenId].verified = verified;
        
        emit ModelVerified(tokenId, msg.sender, verified);
    }
    
    /**
     * @dev Add verifier
     * @param verifier Verifier address
     */
    function addVerifier(address verifier) external onlyOwner {
        require(verifier != address(0), "Invalid verifier");
        isVerifier[verifier] = true;
        emit VerifierAdded(verifier);
    }
    
    /**
     * @dev Remove verifier
     * @param verifier Verifier address
     */
    function removeVerifier(address verifier) external onlyOwner {
        require(isVerifier[verifier], "Not a verifier");
        isVerifier[verifier] = false;
        emit VerifierRemoved(verifier);
    }
    
    /**
     * @dev Get model information
     * @param tokenId Model token ID
     * @return Model Model information
     */
    function getModel(uint256 tokenId) external view returns (Model memory) {
        require(_exists(tokenId), "Model does not exist");
        return models[tokenId];
    }
    
    /**
     * @dev Get usage history for a model
     * @param tokenId Model token ID
     * @return UsageRecord[] Usage history
     */
    function getUsageHistory(uint256 tokenId) external view returns (UsageRecord[] memory) {
        require(_exists(tokenId), "Model does not exist");
        return usageHistory[tokenId];
    }
    
    /**
     * @dev Get creator's models
     * @param creator Creator address
     * @return uint256[] Array of model token IDs
     */
    function getCreatorModels(address creator) external view returns (uint256[] memory) {
        return creatorModels[creator];
    }
    
    /**
     * @dev Get creator's total revenue
     * @param creator Creator address
     * @return Total revenue
     */
    function getCreatorRevenue(address creator) external view returns (uint256) {
        return creatorRevenue[creator];
    }
    
    /**
     * @dev Search models by tag
     * @param tag Tag to search for
     * @return uint256[] Array of matching model token IDs
     */
    function searchByTag(string memory tag) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](_tokenIdCounter.current());
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (!_exists(i)) continue;
            
            string[] memory tags = models[i].tags;
            for (uint256 j = 0; j < tags.length; j++) {
                if (keccak256(bytes(tags[j])) == keccak256(bytes(tag))) {
                    results[count] = i;
                    count++;
                    break;
                }
            }
        }
        
        // Resize array to actual count
        uint256[] memory finalResults = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResults[i] = results[i];
        }
        
        return finalResults;
    }
    
    /**
     * @dev Get models by accuracy range
     * @param minAccuracy Minimum accuracy
     * @param maxAccuracy Maximum accuracy
     * @return uint256[] Array of matching model token IDs
     */
    function getModelsByAccuracy(uint256 minAccuracy, uint256 maxAccuracy) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](_tokenIdCounter.current());
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (!_exists(i)) continue;
            
            uint256 accuracy = models[i].accuracy;
            if (accuracy >= minAccuracy && accuracy <= maxAccuracy) {
                results[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory finalResults = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResults[i] = results[i];
        }
        
        return finalResults;
    }
    
    /**
     * @dev Update model information
     * @param tokenId Model token ID
     * @param name New name
     * @param description New description
     * @param tags New tags
     */
    function updateModel(
        uint256 tokenId,
        string memory name,
        string memory description,
        string[] memory tags
    ) external {
        require(_exists(tokenId), "Model does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not model owner");
        
        models[tokenId].name = name;
        models[tokenId].description = description;
        models[tokenId].tags = tags;
    }
    
    /**
     * @dev Toggle model active status
     * @param tokenId Model token ID
     * @param active Active status
     */
    function toggleModelActive(uint256 tokenId, bool active) external {
        require(_exists(tokenId), "Model does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not model owner");
        
        models[tokenId].active = active;
    }
    
    // Required overrides
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
