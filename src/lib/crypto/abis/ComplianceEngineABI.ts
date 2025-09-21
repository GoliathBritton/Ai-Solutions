/**
 * Compliance Engine ABI
 * @author MetisAI Team
 */

export const ComplianceEngineABI = [
  "function verifyKYC(address, uint8, uint256, string, string) external",
  "function updateAML(address, uint256, string[]) external",
  "function checkCompliance(address, address, uint256, string) external returns (bool, string)",
  "function flagTransaction(bytes32, string) external",
  "function addSanctions(address, string) external",
  "function removeSanctions(address) external",
  "function addToWhitelist(address) external",
  "function removeFromWhitelist(address) external",
  "function addToBlacklist(address) external",
  "function removeFromBlacklist(address) external",
  "function addKYCProvider(address) external",
  "function removeKYCProvider(address) external",
  "function addAMLProvider(address) external",
  "function removeAMLProvider(address) external",
  "function addComplianceOfficer(address) external",
  "function removeComplianceOfficer(address) external",
  "function getKYCInfo(address) view returns (tuple(address user, bool verified, uint8 level, uint256 expiry, string country, string documentHash, uint256 timestamp))",
  "function getAMLRecord(address) view returns (tuple(address user, uint256 riskScore, bool highRisk, uint256 lastUpdate, string[] flags))",
  "function getTransactionRecord(bytes32) view returns (tuple(address from, address to, uint256 amount, uint256 timestamp, string purpose, bool flagged, string reason))",
  "function getComplianceStats() view returns (uint256, uint256, uint256)",
  "function isCompliant(address) view returns (bool)",
  "function pause() external",
  "function unpause() external",
  "event KYCVerified(address indexed user, uint8 level, uint256 expiry, string country)",
  "event KYCExpired(address indexed user, uint256 expiry)",
  "event AMLUpdated(address indexed user, uint256 riskScore, bool highRisk)",
  "event TransactionFlagged(address indexed from, address indexed to, uint256 amount, string reason)",
  "event SanctionsAdded(address indexed user, string reason)",
  "event SanctionsRemoved(address indexed user)",
  "event WhitelistAdded(address indexed user)",
  "event WhitelistRemoved(address indexed user)",
  "event BlacklistAdded(address indexed user)",
  "event BlacklistRemoved(address indexed user)",
  "event ComplianceOfficerAdded(address indexed officer)",
  "event ComplianceOfficerRemoved(address indexed officer)"
];
