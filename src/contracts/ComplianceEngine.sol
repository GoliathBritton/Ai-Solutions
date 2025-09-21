// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./FLYToken.sol";

/**
 * @title Compliance Engine
 * @dev KYC/AML compliance and regulatory framework for FLY tokens
 * @author MetisAI Team
 */
contract ComplianceEngine is Ownable, ReentrancyGuard, Pausable {
    // Compliance structures
    struct KYCInfo {
        address user;
        bool verified;
        uint8 level; // 1 = Basic, 2 = Enhanced, 3 = Premium
        uint256 expiry;
        string country;
        string documentHash;
        uint256 timestamp;
    }
    
    struct AMLRecord {
        address user;
        uint256 riskScore;
        bool highRisk;
        uint256 lastUpdate;
        string[] flags;
    }
    
    struct TransactionRecord {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string purpose;
        bool flagged;
        string reason;
    }
    
    struct SanctionsEntry {
        address user;
        bool sanctioned;
        string reason;
        uint256 timestamp;
    }
    
    // State variables
    FLYToken public flyToken;
    
    mapping(address => KYCInfo) public kycRecords;
    mapping(address => AMLRecord) public amlRecords;
    mapping(address => bool) public isKYCProvider;
    mapping(address => bool) public isAMLProvider;
    mapping(address => bool) public isComplianceOfficer;
    mapping(bytes32 => TransactionRecord) public transactions;
    mapping(address => SanctionsEntry) public sanctionsList;
    mapping(address => bool) public isWhitelisted;
    mapping(address => bool) public isBlacklisted;
    
    uint256 public constant MIN_KYC_AMOUNT = 1000 * 10**18; // 1000 FLY
    uint256 public constant HIGH_RISK_THRESHOLD = 8000; // 80% risk score
    uint256 public constant MEDIUM_RISK_THRESHOLD = 5000; // 50% risk score
    
    uint256 public totalKYCVerified;
    uint256 public totalTransactionsFlagged;
    uint256 public totalSanctionsBlocked;
    
    // Events
    event KYCVerified(
        address indexed user,
        uint8 level,
        uint256 expiry,
        string country
    );
    
    event KYCExpired(
        address indexed user,
        uint256 expiry
    );
    
    event AMLUpdated(
        address indexed user,
        uint256 riskScore,
        bool highRisk
    );
    
    event TransactionFlagged(
        address indexed from,
        address indexed to,
        uint256 amount,
        string reason
    );
    
    event SanctionsAdded(
        address indexed user,
        string reason
    );
    
    event SanctionsRemoved(
        address indexed user
    );
    
    event WhitelistAdded(address indexed user);
    event WhitelistRemoved(address indexed user);
    event BlacklistAdded(address indexed user);
    event BlacklistRemoved(address indexed user);
    
    event ComplianceOfficerAdded(address indexed officer);
    event ComplianceOfficerRemoved(address indexed officer);
    
    constructor(address _flyToken) {
        flyToken = FLYToken(_flyToken);
    }
    
    /**
     * @dev Verify KYC for a user
     * @param user User address
     * @param level KYC level (1-3)
     * @param expiry Expiry timestamp
     * @param country Country code
     * @param documentHash Document hash
     */
    function verifyKYC(
        address user,
        uint8 level,
        uint256 expiry,
        string memory country,
        string memory documentHash
    ) external {
        require(isKYCProvider[msg.sender] || isComplianceOfficer[msg.sender], "Not authorized");
        require(user != address(0), "Invalid user");
        require(level >= 1 && level <= 3, "Invalid KYC level");
        require(expiry > block.timestamp, "Invalid expiry");
        require(bytes(country).length > 0, "Country required");
        require(bytes(documentHash).length > 0, "Document hash required");
        
        kycRecords[user] = KYCInfo({
            user: user,
            verified: true,
            level: level,
            expiry: expiry,
            country: country,
            documentHash: documentHash,
            timestamp: block.timestamp
        });
        
        totalKYCVerified++;
        
        emit KYCVerified(user, level, expiry, country);
    }
    
    /**
     * @dev Update AML record for a user
     * @param user User address
     * @param riskScore Risk score (0-10000)
     * @param flags Risk flags
     */
    function updateAML(
        address user,
        uint256 riskScore,
        string[] memory flags
    ) external {
        require(isAMLProvider[msg.sender] || isComplianceOfficer[msg.sender], "Not authorized");
        require(user != address(0), "Invalid user");
        require(riskScore <= 10000, "Invalid risk score");
        
        bool highRisk = riskScore >= HIGH_RISK_THRESHOLD;
        
        amlRecords[user] = AMLRecord({
            user: user,
            riskScore: riskScore,
            highRisk: highRisk,
            lastUpdate: block.timestamp,
            flags: flags
        });
        
        emit AMLUpdated(user, riskScore, highRisk);
    }
    
    /**
     * @dev Check compliance for a transaction
     * @param from From address
     * @param to To address
     * @param amount Transaction amount
     * @param purpose Transaction purpose
     * @return allowed Whether transaction is allowed
     * @return reason Reason if not allowed
     */
    function checkCompliance(
        address from,
        address to,
        uint256 amount,
        string memory purpose
    ) external returns (bool allowed, string memory reason) {
        // Check blacklist
        if (isBlacklisted[from] || isBlacklisted[to]) {
            return (false, "Address blacklisted");
        }
        
        // Check sanctions
        if (sanctionsList[from].sanctioned || sanctionsList[to].sanctioned) {
            return (false, "Address sanctioned");
        }
        
        // Check KYC for large transactions
        if (amount >= MIN_KYC_AMOUNT) {
            if (!kycRecords[from].verified || kycRecords[from].expiry < block.timestamp) {
                return (false, "KYC required for large transaction");
            }
        }
        
        // Check AML risk
        if (amlRecords[from].highRisk) {
            return (false, "High AML risk detected");
        }
        
        // Check transaction patterns
        if (amount > 100000 * 10**18) { // 100K FLY threshold
            if (amlRecords[from].riskScore > MEDIUM_RISK_THRESHOLD) {
                return (false, "Medium risk threshold exceeded");
            }
        }
        
        // Record transaction
        bytes32 txHash = keccak256(abi.encodePacked(from, to, amount, block.timestamp));
        transactions[txHash] = TransactionRecord({
            from: from,
            to: to,
            amount: amount,
            timestamp: block.timestamp,
            purpose: purpose,
            flagged: false,
            reason: ""
        });
        
        return (true, "");
    }
    
    /**
     * @dev Flag a transaction
     * @param txHash Transaction hash
     * @param reason Flag reason
     */
    function flagTransaction(bytes32 txHash, string memory reason) external {
        require(isComplianceOfficer[msg.sender], "Not authorized");
        require(transactions[txHash].from != address(0), "Transaction not found");
        
        transactions[txHash].flagged = true;
        transactions[txHash].reason = reason;
        
        totalTransactionsFlagged++;
        
        emit TransactionFlagged(
            transactions[txHash].from,
            transactions[txHash].to,
            transactions[txHash].amount,
            reason
        );
    }
    
    /**
     * @dev Add address to sanctions list
     * @param user User address
     * @param reason Sanction reason
     */
    function addSanctions(address user, string memory reason) external {
        require(isComplianceOfficer[msg.sender], "Not authorized");
        require(user != address(0), "Invalid user");
        require(bytes(reason).length > 0, "Reason required");
        
        sanctionsList[user] = SanctionsEntry({
            user: user,
            sanctioned: true,
            reason: reason,
            timestamp: block.timestamp
        });
        
        totalSanctionsBlocked++;
        
        emit SanctionsAdded(user, reason);
    }
    
    /**
     * @dev Remove address from sanctions list
     * @param user User address
     */
    function removeSanctions(address user) external {
        require(isComplianceOfficer[msg.sender], "Not authorized");
        require(sanctionsList[user].sanctioned, "Not sanctioned");
        
        sanctionsList[user].sanctioned = false;
        
        emit SanctionsRemoved(user);
    }
    
    /**
     * @dev Add address to whitelist
     * @param user User address
     */
    function addToWhitelist(address user) external onlyOwner {
        require(user != address(0), "Invalid user");
        isWhitelisted[user] = true;
        emit WhitelistAdded(user);
    }
    
    /**
     * @dev Remove address from whitelist
     * @param user User address
     */
    function removeFromWhitelist(address user) external onlyOwner {
        require(isWhitelisted[user], "Not whitelisted");
        isWhitelisted[user] = false;
        emit WhitelistRemoved(user);
    }
    
    /**
     * @dev Add address to blacklist
     * @param user User address
     */
    function addToBlacklist(address user) external onlyOwner {
        require(user != address(0), "Invalid user");
        isBlacklisted[user] = true;
        emit BlacklistAdded(user);
    }
    
    /**
     * @dev Remove address from blacklist
     * @param user User address
     */
    function removeFromBlacklist(address user) external onlyOwner {
        require(isBlacklisted[user], "Not blacklisted");
        isBlacklisted[user] = false;
        emit BlacklistRemoved(user);
    }
    
    /**
     * @dev Add KYC provider
     * @param provider Provider address
     */
    function addKYCProvider(address provider) external onlyOwner {
        require(provider != address(0), "Invalid provider");
        isKYCProvider[provider] = true;
    }
    
    /**
     * @dev Remove KYC provider
     * @param provider Provider address
     */
    function removeKYCProvider(address provider) external onlyOwner {
        require(isKYCProvider[provider], "Not a provider");
        isKYCProvider[provider] = false;
    }
    
    /**
     * @dev Add AML provider
     * @param provider Provider address
     */
    function addAMLProvider(address provider) external onlyOwner {
        require(provider != address(0), "Invalid provider");
        isAMLProvider[provider] = true;
    }
    
    /**
     * @dev Remove AML provider
     * @param provider Provider address
     */
    function removeAMLProvider(address provider) external onlyOwner {
        require(isAMLProvider[provider], "Not a provider");
        isAMLProvider[provider] = false;
    }
    
    /**
     * @dev Add compliance officer
     * @param officer Officer address
     */
    function addComplianceOfficer(address officer) external onlyOwner {
        require(officer != address(0), "Invalid officer");
        isComplianceOfficer[officer] = true;
        emit ComplianceOfficerAdded(officer);
    }
    
    /**
     * @dev Remove compliance officer
     * @param officer Officer address
     */
    function removeComplianceOfficer(address officer) external onlyOwner {
        require(isComplianceOfficer[officer], "Not an officer");
        isComplianceOfficer[officer] = false;
        emit ComplianceOfficerRemoved(officer);
    }
    
    /**
     * @dev Get KYC information for a user
     * @param user User address
     * @return KYCInfo KYC information
     */
    function getKYCInfo(address user) external view returns (KYCInfo memory) {
        return kycRecords[user];
    }
    
    /**
     * @dev Get AML record for a user
     * @param user User address
     * @return AMLRecord AML record
     */
    function getAMLRecord(address user) external view returns (AMLRecord memory) {
        return amlRecords[user];
    }
    
    /**
     * @dev Get transaction record
     * @param txHash Transaction hash
     * @return TransactionRecord Transaction record
     */
    function getTransactionRecord(bytes32 txHash) external view returns (TransactionRecord memory) {
        return transactions[txHash];
    }
    
    /**
     * @dev Get compliance statistics
     * @return totalKYC Total KYC verified
     * @return totalFlagged Total transactions flagged
     * @return totalSanctions Total sanctions blocked
     */
    function getComplianceStats() external view returns (uint256, uint256, uint256) {
        return (totalKYCVerified, totalTransactionsFlagged, totalSanctionsBlocked);
    }
    
    /**
     * @dev Check if user is compliant
     * @param user User address
     * @return compliant Whether user is compliant
     */
    function isCompliant(address user) external view returns (bool) {
        if (isBlacklisted[user]) return false;
        if (sanctionsList[user].sanctioned) return false;
        if (amlRecords[user].highRisk) return false;
        return true;
    }
    
    /**
     * @dev Pause compliance operations
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause compliance operations
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
