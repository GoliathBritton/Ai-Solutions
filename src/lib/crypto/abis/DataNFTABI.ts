/**
 * Data NFT ABI
 * @author MetisAI Team
 */

export const DataNFTABI = [
  "function mintDataset(string, string, string, uint256, uint256, string[], string) external returns (uint256)",
  "function useDataset(uint256, string) external payable",
  "function verifyDataset(uint256, bool, uint256, uint256, uint256, uint256) external",
  "function updateQualityMetrics(uint256, uint256, uint256, uint256, uint256) external",
  "function getDataset(uint256) view returns (tuple(uint256 id, string name, string description, string ipfsHash, uint256 size, uint256 qualityScore, address provider, uint256 price, bool verified, bool active, uint256 createdAt, string[] tags, string dataType, uint256 totalUsage, uint256 totalRevenue))",
  "function getQualityMetrics(uint256) view returns (tuple(uint256 completeness, uint256 accuracy, uint256 consistency, uint256 relevance, uint256 overall))",
  "function getUsageHistory(uint256) view returns (tuple(address user, uint256 timestamp, uint256 cost, string purpose)[])",
  "function getProviderDatasets(address) view returns (uint256[])",
  "function getProviderReputation(address) view returns (uint256)",
  "function getProviderRevenue(address) view returns (uint256)",
  "function searchByTag(string) view returns (uint256[])",
  "function getDatasetsByQuality(uint256, uint256) view returns (uint256[])",
  "function getDatasetsByType(string) view returns (uint256[])",
  "function updateDataset(uint256, string, string, string[], uint256) external",
  "function toggleDatasetActive(uint256, bool) external",
  "function addVerifier(address) external",
  "function removeVerifier(address) external",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256) view returns (string)",
  "function ownerOf(uint256) view returns (address)",
  "function balanceOf(address) view returns (uint256)",
  "function transferFrom(address, address, uint256) external",
  "function safeTransferFrom(address, address, uint256) external",
  "function approve(address, uint256) external",
  "function getApproved(uint256) view returns (address)",
  "function setApprovalForAll(address, bool) external",
  "function isApprovedForAll(address, address) view returns (bool)",
  "event DatasetMinted(uint256 indexed tokenId, address indexed provider, string name, uint256 size, uint256 qualityScore)",
  "event DatasetUsed(uint256 indexed tokenId, address indexed user, uint256 cost, string purpose)",
  "event DatasetVerified(uint256 indexed tokenId, address indexed verifier, bool verified, uint256 qualityScore)",
  "event QualityUpdated(uint256 indexed tokenId, uint256 newQualityScore)",
  "event ProviderReputationUpdated(address indexed provider, uint256 newReputation)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];
