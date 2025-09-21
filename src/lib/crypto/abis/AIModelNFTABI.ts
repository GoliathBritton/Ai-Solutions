/**
 * AI Model NFT ABI
 * @author MetisAI Team
 */

export const AIModelNFTABI = [
  "function mintModel(string, string, string, uint256, uint256, uint256, string[]) external returns (uint256)",
  "function useModel(uint256, string) external payable",
  "function verifyModel(uint256, bool) external",
  "function getModel(uint256) view returns (tuple(uint256 id, string name, string description, string ipfsHash, uint256 trainingCost, uint256 accuracy, address creator, uint256 royaltyPercentage, uint256 totalUsage, uint256 totalRevenue, bool verified, bool active, uint256 createdAt, string[] tags))",
  "function getUsageHistory(uint256) view returns (tuple(address user, uint256 timestamp, uint256 cost, string purpose)[])",
  "function getCreatorModels(address) view returns (uint256[])",
  "function getCreatorRevenue(address) view returns (uint256)",
  "function searchByTag(string) view returns (uint256[])",
  "function getModelsByAccuracy(uint256, uint256) view returns (uint256[])",
  "function updateModel(uint256, string, string, string[]) external",
  "function toggleModelActive(uint256, bool) external",
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
  "event ModelMinted(uint256 indexed tokenId, address indexed creator, string name, uint256 trainingCost, uint256 accuracy)",
  "event ModelUsed(uint256 indexed tokenId, address indexed user, uint256 cost, string purpose)",
  "event ModelVerified(uint256 indexed tokenId, address indexed verifier, bool verified)",
  "event RoyaltyPaid(uint256 indexed tokenId, address indexed creator, uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)"
];
