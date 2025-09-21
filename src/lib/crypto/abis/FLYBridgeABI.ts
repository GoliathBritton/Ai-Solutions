/**
 * FLY Bridge ABI
 * @author MetisAI Team
 */

export const FLYBridgeABI = [
  "function lockTokens(uint256, uint256, bytes32) external",
  "function unlockTokens(address, uint256, uint256, bytes32, bytes32[]) external",
  "function addChain(uint256, string, uint256, address) external",
  "function updateChain(uint256, bool, uint256) external",
  "function addRelayer(address) external",
  "function removeRelayer(address) external",
  "function getUserLockedTokens(address) view returns (tuple(uint256 amount, uint256 timestamp, uint256 targetChainId, bytes32 targetAddress)[])",
  "function getTransaction(bytes32) view returns (tuple(bytes32 txHash, address user, uint256 amount, uint256 sourceChainId, uint256 targetChainId, bytes32 targetAddress, uint256 timestamp, bool processed, bool confirmed))",
  "function getSupportedChains() view returns (tuple(uint256 chainId, string name, bool active, uint256 minConfirmations, address bridgeAddress)[])",
  "function getBridgeStats() view returns (uint256, uint256, uint256)",
  "function pause() external",
  "function unpause() external",
  "function emergencyWithdraw(address, uint256) external",
  "function updateBridgeFee(uint256) external",
  "event TokensLocked(address indexed user, uint256 amount, uint256 sourceChainId, uint256 targetChainId, bytes32 targetAddress, bytes32 txHash)",
  "event TokensUnlocked(address indexed user, uint256 amount, uint256 sourceChainId, uint256 targetChainId, bytes32 txHash)",
  "event TransactionConfirmed(bytes32 indexed txHash, uint256 confirmations)",
  "event ChainAdded(uint256 indexed chainId, string name, address bridgeAddress)",
  "event ChainUpdated(uint256 indexed chainId, bool active, uint256 minConfirmations)",
  "event RelayerAdded(address indexed relayer)",
  "event RelayerRemoved(address indexed relayer)"
];
