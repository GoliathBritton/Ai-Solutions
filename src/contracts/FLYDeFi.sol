// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./FLYToken.sol";

/**
 * @title FLY DeFi
 * @dev DeFi integration for FLY tokens including liquidity mining and yield farming
 * @author MetisAI Team
 */
contract FLYDeFi is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    // DeFi configuration
    uint256 public constant REWARD_PRECISION = 10000;
    uint256 public constant MAX_REWARD_RATE = 1000; // 10% max reward rate
    
    // Pool structures
    struct LiquidityPool {
        uint256 id;
        address tokenA;
        address tokenB;
        string name;
        uint256 totalLiquidity;
        uint256 rewardRate;
        uint256 totalRewards;
        uint256 distributedRewards;
        bool active;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct UserPoolInfo {
        uint256 stakedAmount;
        uint256 rewardDebt;
        uint256 pendingRewards;
        uint256 lastUpdateTime;
    }
    
    struct FarmPool {
        uint256 id;
        address lpToken;
        string name;
        uint256 allocPoint;
        uint256 lastRewardTime;
        uint256 accRewardPerShare;
        uint256 totalStaked;
        bool active;
    }
    
    // State variables
    FLYToken public flyToken;
    Counters.Counter private _poolIdCounter;
    Counters.Counter private _farmIdCounter;
    
    mapping(uint256 => LiquidityPool) public liquidityPools;
    mapping(uint256 => mapping(address => UserPoolInfo)) public userPoolInfo;
    mapping(uint256 => FarmPool) public farmPools;
    mapping(address => uint256[]) public userPools;
    
    uint256 public totalAllocPoint;
    uint256 public rewardPerSecond;
    uint256 public totalRewardsDistributed;
    
    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address indexed tokenA,
        address indexed tokenB,
        string name,
        uint256 rewardRate
    );
    
    event LiquidityAdded(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );
    
    event LiquidityRemoved(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );
    
    event RewardsClaimed(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );
    
    event FarmPoolCreated(
        uint256 indexed farmId,
        address indexed lpToken,
        string name,
        uint256 allocPoint
    );
    
    event FarmStaked(
        address indexed user,
        uint256 indexed farmId,
        uint256 amount
    );
    
    event FarmUnstaked(
        address indexed user,
        uint256 indexed farmId,
        uint256 amount
    );
    
    event FarmRewardsClaimed(
        address indexed user,
        uint256 indexed farmId,
        uint256 amount
    );
    
    constructor(address _flyToken) {
        flyToken = FLYToken(_flyToken);
        rewardPerSecond = 1 * 10**18; // 1 FLY per second default
    }
    
    /**
     * @dev Create a new liquidity pool
     * @param tokenA First token address
     * @param tokenB Second token address
     * @param name Pool name
     * @param rewardRate Reward rate per second
     * @param duration Pool duration in seconds
     */
    function createLiquidityPool(
        address tokenA,
        address tokenB,
        string memory name,
        uint256 rewardRate,
        uint256 duration
    ) external onlyOwner {
        require(tokenA != address(0) && tokenB != address(0), "Invalid token addresses");
        require(rewardRate <= MAX_REWARD_RATE, "Reward rate too high");
        require(duration > 0, "Invalid duration");
        
        uint256 poolId = _poolIdCounter.current();
        _poolIdCounter.increment();
        
        liquidityPools[poolId] = LiquidityPool({
            id: poolId,
            tokenA: tokenA,
            tokenB: tokenB,
            name: name,
            totalLiquidity: 0,
            rewardRate: rewardRate,
            totalRewards: 0,
            distributedRewards: 0,
            active: true,
            startTime: block.timestamp,
            endTime: block.timestamp + duration
        });
        
        emit PoolCreated(poolId, tokenA, tokenB, name, rewardRate);
    }
    
    /**
     * @dev Add liquidity to a pool
     * @param poolId Pool ID
     * @param amount Amount of FLY tokens to stake
     */
    function addLiquidity(uint256 poolId, uint256 amount) external nonReentrant {
        require(liquidityPools[poolId].active, "Pool not active");
        require(block.timestamp < liquidityPools[poolId].endTime, "Pool ended");
        require(amount > 0, "Amount must be greater than 0");
        require(flyToken.balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        LiquidityPool storage pool = liquidityPools[poolId];
        UserPoolInfo storage userInfo = userPoolInfo[poolId][msg.sender];
        
        // Update user rewards before adding liquidity
        if (userInfo.stakedAmount > 0) {
            uint256 pending = calculatePendingRewards(poolId, msg.sender);
            userInfo.pendingRewards += pending;
        }
        
        // Transfer tokens to contract
        flyToken.transferFrom(msg.sender, address(this), amount);
        
        // Update pool and user info
        pool.totalLiquidity += amount;
        userInfo.stakedAmount += amount;
        userInfo.lastUpdateTime = block.timestamp;
        
        // Add pool to user's pools if not already added
        bool poolExists = false;
        for (uint256 i = 0; i < userPools[msg.sender].length; i++) {
            if (userPools[msg.sender][i] == poolId) {
                poolExists = true;
                break;
            }
        }
        if (!poolExists) {
            userPools[msg.sender].push(poolId);
        }
        
        emit LiquidityAdded(msg.sender, poolId, amount);
    }
    
    /**
     * @dev Remove liquidity from a pool
     * @param poolId Pool ID
     * @param amount Amount to remove
     */
    function removeLiquidity(uint256 poolId, uint256 amount) external nonReentrant {
        require(liquidityPools[poolId].active, "Pool not active");
        require(amount > 0, "Amount must be greater than 0");
        
        UserPoolInfo storage userInfo = userPoolInfo[poolId][msg.sender];
        require(userInfo.stakedAmount >= amount, "Insufficient staked amount");
        
        // Calculate and claim pending rewards
        uint256 pending = calculatePendingRewards(poolId, msg.sender);
        userInfo.pendingRewards += pending;
        
        // Update pool and user info
        liquidityPools[poolId].totalLiquidity -= amount;
        userInfo.stakedAmount -= amount;
        userInfo.lastUpdateTime = block.timestamp;
        
        // Transfer tokens back to user
        flyToken.transfer(msg.sender, amount);
        
        emit LiquidityRemoved(msg.sender, poolId, amount);
    }
    
    /**
     * @dev Claim rewards from a pool
     * @param poolId Pool ID
     */
    function claimRewards(uint256 poolId) external nonReentrant {
        require(liquidityPools[poolId].active, "Pool not active");
        
        UserPoolInfo storage userInfo = userPoolInfo[poolId][msg.sender];
        require(userInfo.stakedAmount > 0, "No staked amount");
        
        uint256 pending = calculatePendingRewards(poolId, msg.sender);
        uint256 totalRewards = userInfo.pendingRewards + pending;
        
        require(totalRewards > 0, "No rewards to claim");
        
        // Reset user rewards
        userInfo.pendingRewards = 0;
        userInfo.lastUpdateTime = block.timestamp;
        
        // Update pool stats
        liquidityPools[poolId].distributedRewards += totalRewards;
        totalRewardsDistributed += totalRewards;
        
        // Transfer rewards to user
        flyToken.transfer(msg.sender, totalRewards);
        
        emit RewardsClaimed(msg.sender, poolId, totalRewards);
    }
    
    /**
     * @dev Calculate pending rewards for a user in a pool
     * @param poolId Pool ID
     * @param user User address
     * @return Pending rewards
     */
    function calculatePendingRewards(uint256 poolId, address user) public view returns (uint256) {
        LiquidityPool memory pool = liquidityPools[poolId];
        UserPoolInfo memory userInfo = userPoolInfo[poolId][user];
        
        if (userInfo.stakedAmount == 0 || !pool.active) return 0;
        
        uint256 timeElapsed = block.timestamp - userInfo.lastUpdateTime;
        uint256 poolEndTime = pool.endTime;
        
        if (block.timestamp > poolEndTime) {
            timeElapsed = poolEndTime - userInfo.lastUpdateTime;
        }
        
        return (userInfo.stakedAmount * pool.rewardRate * timeElapsed) / REWARD_PRECISION;
    }
    
    /**
     * @dev Create a farm pool
     * @param lpToken LP token address
     * @param name Farm name
     * @param allocPoint Allocation points
     */
    function createFarmPool(
        address lpToken,
        string memory name,
        uint256 allocPoint
    ) external onlyOwner {
        require(lpToken != address(0), "Invalid LP token");
        require(allocPoint > 0, "Invalid allocation points");
        
        uint256 farmId = _farmIdCounter.current();
        _farmIdCounter.increment();
        
        farmPools[farmId] = FarmPool({
            id: farmId,
            lpToken: lpToken,
            name: name,
            allocPoint: allocPoint,
            lastRewardTime: block.timestamp,
            accRewardPerShare: 0,
            totalStaked: 0,
            active: true
        });
        
        totalAllocPoint += allocPoint;
        
        emit FarmPoolCreated(farmId, lpToken, name, allocPoint);
    }
    
    /**
     * @dev Stake LP tokens in a farm
     * @param farmId Farm ID
     * @param amount Amount to stake
     */
    function stakeInFarm(uint256 farmId, uint256 amount) external nonReentrant {
        require(farmPools[farmId].active, "Farm not active");
        require(amount > 0, "Amount must be greater than 0");
        
        FarmPool storage farm = farmPools[farmId];
        UserPoolInfo storage userInfo = userPoolInfo[farmId][msg.sender];
        
        // Update farm rewards
        updateFarmRewards(farmId);
        
        // Claim pending rewards
        if (userInfo.stakedAmount > 0) {
            uint256 pending = (userInfo.stakedAmount * farm.accRewardPerShare) / 1e12 - userInfo.rewardDebt;
            if (pending > 0) {
                userInfo.pendingRewards += pending;
            }
        }
        
        // Transfer LP tokens to contract
        IERC20(farm.lpToken).transferFrom(msg.sender, address(this), amount);
        
        // Update farm and user info
        farm.totalStaked += amount;
        userInfo.stakedAmount += amount;
        userInfo.rewardDebt = (userInfo.stakedAmount * farm.accRewardPerShare) / 1e12;
        
        emit FarmStaked(msg.sender, farmId, amount);
    }
    
    /**
     * @dev Unstake LP tokens from a farm
     * @param farmId Farm ID
     * @param amount Amount to unstake
     */
    function unstakeFromFarm(uint256 farmId, uint256 amount) external nonReentrant {
        require(farmPools[farmId].active, "Farm not active");
        require(amount > 0, "Amount must be greater than 0");
        
        FarmPool storage farm = farmPools[farmId];
        UserPoolInfo storage userInfo = userPoolInfo[farmId][msg.sender];
        require(userInfo.stakedAmount >= amount, "Insufficient staked amount");
        
        // Update farm rewards
        updateFarmRewards(farmId);
        
        // Calculate pending rewards
        uint256 pending = (userInfo.stakedAmount * farm.accRewardPerShare) / 1e12 - userInfo.rewardDebt;
        if (pending > 0) {
            userInfo.pendingRewards += pending;
        }
        
        // Update farm and user info
        farm.totalStaked -= amount;
        userInfo.stakedAmount -= amount;
        userInfo.rewardDebt = (userInfo.stakedAmount * farm.accRewardPerShare) / 1e12;
        
        // Transfer LP tokens back to user
        IERC20(farm.lpToken).transfer(msg.sender, amount);
        
        emit FarmUnstaked(msg.sender, farmId, amount);
    }
    
    /**
     * @dev Claim farm rewards
     * @param farmId Farm ID
     */
    function claimFarmRewards(uint256 farmId) external nonReentrant {
        require(farmPools[farmId].active, "Farm not active");
        
        FarmPool storage farm = farmPools[farmId];
        UserPoolInfo storage userInfo = userPoolInfo[farmId][msg.sender];
        
        // Update farm rewards
        updateFarmRewards(farmId);
        
        // Calculate pending rewards
        uint256 pending = (userInfo.stakedAmount * farm.accRewardPerShare) / 1e12 - userInfo.rewardDebt;
        uint256 totalRewards = userInfo.pendingRewards + pending;
        
        require(totalRewards > 0, "No rewards to claim");
        
        // Reset user rewards
        userInfo.pendingRewards = 0;
        userInfo.rewardDebt = (userInfo.stakedAmount * farm.accRewardPerShare) / 1e12;
        
        // Transfer rewards to user
        flyToken.transfer(msg.sender, totalRewards);
        
        emit FarmRewardsClaimed(msg.sender, farmId, totalRewards);
    }
    
    /**
     * @dev Update farm rewards
     * @param farmId Farm ID
     */
    function updateFarmRewards(uint256 farmId) internal {
        FarmPool storage farm = farmPools[farmId];
        if (block.timestamp <= farm.lastRewardTime) return;
        
        if (farm.totalStaked == 0) {
            farm.lastRewardTime = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - farm.lastRewardTime;
        uint256 reward = (timeElapsed * rewardPerSecond * farm.allocPoint) / totalAllocPoint;
        
        farm.accRewardPerShare += (reward * 1e12) / farm.totalStaked;
        farm.lastRewardTime = block.timestamp;
    }
    
    /**
     * @dev Get user's pools
     * @param user User address
     * @return Array of pool IDs
     */
    function getUserPools(address user) external view returns (uint256[] memory) {
        return userPools[user];
    }
    
    /**
     * @dev Get pool information
     * @param poolId Pool ID
     * @return LiquidityPool Pool information
     */
    function getPoolInfo(uint256 poolId) external view returns (LiquidityPool memory) {
        return liquidityPools[poolId];
    }
    
    /**
     * @dev Get farm information
     * @param farmId Farm ID
     * @return FarmPool Farm information
     */
    function getFarmInfo(uint256 farmId) external view returns (FarmPool memory) {
        return farmPools[farmId];
    }
    
    /**
     * @dev Update reward rate
     * @param newRate New reward rate per second
     */
    function updateRewardRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Invalid reward rate");
        rewardPerSecond = newRate;
    }
    
    /**
     * @dev Emergency withdrawal
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
