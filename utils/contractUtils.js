const { ethers } = require("ethers");
const { getProvider, getSigner } = require("./avaxUtils");
const { withRetry } = require("./retryHelper");
const dotenv = require("dotenv");
dotenv.config();

// --- ABIs from compiled contracts ---

const BattleTokenArtifact = require("../abis/BattleToken.json");
const ChainBoisNFTArtifact = require("../abis/ChainBoisNFT.json");
const WeaponNFTArtifact = require("../abis/WeaponNFT.json");

const BATTLE_TOKEN_ABI = BattleTokenArtifact.abi;
const CHAINBOIS_NFT_ABI = ChainBoisNFTArtifact.abi;
const WEAPON_NFT_ABI = WeaponNFTArtifact.abi;

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
    return getSignedContract(address, BATTLE_TOKEN_ABI, privateKey);
  }
  return getContract(address, BATTLE_TOKEN_ABI);
};

const getBattleBalance = async function (walletAddress) {
  return withRetry(async () => {
    const contract = getBattleTokenContract();
    const balance = await contract.balanceOf(walletAddress);
    return ethers.formatEther(balance);
  });
};

const mintBattleTokens = async function (toAddress, amount, signerPrivateKey) {
  const contract = getBattleTokenContract(signerPrivateKey);
  const tx = await contract.mint(toAddress, ethers.parseEther(String(amount)));
  const receipt = await tx.wait();
  return receipt;
};

const transferBattleTokens = async function (toAddress, amount, signerPrivateKey) {
  const contract = getBattleTokenContract(signerPrivateKey);
  const tx = await contract.transfer(toAddress, ethers.parseEther(String(amount)));
  const receipt = await tx.wait();
  return receipt;
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
    const level = await contract.getLevel(tokenId);
    return Number(level);
  });
};

const setNftLevel = async function (tokenId, newLevel, signerPrivateKey) {
  const contract = getChainboisNftContract(signerPrivateKey);
  const tx = await contract.setLevel(tokenId, newLevel);
  const receipt = await tx.wait();
  return receipt;
};

const getNftOwner = async function (tokenId) {
  return withRetry(async () => {
    const contract = getChainboisNftContract();
    const owner = await contract.ownerOf(tokenId);
    return owner;
  });
};

const transferNft = async function (fromAddress, toAddress, tokenId, signerPrivateKey) {
  const contract = getChainboisNftContract(signerPrivateKey);
  const tx = await contract.transferFrom(fromAddress, toAddress, tokenId);
  const receipt = await tx.wait();
  return receipt;
};

const mintChainboiNft = async function (toAddress, signerPrivateKey) {
  const contract = getChainboisNftContract(signerPrivateKey);
  const tx = await contract.mint(toAddress);
  const receipt = await tx.wait();
  return receipt;
};

const getChainboisTotalSupply = async function () {
  return withRetry(async () => {
    const contract = getChainboisNftContract();
    const supply = await contract.totalSupply();
    return Number(supply);
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

const mintWeaponNft = async function (toAddress, weaponName, signerPrivateKey) {
  const contract = getWeaponNftContract(signerPrivateKey);
  const tx = await contract.mint(toAddress, weaponName);
  const receipt = await tx.wait();
  return receipt;
};

const getWeaponName = async function (tokenId) {
  return withRetry(async () => {
    const contract = getWeaponNftContract();
    const name = await contract.weaponName(tokenId);
    return name;
  });
};

const transferWeaponNft = async function (fromAddress, toAddress, tokenId, signerPrivateKey) {
  const contract = getWeaponNftContract(signerPrivateKey);
  const tx = await contract.transferFrom(fromAddress, toAddress, tokenId);
  const receipt = await tx.wait();
  return receipt;
};

const getWeaponTotalSupply = async function () {
  return withRetry(async () => {
    const contract = getWeaponNftContract();
    const supply = await contract.totalSupply();
    return Number(supply);
  });
};

module.exports = {
  BATTLE_TOKEN_ABI,
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
  getChainboisTotalSupply,
  getWeaponNftContract,
  mintWeaponNft,
  getWeaponName,
  transferWeaponNft,
  getWeaponTotalSupply,
};
