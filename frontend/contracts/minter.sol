// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract minter is ERC721URIStorage, Ownable(msg.sender) {

    using Strings for uint256;

    uint256 public price = 50000000000000000;  // 0.05 ETH
    uint256 public constant MAX_MINT_PER_TX = 1;

    uint256 public totalSupply;
    mapping(address => uint256) private totalMintedPerWallet;

    string public baseUri;
    string public baseExtension = ".json";

    constructor() ERC721 ("KuverseNFT", "MINT") {
        baseUri = "ipfs://";  // Set base URI for metadata
        totalSupply = 0;  // Initialize totalSupply to 0 for the first token
    }

    // Mint function
    function mint(string memory tokenURI) external payable {
        uint256 curTotalSupply = totalSupply;
        require(price <= msg.value, "Insufficient funds. You need more ETH.");

        _safeMint(msg.sender, curTotalSupply + 1);  // Mint the token with a new token 
        _setTokenURI(curTotalSupply + 1, tokenURI);
        
        totalMintedPerWallet[msg.sender] += 1;
        totalSupply += 1;
    }

    // Set price (onlyOwner)
    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    // Withdraw contract balance (onlyOwner)
    function withdrawBalance() external payable onlyOwner {
        uint256 balance = address(this).balance;
        (bool transfer, ) = payable(0xEa9611Ee7C9Cc6d2b21A1d841ca16B703457431E).call{value: balance}("");
        require(transfer, "Transfer failed.");
    }

}
