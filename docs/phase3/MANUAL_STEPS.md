# Phase 3B: Manual Steps Guide

This document covers all remaining manual steps for completing Phase 3B. Steps marked [DONE] were already completed during implementation.

---

## 1. Cloudinary Setup (Badge Overlays on NFT Images)

Cloudinary is used to dynamically overlay rank badge images on top of the NFT images. Instead of re-rendering images every time someone levels up, Cloudinary constructs a URL that applies the overlay on-the-fly:

```
https://res.cloudinary.com/YOUR_CLOUD/image/upload/l_chainbois-badges:captain,g_south_east,w_150,o_90/chainbois/1.png
```

This URL says: "Take the base image `chainbois/1.png`, overlay `chainbois-badges/captain.png` in the bottom-right corner at 150px wide and 90% opacity."

### Step 1.1: Create a Cloudinary Account

1. Go to https://cloudinary.com and sign up (free tier gives 25 monthly credits, enough for testnet)
2. From the Dashboard, note your:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcDEF123-ghiJKL456`)

### Step 1.2: Add Environment Variables

Add these to `/root/chainbois-api/.env`:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### Step 1.3: Create Badge Images

You need 8 transparent PNG badge images (one per rank). These are the overlay icons that appear on the NFT image to show the player's current rank.

Create them (or have your designer create them) and save to `assets/badges/`:

```
assets/badges/
  private.png
  corporal.png
  sergeant.png
  captain.png
  major.png
  colonel.png
  major_general.png
  field_marshal.png
```

Recommended specs:
- Size: 200x200px or 300x300px
- Format: PNG with transparent background
- Content: Rank insignia/emblem for each military rank

For testing, you can create simple placeholder badges (e.g., colored circles with rank text).

### Step 1.4: Get NFT Images Locally

The original generated images need to be available locally. They should be in one of these locations:
- `build/chainbois/images/` (if the build directory still exists from generation)
- Or download them from IPFS: `https://gateway.pinata.cloud/ipfs/bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/`

If images aren't available locally, you can download all 50 with:

```bash
mkdir -p /tmp/chainbois-images
for i in $(seq 1 50); do
  curl -o /tmp/chainbois-images/$i.png \
    "https://gateway.pinata.cloud/ipfs/bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/$i.png"
  echo "Downloaded $i.png"
done
```

### Step 1.5: Upload to Cloudinary

Upload the NFT images and badge overlays:

```bash
# Upload all 50 NFT images (replace path with your images directory)
node scripts/migrateToCloudinary.js images /tmp/chainbois-images

# Upload badge overlays
node scripts/migrateToCloudinary.js badges assets/badges

# Or do both at once
node scripts/migrateToCloudinary.js all /tmp/chainbois-images assets/badges
```

### Step 1.6: Verify

After uploading, test a badge overlay URL in your browser:

```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/chainbois/1.png
```

This should show NFT #1's image. Once badges are uploaded too, the dynamic metadata endpoint will automatically construct overlay URLs.

### Step 1.7: Restart the Server

```bash
pm2 restart chainbois-api
```

The metadata endpoint at `GET /api/v1/metadata/:tokenId.json` will now return Cloudinary image URLs with badge overlays instead of IPFS fallback URLs.

---

## 2. Rarity Calculation

Rarity scores rank all 50 NFTs based on how rare their trait combinations are. This data powers the rarity leaderboard and is used for trait-based airdrops.

### Step 2.1: Trigger Rarity Calculation

You need an admin user token. Make the following API call:

```bash
curl -X POST https://your-api-domain.com/api/v1/airdrop/calculate-rarity \
  -H "Authorization: Bearer YOUR_ADMIN_FIREBASE_TOKEN" \
  -H "Content-Type: application/json"
```

This does two things:
1. Populates the `NftTrait` collection (one doc per NFT with denormalized traits for fast queries)
2. Calculates rarity scores, ranks (1 = rarest), percentiles, and tiers for all 50 NFTs

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "Rarity calculation complete",
    "nftsProcessed": 50,
    "uniqueTraits": 87
  }
}
```

### Step 2.2: Verify Rarity Leaderboard

```bash
curl -s https://your-api-domain.com/api/v1/airdrop/rarity | python3 -m json.tool
```

This returns all 50 NFTs ranked by rarity. The rarest NFT has `rank: 1`.

To check a specific NFT:

```bash
curl -s https://your-api-domain.com/api/v1/airdrop/rarity/1 | python3 -m json.tool
```

---

## 3. Trait Airdrop Pool Setup

The trait airdrop system distributes $BATTLE tokens weekly. Each week it picks a random trait (e.g., "Background: Combat Red"), finds all NFTs with that trait, and distributes tokens proportionally to their owners.

### Step 3.1: Create an Airdrop Pool

```bash
curl -X POST https://your-api-domain.com/api/v1/airdrop/traits-pool \
  -H "Authorization: Bearer YOUR_ADMIN_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "poolName": "ChainBois Weekly Trait Airdrop",
    "tokenAddress": "YOUR_BATTLE_TOKEN_ADDRESS",
    "weeklyDistributionAmount": 1000
  }'
```

- `tokenAddress`: The deployed $BATTLE token contract address (from `.env` as `BATTLE_TOKEN_ADDRESS`)
- `weeklyDistributionAmount`: How many $BATTLE tokens to distribute per week

The pool is created with `status: "active"`, meaning the cron job will pick it up.

### Step 3.2: How the Weekly Airdrop Works

The cron job runs automatically every **Wednesday at 8 PM UTC**. When it runs:

1. Picks a random unused trait (e.g., "Weapon: War Bow")
2. Finds all NFTs with that trait (e.g., 5 NFTs have "War Bow")
3. Looks up current owners of those NFTs (excludes platform wallets like nft_store, deployer)
4. Calculates per-holder amount: `weeklyAmount / totalEligibleNfts * nftsOwnedByHolder`
5. Mints $BATTLE tokens to each eligible holder
6. Records transactions and updates the pool's trait history
7. Marks the trait as "used" so it won't be picked again until all traits have been used

### Step 3.3: Manual Airdrop Trigger (Testing)

To test the airdrop without waiting for Wednesday:

```bash
curl -X POST https://your-api-domain.com/api/v1/airdrop/distribute \
  -H "Authorization: Bearer YOUR_ADMIN_FIREBASE_TOKEN" \
  -H "Content-Type: application/json"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "message": "Trait airdrop complete",
    "trait": { "type": "weapon", "value": "War Bow" },
    "matchingNfts": 5,
    "eligibleHolders": 1,
    "totalDistributed": 1000,
    "distributions": [
      { "address": "0x469...", "nftCount": 5, "amount": 1000, "txHash": "0xabc..." }
    ]
  }
}
```

Note: Since all 50 NFTs are currently owned by one address (the nft_store wallet `0x469622d0...`), you'll want to transfer some NFTs to test users first, otherwise the airdrop will have no eligible holders (platform wallets are excluded).

### Step 3.4: Check Distribution History

```bash
curl -s https://your-api-domain.com/api/v1/airdrop/trait-history | python3 -m json.tool
```

---

## 4. Point Contract BaseURI to Dynamic Metadata Endpoint [DONE]

The contract's baseURI has been switched from IPFS to the dynamic API endpoint. `tokenURI(1)` now returns `https://your-api-domain.com/api/v1/metadata/1.json`.

This was done via `setBaseURI()` which emitted `BatchMetadataUpdate(1, 50)` to signal explorers. Explorers (Glacier, Snowtrace) may take hours to refresh — see Explorer Guide for timing details.

**How to re-run if needed:**

```bash
# From the server, run:
node -e "
const dotenv = require('dotenv');
dotenv.config();
const { ethers } = require('ethers');
const { getProvider } = require('./utils/avaxUtils');
const { decrypt } = require('./utils/cryptUtils');
const connectDB = require('./config/db');
const Wallet = require('./models/walletModel');

(async () => {
  await connectDB();
  const w = await Wallet.findOne({ role: 'deployer' }).select('+key +iv');
  const key = await decrypt(w.key, w.iv);
  const signer = new ethers.Wallet(key, getProvider());
  const contract = new ethers.Contract(
    process.env.CHAINBOIS_NFT_ADDRESS,
    require('./abis/ChainBoisNFT.json').abi,
    signer
  );
  const newBaseUri = 'https://your-api-domain.com/api/v1/metadata/';
  console.log('Setting baseURI to:', newBaseUri);
  const tx = await contract.setBaseURI(newBaseUri);
  await tx.wait();
  console.log('Done. Tx:', tx.hash);
  process.exit(0);
})();
"
```

After this, `tokenURI(1)` will return `https://your-api-domain.com/api/v1/metadata/1.json`, and marketplaces will get live level, rank, kills, score, and badge-overlayed images.

**Important**: Only do this once the dynamic endpoint is stable and the server has good uptime, since marketplaces will call it directly.

---

## Verification Checklist

### Already Completed [DONE]

- [x] Fixed all 50 metadata JSON files (trait names cleaned, game fields added)
- [x] Added Level, Rank, Kills, Score, Games Played to `attributes` array (so explorers can index them)
- [x] Re-uploaded metadata to IPFS (latest CID: `bafybeig26yewnliuazj3dvuy5d2mmip67i3bqemfxgbhkpt4xv55ojvrxm`)
- [x] Updated contract baseURI on-chain (tx: `0xddb792f7281d1bfc8be6df8831792e58e935d89912b48c08f4323a33f8119464`)
- [x] Triggered Glacier reindex for all 50 tokens (rate-limited — Glacier auto-refreshes within hours)
- [x] Synced all 50 NFTs to MongoDB ChainboiNft collection
- [x] Generation script post-processing added for future NFTs
- [x] Dynamic metadata endpoint deployed and tested
- [x] Airdrop endpoints deployed and tested
- [x] Weekly trait airdrop cron job registered (Wed 8PM UTC)
- [x] All 259 tests passing

### Completed in Phase 3B [DONE]

- [x] Set up Cloudinary account and added env vars
- [x] Extracted 7 military medal badge PNGs (no badge for Private/level 0)
- [x] Uploaded 50 NFT images + 7 badges to Cloudinary
- [x] Verified Cloudinary badge overlay renders correctly (top-right placement)
- [x] Redeployed ChainBoisNFT and WeaponNFT with EIP-4906 (MetadataUpdate events)
- [x] Switched contract baseURI from IPFS to dynamic API endpoint
- [x] Tested level-up end-to-end: token #1 leveled to 2 (Sergeant)
- [x] Renamed rank 0 from "Trainee" to "Private" across all code, metadata, and docs
- [x] Updated all 50 metadata JSONs with "Private" rank

### Remaining Manual Steps

- [ ] Trigger rarity calculation (Section 2, Step 2.1)
- [ ] Create trait airdrop pool (Section 3, Step 3.1)

---

## 5. Glacier Reindex & Explorer Caching

### How Explorer Caching Works

When you update NFT metadata (re-upload to IPFS, call `setBaseURI()`), the data flow is:

1. **On-chain** (instant): `tokenURI()` returns the new IPFS CID immediately after the tx confirms
2. **IPFS** (instant): New metadata is available at the new CID immediately after upload
3. **Glacier API** (cached): Glacier caches metadata and only refreshes when:
   - A `:reindex` call is made (has a cooldown — roughly 2-6 hours between reindexes)
   - Glacier's own periodic refresh cycle runs (can take hours to days)
4. **Snowtrace / Avascan** (cached): These read from Glacier, so they update only after Glacier updates

### Verifying Data at Each Layer

```bash
# 1. On-chain (always correct and instant)
node -e "
const { ethers } = require('ethers');
require('dotenv').config();
const { abi } = require('./abis/ChainBoisNFT.json');
const p = new ethers.JsonRpcProvider(process.env.AVAX_RPC_URL, parseInt(process.env.AVAX_CHAIN_ID));
const c = new ethers.Contract('0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3', abi, p);
c.tokenURI(1).then(u => console.log('tokenURI:', u));
"

# 2. IPFS (always correct for the CID)
curl -s "https://gateway.pinata.cloud/ipfs/bafybeig26yewnliuazj3dvuy5d2mmip67i3bqemfxgbhkpt4xv55ojvrxm/1.json" | python3 -m json.tool

# 3. Glacier API (may be stale - check metadataLastUpdatedTimestamp)
curl -s "https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3/tokens/1" | python3 -m json.tool

# 4. Force Glacier refresh (may fail if cooldown active)
curl -X POST "https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3/tokens/1:reindex"
```

### If Glacier Still Shows Old Data

The reindex API returns `"Nft has been recently indexed"` with a 400 status during cooldown. Options:
1. **Wait**: Glacier auto-refreshes periodically (usually within 24 hours)
2. **Retry later**: Try the reindex endpoint again after a few hours
3. **Batch reindex script**: `node scripts/reuploadMetadata.js` includes reindex for all 50 tokens

---

## Useful URLs for Verification

### On-Chain (Always Current)
- **IPFS Metadata**: https://gateway.pinata.cloud/ipfs/bafybeig26yewnliuazj3dvuy5d2mmip67i3bqemfxgbhkpt4xv55ojvrxm/1.json
- **IPFS Images**: https://gateway.pinata.cloud/ipfs/bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/1.png

### Explorers (May Be Cached)
- **ChainBois contract on Snowtrace**: https://testnet.snowtrace.io/address/0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3
- **ChainBoi #1 on Snowtrace**: https://testnet.snowtrace.io/nft/0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3/1?chainid=43113
- **WeaponNFT contract on Snowtrace**: https://testnet.snowtrace.io/address/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d
- **Weapon #1 on Snowtrace**: https://testnet.snowtrace.io/nft/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d/1?chainid=43113
- **$BATTLE Token on Snowtrace**: https://testnet.snowtrace.io/token/0xF16214F76f19bD1E6d3349fC199B250a8E441E8C
- **BaseURI Update Tx**: https://testnet.snowtrace.io/tx/0xddb792f7281d1bfc8be6df8831792e58e935d89912b48c08f4323a33f8119464

### Glacier API (JSON)
- **ChainBoi #1**: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3/tokens/1
- **All ChainBois**: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3/tokens
- **Weapon #1**: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d/tokens/1
- **All Weapons**: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d/tokens

### Our API (Dynamic / Real-time)
- **Dynamic Metadata**: https://your-api-domain.com/api/v1/metadata/1.json
- **Rarity Leaderboard**: https://your-api-domain.com/api/v1/airdrop/rarity

### Full Explorer Guide
See [docs/EXPLORER_GUIDE.md](../EXPLORER_GUIDE.md) for a comprehensive guide on using Avalanche/EVM explorers.
