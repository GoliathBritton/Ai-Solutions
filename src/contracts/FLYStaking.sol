// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./FLYToken.sol";

/**
 * @title FLY Staking
 * @dev Advanced staking system for FLY tokens with multiple lock periods and multipliers
 * @author MetisAI Team
 */
contract FLYStaking is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    // Staking configuration
    uint256 public constant MIN_STAKE_AMOUNT = 1000 * 10**18; // 1000 FLY
    uint256 public constant MAX_STAKE_AMOUNT = 10_000_000 * 10**18; // 10M FLY
    uint256 public constant BASE_APY = 12; // 12% base APY
    uint256 public constant REWARD_PRECISION = 10000; // For percentage calculations
    
    // Stake structures
    struct Stake {
        uint256 id;
        uint256 amount;
        uint256 startTime;
        uint256 lockPeriod;
        uint256 multiplier;
        uint256 lastClaimTime;
        bool active;
        bool autoCompound;
    }
    
    struct StakeOption {
        uint256 lockPeriod;
        uint256 multiplier;
        bool active;
        string name;
    }
    
    struct UserStakeInfo {
        uint256 totalStaked;
        uint256 totalRewards;
        uint256 activeStakes;
        uint256 totalClaimed;
    }
    
    // State variables
    FLYToken public flyToken;
    Counters.Counter private _stakeIdCounter;
    
    mapping(uint256 => Stake) public stakes;
    mapping(address => uint256[]) public userStakes;
    mapping(address => UserStakeInfo) public userInfo;
    mapping(address => bool) public isValidator;
    mapping(address => uint256) public validatorRewards;
    
    StakeOption[] public stakeOptions;
    uint256 public totalStaked;
    uint256 public totalRewardsDistributed;
    uint256 public rewardPool;
    
    // Events
    event Staked(
        address indexed user,
        uint256 indexed stakeId,
        uint256 amount,
        uint256 lockPeriod,
        uint256 multiplier
    );
    
    event Unstaked(
        address indexed user,
        uint256 indexed stakeId,
        uint256 amount,
        uint256 reward
    );
    
    event RewardsClaimed(
        address indexed user,
        uint256 indexed stakeId,
        uint256 amount
    );
    
    event AutoCompoundToggled(
        address indexed user,
        uint256 indexed stakeId,
        bool enabled
    );
    
    event ValidatorRewardDistributed(
        address indexed validator,
        uint256 amount
    );
    
    event RewardPoolUpdated(uint256 newAmount);
    
    constructor(address _flyToken) {
        flyToken = FLYToken(_flyToken);
        
        // Initialize stake options
        stakeOptions.push(StakeOption(30 days, 100, true, "Flexible"));      // 1x multiplier
        stakeOptions.push(StakeOption(90 days, 120, true, "Short Term"));    // 1.2x multiplier
        stakeOptions.push(StakeOption(180 days, 150, true, "Medium Term"));  // 1.5x multiplier
        stakeOptions.push(StakeOption(365 days, 200, true, "Long Term"));    // 2x multiplier
        stakeOptions.push(StakeOption(730 days, 300, true, "Ultra Long"));   // 3x multiplier
    }
    
    /**
     * @dev Create a new stake
     * @param amount Amount to stake
     * @param optionIndex Index of stake option
     * @param autoCompound Enable auto-compounding
     */
    function stake(
        uint256 amount,
        uint256 optionIndex,
        bool autoCompound
    ) external nonReentrant {
        require(amount >= MIN_STAKE_AMOUNT, "Amount below minimum");
        require(amount <= MAX_STAKE_AMOUNT, "Amount exceeds maximum");
        require(optionIndex < stakeOptions.length, "Invalid option");
        require(stakeOptions[optionIndex].active, "Option inactive");
        require(flyToken.balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        StakeOption memory option = stakeOptions[optionIndex];
        
        // Transfer tokens to contract
        flyToken.transferFrom(msg.sender, address(this), amount);
        
        // Create stake
        uint256 stakeId = _stakeIdCounter.current();
        _stakeIdCounter.increment();
        
        stakes[stakeId] = Stake({
            id: stakeId,
            amount: amount,
            startTime: block.timestamp,
            lockPeriod: option.lockPeriod,
            multiplier: option.multiplier,
            lastClaimTime: block.timestamp,
            active: true,
            autoCompound: autoCompound
        });
        
        userStakes[msg.sender].push(stakeId);
        userInfo[msg.sender].totalStaked += amount;
        userInfo[msg.sender].activeStakes++;
        totalStaked += amount;
        
        emit Staked(msg.sender, stakeId, amount, option.lockPeriod, option.multiplier);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     * @param stakeId Stake ID to unstake
     */
    function unstake(uint256 stakeId) external nonReentrant {
        require(stakes[stakeId].active, "Stake not active");
        require(stakes[stakeId].startTime + stakes[stakeId].lockPeriod <= block.timestamp, "Stake still locked");
        
        Stake storage stakeInfo = stakes[stakeId];
        require(stakeInfo.active, "Stake already inactive");
        
        uint256 reward = calculateStakeReward(stakeId);
        uint256 totalAmount = stakeInfo.amount + reward;
        
        // Mark stake as inactive
        stakeInfo.active = false;
        userInfo[msg.sender].totalStaked -= stakeInfo.amount;
        userInfo[msg.sender].activeStakes--;
        userInfo[msg.sender].totalClaimed += reward;
        totalStaked -= stakeInfo.amount;
        totalRewardsDistributed += reward;
        
        // Transfer tokens back to user
        flyToken.transfer(msg.sender, totalAmount);
        
        emit Unstaked(msg.sender, stakeId, stakeInfo.amount, reward);
    }
    
    /**
     * @dev Claim rewards from a stake
     * @param stakeId Stake ID
     */
    function claimRewards(uint256 stakeId) external nonReentrant {
        require(stakes[stakeId].active, "Stake not active");
        
        Stake storage stakeInfo = stakes[stakeId];
        uint256 reward = calculateStakeReward(stakeId);
        require(reward > 0, "No rewards to claim");
        
        stakeInfo.lastClaimTime = block.timestamp;
        userInfo[msg.sender].totalRewards += reward;
        userInfo[msg.sender].totalClaimed += reward;
        totalRewardsDistributed += reward;
        
        // If auto-compound is enabled, add rewards to stake
        if (stakeInfo.autoCompound) {
            stakeInfo.amount += reward;
            emit RewardsClaimed(msg.sender, stakeId, reward);
        } else {
            flyToken.transfer(msg.sender, reward);
            emit RewardsClaimed(msg.sender, stakeId, reward);
        }
    }
    
    /**
     * @dev Toggle auto-compounding for a stake
     * @param stakeId Stake ID
     */
    function toggleAutoCompound(uint256 stakeId) external {
        require(stakes[stakeId].active, "Stake not active");
        
        Stake storage stakeInfo = stakes[stakeId];
        stakeInfo.autoCompound = !stakeInfo.autoCompound;
        
        emit AutoCompoundToggled(msg.sender, stakeId, stakeInfo.autoCompound);
    }
    
    /**
     * @dev Calculate rewards for a stake
     * @param stakeId Stake ID
     * @return reward Calculated reward
     */
    function calculateStakeReward(uint256 stakeId) public view returns (uint256) {
        Stake memory stakeInfo = stakes[stakeId];
        if (!stakeInfo.active) return 0;
        
        uint256 timeElapsed = block.timestamp - stakeInfo.lastClaimTime;
        uint256 baseReward = (stakeInfo.amount * BASE_APY * timeElapsed) / (365 days * REWARD_PRECISION);
        uint256 boostedReward = baseReward * stakeInfo.multiplier / 100;
        
        return boostedReward;
    }
    
    /**
     * @dev Calculate total pending rewards for user
     * @param user User address
     * @return totalRewards Total pending rewards
     */
    function calculateTotalRewards(address user) external view returns (uint256 totalRewards) {
        uint256[] memory userStakeIds = userStakes[user];
        for (uint256 i = 0; i < userStakeIds.length; i++) {
            if (stakes[userStakeIds[i]].active) {
                totalRewards += calculateStakeReward(userStakeIds[i]);
            }
        }
    }
    
    /**
     * @dev Get user stake information
     * @param user User address
     * @return UserStakeInfo User stake information
     */
    function getUserStakeInfo(address user) external view returns (UserStakeInfo memory) {
        return userInfo[user];
    }
    
    /**
     * @dev Get user active stakes
     * @param user User address
     * @return stakeIds Array of active stake IDs
     */
    function getUserActiveStakes(address user) external view returns (uint256[] memory) {
        uint256[] memory userStakeIds = userStakes[user];
        uint256 activeCount = 0;
        
        // Count active stakes
        for (uint256 i = 0; i < userStakeIds.length; i++) {
            if (stakes[userStakeIds[i]].active) {
                activeCount++;
            }
        }
        
        // Create array of active stakes
        uint256[] memory activeStakes = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userStakeIds.length; i++) {
            if (stakes[userStakeIds[i]].active) {
                activeStakes[index] = userStakeIds[i];
                index++;
            }
        }
        
        return activeStakes;
    }
    
    /**
     * @dev Add validator
     * @param validator Validator address
     */
    function addValidator(address validator) external onlyOwner {
        require(validator != address(0), "Invalid validator");
        isValidator[validator] = true;
    }
    
    /**
     * @dev Remove validator
     * @param validator Validator address
     */
    function removeValidator(address validator) external onlyOwner {
        require(isValidator[validator], "Not a validator");
        isValidator[validator] = false;
    }
    
    /**
     * @dev Distribute validator rewards
     * @param validator Validator address
     * @param amount Reward amount
     */
    function distributeValidatorReward(address validator, uint256 amount) external onlyOwner {
        require(isValidator[validator], "Not a validator");
        require(amount <= rewardPool, "Insufficient reward pool");
        
        validatorRewards[validator] += amount;
        rewardPool -= amount;
        flyToken.transfer(validator, amount);
        
        emit ValidatorRewardDistributed(validator, amount);
    }
    
    /**
     * @dev Update reward pool
     * @param amount New reward pool amount
     */
    function updateRewardPool(uint256 amount) external onlyOwner {
        require(amount > rewardPool, "Amount must be greater than current pool");
        
        uint256 difference = amount - rewardPool;
        flyToken.transferFrom(msg.sender, address(this), difference);
        rewardPool = amount;
        
        emit RewardPoolUpdated(amount);
    }
    
    /**
     * @dev Add new stake option
     * @param lockPeriod Lock period in seconds
     * @param multiplier Multiplier (100 = 1x)
     * @param name Option name
     */
    function addStakeOption(
        uint256 lockPeriod,
        uint256 multiplier,
        string memory name
    ) external onlyOwner {
        stakeOptions.push(StakeOption(lockPeriod, multiplier, true, name));
    }
    
    /**
     * @dev Toggle stake option
     * @param optionIndex Option index
     * @param active Active status
     */
    function toggleStakeOption(uint256 optionIndex, bool active) external onlyOwner {
        require(optionIndex < stakeOptions.length, "Invalid option");
        stakeOptions[optionIndex].active = active;
    }
    
    /**
     * @dev Get stake option
     * @param optionIndex Option index
     * @return StakeOption Stake option details
     */
    function getStakeOption(uint256 optionIndex) external view returns (StakeOption memory) {
        require(optionIndex < stakeOptions.length, "Invalid option");
        return stakeOptions[optionIndex];
    }
    
    /**
     * @dev Get all stake options
     * @return StakeOption[] All stake options
     */
    function getAllStakeOptions() external view returns (StakeOption[] memory) {
        return stakeOptions;
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
