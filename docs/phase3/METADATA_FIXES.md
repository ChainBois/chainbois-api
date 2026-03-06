# Phase 3B: NFT Metadata Fixes + Dynamic Metadata + Rarity & Airdrops

## Overview

This update fixes NFT metadata issues, adds a dynamic metadata endpoint, implements Cloudinary badge overlays, and introduces rarity scoring with trait-based $BATTLE airdrops.

---

## What Changed

### 1. Metadata JSON Cleanup (50 NFTs)

All metadata files in `assets/nft-collection/metadata/` have been fixed:

| Before | After |
|--------|-------|
| `"01_Background"` | `"Background"` |
| `"Combat_Red"` | `"Combat Red"` |
| `ipfs://PLACEHOLDER_CID/1.png` | `ipfs://bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/1.png` |
| Missing level/stats fields | Added `level`, `badges`, `inGameStats`, `collection` |
| `"compiler": "HashLips Art Engine"` | Removed |

### 2. Dynamic Metadata Endpoint

**`GET /api/v1/metadata/:tokenId.json`** (public, no auth)

Serves real-time ERC-721 metadata combining:
- On-chain level from contract
- In-game stats from MongoDB
- Cloudinary badge-overlayed image URL
- Cleaned trait attributes

```json
{
  "name": "ChainBoi #1",
  "description": "...",
  "image": "https://res.cloudinary.com/<cloud>/image/upload/l_chainbois-badges:captain,.../chainbois/1.png",
  "external_url": "https://chainbois.gg/nft/1",
  "collection": "ChainBois Genesis",
  "attributes": [
    { "trait_type": "Background", "value": "Combat Red" },
    { "trait_type": "Level", "value": 3, "display_type": "number", "max_value": 7 },
    { "trait_type": "Rank", "value": "Captain" },
    { "trait_type": "Kills", "value": 42, "display_type": "number" },
    { "trait_type": "Games Played", "value": 15, "display_type": "number" },
    { "trait_type": "Score", "value": 12500, "display_type": "number" }
  ]
}
```

To make marketplaces use this, set contract baseURI to:
```
https://your-api-domain.com/api/v1/metadata/
```

### 3. Cloudinary Badge Overlays

Badge images overlay on NFT images via Cloudinary URL transformations. No re-rendering needed - the URL dynamically encodes the transformation based on current level.

**Setup required:**
1. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env`
2. Upload NFT images: `node scripts/migrateToCloudinary.js images <images-dir>`
3. Upload badges: `node scripts/migrateToCloudinary.js badges <badges-dir>`

### 4. Rarity Scoring

Formula: `rarityScore = 1/(traitCountFreq/totalSupply) + SUM[1/(freq/totalSupply)]`

Tiers:
| Tier | Percentile |
|------|-----------|
| Legendary | Top 1% |
| Epic | Top 1-5% |
| Rare | Top 5-20% |
| Uncommon | Top 20-50% |
| Common | Bottom 50% |

### 5. Trait-Based $BATTLE Airdrops

Weekly cron (Wednesdays 8 PM UTC):
1. Pick random unused trait (e.g., "Background: Combat Red")
2. Find all NFTs with that trait
3. Look up owners (exclude platform wallets)
4. Distribute $BATTLE proportionally: `weeklyAmount / totalEligibleNfts * nftsPerHolder`
5. Track in TraitsPool history, mark trait as used

---

## New API Endpoints

### Dynamic Metadata
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/metadata/:tokenId.json` | None | ERC-721 metadata for marketplaces |

### Airdrop (Public)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/airdrop/rarity` | None | Paginated rarity leaderboard |
| GET | `/airdrop/rarity/:tokenId` | None | Single NFT rarity |
| GET | `/airdrop/traits-pool` | None | Active airdrop pools |
| GET | `/airdrop/trait-history` | None | Distribution history |

### Airdrop (Admin)
| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/airdrop/traits-pool` | Admin | Create airdrop pool |
| POST | `/airdrop/calculate-rarity` | Admin | Trigger rarity calculation |
| POST | `/airdrop/distribute` | Admin | Manual airdrop trigger |

---

## Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `fixMetadata.js` | Clean traits + add game fields | `node scripts/fixMetadata.js` |
| `reuploadMetadata.js` | Re-upload to IPFS + set baseURI | `node scripts/reuploadMetadata.js [--set-base-uri]` |
| `syncNftsToMongo.js` | Populate ChainboiNft collection | `node scripts/syncNftsToMongo.js` |
| `migrateToCloudinary.js` | Upload images/badges to Cloudinary | `node scripts/migrateToCloudinary.js images <dir>` |

---

## New Models

| Model | Purpose |
|-------|---------|
| `NftRarity` | Rarity scores, ranks, tiers per NFT |
| `NftTrait` | Denormalized traits per NFT (fast queries) |
| `Trait` | Unique trait type+value combos (airdrop rotation) |
| `TraitsPool` | Airdrop pool config + distribution history |

---

## Environment Variables (new)

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Deployment Steps

1. Run metadata fix: `node scripts/fixMetadata.js` (already done)
2. Re-upload to IPFS: `node scripts/reuploadMetadata.js --set-base-uri`
3. Sync to MongoDB: `node scripts/syncNftsToMongo.js`
4. Set up Cloudinary and run migration
5. Restart server (picks up new routes + cron job)
6. Trigger rarity calculation: `POST /api/v1/airdrop/calculate-rarity`
7. Create airdrop pool: `POST /api/v1/airdrop/traits-pool`
