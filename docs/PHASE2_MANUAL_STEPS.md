# Phase 2: Smart Contracts & NFTs - Manual Execution Guide

This document covers **every manual step** required to deploy contracts, generate NFT art, upload to IPFS, mint tokens, and verify the full pipeline. Follow these steps in order.

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node -v`)
- [ ] MongoDB running locally or Atlas URI ready
- [ ] `.env` file configured (see below)
- [ ] Firebase project set up with service account JSON file at `config/chainbois-firebase-config.json`
- [ ] Avalanche testnet faucet access: https://faucet.avax.network/
- [ ] Pinata account: https://app.pinata.cloud/ (free tier works for testnet)
- [ ] Your **trait layer images** ready (see Section 3 for format requirements)
- [ ] Your **weapon images** ready (see Section 4 for format requirements)

---

## Step 1: Environment Setup

### 1.1 Ensure `.env` Has These Variables

```env
# === Server ===
PORT=5000
NODE_ENV=development

# === MongoDB ===
MONGODB_URI=mongodb://localhost:27017/chainbois_testnet
MONGODB_URI_PROD=mongodb://localhost:27017/chainbois_mainnet
NETWORK=dev

# === Avalanche (Fuji Testnet) ===
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43113
AVAX_DATA_API_URL=https://data-api.avax.network

# === Firebase Admin ===
# Credentials loaded from config/chainbois-firebase-config.json (see Step 1.4)
# Only the database URL is needed as an env var:
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# === Wallet Encryption ===
ALGORITHM=aes-256-cbc
KEY=<generate-below>

# === IPFS (Pinata) ===
PINATA_JWT=<get-from-pinata-dashboard>

# === Contract Addresses (filled after deployment) ===
BATTLE_TOKEN_ADDRESS=
CHAINBOIS_NFT_ADDRESS=
WEAPON_NFT_ADDRESS=

# === Deployer Key (filled after wallet generation) ===
DEPLOYER_PRIVATE_KEY=

# === Discord (optional) ===
DISCORD_WEBHOOK_URL=
```

### 1.2 Generate Encryption Key (if not already done)

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the 64-character hex string to `KEY=` in `.env`.

### 1.3 Get Pinata JWT

1. Go to https://app.pinata.cloud/developers/api-keys
2. Click "New Key"
3. Enable permissions: `pinFileToIPFS`, `pinJSONToIPFS`
4. Copy the JWT token to `PINATA_JWT=` in `.env`

The free Pinata plan gives you 500 uploads and 1GB storage - plenty for testnet.

### 1.4 Firebase Service Account JSON

The backend loads Firebase Admin credentials from a JSON file (NOT env vars).

1. Go to [Firebase Console](https://console.firebase.google.com) → your project
2. Project Settings → Service Accounts → Generate New Private Key
3. Save the downloaded JSON file as `config/chainbois-firebase-config.json`
4. Ensure `FIREBASE_DATABASE_URL` is set in `.env` (the only Firebase env var needed)

---

## Step 2: Generate Platform Wallets

This creates 4 encrypted wallets in MongoDB: `deployer`, `nft_store`, `weapon_store`, `prize_pool`.

```bash
node scripts/generateWallets.js
```

**What happens:**
- Generates 4 random Ethereum wallets using ethers.js
- Encrypts each private key with AES-256-CBC
- Stores encrypted keys in MongoDB `wallets` collection
- Prints the deployer private key **one time only**

**You must do:**
1. Copy the `DEPLOYER_PRIVATE_KEY=0x...` line to your `.env`
2. Note the deployer address (you'll fund it next)

**Output example:**
```
Connected to MongoDB

[deployer] Created: 0xAbC123...
  *** IMPORTANT: Copy this deployer private key to your .env ***
  DEPLOYER_PRIVATE_KEY=0x1234abcd...
  *** This is the only time this key will be displayed ***

[nft_store] Created: 0xDeF456...
[weapon_store] Created: 0x789Ghi...
[prize_pool] Created: 0xJkl012...
```

**Idempotent:** Running again skips existing wallets.

---

## Step 3: Fund the Deployer Wallet

The deployer wallet needs AVAX for gas to deploy contracts and mint NFTs.

### For Testnet (Fuji):

1. Go to https://faucet.avax.network/
2. Select "Fuji (C-Chain)"
3. Paste your deployer address
4. Request 2 AVAX (you may need to request twice - faucet gives ~2 AVAX per request)
5. Wait ~10 seconds for the transaction to confirm

**Estimated AVAX needed for testnet:**

| Operation                     | AVAX Cost |
|-------------------------------|-----------|
| Deploy 3 contracts            | ~0.15     |
| Set baseURI (2 contracts)     | ~0.01     |
| Mint 20 ChainBoi NFTs         | ~0.06     |
| Mint ~10 Weapon NFTs          | ~0.04     |
| Mint $BATTLE to test wallets  | ~0.01     |
| Fund 3 test wallets (1 each)  | 3.00      |
| Transfer NFTs to test users   | ~0.01     |
| **Total**                     | **~3.3**  |

Request 4 AVAX from the faucet to have some buffer.

### Verify Funding:

```bash
node -e "
require('dotenv').config();
const { getAvaxBalance } = require('./utils/avaxUtils');
// Use the deployer address printed above:
getAvaxBalance('0xYourDeployerAddress').then(b => console.log('Balance:', b, 'AVAX'));
"
```

---

## Step 4: Deploy Smart Contracts

```bash
npx hardhat run scripts/deploy.js --network fuji
```

**What happens:**
- Deploys BattleToken (ERC-20), ChainBoisNFT (ERC-721), WeaponNFT (ERC-721)
- Each contract takes ~10-20 seconds to deploy
- Saves addresses to `deployments/fuji.json`

**Output example:**
```
Deploying contracts to fuji (chainId: 43113)
Deployer: 0xAbC123...
Deployer balance: 3.98 AVAX

Deploying BattleToken...
  BattleToken deployed: 0x1111...
Deploying ChainBoisNFT...
  ChainBoisNFT deployed: 0x2222...
Deploying WeaponNFT...
  WeaponNFT deployed: 0x3333...

========================================
Add these to your .env file:
========================================
BATTLE_TOKEN_ADDRESS=0x1111...
CHAINBOIS_NFT_ADDRESS=0x2222...
WEAPON_NFT_ADDRESS=0x3333...

========================================
Verify contracts on Snowtrace:
========================================
npx hardhat verify --network fuji 0x1111...
npx hardhat verify --network fuji 0x2222...
npx hardhat verify --network fuji 0x3333...

Gas spent: 0.14 AVAX
Remaining: 3.84 AVAX
```

**You must do:**
1. Copy the 3 contract addresses to your `.env`
2. (Optional) Run the verify commands to verify contracts on Snowtrace

### Verify Contracts on Snowtrace (Optional)

```bash
npx hardhat verify --network fuji 0x1111...
npx hardhat verify --network fuji 0x2222...
npx hardhat verify --network fuji 0x3333...
```

This makes the contract source code readable on https://testnet.snowtrace.io/. Not required for functionality but useful for debugging and transparency.

---

## Step 5: Prepare NFT Trait Images

### What You Need to Provide

A **zip file** containing folders of layered trait images. Each folder is one "layer" (e.g., background, body, eyes, mouth, accessory). Inside each folder, individual PNG images represent the trait variations.

### Required Format

```
traits.zip
└── (extract to)
    ├── 01_Background/
    │   ├── Blue#50.png          ← "#50" = 50% rarity weight
    │   ├── Red#30.png           ← "#30" = 30% rarity weight
    │   ├── Gold#10.png
    │   └── Purple#10.png
    ├── 02_Body/
    │   ├── Default#60.png
    │   ├── Armored#25.png
    │   └── Golden#15.png
    ├── 03_Eyes/
    │   ├── Normal#50.png
    │   ├── Laser#20.png
    │   ├── Cyber#20.png
    │   └── Ghost#10.png
    ├── 04_Mouth/
    │   ├── Smile#40.png
    │   ├── Grin#30.png
    │   └── Mask#30.png
    └── 05_Accessory/
        ├── None#50.png
        ├── Hat#25.png
        ├── Crown#15.png
        └── Headband#10.png
```

### Rules

1. **Folder naming**: Prefix with numbers for ordering (e.g., `01_`, `02_`). Folders are sorted alphabetically, so numbering ensures correct layer order.
2. **Layer stacking**: First folder = bottom layer (background), last folder = top layer (accessory). Images are composited in folder order.
3. **Image dimensions**: All PNGs should be the **same dimensions** (recommended: 1024x1024). The script generates at 1024x1024.
4. **Transparency**: Use transparent PNG for layers that don't cover the full canvas.
5. **Rarity weights**: Append `#weight` to the filename before `.png`. Higher weight = more common. If no `#`, all traits in that layer have equal probability.
6. **File format**: PNG only. No JPEG, SVG, or other formats.
7. **Wrapper directory OK**: If the zip extracts to a single wrapper directory (e.g., `traits/01_Background/...`), the script auto-detects and flattens it.

### How Many Unique Combinations?

For testnet, we mint 20 NFTs. For mainnet, 4,032 NFTs.

**Minimum traits needed** for 4,032 unique combinations:
- With 5 layers of 4 traits each: 4^5 = 1,024 combinations (not enough)
- With 5 layers of 5 traits each: 5^5 = 3,125 (borderline)
- With 5 layers of 6 traits each: 6^5 = 7,776 (plenty)
- With 6 layers of 4 traits each: 4^6 = 4,096 (just enough)

**Recommendation**: 5-7 layers with 4-8 traits each.

### How to Upload Traits to the Server

```bash
# From your local machine:
scp traits.zip user@your-server-ip:/tmp/traits.zip
```

Or if you're working locally, just note the path to the zip file.

---

## Step 6: Generate NFT Art with HashLips

```bash
node scripts/generateNftArt.js /tmp/traits.zip 20
```

Arguments:
- First argument: path to your traits zip
- Second argument: number of NFTs to generate (default: 20 for testnet, use 4032 for mainnet)

**What happens behind the scenes:**

1. **Clones HashLips Art Engine** to `nft-generation/` directory (first run only). HashLips is the industry-standard open-source tool for generative PFP collections.

2. **Extracts your traits zip** to `nft-generation/layers/`. Auto-detects layer folders, handles wrapper directories.

3. **Configures HashLips** by writing `nft-generation/src/config.js`:
   - Sets `namePrefix` to "ChainBoi"
   - Sets `description` to "ChainBois Genesis Collection"
   - Sets `growEditionSizeTo` to your count
   - Auto-maps your layer folders to `layersOrder`
   - Adds `extraMetadata` with game fields: `{ level: 0, badges: [], inGameStats: { kills: 0, score: 0, gamesPlayed: 0 } }`
   - Image format: 1024x1024 PNG
   - Editions start at 1 (not 0)

4. **Runs HashLips** (`node index.js` in the engine directory). This:
   - Combines random traits from each layer
   - Ensures DNA uniqueness (no duplicate combinations)
   - Generates PNG images (`1.png`, `2.png`, ..., `20.png`)
   - Generates JSON metadata (`1.json`, `2.json`, ..., `20.json`)

5. **Copies output** to `build/chainbois/images/` and `build/chainbois/json/`

**Output:**
```
Generating 20 NFTs from /tmp/traits.zip

HashLips art engine already present.
Extracting traits...

Detected 5 layers:
  1. 01_Background
  2. 02_Body
  3. 03_Eyes
  4. 04_Mouth
  5. 05_Accessory

HashLips config written.

Generating NFT art...
[HashLips output: DNA generation, image compositing...]

========================================
Generation Complete
========================================
  Images: 20 → build/chainbois/images
  Metadata: 20 → build/chainbois/json

Next steps:
  1. Review generated art in build/chainbois/images/
  2. Run: node scripts/uploadToIpfs.js chainbois
```

### Review the Output

Before uploading to IPFS, review the generated art:

```bash
# Check image count
ls build/chainbois/images/ | wc -l

# Check a metadata file
cat build/chainbois/json/1.json
```

**Example metadata (before IPFS upload):**
```json
{
  "name": "ChainBoi #1",
  "description": "ChainBois Genesis Collection",
  "image": "ipfs://PLACEHOLDER_CID/1.png",
  "dna": "8a3b7c4d...",
  "edition": 1,
  "date": 1709472000000,
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Body", "value": "Default" },
    { "trait_type": "Eyes", "value": "Laser" },
    { "trait_type": "Mouth", "value": "Grin" },
    { "trait_type": "Accessory", "value": "Crown" }
  ],
  "collection": "ChainBois Genesis",
  "level": 0,
  "badges": [],
  "inGameStats": {
    "kills": 0,
    "score": 0,
    "gamesPlayed": 0
  }
}
```

### Re-generate If Needed

If you're not happy with the output, you can re-run with different traits or count:

```bash
node scripts/generateNftArt.js /tmp/different-traits.zip 20
```

This overwrites the previous output in `build/chainbois/`.

---

## Step 7: Prepare Weapon Images

### What You Need to Provide

A **zip file** containing one image per weapon. The filename (without extension) becomes the weapon name stored on-chain.

### Required Format

```
weapons.zip
└── (extract to)
    ├── AK-47.png
    ├── M4A1.png
    ├── Sniper-Rifle.png
    ├── Rocket-Launcher.png
    ├── Flamethrower.png
    ├── Crossbow.png
    ├── Katana.png
    └── Plasma-Gun.png
```

### Rules

1. **Filename = Weapon Name**: `AK-47.png` → weapon name stored on-chain is "AK-47"
2. **Image format**: PNG, JPG, or WEBP supported
3. **Recommended dimensions**: 512x512 or 1024x1024 (consistent size)
4. **No numbering needed**: The script assigns token IDs 1, 2, 3... in alphabetical order
5. **Wrapper directory OK**: If the zip extracts to a wrapper folder, it's auto-flattened

### How Many Weapons?

Entirely up to you. Typical range: 5-30 weapons. Each weapon is a separate NFT that can be traded.

These are the **premium weapons** that NFT holders can purchase (Phases 5+). The 4 base weapons (Pistol, Knife, Shotgun, SMG) are available to all players and are NOT NFTs.

### Upload to Server

```bash
scp weapons.zip user@your-server-ip:/tmp/weapons.zip
```

---

## Step 8: Upload Everything to IPFS

### 8.1 Upload ChainBoi Collection

```bash
node scripts/uploadToIpfs.js chainbois
```

**What happens:**

1. Reads images from `build/chainbois/images/`
2. Uploads all images as a directory to Pinata IPFS → gets `imagesCid`
3. Updates each metadata JSON: replaces placeholder image URL with `ipfs://{imagesCid}/{edition}.png`
4. Uploads all metadata JSONs as a directory to Pinata IPFS → gets `metadataCid`
5. Saves CID info to `deployments/fuji-ipfs-chainbois.json`

**Output:**
```
--- Uploading ChainBoi images ---
Uploading 20 files from build/chainbois/images...
Uploaded: ipfs://QmABC123.../

Updating metadata with image URIs...
Updated 20 metadata files.

--- Uploading ChainBoi metadata ---
Uploading 20 files from build/chainbois/json...
Uploaded: ipfs://QmDEF456.../

========================================
ChainBois IPFS Upload Complete
========================================
  Images CID:   QmABC123...
  Metadata CID: QmDEF456...
  Base URI:     ipfs://QmDEF456.../
  Saved to:     deployments/fuji-ipfs-chainbois.json

Next: Set baseURI on contract:
  The mintChainbois.js script will do this automatically.
```

### 8.2 Upload Weapon Collection

```bash
node scripts/uploadToIpfs.js weapons /tmp/weapons.zip
```

**What happens:**

1. Extracts weapon images from zip
2. Uploads images to Pinata → gets `imagesCid`
3. Auto-creates metadata JSON for each weapon (with name, description, image URI, attributes)
4. Uploads metadata to Pinata → gets `metadataCid`
5. Saves info including weapon names to `deployments/fuji-ipfs-weapons.json`

**Generated weapon metadata example (`1.json`):**
```json
{
  "name": "Weapon #1 - AK-47",
  "description": "ChainBois Weapon: AK-47",
  "image": "ipfs://QmGHI789.../AK-47.png",
  "attributes": [
    { "trait_type": "Weapon Name", "value": "AK-47" }
  ]
}
```

---

## Step 9: Mint NFTs

### 9.1 Mint ChainBoi NFTs

```bash
node scripts/mintChainbois.js 20
```

**What happens:**

1. Connects to MongoDB, loads deployer + nft_store wallets
2. Checks current on-chain supply (skips already-minted)
3. Sets `baseURI` on the contract from IPFS deployment info
4. Mints `count` NFTs to the `nft_store` wallet in batches of 20
5. Each mint: deployer calls `contract.mint(nftStoreAddress)`, which assigns the next tokenId
6. Saves progress after every mint to `deployments/mint-session-chainbois.json`
7. On failure: logs the error, continues with next, retries failed mints at the end

**Output:**
```
Connected to MongoDB
Deployer: 0xAbC123...
NFT Store: 0xDeF456...
Target: 20 NFTs

Deployer AVAX balance: 3.7
Current supply on-chain: 0
Remaining to mint: 20

Setting baseURI to ipfs://QmDEF456.../...
BaseURI set successfully.

Minted #5 (5/20) tx: 0xaaa...
Minted #10 (10/20) tx: 0xbbb...
Minted #15 (15/20) tx: 0xccc...
Minted #20 (20/20) tx: 0xddd...

========================================
Minting Complete
========================================
  Target:    20
  On-chain:  20
  Minted:    20
  Failed:    0
  Status:    completed
```

**Resume-safe:** If the script crashes mid-mint, just run it again. It reads `totalSupply()` and skips already-minted tokens.

### 9.2 Mint Weapon NFTs

```bash
node scripts/mintWeapons.js
```

Same pattern as ChainBoi minting, but:
- Reads weapon names from `deployments/fuji-ipfs-weapons.json`
- Passes each weapon name to `contract.mint(weaponStoreAddress, weaponName)`
- Weapon name is stored on-chain in the `weaponName` mapping

---

## Step 10: Fund Test Wallets

```bash
node scripts/fundTestWallets.js
```

**What happens:**

Creates 3 test wallets and funds them:

| Wallet | AVAX | $BATTLE | ChainBoi NFT | Weapon NFT |
|--------|------|---------|--------------|------------|
| test_user_1 | 1.0 | 100 | #1 | #1 |
| test_user_2 | 1.0 | 100 | - | - |
| test_user_3 | 1.0 | 100 | - | - |

- `test_user_1` has an NFT - used to test WEB3 flow
- `test_user_2` has no NFT - used to test WEB2 flow
- `test_user_3` spare for additional testing

**Idempotent:** Skips wallets that already have sufficient balances.

---

## Step 11: Run Integration Tests

```bash
node scripts/testIntegration.js
```

This runs real on-chain tests (NOT mocked):

```
ChainBois Integration Tests
===========================

Connected to MongoDB

1. Contract Deployment
  ✓ BattleToken name
  ✓ BattleToken symbol
  ✓ ChainBoisNFT name
  ✓ ChainBoisNFT symbol
  ✓ WeaponNFT name
  ✓ WeaponNFT symbol

2. Supply Check
  ✓ ChainBoisNFT totalSupply > 0 (20)
  ✓ WeaponNFT totalSupply > 0 (8)

3. Wallet Encryption
  ✓ Encrypt/decrypt round-trip
  ✓ Deployer wallet exists in DB
  ✓ Deployer key decrypts to valid format

4. NFT Ownership
  ✓ NFT #1 has valid owner (0x...)
  ✓ NFT #1 owned by test_user_1
  ✓ test_user_1 hasNft = true
  ✓ test_user_1 nftTokenId is set (1)
  ✓ test_user_1 level is number (0)
  ✓ test_user_2 hasNft = false
  ✓ test_user_2 nftTokenId is null
  ✓ test_user_2 level = 0

5. NFT Level
  ✓ NFT #1 initial level = 0

6. Weapon NFT
  ✓ Weapon #1 has name: "AK-47"

7. $BATTLE Token
  ✓ test_user_1 $BATTLE balance > 0 (100.0)

8. Glacier Data API
  ✓ Glacier returns NFTs for test_user_1 (1)

========================================
Results: 23 passed, 0 failed
========================================
```

---

## Step 12: Run Unit Tests

```bash
npm test
```

Should show:
```
Test Suites: 15 passed, 15 total
Tests:       187 passed, 187 total
```

---

## Step 13: Start the Server and Test API

### Start the Server

```bash
# Development (single process, auto-restart)
node server.js

# Production (PM2 with cron jobs)
pm2 start ecosystem.config.js
pm2 save
```

### Manual API Testing

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Import Postman collection
# File: docs/POSTMAN_COLLECTION.json
# Set variables: base_url = http://localhost:5000/api/v1
```

---

## Step 14: Verify on Snowtrace

Check your deployed contracts on the block explorer:

- **Testnet**: https://testnet.snowtrace.io/address/{CONTRACT_ADDRESS}
- **Mainnet**: https://snowtrace.io/address/{CONTRACT_ADDRESS}

You should see:
- Contract creation transaction
- Mint transactions
- Token transfers
- Token balances

---

## Troubleshooting

### "AVAX_RPC_URL and AVAX_CHAIN_ID must be configured"
Set both in `.env`. For Fuji testnet:
```
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43113
```

### "BATTLE_TOKEN_ADDRESS not configured"
Deploy contracts first (Step 4), then copy addresses to `.env`.

### "Encryption KEY and ALGORITHM must be set"
Generate a key (Step 1.2) and ensure both `KEY` and `ALGORITHM` are in `.env`.

### Minting fails mid-batch
Just re-run the script. It checks `totalSupply()` and resumes from where it left off. Progress is saved in `deployments/mint-session-*.json`.

### "insufficient funds for gas"
Fund the deployer wallet with more AVAX from the faucet.

### HashLips "Too few unique DNA combinations"
You need more trait variations. Either add more traits per layer or add more layers. See the combination math in Step 5.

### Pinata upload times out
Large collections (4000+ images) may take several minutes. The script handles this, but if it fails, you can re-run - Pinata deduplicates by content hash.

### Firebase token errors
Ensure `config/chainbois-firebase-config.json` exists and matches your Firebase project. Download it from Firebase Console → Project Settings → Service Accounts → Generate New Private Key.

---

## Complete Execution Summary

| Step | Command | Time | AVAX Cost |
|------|---------|------|-----------|
| 1 | Configure `.env` | 5 min | - |
| 2 | `node scripts/generateWallets.js` | 5 sec | - |
| 3 | Fund via faucet | 1 min | - (free) |
| 4 | `npx hardhat run scripts/deploy.js --network fuji` | 1 min | ~0.15 |
| 5 | Prepare trait images | Varies | - |
| 6 | `node scripts/generateNftArt.js /tmp/traits.zip 20` | 30 sec | - |
| 7 | Prepare weapon images | Varies | - |
| 8a | `node scripts/uploadToIpfs.js chainbois` | 1-5 min | - |
| 8b | `node scripts/uploadToIpfs.js weapons /tmp/weapons.zip` | 1-2 min | - |
| 9a | `node scripts/mintChainbois.js 20` | 2-5 min | ~0.07 |
| 9b | `node scripts/mintWeapons.js` | 1-2 min | ~0.04 |
| 10 | `node scripts/fundTestWallets.js` | 2 min | ~3.02 |
| 11 | `node scripts/testIntegration.js` | 30 sec | - |
| 12 | `npm test` | 3 sec | - |
| 13 | `node server.js` | Instant | - |
| **Total** | | **~20 min** | **~3.3 AVAX** |
