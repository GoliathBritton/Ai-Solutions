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
 * @title Data NFT
 * @dev NFT contract for training data with quality scoring and verification
 * @author MetisAI Team
 */
contract DataNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Data structures
    struct Dataset {
        uint256 id;
        string name;
        string description;
        string ipfsHash;
        uint256 size;
        uint256 qualityScore;
        address provider;
        uint256 price;
        bool verified;
        bool active;
        uint256 createdAt;
        string[] tags;
        string dataType;
        uint256 totalUsage;
        uint256 totalRevenue;
    }
    
    struct QualityMetric {
        uint256 completeness;
        uint256 accuracy;
        uint256 consistency;
        uint256 relevance;
        uint256 overall;
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
    
    mapping(uint256 => Dataset) public datasets;
    mapping(uint256 => QualityMetric) public qualityMetrics;
    mapping(uint256 => UsageRecord[]) public usageHistory;
    mapping(address => uint256[]) public providerDatasets;
    mapping(address => bool) public isVerifier;
    mapping(address => uint256) public providerReputation;
    mapping(address => uint256) public providerRevenue;
    
    uint256 public constant MAX_QUALITY_SCORE = 10000; // 100% max quality
    uint256 public constant MIN_QUALITY_SCORE = 1000;  // 10% min quality
    uint256 public constant PLATFORM_FEE = 250; // 2.5% platform fee
    uint256 public constant VERIFICATION_FEE = 50 * 10**18; // 50 FLY verification fee
    
    // Events
    event DatasetMinted(
        uint256 indexed tokenId,
        address indexed provider,
        string name,
        uint256 size,
        uint256 qualityScore
    );
    
    event DatasetUsed(
        uint256 indexed tokenId,
        address indexed user,
        uint256 cost,
        string purpose
    );
    
    event DatasetVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        bool verified,
        uint256 qualityScore
    );
    
    event QualityUpdated(
        uint256 indexed tokenId,
        uint256 newQualityScore
    );
    
    event ProviderReputationUpdated(
        address indexed provider,
        uint256 newReputation
    );
    
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    constructor(address _flyToken) ERC721("Data NFT", "DATANFT") {
        flyToken = FLYToken(_flyToken);
    }
    
    /**
     * @dev Mint a new data NFT
     * @param name Dataset name
     * @param description Dataset description
     * @param ipfsHash IPFS hash for dataset
     * @param size Dataset size in bytes
     * @param price Price to use the dataset
     * @param tags Dataset tags
     * @param dataType Type of data (text, image, audio, etc.)
     */
    function mintDataset(
        string memory name,
        string memory description,
        string memory ipfsHash,
        uint256 size,
        uint256 price,
        string[] memory tags,
        string memory dataType
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(size > 0, "Size must be greater than 0");
        require(price > 0, "Price must be greater than 0");
        require(tags.length > 0, "At least one tag required");
        require(bytes(dataType).length > 0, "Data type cannot be empty");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        datasets[tokenId] = Dataset({
            id: tokenId,
            name: name,
            description: description,
            ipfsHash: ipfsHash,
            size: size,
            qualityScore: 0, // Will be set after verification
            provider: msg.sender,
            price: price,
            verified: false,
            active: true,
            createdAt: block.timestamp,
            tags: tags,
            dataType: dataType,
            totalUsage: 0,
            totalRevenue: 0
        });
        
        providerDatasets[msg.sender].push(tokenId);
        
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, ipfsHash);
        
        emit DatasetMinted(tokenId, msg.sender, name, size, 0);
        
        return tokenId;
    }
    
    /**
     * @dev Use a dataset
     * @param tokenId Dataset token ID
     * @param purpose Purpose of usage
     */
    function useDataset(uint256 tokenId, string memory purpose) external payable nonReentrant {
        require(_exists(tokenId), "Dataset does not exist");
        require(datasets[tokenId].active, "Dataset not active");
        require(datasets[tokenId].verified, "Dataset not verified");
        require(msg.value >= datasets[tokenId].price, "Insufficient payment");
        
        Dataset storage dataset = datasets[tokenId];
        
        // Record usage
        usageHistory[tokenId].push(UsageRecord({
            user: msg.sender,
            timestamp: block.timestamp,
            cost: msg.value,
            purpose: purpose
        }));
        
        dataset.totalUsage++;
        dataset.totalRevenue += msg.value;
        
        // Calculate fees
        uint256 platformFee = (msg.value * PLATFORM_FEE) / 10000;
        uint256 providerAmount = msg.value - platformFee;
        
        // Distribute payments
        providerRevenue[dataset.provider] += providerAmount;
        payable(dataset.provider).transfer(providerAmount);
        
        // Platform fee goes to contract owner
        if (platformFee > 0) {
            payable(owner()).transfer(platformFee);
        }
        
        emit DatasetUsed(tokenId, msg.sender, msg.value, purpose);
    }
    
    /**
     * @dev Verify a dataset and set quality metrics
     * @param tokenId Dataset token ID
     * @param verified Verification status
     * @param completeness Completeness score (0-10000)
     * @param accuracy Accuracy score (0-10000)
     * @param consistency Consistency score (0-10000)
     * @param relevance Relevance score (0-10000)
     */
    function verifyDataset(
        uint256 tokenId,
        bool verified,
        uint256 completeness,
        uint256 accuracy,
        uint256 consistency,
        uint256 relevance
    ) external {
        require(isVerifier[msg.sender], "Not a verifier");
        require(_exists(tokenId), "Dataset does not exist");
        require(completeness <= MAX_QUALITY_SCORE, "Invalid completeness score");
        require(accuracy <= MAX_QUALITY_SCORE, "Invalid accuracy score");
        require(consistency <= MAX_QUALITY_SCORE, "Invalid consistency score");
        require(relevance <= MAX_QUALITY_SCORE, "Invalid relevance score");
        
        Dataset storage dataset = datasets[tokenId];
        dataset.verified = verified;
        
        if (verified) {
            // Calculate overall quality score
            uint256 overall = (completeness + accuracy + consistency + relevance) / 4;
            
            qualityMetrics[tokenId] = QualityMetric({
                completeness: completeness,
                accuracy: accuracy,
                consistency: consistency,
                relevance: relevance,
                overall: overall
            });
            
            dataset.qualityScore = overall;
            
            // Update provider reputation
            if (overall >= 8000) { // High quality
                providerReputation[dataset.provider] += 20;
            } else if (overall >= 6000) { // Medium quality
                providerReputation[dataset.provider] += 10;
            } else if (overall >= 4000) { // Low quality
                providerReputation[dataset.provider] += 5;
            } else { // Very low quality
                providerReputation[dataset.provider] -= 10;
            }
            
            emit ProviderReputationUpdated(dataset.provider, providerReputation[dataset.provider]);
        } else {
            // Penalize provider for poor quality
            providerReputation[dataset.provider] -= 20;
            emit ProviderReputationUpdated(dataset.provider, providerReputation[dataset.provider]);
        }
        
        emit DatasetVerified(tokenId, msg.sender, verified, dataset.qualityScore);
    }
    
    /**
     * @dev Update quality metrics for a dataset
     * @param tokenId Dataset token ID
     * @param completeness New completeness score
     * @param accuracy New accuracy score
     * @param consistency New consistency score
     * @param relevance New relevance score
     */
    function updateQualityMetrics(
        uint256 tokenId,
        uint256 completeness,
        uint256 accuracy,
        uint256 consistency,
        uint256 relevance
    ) external {
        require(isVerifier[msg.sender], "Not a verifier");
        require(_exists(tokenId), "Dataset does not exist");
        require(datasets[tokenId].verified, "Dataset not verified");
        
        uint256 overall = (completeness + accuracy + consistency + relevance) / 4;
        
        qualityMetrics[tokenId] = QualityMetric({
            completeness: completeness,
            accuracy: accuracy,
            consistency: consistency,
            relevance: relevance,
            overall: overall
        });
        
        datasets[tokenId].qualityScore = overall;
        
        emit QualityUpdated(tokenId, overall);
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
     * @dev Get dataset information
     * @param tokenId Dataset token ID
     * @return Dataset Dataset information
     */
    function getDataset(uint256 tokenId) external view returns (Dataset memory) {
        require(_exists(tokenId), "Dataset does not exist");
        return datasets[tokenId];
    }
    
    /**
     * @dev Get quality metrics for a dataset
     * @param tokenId Dataset token ID
     * @return QualityMetric Quality metrics
     */
    function getQualityMetrics(uint256 tokenId) external view returns (QualityMetric memory) {
        require(_exists(tokenId), "Dataset does not exist");
        return qualityMetrics[tokenId];
    }
    
    /**
     * @dev Get usage history for a dataset
     * @param tokenId Dataset token ID
     * @return UsageRecord[] Usage history
     */
    function getUsageHistory(uint256 tokenId) external view returns (UsageRecord[] memory) {
        require(_exists(tokenId), "Dataset does not exist");
        return usageHistory[tokenId];
    }
    
    /**
     * @dev Get provider's datasets
     * @param provider Provider address
     * @return uint256[] Array of dataset token IDs
     */
    function getProviderDatasets(address provider) external view returns (uint256[] memory) {
        return providerDatasets[provider];
    }
    
    /**
     * @dev Get provider's reputation
     * @param provider Provider address
     * @return Reputation score
     */
    function getProviderReputation(address provider) external view returns (uint256) {
        return providerReputation[provider];
    }
    
    /**
     * @dev Get provider's total revenue
     * @param provider Provider address
     * @return Total revenue
     */
    function getProviderRevenue(address provider) external view returns (uint256) {
        return providerRevenue[provider];
    }
    
    /**
     * @dev Search datasets by tag
     * @param tag Tag to search for
     * @return uint256[] Array of matching dataset token IDs
     */
    function searchByTag(string memory tag) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](_tokenIdCounter.current());
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (!_exists(i)) continue;
            
            string[] memory tags = datasets[i].tags;
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
     * @dev Get datasets by quality range
     * @param minQuality Minimum quality score
     * @param maxQuality Maximum quality score
     * @return uint256[] Array of matching dataset token IDs
     */
    function getDatasetsByQuality(uint256 minQuality, uint256 maxQuality) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](_tokenIdCounter.current());
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (!_exists(i)) continue;
            
            uint256 quality = datasets[i].qualityScore;
            if (quality >= minQuality && quality <= maxQuality) {
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
     * @dev Get datasets by data type
     * @param dataType Data type to search for
     * @return uint256[] Array of matching dataset token IDs
     */
    function getDatasetsByType(string memory dataType) external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](_tokenIdCounter.current());
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter.current(); i++) {
            if (!_exists(i)) continue;
            
            if (keccak256(bytes(datasets[i].dataType)) == keccak256(bytes(dataType))) {
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
     * @dev Update dataset information
     * @param tokenId Dataset token ID
     * @param name New name
     * @param description New description
     * @param tags New tags
     * @param price New price
     */
    function updateDataset(
        uint256 tokenId,
        string memory name,
        string memory description,
        string[] memory tags,
        uint256 price
    ) external {
        require(_exists(tokenId), "Dataset does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not dataset owner");
        
        datasets[tokenId].name = name;
        datasets[tokenId].description = description;
        datasets[tokenId].tags = tags;
        datasets[tokenId].price = price;
    }
    
    /**
     * @dev Toggle dataset active status
     * @param tokenId Dataset token ID
     * @param active Active status
     */
    function toggleDatasetActive(uint256 tokenId, bool active) external {
        require(_exists(tokenId), "Dataset does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not dataset owner");
        
        datasets[tokenId].active = active;
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
