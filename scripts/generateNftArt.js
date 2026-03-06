/**
 * Generate NFT art using HashLips art engine.
 *
 * Usage:
 *   node scripts/generateNftArt.js <traits-zip> [count]
 *
 * Example:
 *   node scripts/generateNftArt.js /tmp/traits.zip 20        # testnet
 *   node scripts/generateNftArt.js /tmp/traits.zip 4032      # mainnet
 *
 * Prerequisites:
 *   - User SCP's traits zip to server
 *   - Git must be installed (to clone HashLips)
 *   - canvas npm package (installed by HashLips)
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const NFT_GEN_DIR = path.join(__dirname, "..", "nft-generation");
const BUILD_DIR = path.join(__dirname, "..", "build", "chainbois");

const main = async function () {
  const traitsZip = process.argv[2];
  const count = parseInt(process.argv[3]) || 20;

  if (!traitsZip) {
    console.error("Usage: node scripts/generateNftArt.js <traits-zip> [count]");
    console.error("  traits-zip: Path to zipped traits folder");
    console.error("  count: Number of NFTs to generate (default: 20)");
    process.exit(1);
  }

  if (!fs.existsSync(traitsZip)) {
    console.error(`Traits zip not found: ${traitsZip}`);
    process.exit(1);
  }

  console.log(`Generating ${count} NFTs from ${traitsZip}\n`);

  // 1. Clone HashLips if not present
  if (!fs.existsSync(path.join(NFT_GEN_DIR, "index.js"))) {
    console.log("Cloning HashLips art engine...");
    execSync(`git clone https://github.com/HashLips/hashlips_art_engine.git ${NFT_GEN_DIR}`, {
      stdio: "inherit",
    });
    console.log("Installing HashLips dependencies...");
    execSync("npm install", { cwd: NFT_GEN_DIR, stdio: "inherit" });
  } else {
    console.log("HashLips art engine already present.");
  }

  // 2. Extract traits to layers/
  const layersDir = path.join(NFT_GEN_DIR, "layers");
  if (fs.existsSync(layersDir)) {
    fs.rmSync(layersDir, { recursive: true });
  }
  fs.mkdirSync(layersDir, { recursive: true });

  console.log("Extracting traits...");
  execSync(`unzip -o "${traitsZip}" -d "${layersDir}"`, { stdio: "inherit" });

  // Auto-detect layer folders (skip hidden files, sort alphabetically)
  const layerFolders = fs.readdirSync(layersDir)
    .filter((f) => !f.startsWith(".") && fs.statSync(path.join(layersDir, f)).isDirectory())
    .sort();

  if (layerFolders.length === 0) {
    // Check if zip had a wrapper directory
    const wrapperContents = fs.readdirSync(layersDir);
    if (wrapperContents.length === 1 && fs.statSync(path.join(layersDir, wrapperContents[0])).isDirectory()) {
      const wrapperDir = path.join(layersDir, wrapperContents[0]);
      const innerFolders = fs.readdirSync(wrapperDir);
      for (const f of innerFolders) {
        fs.renameSync(path.join(wrapperDir, f), path.join(layersDir, f));
      }
      fs.rmdirSync(wrapperDir);
    }
  }

  const finalLayers = fs.readdirSync(layersDir)
    .filter((f) => !f.startsWith(".") && fs.statSync(path.join(layersDir, f)).isDirectory())
    .sort();

  console.log(`\nDetected ${finalLayers.length} layers:`);
  finalLayers.forEach((l, i) => console.log(`  ${i + 1}. ${l}`));

  if (finalLayers.length === 0) {
    console.error("No layer folders found in traits zip!");
    process.exit(1);
  }

  // 3. Configure HashLips
  const layersOrder = finalLayers.map((name) => `    { name: "${name}" }`).join(",\n");

  const configContent = `"use strict";

const path = require("path");
const isLocal = typeof process.pkg === "undefined";
const basePath = isLocal ? process.cwd() : path.dirname(process.execPath);
const { MODE } = require(path.join(basePath, "constants/blend_mode.js"));
const { NETWORK } = require(path.join(basePath, "constants/network.js"));

const network = NETWORK.eth;

const namePrefix = "ChainBoi";
const description = "ChainBois Genesis Collection";
const baseUri = "ipfs://PLACEHOLDER_CID";

const solanaMetadata = {
  symbol: "CBOI",
  seller_fee_basis_points: 500,
  external_url: "",
  creators: [],
};

const layerConfigurations = [
  {
    growEditionSizeTo: ${count},
    layersOrder: [
${layersOrder}
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 1024,
  height: 1024,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {
  collection: "ChainBois Genesis",
  level: 0,
  badges: [],
  inGameStats: { kills: 0, score: 0, gamesPlayed: 0 },
};

const rarityDelimiter = "#";

const uniqueDnaTor498 = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC",
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTor498,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};
`;

  const configPath = path.join(NFT_GEN_DIR, "src", "config.js");
  fs.writeFileSync(configPath, configContent);
  console.log("\nHashLips config written.");

  // 4. Run HashLips
  console.log("\nGenerating NFT art...");
  execSync("node index.js", { cwd: NFT_GEN_DIR, stdio: "inherit" });

  // 5. Copy output to build/chainbois/
  const hlBuildImages = path.join(NFT_GEN_DIR, "build", "images");
  const hlBuildJson = path.join(NFT_GEN_DIR, "build", "json");

  if (!fs.existsSync(hlBuildImages) || !fs.existsSync(hlBuildJson)) {
    console.error("HashLips build output not found!");
    process.exit(1);
  }

  const buildImages = path.join(BUILD_DIR, "images");
  const buildJson = path.join(BUILD_DIR, "json");
  fs.mkdirSync(buildImages, { recursive: true });
  fs.mkdirSync(buildJson, { recursive: true });

  // Copy images
  for (const f of fs.readdirSync(hlBuildImages)) {
    fs.copyFileSync(path.join(hlBuildImages, f), path.join(buildImages, f));
  }

  // Copy, clean, and verify JSON metadata
  const jsonFiles = fs.readdirSync(hlBuildJson).filter((f) => f !== "_metadata.json");
  for (const f of jsonFiles) {
    fs.copyFileSync(path.join(hlBuildJson, f), path.join(buildJson, f));
  }

  // Post-process metadata: clean trait names and inject game fields
  console.log("\nPost-processing metadata...");
  for (const f of jsonFiles) {
    const filePath = path.join(buildJson, f);
    const metadata = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Clean trait names (HashLips uses folder names like "01_Background")
    if (Array.isArray(metadata.attributes)) {
      metadata.attributes = metadata.attributes.map((attr) => ({
        trait_type: attr.trait_type.replace(/^\d+_/, "").replace(/_/g, " "),
        value: typeof attr.value === "string" ? attr.value.replace(/_/g, " ") : attr.value,
      }));
    }

    // Inject game fields if HashLips didn't include them
    if (!metadata.collection) metadata.collection = "ChainBois Genesis";
    if (metadata.level === undefined) metadata.level = 0;
    if (!metadata.badges) metadata.badges = [];
    if (!metadata.inGameStats) metadata.inGameStats = { kills: 0, score: 0, gamesPlayed: 0 };

    // Add game stats to attributes array so explorers can index them
    const gameStatTypes = ["Level", "Rank", "Kills", "Score", "Games Played"];
    metadata.attributes = metadata.attributes.filter(
      (attr) => !gameStatTypes.includes(attr.trait_type)
    );
    metadata.attributes.push(
      { trait_type: "Level", value: 0, display_type: "number", max_value: 7 },
      { trait_type: "Rank", value: "Private" },
      { trait_type: "Kills", value: 0, display_type: "number" },
      { trait_type: "Score", value: 0, display_type: "number" },
      { trait_type: "Games Played", value: 0, display_type: "number" }
    );

    // Remove compiler field
    delete metadata.compiler;

    fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  }
  console.log(`Post-processed ${jsonFiles.length} metadata files.`);

  const imageCount = fs.readdirSync(buildImages).length;
  const jsonCount = jsonFiles.length;

  console.log(`\n========================================`);
  console.log(`Generation Complete`);
  console.log(`========================================`);
  console.log(`  Images: ${imageCount} → ${buildImages}`);
  console.log(`  Metadata: ${jsonCount} → ${buildJson}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review generated art in build/chainbois/images/`);
  console.log(`  2. Run: node scripts/uploadToIpfs.js chainbois`);
};

main().catch((error) => {
  console.error("Generation failed:", error);
  process.exit(1);
});
