/**
 * Redeploy BattleToken with ERC20Capped and mint initial supply.
 *
 * Usage:
 *   npx hardhat run scripts/redeployBattleToken.js --network fuji
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const BATTLE_TOKEN_CAP = hre.ethers.parseEther("10000000"); // 10M cap
const INITIAL_MINT = hre.ethers.parseEther("10000000"); // Mint full cap to deployer

const main = async function () {
  const network = hre.network.name;
  const [deployer] = await hre.ethers.getSigners();

  console.log(`\nRedeploying BattleToken to ${network}`);
  console.log(`Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${hre.ethers.formatEther(balance)} AVAX\n`);

  // Deploy new BattleToken with cap
  console.log("Deploying BattleToken (ERC20Capped, 10M cap)...");
  const BattleToken = await hre.ethers.getContractFactory("BattleToken");
  const battleToken = await BattleToken.deploy(BATTLE_TOKEN_CAP);
  await battleToken.waitForDeployment();
  const newAddress = await battleToken.getAddress();
  console.log(`  BattleToken deployed: ${newAddress}`);

  // Verify cap
  const cap = await battleToken.cap();
  console.log(`  Cap: ${hre.ethers.formatEther(cap)} BATTLE`);

  // Mint full supply to deployer (will transfer to rewards wallet via app script)
  console.log(`\nMinting ${hre.ethers.formatEther(INITIAL_MINT)} BATTLE to deployer...`);
  const mintTx = await battleToken.mint(deployer.address, INITIAL_MINT);
  await mintTx.wait();
  console.log(`  Minted. Tx: ${mintTx.hash}`);

  // Verify supply
  const totalSupply = await battleToken.totalSupply();
  console.log(`  Total supply: ${hre.ethers.formatEther(totalSupply)} BATTLE`);
  console.log(`  Cap reached: ${totalSupply === cap}`);

  // Update fuji.json
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  const deploymentPath = path.join(deploymentsDir, `${network}.json`);

  if (fs.existsSync(deploymentPath)) {
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
    deployment.contracts.BattleToken = newAddress;
    deployment.battleTokenRedeployedAt = new Date().toISOString();
    deployment.battleTokenCap = "10000000";
    fs.writeFileSync(deploymentPath, JSON.stringify(deployment, null, 2));
    console.log(`\nUpdated ${deploymentPath}`);
  }

  console.log("\n========================================");
  console.log("Update your .env file:");
  console.log("========================================");
  console.log(`BATTLE_TOKEN_ADDRESS=${newAddress}`);

  const finalBalance = await hre.ethers.provider.getBalance(deployer.address);
  const spent = balance - finalBalance;
  console.log(`\nGas spent: ${hre.ethers.formatEther(spent)} AVAX`);
  console.log(`Remaining: ${hre.ethers.formatEther(finalBalance)} AVAX`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Redeployment failed:", error);
    process.exit(1);
  });
