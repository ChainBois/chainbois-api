/**
 * Integration test script - hits real deployed contracts on Fuji/Mainnet.
 *
 * Usage:
 *   node scripts/testIntegration.js
 *
 * Requires:
 *   - .env configured with contract addresses, RPC URL, DB URI
 *   - Contracts deployed and NFTs minted
 *   - Test wallets funded
 */
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const { ethers } = require("ethers");
const Wallet = require("../models/walletModel");
const { getAvaxBalance, getErc721Balances, isValidAddress } = require("../utils/avaxUtils");
const { decrypt, validateCryptoEnv, encrypt } = require("../utils/cryptUtils");
const {
  getBattleBalance,
  getChainboisTotalSupply,
  getWeaponTotalSupply,
  getNftLevel,
  setNftLevel,
  getNftOwner,
  getWeaponName,
  getChainboisNftContract,
  getBattleTokenContract,
  getWeaponNftContract,
} = require("../utils/contractUtils");
const { lookupNftAssets } = require("../utils/nftUtils");

let passed = 0;
let failed = 0;
const failures = [];

const assert = function (condition, testName) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    failures.push(testName);
    console.log(`  ✗ ${testName}`);
  }
};

const assertEq = function (actual, expected, testName) {
  if (actual === expected) {
    passed++;
    console.log(`  ✓ ${testName}`);
  } else {
    failed++;
    failures.push(`${testName} (expected: ${expected}, got: ${actual})`);
    console.log(`  ✗ ${testName} (expected: ${expected}, got: ${actual})`);
  }
};

const main = async function () {
  console.log("ChainBois Integration Tests");
  console.log("===========================\n");

  validateCryptoEnv();

  const dbUri = process.env.NETWORK === "prod"
    ? process.env.MONGODB_URI_PROD
    : process.env.MONGODB_URI;

  await mongoose.connect(dbUri);
  console.log("Connected to MongoDB\n");

  // --- Contract Deployment Verification ---
  console.log("1. Contract Deployment");

  try {
    const battleContract = getBattleTokenContract();
    const name = await battleContract.name();
    assertEq(name, "Battle Token", "BattleToken name");
    const symbol = await battleContract.symbol();
    assertEq(symbol, "BATTLE", "BattleToken symbol");
  } catch (err) {
    assert(false, `BattleToken contract check: ${err.message}`);
  }

  try {
    const nftContract = getChainboisNftContract();
    const name = await nftContract.name();
    assertEq(name, "ChainBois", "ChainBoisNFT name");
    const symbol = await nftContract.symbol();
    assertEq(symbol, "CBOI", "ChainBoisNFT symbol");
  } catch (err) {
    assert(false, `ChainBoisNFT contract check: ${err.message}`);
  }

  try {
    const weaponContract = getWeaponNftContract();
    const name = await weaponContract.name();
    assertEq(name, "ChainBois Weapons", "WeaponNFT name");
    const symbol = await weaponContract.symbol();
    assertEq(symbol, "CBWEP", "WeaponNFT symbol");
  } catch (err) {
    assert(false, `WeaponNFT contract check: ${err.message}`);
  }

  // --- Supply Check ---
  console.log("\n2. Supply Check");

  try {
    const nftSupply = await getChainboisTotalSupply();
    assert(nftSupply > 0, `ChainBoisNFT totalSupply > 0 (${nftSupply})`);
  } catch (err) {
    assert(false, `ChainBoisNFT totalSupply: ${err.message}`);
  }

  try {
    const weaponSupply = await getWeaponTotalSupply();
    assert(weaponSupply > 0, `WeaponNFT totalSupply > 0 (${weaponSupply})`);
  } catch (err) {
    assert(false, `WeaponNFT totalSupply: ${err.message}`);
  }

  // --- Wallet Encryption Round-Trip ---
  console.log("\n3. Wallet Encryption");

  try {
    const testKey = "0x" + "a".repeat(64);
    const encrypted = await encrypt(testKey);
    const decrypted = await decrypt(encrypted.data, encrypted.iv);
    assertEq(decrypted, testKey, "Encrypt/decrypt round-trip");
  } catch (err) {
    assert(false, `Encrypt/decrypt: ${err.message}`);
  }

  try {
    const deployer = await Wallet.findOne({ role: "deployer" }).select("+key +iv");
    assert(deployer !== null, "Deployer wallet exists in DB");
    if (deployer) {
      const key = await decrypt(deployer.key, deployer.iv);
      assert(key.startsWith("0x") && key.length === 66, "Deployer key decrypts to valid format");
    }
  } catch (err) {
    assert(false, `Deployer wallet check: ${err.message}`);
  }

  // --- NFT Ownership Queries ---
  console.log("\n4. NFT Ownership");

  const testWallets = await Wallet.find({ role: "test" }).sort({ createdAt: 1 });
  if (testWallets.length >= 2) {
    const testUser1 = testWallets[0];
    const testUser2 = testWallets[1];

    try {
      const owner = await getNftOwner(1);
      assert(isValidAddress(owner), `NFT #1 has valid owner (${owner})`);
      assertEq(owner.toLowerCase(), testUser1.address.toLowerCase(), "NFT #1 owned by test_user_1");
    } catch (err) {
      assert(false, `NFT ownership: ${err.message}`);
    }

    // lookupNftAssets for test_user_1 (has NFT)
    try {
      const assets = await lookupNftAssets(testUser1.address);
      assertEq(assets.hasNft, true, "test_user_1 hasNft = true");
      assert(assets.nftTokenId !== null, `test_user_1 nftTokenId is set (${assets.nftTokenId})`);
      assert(typeof assets.level === "number", `test_user_1 level is number (${assets.level})`);
    } catch (err) {
      assert(false, `lookupNftAssets test_user_1: ${err.message}`);
    }

    // lookupNftAssets for test_user_2 (no NFT)
    try {
      const assets = await lookupNftAssets(testUser2.address);
      assertEq(assets.hasNft, false, "test_user_2 hasNft = false");
      assertEq(assets.nftTokenId, null, "test_user_2 nftTokenId is null");
      assertEq(assets.level, 0, "test_user_2 level = 0");
    } catch (err) {
      assert(false, `lookupNftAssets test_user_2: ${err.message}`);
    }
  } else {
    console.log("  (skipped - test wallets not created yet)");
  }

  // --- NFT Level ---
  console.log("\n5. NFT Level");

  try {
    const level = await getNftLevel(1);
    assertEq(level, 0, "NFT #1 initial level = 0");
  } catch (err) {
    assert(false, `getNftLevel: ${err.message}`);
  }

  // --- Weapon Name ---
  console.log("\n6. Weapon NFT");

  try {
    const name = await getWeaponName(1);
    assert(name.length > 0, `Weapon #1 has name: "${name}"`);
  } catch (err) {
    assert(false, `getWeaponName: ${err.message}`);
  }

  // --- $BATTLE Token ---
  console.log("\n7. $BATTLE Token");

  if (testWallets.length >= 1) {
    try {
      const balance = await getBattleBalance(testWallets[0].address);
      assert(parseFloat(balance) > 0, `test_user_1 $BATTLE balance > 0 (${balance})`);
    } catch (err) {
      assert(false, `$BATTLE balance: ${err.message}`);
    }
  }

  // --- Glacier Data API ---
  console.log("\n8. Glacier Data API");

  if (testWallets.length >= 1) {
    try {
      const nfts = await getErc721Balances(testWallets[0].address, process.env.CHAINBOIS_NFT_ADDRESS);
      assert(nfts.length > 0, `Glacier returns NFTs for test_user_1 (${nfts.length})`);
    } catch (err) {
      assert(false, `Glacier ERC721 query: ${err.message}`);
    }
  }

  // --- Summary ---
  console.log("\n========================================");
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log("========================================");

  if (failures.length > 0) {
    console.log("\nFailed tests:");
    failures.forEach((f) => console.log(`  - ${f}`));
  }

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
};

main().catch((error) => {
  console.error("Test failed:", error);
  process.exit(1);
});
