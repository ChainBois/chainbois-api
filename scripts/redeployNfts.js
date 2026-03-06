/**
 * Redeploy ChainBoisNFT and WeaponNFT contracts with EIP-4906 support.
 * BattleToken is NOT redeployed (stays at existing address).
 *
 * Usage:
 *   npx hardhat run scripts/redeployNfts.js --network fuji
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const main = async function () {
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;
  const [deployer] = await hre.ethers.getSigners();

  console.log(`\nRedeploying NFT contracts to ${network} (chainId: ${chainId})`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} AVAX\n`);

  // Load existing deployment for BattleToken address
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const existingPath = path.join(deploymentsDir, `${network}.json`);
  const existing = JSON.parse(fs.readFileSync(existingPath, "utf8"));
  console.log(`Keeping BattleToken at: ${existing.contracts.BattleToken}`);
  console.log(`Old ChainBoisNFT: ${existing.contracts.ChainBoisNFT}`);
  console.log(`Old WeaponNFT: ${existing.contracts.WeaponNFT}\n`);

  // 1. Deploy new ChainBoisNFT
  console.log("Deploying ChainBoisNFT (with EIP-4906)...");
  const ChainBoisNFT = await hre.ethers.getContractFactory("ChainBoisNFT");
  const chainboisNft = await ChainBoisNFT.deploy();
  await chainboisNft.waitForDeployment();
  const chainboisNftAddress = await chainboisNft.getAddress();
  console.log(`  ChainBoisNFT deployed: ${chainboisNftAddress}`);

  // Verify EIP-4906 support
  const supports4906 = await chainboisNft.supportsInterface("0x49064906");
  console.log(`  EIP-4906 supported: ${supports4906}`);

  // 2. Deploy new WeaponNFT
  console.log("Deploying WeaponNFT (with EIP-4906)...");
  const WeaponNFT = await hre.ethers.getContractFactory("WeaponNFT");
  const weaponNft = await WeaponNFT.deploy();
  await weaponNft.waitForDeployment();
  const weaponNftAddress = await weaponNft.getAddress();
  console.log(`  WeaponNFT deployed: ${weaponNftAddress}`);

  const supports4906w = await weaponNft.supportsInterface("0x49064906");
  console.log(`  EIP-4906 supported: ${supports4906w}`);

  // Save updated deployment info
  const deployment = {
    network,
    chainId,
    deployer: deployer.address,
    contracts: {
      BattleToken: existing.contracts.BattleToken,
      ChainBoisNFT: chainboisNftAddress,
      WeaponNFT: weaponNftAddress,
    },
    previousContracts: {
      ChainBoisNFT: existing.contracts.ChainBoisNFT,
      WeaponNFT: existing.contracts.WeaponNFT,
    },
    deployedAt: new Date().toISOString(),
    redeployReason: "Added EIP-4906 (MetadataUpdate events) for explorer metadata refresh",
  };

  fs.writeFileSync(existingPath, JSON.stringify(deployment, null, 2));
  console.log(`\nDeployment saved to ${existingPath}`);

  console.log("\n========================================");
  console.log("Update your .env file:");
  console.log("========================================");
  console.log(`CHAINBOIS_NFT_ADDRESS=${chainboisNftAddress}`);
  console.log(`WEAPON_NFT_ADDRESS=${weaponNftAddress}`);
  console.log(`# BattleToken unchanged: ${existing.contracts.BattleToken}`);

  console.log("\n========================================");
  console.log("Next steps:");
  console.log("========================================");
  console.log("1. Update .env with new addresses above");
  console.log("2. Run: node scripts/mintChainbois.js 50");
  console.log("3. Run: node scripts/mintWeapons.js");
  console.log("4. Run: node scripts/reuploadMetadata.js --set-base-uri");
  console.log("5. Run: node scripts/syncNftsToMongo.js");

  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  const spent = balance - finalBalance;
  console.log(`\nGas spent: ${hre.ethers.formatEther(spent)} AVAX`);
  console.log(`Remaining: ${hre.ethers.formatEther(finalBalance)} AVAX`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Redeploy failed:", error);
    process.exit(1);
  });
