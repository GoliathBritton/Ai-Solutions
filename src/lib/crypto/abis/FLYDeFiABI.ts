/**
 * FLY DeFi ABI
 * @author MetisAI Team
 */

export const FLYDeFiABI = [
  "function createLiquidityPool(address, address, string, uint256, uint256) external",
  "function addLiquidity(uint256, uint256) external",
  "function removeLiquidity(uint256, uint256) external",
  "function claimRewards(uint256) external",
  "function calculatePendingRewards(uint256, address) view returns (uint256)",
  "function createFarmPool(address, string, uint256) external",
  "function stakeInFarm(uint256, uint256) external",
  "function unstakeFromFarm(uint256, uint256) external",
  "function claimFarmRewards(uint256) external",
  "function getUserPools(address) view returns (uint256[])",
  "function getPoolInfo(uint256) view returns (tuple(uint256 id, address tokenA, address tokenB, string name, uint256 totalLiquidity, uint256 rewardRate, uint256 totalRewards, uint256 distributedRewards, bool active, uint256 startTime, uint256 endTime))",
  "function getFarmInfo(uint256) view returns (tuple(uint256 id, address lpToken, string name, uint256 allocPoint, uint256 lastRewardTime, uint256 accRewardPerShare, uint256 totalStaked, bool active))",
  "function updateRewardRate(uint256) external",
  "event PoolCreated(uint256 indexed poolId, address indexed tokenA, address indexed tokenB, string name, uint256 rewardRate)",
  "event LiquidityAdded(address indexed user, uint256 indexed poolId, uint256 amount)",
  "event LiquidityRemoved(address indexed user, uint256 indexed poolId, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 indexed poolId, uint256 amount)",
  "event FarmPoolCreated(uint256 indexed farmId, address indexed lpToken, string name, uint256 allocPoint)",
  "event FarmStaked(address indexed user, uint256 indexed farmId, uint256 amount)",
  "event FarmUnstaked(address indexed user, uint256 indexed farmId, uint256 amount)",
  "event FarmRewardsClaimed(address indexed user, uint256 indexed farmId, uint256 amount)"
];
