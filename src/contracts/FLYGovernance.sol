// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./FLYToken.sol";

/**
 * @title FLY Governance
 * @dev Decentralized governance system for FLYFOX AI
 * @author MetisAI Team
 */
contract FLYGovernance is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Governance configuration
    uint256 public constant MIN_PROPOSAL_THRESHOLD = 1000 * 10**18; // 1000 FLY
    uint256 public constant VOTING_DELAY = 1 days;
    uint256 public constant VOTING_PERIOD = 3 days;
    uint256 public constant EXECUTION_DELAY = 1 days;
    uint256 public constant QUORUM_THRESHOLD = 10; // 10% of total supply
    uint256 public constant MAJORITY_THRESHOLD = 50; // 50% of votes
    
    // Proposal structures
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 voteStart;
        uint256 voteEnd;
        uint256 executionTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        bool canceled;
        bytes32 ipfsHash;
    }
    
    struct Vote {
        bool hasVoted;
        uint8 support; // 0 = against, 1 = for, 2 = abstain
        uint256 votes;
    }
    
    // State variables
    Counters.Counter private _proposalCount;
    FLYToken public flyToken;
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(address => uint256) public votingPower;
    mapping(address => bool) public isDelegate;
    mapping(address => address) public delegates;
    mapping(address => uint256) public delegatedVotes;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 voteStart,
        uint256 voteEnd
    );
    
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        uint8 support,
        uint256 votes,
        string reason
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCanceled(uint256 indexed proposalId);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event DelegateVotesChanged(address indexed delegate, uint256 previousVotes, uint256 newVotes);
    
    constructor(address _flyToken) {
        flyToken = FLYToken(_flyToken);
    }
    
    /**
     * @dev Create a new proposal
     * @param title Proposal title
     * @param description Proposal description
     * @param ipfsHash IPFS hash for detailed proposal
     */
    function propose(
        string memory title,
        string memory description,
        bytes32 ipfsHash
    ) external returns (uint256) {
        require(flyToken.balanceOf(msg.sender) >= MIN_PROPOSAL_THRESHOLD, "Insufficient FLY for proposal");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        
        uint256 proposalId = _proposalCount.current();
        _proposalCount.increment();
        
        uint256 voteStart = block.timestamp + VOTING_DELAY;
        uint256 voteEnd = voteStart + VOTING_PERIOD;
        uint256 executionTime = voteEnd + EXECUTION_DELAY;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            voteStart: voteStart,
            voteEnd: voteEnd,
            executionTime: executionTime,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            executed: false,
            canceled: false,
            ipfsHash: ipfsHash
        });
        
        emit ProposalCreated(proposalId, msg.sender, title, voteStart, voteEnd);
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     * @param proposalId Proposal ID
     * @param support Vote support (0 = against, 1 = for, 2 = abstain)
     * @param reason Voting reason
     */
    function castVote(
        uint256 proposalId,
        uint8 support,
        string memory reason
    ) external nonReentrant {
        require(support <= 2, "Invalid vote type");
        require(proposalId < _proposalCount.current(), "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.voteStart, "Voting not started");
        require(block.timestamp <= proposal.voteEnd, "Voting ended");
        require(!proposal.canceled, "Proposal canceled");
        require(!proposal.executed, "Proposal executed");
        
        Vote storage vote = votes[proposalId][msg.sender];
        require(!vote.hasVoted, "Already voted");
        
        uint256 votes = getVotingPower(msg.sender);
        require(votes > 0, "No voting power");
        
        vote.hasVoted = true;
        vote.support = support;
        vote.votes = votes;
        
        if (support == 0) {
            proposal.againstVotes += votes;
        } else if (support == 1) {
            proposal.forVotes += votes;
        } else if (support == 2) {
            proposal.abstainVotes += votes;
        }
        
        emit VoteCast(msg.sender, proposalId, support, votes, reason);
    }
    
    /**
     * @dev Execute a proposal
     * @param proposalId Proposal ID
     */
    function execute(uint256 proposalId) external nonReentrant {
        require(proposalId < _proposalCount.current(), "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.executionTime, "Execution not ready");
        require(!proposal.executed, "Already executed");
        require(!proposal.canceled, "Proposal canceled");
        require(proposal.forVotes > proposal.againstVotes, "Proposal not passed");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        require(totalVotes >= (flyToken.totalSupply() * QUORUM_THRESHOLD) / 100, "Quorum not met");
        
        proposal.executed = true;
        
        // Execute proposal logic here
        // This would typically involve calling other contracts or functions
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel a proposal
     * @param proposalId Proposal ID
     */
    function cancel(uint256 proposalId) external {
        require(proposalId < _proposalCount.current(), "Proposal does not exist");
        
        Proposal storage proposal = proposals[proposalId];
        require(msg.sender == proposal.proposer || msg.sender == owner(), "Not authorized");
        require(!proposal.executed, "Already executed");
        require(!proposal.canceled, "Already canceled");
        require(block.timestamp < proposal.voteStart, "Voting started");
        
        proposal.canceled = true;
        emit ProposalCanceled(proposalId);
    }
    
    /**
     * @dev Delegate voting power to another address
     * @param delegate Address to delegate to
     */
    function delegate(address delegate) external {
        require(delegate != address(0), "Invalid delegate");
        require(delegate != msg.sender, "Cannot delegate to self");
        
        address currentDelegate = delegates[msg.sender];
        require(currentDelegate != delegate, "Already delegated to this address");
        
        delegates[msg.sender] = delegate;
        
        uint256 delegatorBalance = flyToken.balanceOf(msg.sender);
        uint256 delegatorVotes = votingPower[msg.sender];
        
        _moveVotingPower(currentDelegate, delegate, delegatorVotes);
        _moveVotingPower(address(0), delegate, delegatorBalance);
        
        emit DelegateChanged(msg.sender, currentDelegate, delegate);
    }
    
    /**
     * @dev Get voting power for an address
     * @param account Address to check
     * @return Voting power
     */
    function getVotingPower(address account) public view returns (uint256) {
        address delegate = delegates[account];
        if (delegate != address(0)) {
            return delegatedVotes[delegate];
        }
        return votingPower[account];
    }
    
    /**
     * @dev Get proposal details
     * @param proposalId Proposal ID
     * @return Proposal details
     */
    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        require(proposalId < _proposalCount.current(), "Proposal does not exist");
        return proposals[proposalId];
    }
    
    /**
     * @dev Get proposal count
     * @return Total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return _proposalCount.current();
    }
    
    /**
     * @dev Check if proposal can be executed
     * @param proposalId Proposal ID
     * @return Can execute
     */
    function canExecute(uint256 proposalId) external view returns (bool) {
        if (proposalId >= _proposalCount.current()) return false;
        
        Proposal memory proposal = proposals[proposalId];
        if (proposal.executed || proposal.canceled) return false;
        if (block.timestamp < proposal.executionTime) return false;
        if (proposal.forVotes <= proposal.againstVotes) return false;
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        return totalVotes >= (flyToken.totalSupply() * QUORUM_THRESHOLD) / 100;
    }
    
    /**
     * @dev Internal function to move voting power
     */
    function _moveVotingPower(
        address from,
        address to,
        uint256 amount
    ) internal {
        if (from != address(0)) {
            uint256 newFromVotes = delegatedVotes[from] - amount;
            delegatedVotes[from] = newFromVotes;
            emit DelegateVotesChanged(from, delegatedVotes[from] + amount, newFromVotes);
        }
        
        if (to != address(0)) {
            uint256 newToVotes = delegatedVotes[to] + amount;
            delegatedVotes[to] = newToVotes;
            emit DelegateVotesChanged(to, delegatedVotes[to] - amount, newToVotes);
        }
    }
    
    /**
     * @dev Update voting power when tokens are transferred
     * @param from From address
     * @param to To address
     * @param amount Transfer amount
     */
    function updateVotingPower(
        address from,
        address to,
        uint256 amount
    ) external {
        require(msg.sender == address(flyToken), "Only FLY token can call this");
        
        if (from != address(0)) {
            address fromDelegate = delegates[from];
            if (fromDelegate != address(0)) {
                _moveVotingPower(fromDelegate, address(0), amount);
            } else {
                votingPower[from] -= amount;
            }
        }
        
        if (to != address(0)) {
            address toDelegate = delegates[to];
            if (toDelegate != address(0)) {
                _moveVotingPower(address(0), toDelegate, amount);
            } else {
                votingPower[to] += amount;
            }
        }
    }
}
