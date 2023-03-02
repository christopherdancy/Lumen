pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract ProofofAccess is ERC721 {
    using Counters for Counters.Counter;
    IERC20 public usdc;

    Counters.Counter private _tokenIdCounter;

    struct PortfolioMetadata {
        uint timestamp;
    }
    mapping(uint256 => PortfolioMetadata) public tokenPortfolios;
    mapping(address => mapping(address => uint)) public requests;
    event Requested(address indexed requestor, address indexed attester, uint indexed tokenId);
    event Attested(address indexed requestor, address indexed attester, uint indexed tokenId, uint timestamp);

    constructor() ERC721("SoulAttestedPortfolio", "SAP") {}

    function request(address attester) public {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        requests[msg.sender][attester] = tokenId;
        emit Requested(msg.sender, attester, tokenId);
    }

    function attest(address requestor) public {
        uint tokenId = requests[requestor][msg.sender];
        require(tokenId != 0, "Request Does Not Exist");
        if(_exists(tokenId)) _burn(tokenId);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId);
        emit Attested(requestor, msg.sender, tokenId, tokenPortfolios[tokenId].timestamp);
    }
    
    function _setTokenURI(uint256 tokenId) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        tokenPortfolios[tokenId] = PortfolioMetadata(block.timestamp);
    }

    function _beforeTokenTransfer(address from, address to, uint256) pure internal {
        require(from == address(0) || to == address(0), "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner.");
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}