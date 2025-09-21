/**
 * FLY Token ABI
 * @author MetisAI Team
 */

export const FLYTokenABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "function transferFrom(address, address, uint256) returns (bool)",
  "function approve(address, uint256) returns (bool)",
  "function allowance(address, address) view returns (uint256)",
  "function stake(uint256, uint256) external",
  "function unstake(uint256) external",
  "function calculateStakeReward(address, uint256) view returns (uint256)",
  "function calculateTotalRewards(address) view returns (uint256)",
  "function mintRewards(address, uint256, string) external",
  "function burnTokens(uint256, string) external",
  "function pause() external",
  "function unpause() external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 multiplier)",
  "event TokensUnstaked(address indexed user, uint256 amount, uint256 reward)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
  "event TokensMinted(address indexed to, uint256 amount, string reason)",
  "event TokensBurned(address indexed from, uint256 amount, string reason)"
];
