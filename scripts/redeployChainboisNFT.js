/**
 * Redeploy only the ChainBoisNFT contract (keeps BattleToken + WeaponNFT).
 * After deploy: updates deployments/fuji.json, .env, and ABI.
 *
 * Usage:
 *   npx hardhat run scripts/redeployChainboisNFT.js --network fuji
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const main = async function () {
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();

  console.log(`\nRedeploying ChainBoisNFT on ${network}`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${hre.ethers.formatEther(balance)} AVAX\n`);

  // Deploy
  console.log("Deploying ChainBoisNFT...");
  const ChainBoisNFT = await hre.ethers.getContractFactory("ChainBoisNFT");
  const chainboisNft = await ChainBoisNFT.deploy();
  await chainboisNft.waitForDeployment();
  const newAddress = await chainboisNft.getAddress();
  console.log(`  NEW ChainBoisNFT: ${newAddress}`);

  // Update deployments file
  const deploymentsPath = path.join(__dirname, "..", "deployments", `${network}.json`);
  const deployment = JSON.parse(fs.readFileSync(deploymentsPath, "utf8"));

  const oldAddress = deployment.contracts.ChainBoisNFT;
  if (!deployment.previousContracts) deployment.previousContracts = {};
  deployment.previousContracts.ChainBoisNFT = oldAddress;
  deployment.contracts.ChainBoisNFT = newAddress;
  deployment.deployedAt = new Date().toISOString();
  deployment.redeployReason = "Added emitBatchMetadataUpdate() for hackathon demo";

  fs.writeFileSync(deploymentsPath, JSON.stringify(deployment, null, 2));
  console.log(`  Updated ${deploymentsPath}`);

  // Print .env update
  console.log("\n========================================");
  console.log("Update your .env:");
  console.log("========================================");
  console.log(`CHAINBOIS_NFT_ADDRESS=${newAddress}`);
  console.log(`\n(Old address was: ${oldAddress})`);

  // Print verify command
  console.log("\n========================================");
  console.log("Verify on Snowtrace:");
  console.log("========================================");
  console.log(`npx hardhat verify --network ${network} ${newAddress}`);

  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`\nGas spent: ${hre.ethers.formatEther(balance - finalBalance)} AVAX`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Redeploy failed:", error);
    process.exit(1);
  });
