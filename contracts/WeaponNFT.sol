// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/interfaces/IERC4906.sol";

contract WeaponNFT is ERC721, Ownable, IERC4906 {
    using Strings for uint256;

    uint256 private _nextTokenId = 1;
    string private _baseTokenURI;
    mapping(uint256 => string) public weaponName;

    constructor() ERC721("ChainBois Weapons", "CBWEP") Ownable(msg.sender) {}

    function mint(address to, string calldata name) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        weaponName[tokenId] = name;
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

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        return bytes(base).length > 0 ? string.concat(base, tokenId.toString(), ".json") : "";
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, IERC165) returns (bool) {
        return interfaceId == bytes4(0x49064906) || super.supportsInterface(interfaceId);
    }
}
