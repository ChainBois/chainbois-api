const { ethers } = require("ethers");
const axios = require("axios");
const { withRetry } = require("./retryHelper");
const dotenv = require("dotenv");
dotenv.config();

// --- Provider ---
let provider;
const getProvider = function () {
  if (!provider) {
    const chainId = parseInt(process.env.AVAX_CHAIN_ID);
    if (!process.env.AVAX_RPC_URL || isNaN(chainId)) {
      throw new Error("AVAX_RPC_URL and AVAX_CHAIN_ID must be configured");
    }
    provider = new ethers.JsonRpcProvider(process.env.AVAX_RPC_URL, chainId);
  }
  return provider;
};

// --- Data API (Glacier) ---
const DATA_API_URL = process.env.AVAX_DATA_API_URL || "https://data-api.avax.network";
const CHAIN_ID = process.env.AVAX_CHAIN_ID || "43113";

const dataApiHeaders = function () {
  const headers = { "Content-Type": "application/json" };
  if (process.env.AVAX_DATA_API_KEY) {
    headers["x-glacier-api-key"] = process.env.AVAX_DATA_API_KEY;
  }
  return headers;
};

/**
 * Get ERC-721 NFTs owned by an address
 * @param {string} address - Wallet address
 * @param {string} contractAddress - Optional filter by contract
 * @returns {Promise<Array>} Array of NFT balances
 */
const getErc721Balances = async function (address, contractAddress) {
  return withRetry(async () => {
    const url = `${DATA_API_URL}/v1/chains/${CHAIN_ID}/addresses/${address}/balances:listErc721`;
    const params = { pageSize: 100 };
    if (contractAddress) {
      params.contractAddress = contractAddress;
    }
    const response = await axios.get(url, {
      headers: dataApiHeaders(),
      params,
      timeout: 15000,
    });
    return response.data.erc721TokenBalances || [];
  });
};

/**
 * Get ERC-20 token balances for an address
 * @param {string} address - Wallet address
 * @returns {Promise<Array>} Array of token balances
 */
const getErc20Balances = async function (address) {
  return withRetry(async () => {
    const url = `${DATA_API_URL}/v1/chains/${CHAIN_ID}/addresses/${address}/balances:listErc20`;
    const response = await axios.get(url, {
      headers: dataApiHeaders(),
      params: { pageSize: 100 },
      timeout: 15000,
    });
    return response.data.erc20TokenBalances || [];
  });
};

/**
 * Get native AVAX balance for an address
 * @param {string} address - Wallet address
 * @returns {Promise<string>} Balance in AVAX
 */
const getAvaxBalance = async function (address) {
  return withRetry(async () => {
    const p = getProvider();
    const balance = await p.getBalance(address);
    return ethers.formatEther(balance);
  });
};

/**
 * Get a specific NFT token by collection and tokenId
 * @param {string} contractAddress - NFT contract address
 * @param {string} tokenId - Token ID
 * @returns {Promise<Object>} Token data with metadata
 */
const getNftToken = async function (contractAddress, tokenId) {
  return withRetry(async () => {
    const url = `${DATA_API_URL}/v1/chains/${CHAIN_ID}/nfts/collections/${contractAddress}/tokens/${tokenId}`;
    const response = await axios.get(url, {
      headers: dataApiHeaders(),
      timeout: 15000,
    });
    return response.data;
  });
};

/**
 * Trigger metadata reindex for a specific NFT (after level-up, badge change)
 * @param {string} contractAddress - NFT contract address
 * @param {string} tokenId - Token ID
 * @returns {Promise<Object>} Reindex response
 */
const reindexNftMetadata = async function (contractAddress, tokenId) {
  return withRetry(async () => {
    const url = `${DATA_API_URL}/v1/chains/${CHAIN_ID}/nfts/collections/${contractAddress}/tokens/${tokenId}:reindex`;
    const response = await axios.post(url, {}, {
      headers: dataApiHeaders(),
      timeout: 15000,
    });
    return response.data;
  });
};

/**
 * Verify a transaction on-chain
 * @param {string} txHash - Transaction hash
 * @returns {Promise<Object>} Transaction receipt
 */
const getTransactionReceipt = async function (txHash) {
  return withRetry(async () => {
    const p = getProvider();
    const receipt = await p.getTransactionReceipt(txHash);
    return receipt;
  });
};

/**
 * Get a transaction by hash
 * @param {string} txHash - Transaction hash
 * @returns {Promise<Object>} Transaction data
 */
const getTransaction = async function (txHash) {
  return withRetry(async () => {
    const p = getProvider();
    const tx = await p.getTransaction(txHash);
    return tx;
  });
};

/**
 * Verify a payment transaction (for armory purchases, level-up, etc.)
 * Following ghetto-market pattern: check sender, receiver, amount, staleness
 * @param {string} txHash - Transaction hash
 * @param {string} expectedSender - Expected sender address
 * @param {string} expectedReceiver - Expected receiver address
 * @param {string} expectedAmount - Expected amount in wei
 * @param {number} maxAgeSeconds - Max age of transaction (default 50s)
 * @returns {Promise<Object>} { valid: boolean, reason: string }
 */
const verifyPayment = async function (txHash, expectedSender, expectedReceiver, expectedAmount, maxAgeSeconds = 300) {
  const receipt = await getTransactionReceipt(txHash);
  if (!receipt) {
    return { valid: false, reason: "Transaction not found" };
  }
  if (receipt.status !== 1) {
    return { valid: false, reason: "Transaction failed" };
  }

  const tx = await getTransaction(txHash);
  if (!tx) {
    return { valid: false, reason: "Transaction data not found" };
  }

  if (tx.from.toLowerCase() !== expectedSender.toLowerCase()) {
    return { valid: false, reason: "Incorrect sender" };
  }
  if (!tx.to) {
    return { valid: false, reason: "Transaction is a contract creation (no receiver)" };
  }
  if (tx.to.toLowerCase() !== expectedReceiver.toLowerCase()) {
    return { valid: false, reason: "Incorrect receiver" };
  }

  const expectedAmountBN = BigInt(expectedAmount);
  const actualAmountBN = BigInt(tx.value.toString());
  if (actualAmountBN < expectedAmountBN) {
    return { valid: false, reason: "Insufficient payment amount" };
  }

  // Check staleness
  const p = getProvider();
  const block = await p.getBlock(receipt.blockNumber);
  if (!block) {
    return { valid: false, reason: "Block not found" };
  }
  const now = Math.floor(Date.now() / 1000);
  if (now - block.timestamp > maxAgeSeconds) {
    return { valid: false, reason: "Transaction is too old" };
  }

  return { valid: true, reason: "Payment verified" };
};

/**
 * Create a wallet (for platform wallets)
 * @returns {Object} { address, privateKey }
 */
const createWallet = function () {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
};

/**
 * Get a signer from a private key
 * @param {string} privateKey - Private key
 * @returns {ethers.Wallet} Connected wallet signer
 */
const getSigner = function (privateKey) {
  const p = getProvider();
  return new ethers.Wallet(privateKey, p);
};

/**
 * Send native AVAX from one wallet to another
 * @param {string} fromPrivateKey - Sender private key
 * @param {string} toAddress - Recipient address
 * @param {string} amountInAvax - Amount in AVAX (e.g., "1.5")
 * @returns {Promise<Object>} Transaction receipt
 */
const sendAvax = async function (fromPrivateKey, toAddress, amountInAvax) {
  const signer = getSigner(fromPrivateKey);
  const tx = await signer.sendTransaction({
    to: toAddress,
    value: ethers.parseEther(amountInAvax),
  });
  const receipt = await tx.wait();
  return receipt;
};

/**
 * Get the current block number
 * @returns {Promise<number>}
 */
const getBlockNumber = async function () {
  const p = getProvider();
  return p.getBlockNumber();
};

/**
 * Check if an address is valid
 * @param {string} address
 * @returns {boolean}
 */
const isValidAddress = function (address) {
  return ethers.isAddress(address);
};

module.exports = {
  getProvider,
  getErc721Balances,
  getErc20Balances,
  getAvaxBalance,
  getNftToken,
  reindexNftMetadata,
  getTransactionReceipt,
  getTransaction,
  verifyPayment,
  createWallet,
  getSigner,
  sendAvax,
  getBlockNumber,
  isValidAddress,
};
