const { ethers } = require("ethers");
const { getProvider, getSigner } = require("./avaxUtils");
const { withRetry } = require("./retryHelper");
const dotenv = require("dotenv");
dotenv.config();

// --- ABI Fragments (minimal, expanded when contracts are deployed) ---

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function burn(uint256 amount)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function totalSupply() view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

const CHAINBOIS_NFT_ABI = [
  ...ERC721_ABI,
  "function tokenLevel(uint256 tokenId) view returns (uint8)",
  "function setLevel(uint256 tokenId, uint8 level)",
  "function mint(address to)",
  "function reserve(address to, uint256 quantity)",
  "function setBaseURI(string memory baseURI)",
];

const WEAPON_NFT_ABI = [
  ...ERC721_ABI,
  "function mint(address to, string memory uri)",
  "function setBaseURI(string memory baseURI)",
];

/**
 * Get a read-only contract instance
 * @param {string} address - Contract address
 * @param {Array} abi - Contract ABI
 * @returns {ethers.Contract}
 */
const getContract = function (address, abi) {
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
};

/**
 * Get a writable contract instance (with signer)
 * @param {string} contractAddress - Contract address
 * @param {Array} abi - Contract ABI
 * @param {string} privateKey - Signer private key
 * @returns {ethers.Contract}
 */
const getSignedContract = function (contractAddress, abi, privateKey) {
  const signer = getSigner(privateKey);
  return new ethers.Contract(contractAddress, abi, signer);
};

// --- $BATTLE Token Operations ---

const getBattleTokenContract = function (privateKey) {
  const address = process.env.BATTLE_TOKEN_ADDRESS;
  if (!address) throw new Error("BATTLE_TOKEN_ADDRESS not configured");
  if (privateKey) {
    return getSignedContract(address, ERC20_ABI, privateKey);
  }
  return getContract(address, ERC20_ABI);
};

const getBattleBalance = async function (walletAddress) {
  return withRetry(async () => {
    const contract = getBattleTokenContract();
    const balance = await contract.balanceOf(walletAddress);
    return ethers.formatEther(balance);
  });
};

const mintBattleTokens = async function (toAddress, amount, signerPrivateKey) {
  return withRetry(async () => {
    const contract = getBattleTokenContract(signerPrivateKey);
    const tx = await contract.mint(toAddress, ethers.parseEther(amount));
    const receipt = await tx.wait();
    return receipt;
  });
};

const transferBattleTokens = async function (toAddress, amount, signerPrivateKey) {
  return withRetry(async () => {
    const contract = getBattleTokenContract(signerPrivateKey);
    const tx = await contract.transfer(toAddress, ethers.parseEther(amount));
    const receipt = await tx.wait();
    return receipt;
  });
};

// --- ChainBois NFT Operations ---

const getChainboisNftContract = function (privateKey) {
  const address = process.env.CHAINBOIS_NFT_ADDRESS;
  if (!address) throw new Error("CHAINBOIS_NFT_ADDRESS not configured");
  if (privateKey) {
    return getSignedContract(address, CHAINBOIS_NFT_ABI, privateKey);
  }
  return getContract(address, CHAINBOIS_NFT_ABI);
};

const getNftLevel = async function (tokenId) {
  return withRetry(async () => {
    const contract = getChainboisNftContract();
    const level = await contract.tokenLevel(tokenId);
    return Number(level);
  });
};

const setNftLevel = async function (tokenId, newLevel, signerPrivateKey) {
  return withRetry(async () => {
    const contract = getChainboisNftContract(signerPrivateKey);
    const tx = await contract.setLevel(tokenId, newLevel);
    const receipt = await tx.wait();
    return receipt;
  });
};

const getNftOwner = async function (tokenId) {
  return withRetry(async () => {
    const contract = getChainboisNftContract();
    const owner = await contract.ownerOf(tokenId);
    return owner;
  });
};

const transferNft = async function (fromAddress, toAddress, tokenId, signerPrivateKey) {
  return withRetry(async () => {
    const contract = getChainboisNftContract(signerPrivateKey);
    const tx = await contract.transferFrom(fromAddress, toAddress, tokenId);
    const receipt = await tx.wait();
    return receipt;
  });
};

const mintChainboiNft = async function (toAddress, signerPrivateKey) {
  return withRetry(async () => {
    const contract = getChainboisNftContract(signerPrivateKey);
    const tx = await contract.mint(toAddress);
    const receipt = await tx.wait();
    return receipt;
  });
};

// --- Weapon NFT Operations ---

const getWeaponNftContract = function (privateKey) {
  const address = process.env.WEAPON_NFT_ADDRESS;
  if (!address) throw new Error("WEAPON_NFT_ADDRESS not configured");
  if (privateKey) {
    return getSignedContract(address, WEAPON_NFT_ABI, privateKey);
  }
  return getContract(address, WEAPON_NFT_ABI);
};

const transferWeaponNft = async function (fromAddress, toAddress, tokenId, signerPrivateKey) {
  return withRetry(async () => {
    const contract = getWeaponNftContract(signerPrivateKey);
    const tx = await contract.transferFrom(fromAddress, toAddress, tokenId);
    const receipt = await tx.wait();
    return receipt;
  });
};

module.exports = {
  ERC20_ABI,
  ERC721_ABI,
  CHAINBOIS_NFT_ABI,
  WEAPON_NFT_ABI,
  getContract,
  getSignedContract,
  getBattleTokenContract,
  getBattleBalance,
  mintBattleTokens,
  transferBattleTokens,
  getChainboisNftContract,
  getNftLevel,
  setNftLevel,
  getNftOwner,
  transferNft,
  mintChainboiNft,
  getWeaponNftContract,
  transferWeaponNft,
};
