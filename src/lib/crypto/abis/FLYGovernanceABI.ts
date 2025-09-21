/**
 * FLY Governance ABI
 * @author MetisAI Team
 */

export const FLYGovernanceABI = [
  "function propose(string, string, bytes32) external returns (uint256)",
  "function castVote(uint256, uint8, string) external",
  "function execute(uint256) external",
  "function cancel(uint256) external",
  "function delegate(address) external",
  "function getProposal(uint256) view returns (tuple(uint256 id, address proposer, string title, string description, uint256 voteStart, uint256 voteEnd, uint256 executionTime, uint256 forVotes, uint256 againstVotes, uint256 abstainVotes, bool executed, bool canceled, bytes32 ipfsHash))",
  "function getProposalCount() view returns (uint256)",
  "function canExecute(uint256) view returns (bool)",
  "function getVotingPower(address) view returns (uint256)",
  "event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title, uint256 voteStart, uint256 voteEnd)",
  "event VoteCast(address indexed voter, uint256 indexed proposalId, uint8 support, uint256 votes, string reason)",
  "event ProposalExecuted(uint256 indexed proposalId)",
  "event ProposalCanceled(uint256 indexed proposalId)",
  "event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)",
  "event DelegateVotesChanged(address indexed delegate, uint256 previousVotes, uint256 newVotes)"
];
