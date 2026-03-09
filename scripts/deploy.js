/**
 * Deploy all 3 contracts to the configured network.
 *
 * Usage:
 *   npx hardhat run scripts/deploy.js --network fuji
 *   npx hardhat run scripts/deploy.js --network mainnet
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const main = async function () {
  const network = hre.network.name;
  const chainId = hre.network.config.chainId;
  const [deployer] = await hre.ethers.getSigners();

  console.log(`\nDeploying contracts to ${network} (chainId: ${chainId})`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${hre.ethers.formatEther(balance)} AVAX\n`);

  // 1. Deploy BattleToken (capped at 10M)
  console.log("Deploying BattleToken...");
  const BATTLE_TOKEN_CAP = hre.ethers.parseEther("10000000"); // 10 million BATTLE
  const BattleToken = await hre.ethers.getContractFactory("BattleToken");
  const battleToken = await BattleToken.deploy(BATTLE_TOKEN_CAP);
  await battleToken.waitForDeployment();
  const battleTokenAddress = await battleToken.getAddress();
  console.log(`  BattleToken deployed: ${battleTokenAddress}`);

  // 2. Deploy ChainBoisNFT
  console.log("Deploying ChainBoisNFT...");
  const ChainBoisNFT = await hre.ethers.getContractFactory("ChainBoisNFT");
  const chainboisNft = await ChainBoisNFT.deploy();
  await chainboisNft.waitForDeployment();
  const chainboisNftAddress = await chainboisNft.getAddress();
  console.log(`  ChainBoisNFT deployed: ${chainboisNftAddress}`);

  // 3. Deploy WeaponNFT
  console.log("Deploying WeaponNFT...");
  const WeaponNFT = await hre.ethers.getContractFactory("WeaponNFT");
  const weaponNft = await WeaponNFT.deploy();
  await weaponNft.waitForDeployment();
  const weaponNftAddress = await weaponNft.getAddress();
  console.log(`  WeaponNFT deployed: ${weaponNftAddress}`);

  // Save deployment info
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deployment = {
    network,
    chainId,
    deployer: deployer.address,
    contracts: {
      BattleToken: battleTokenAddress,
      ChainBoisNFT: chainboisNftAddress,
      WeaponNFT: weaponNftAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(deployment, null, 2));
  console.log(`\nDeployment saved to ${outputPath}`);

  // Print .env values for user to copy
  console.log("\n========================================");
  console.log("Add these to your .env file:");
  console.log("========================================");
  console.log(`BATTLE_TOKEN_ADDRESS=${battleTokenAddress}`);
  console.log(`CHAINBOIS_NFT_ADDRESS=${chainboisNftAddress}`);
  console.log(`WEAPON_NFT_ADDRESS=${weaponNftAddress}`);

  // Print verification commands
  console.log("\n========================================");
  console.log("Verify contracts on Snowtrace:");
  console.log("========================================");
  console.log(`npx hardhat verify --network ${network} ${battleTokenAddress}`);
  console.log(`npx hardhat verify --network ${network} ${chainboisNftAddress}`);
  console.log(`npx hardhat verify --network ${network} ${weaponNftAddress}`);

  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  const spent = balance - finalBalance;
  console.log(`\nGas spent: ${hre.ethers.formatEther(spent)} AVAX`);
  console.log(`Remaining: ${hre.ethers.formatEther(finalBalance)} AVAX`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
