/**
 * Fix NFT metadata JSON files.
 *
 * Transforms all metadata in assets/nft-collection/metadata/:
 *   - Strip numeric prefix from trait_type ("01_Background" → "Background")
 *   - Replace underscores with spaces in trait values ("Combat_Red" → "Combat Red")
 *   - Fix image URI placeholder with actual IPFS CID
 *   - Add collection, level, badges, inGameStats fields
 *   - Remove compiler field
 *
 * Usage:
 *   node scripts/fixMetadata.js
 */
const fs = require("fs");
const path = require("path");

const METADATA_DIR = path.join(__dirname, "..", "assets", "nft-collection", "metadata");
const IMAGES_CID = "bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4";

const cleanTraitType = function (traitType) {
  // Strip numeric prefix: "01_Background" → "Background"
  const stripped = traitType.replace(/^\d+_/, "");
  // Replace underscores with spaces: "Some_Trait" → "Some Trait"
  return stripped.replace(/_/g, " ");
};

const cleanValue = function (value) {
  if (typeof value !== "string") return value;
  // Replace underscores with spaces: "Combat_Red" → "Combat Red"
  return value.replace(/_/g, " ");
};

const fixMetadataFile = function (filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const metadata = JSON.parse(raw);

  // Fix image URI
  const edition = metadata.edition || path.basename(filePath, ".json");
  metadata.image = `ipfs://${IMAGES_CID}/${edition}.png`;

  // Add game fields
  metadata.collection = "ChainBois Genesis";
  metadata.level = 0;
  metadata.badges = [];
  metadata.inGameStats = { kills: 0, score: 0, gamesPlayed: 0 };

  // Clean attributes
  if (Array.isArray(metadata.attributes)) {
    metadata.attributes = metadata.attributes.map((attr) => ({
      trait_type: cleanTraitType(attr.trait_type),
      value: cleanValue(attr.value),
    }));

    // Remove any existing game stat attributes (to avoid duplicates on re-run)
    const gameStatTypes = ["Level", "Rank", "Kills", "Score", "Games Played"];
    metadata.attributes = metadata.attributes.filter(
      (attr) => !gameStatTypes.includes(attr.trait_type)
    );

    // Add game stats to attributes array so explorers can index them
    metadata.attributes.push(
      { trait_type: "Level", value: 0, display_type: "number", max_value: 7 },
      { trait_type: "Rank", value: "Private" },
      { trait_type: "Kills", value: 0, display_type: "number" },
      { trait_type: "Score", value: 0, display_type: "number" },
      { trait_type: "Games Played", value: 0, display_type: "number" }
    );
  }

  // Remove compiler field
  delete metadata.compiler;

  // Reorder fields for cleanliness
  const ordered = {
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    collection: metadata.collection,
    level: metadata.level,
    badges: metadata.badges,
    inGameStats: metadata.inGameStats,
    dna: metadata.dna,
    edition: metadata.edition,
    date: metadata.date,
    attributes: metadata.attributes,
  };

  fs.writeFileSync(filePath, JSON.stringify(ordered, null, 2));
  return ordered;
};

const main = function () {
  if (!fs.existsSync(METADATA_DIR)) {
    console.error(`Metadata directory not found: ${METADATA_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(METADATA_DIR).filter((f) => f.endsWith(".json") && f !== "_metadata.json");
  console.log(`Found ${files.length} metadata files to fix.\n`);

  let fixed = 0;
  for (const fileName of files) {
    const filePath = path.join(METADATA_DIR, fileName);
    const result = fixMetadataFile(filePath);
    fixed++;

    // Show first file as sample
    if (fixed === 1) {
      console.log("Sample output (first file):");
      console.log(JSON.stringify(result, null, 2));
      console.log();
    }
  }

  console.log(`Fixed ${fixed} metadata files.`);
  console.log(`\nChanges applied:`);
  console.log(`  - Stripped numeric prefixes from trait_type`);
  console.log(`  - Replaced underscores with spaces in values`);
  console.log(`  - Fixed image URIs with CID: ${IMAGES_CID}`);
  console.log(`  - Added collection, level, badges, inGameStats`);
  console.log(`  - Added Level, Rank, Kills, Score, Games Played to attributes array`);
  console.log(`  - Removed compiler field`);
};

main();
