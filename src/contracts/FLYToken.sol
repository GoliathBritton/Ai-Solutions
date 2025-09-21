// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FLY Token
 * @dev FLYFOX AI's native utility token with advanced features
 * @author MetisAI Team
 */
contract FLYToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, ReentrancyGuard {
    // Token configuration
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion FLY
    uint256 public constant INITIAL_SUPPLY = 400_000_000 * 10**18; // 400M for ecosystem
    uint256 public constant TEAM_ALLOCATION = 150_000_000 * 10**18; // 150M for team
    uint256 public constant INVESTOR_ALLOCATION = 250_000_000 * 10**18; // 250M for investors
    uint256 public constant FOUNDATION_ALLOCATION = 100_000_000 * 10**18; // 100M for foundation
    uint256 public constant COMMUNITY_ALLOCATION = 100_000_000 * 10**18; // 100M for community
    
    // Staking configuration
    uint256 public constant STAKING_APY = 12; // 12% APY
    uint256 public constant MIN_STAKE_AMOUNT = 1000 * 10**18; // 1000 FLY minimum
    uint256 public constant MAX_STAKE_AMOUNT = 10_000_000 * 10**18; // 10M FLY maximum
    
    // Staking structures
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lockPeriod;
        uint256 boostedMultiplier;
        bool active;
    }
    
    struct StakeOption {
        uint256 lockPeriod;
        uint256 multiplier;
        bool active;
    }
    
    // Mappings
    mapping(address => Stake[]) public userStakes;
    mapping(address => uint256) public totalStaked;
    mapping(address => uint256) public lastRewardClaim;
    mapping(address => bool) public allowedRecipients;
    mapping(address => bool) public isValidator;
    mapping(address => uint256) public validatorReputation;
    
    // Stake options
    StakeOption[] public stakeOptions;
    
    // Events
    event TokensStaked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 multiplier);
    event TokensUnstaked(address indexed user, uint256 amount, uint256 reward);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event ReputationUpdated(address indexed validator, uint256 newReputation);
    event TokensMinted(address indexed to, uint256 amount, string reason);
    event TokensBurned(address indexed from, uint256 amount, string reason);
    
    constructor() ERC20("FLY Token", "FLY") {
        // Initialize stake options
        stakeOptions.push(StakeOption(30 days, 100, true));    // 1x multiplier
        stakeOptions.push(StakeOption(90 days, 120, true));    // 1.2x multiplier
        stakeOptions.push(StakeOption(180 days, 150, true));   // 1.5x multiplier
        stakeOptions.push(StakeOption(365 days, 200, true));   // 2x multiplier
        
        // Mint initial allocations
        _mint(msg.sender, INITIAL_SUPPLY);
        _mint(address(this), TEAM_ALLOCATION + INVESTOR_ALLOCATION + FOUNDATION_ALLOCATION + COMMUNITY_ALLOCATION);
        
        // Set initial allowed recipients (contracts, exchanges, etc.)
        allowedRecipients[address(this)] = true;
        allowedRecipients[msg.sender] = true;
    }
    
    /**
     * @dev Stake FLY tokens with selected lock period
     * @param amount Amount of FLY tokens to stake
     * @param optionIndex Index of stake option (0-3)
     */
    function stake(uint256 amount, uint256 optionIndex) external nonReentrant whenNotPaused {
        require(amount >= MIN_STAKE_AMOUNT, "Amount below minimum stake");
        require(amount <= MAX_STAKE_AMOUNT, "Amount exceeds maximum stake");
        require(optionIndex < stakeOptions.length, "Invalid stake option");
        require(stakeOptions[optionIndex].active, "Stake option inactive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        StakeOption memory option = stakeOptions[optionIndex];
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Create stake
        userStakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            lockPeriod: option.lockPeriod,
            boostedMultiplier: option.multiplier,
            active: true
        }));
        
        totalStaked[msg.sender] += amount;
        
        emit TokensStaked(msg.sender, amount, option.lockPeriod, option.multiplier);
    }
    
    /**
     * @dev Unstake FLY tokens and claim rewards
     * @param stakeIndex Index of stake to unstake
     */
    function unstake(uint256 stakeIndex) external nonReentrant whenNotPaused {
        require(stakeIndex < userStakes[msg.sender].length, "Invalid stake index");
        
        Stake storage stakeInfo = userStakes[msg.sender][stakeIndex];
        require(stakeInfo.active, "Stake already inactive");
        require(block.timestamp >= stakeInfo.startTime + stakeInfo.lockPeriod, "Stake still locked");
        
        uint256 reward = calculateStakeReward(msg.sender, stakeIndex);
        uint256 totalAmount = stakeInfo.amount + reward;
        
        // Mark stake as inactive
        stakeInfo.active = false;
        totalStaked[msg.sender] -= stakeInfo.amount;
        
        // Transfer tokens back to user
        _transfer(address(this), msg.sender, totalAmount);
        
        emit TokensUnstaked(msg.sender, stakeInfo.amount, reward);
    }
    
    /**
     * @dev Calculate rewards for a specific stake
     * @param user User address
     * @param stakeIndex Index of stake
     * @return reward Calculated reward amount
     */
    function calculateStakeReward(address user, uint256 stakeIndex) public view returns (uint256) {
        require(stakeIndex < userStakes[user].length, "Invalid stake index");
        
        Stake memory stakeInfo = userStakes[user][stakeIndex];
        if (!stakeInfo.active) return 0;
        
        uint256 stakingDuration = block.timestamp - stakeInfo.startTime;
        uint256 baseReward = (stakeInfo.amount * STAKING_APY * stakingDuration) / (365 days * 100);
        uint256 boostedReward = baseReward * stakeInfo.boostedMultiplier / 100;
        
        return boostedReward;
    }
    
    /**
     * @dev Calculate total pending rewards for user
     * @param user User address
     * @return totalRewards Total pending rewards
     */
    function calculateTotalRewards(address user) external view returns (uint256 totalRewards) {
        for (uint256 i = 0; i < userStakes[user].length; i++) {
            if (userStakes[user][i].active) {
                totalRewards += calculateStakeReward(user, i);
            }
        }
    }
    
    /**
     * @dev Add validator address
     * @param validator Validator address
     */
    function addValidator(address validator) external onlyOwner {
        require(validator != address(0), "Invalid validator address");
        isValidator[validator] = true;
        validatorReputation[validator] = 100; // Initial reputation score
        emit ValidatorAdded(validator);
    }
    
    /**
     * @dev Remove validator address
     * @param validator Validator address
     */
    function removeValidator(address validator) external onlyOwner {
        require(isValidator[validator], "Not a validator");
        isValidator[validator] = false;
        emit ValidatorRemoved(validator);
    }
    
    /**
     * @dev Update validator reputation
     * @param validator Validator address
     * @param newReputation New reputation score
     */
    function updateValidatorReputation(address validator, uint256 newReputation) external onlyOwner {
        require(isValidator[validator], "Not a validator");
        require(newReputation <= 1000, "Reputation exceeds maximum");
        validatorReputation[validator] = newReputation;
        emit ReputationUpdated(validator, newReputation);
    }
    
    /**
     * @dev Mint tokens for rewards and incentives
     * @param to Recipient address
     * @param amount Amount to mint
     * @param reason Reason for minting
     */
    function mintRewards(address to, uint256 amount, string memory reason) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Burn tokens for deflationary mechanisms
     * @param amount Amount to burn
     * @param reason Reason for burning
     */
    function burnTokens(uint256 amount, string memory reason) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount, reason);
    }
    
    /**
     * @dev Override transfer to include compliance checks
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
        
        // Compliance check for large transfers
        if (amount > 100_000 * 10**18) { // 100K FLY threshold
            require(allowedRecipients[to] || isContract(to), "Large transfer requires compliance");
        }
    }
    
    /**
     * @dev Check if address is a contract
     */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Emergency withdrawal of stuck tokens
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
}
