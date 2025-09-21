/**
 * FLY Staking ABI
 * @author MetisAI Team
 */

export const FLYStakingABI = [
  "function stake(uint256, uint256, bool) external",
  "function unstake(uint256) external",
  "function claimRewards(uint256) external",
  "function toggleAutoCompound(uint256) external",
  "function calculateStakeReward(uint256) view returns (uint256)",
  "function calculateTotalRewards(address) view returns (uint256)",
  "function getUserStakeInfo(address) view returns (tuple(uint256 totalStaked, uint256 totalRewards, uint256 activeStakes, uint256 totalClaimed))",
  "function getUserActiveStakes(address) view returns (uint256[])",
  "function getStakeOption(uint256) view returns (tuple(uint256 lockPeriod, uint256 multiplier, bool active, string name))",
  "function getAllStakeOptions() view returns (tuple(uint256 lockPeriod, uint256 multiplier, bool active, string name)[])",
  "function addValidator(address) external",
  "function removeValidator(address) external",
  "function distributeValidatorReward(address, uint256) external",
  "function updateRewardPool(uint256) external",
  "event Staked(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 lockPeriod, uint256 multiplier)",
  "event Unstaked(address indexed user, uint256 indexed stakeId, uint256 amount, uint256 reward)",
  "event RewardsClaimed(address indexed user, uint256 indexed stakeId, uint256 amount)",
  "event AutoCompoundToggled(address indexed user, uint256 indexed stakeId, bool enabled)",
  "event ValidatorRewardDistributed(address indexed validator, uint256 amount)",
  "event RewardPoolUpdated(uint256 newAmount)"
];
