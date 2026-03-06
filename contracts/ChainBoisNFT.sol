// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/interfaces/IERC4906.sol";

contract ChainBoisNFT is ERC721, Ownable, IERC4906 {
    using Strings for uint256;

    uint256 private _nextTokenId = 1; // Start at 1 to match HashLips editions
    string private _baseTokenURI;
    mapping(uint256 => uint8) public nftLevel;

    constructor() ERC721("ChainBois", "CBOI") Ownable(msg.sender) {}

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        // EIP-4906: signal indexers to refresh metadata for all minted tokens
        if (_nextTokenId > 1) {
            emit BatchMetadataUpdate(1, _nextTokenId - 1);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Override to append .json (OZ default: baseURI + tokenId, no extension)
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        return bytes(base).length > 0 ? string.concat(base, tokenId.toString(), ".json") : "";
    }

    function setLevel(uint256 tokenId, uint8 level) external onlyOwner {
        require(level <= 7, "Max level is 7");
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        nftLevel[tokenId] = level;
        // EIP-4906: signal indexers to refresh this token's metadata
        emit MetadataUpdate(tokenId);
    }

    function getLevel(uint256 tokenId) external view returns (uint8) {
        return nftLevel[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, IERC165) returns (bool) {
        return interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
    }
}
