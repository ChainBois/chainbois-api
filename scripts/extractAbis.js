/**
 * Extract ABIs from Hardhat compilation artifacts to abis/ directory.
 * Run after `npx hardhat compile`:
 *   node scripts/extractAbis.js
 */
const fs = require("fs");
const path = require("path");

const CONTRACTS = ["BattleToken", "ChainBoisNFT", "WeaponNFT"];
const ARTIFACTS_DIR = path.join(__dirname, "..", "artifacts", "contracts");
const OUTPUT_DIR = path.join(__dirname, "..", "abis");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let extracted = 0;

for (const name of CONTRACTS) {
  const artifactPath = path.join(ARTIFACTS_DIR, `${name}.sol`, `${name}.json`);

  if (!fs.existsSync(artifactPath)) {
    console.error(`Artifact not found: ${artifactPath}`);
    console.error("Run 'npx hardhat compile' first.");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const output = {
    contractName: name,
    abi: artifact.abi,
  };

  const outputPath = path.join(OUTPUT_DIR, `${name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Extracted ${name} ABI → ${outputPath} (${artifact.abi.length} entries)`);
  extracted++;
}

console.log(`\nDone: ${extracted} ABIs extracted to abis/`);
