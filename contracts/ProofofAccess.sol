pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ProofofAccess is ERC721 {
    using Counters for Counters.Counter;
    IERC20 public usdc;

    Counters.Counter private _tokenIdCounter;

    struct PortfolioMetadata {
        uint256 timestamp;
    }
    mapping(uint256 => PortfolioMetadata) public tokenPortfolios;
    mapping(address => mapping(address => uint256)) public requests;
    event Requested(
        address indexed requestor,
        address indexed attester,
        uint256 indexed tokenId
    );
    event Attested(
        address indexed requestor,
        address indexed attester,
        uint256 indexed tokenId,
        uint256 timestamp
    );

    constructor() ERC721("SoulAttestedPortfolio", "SAP") {}

    function request(address attester) public returns (uint256 tokenId) {
        _tokenIdCounter.increment();
        tokenId = _tokenIdCounter.current();
        requests[msg.sender][attester] = tokenId;
        emit Requested(msg.sender, attester, tokenId);
    }

    // include self attestions + when address was provided
    function attest(address requestor) public {
        uint256 tokenId = requests[requestor][msg.sender];
        // Check if this is a self-attestion
        if (requestor == msg.sender && tokenId == 0)
            tokenId = request(msg.sender);
        require(tokenId != 0, "Request Does Not Exist");

        // If token does not exist mint + setTokenURI
        if (!_exists(tokenId)) _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId);

        emit Attested(
            requestor,
            msg.sender,
            tokenId,
            tokenPortfolios[tokenId].timestamp
        );
    }

    function _setTokenURI(uint256 tokenId) internal virtual {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        tokenPortfolios[tokenId] = PortfolioMetadata(block.timestamp);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256
    ) internal pure {
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
