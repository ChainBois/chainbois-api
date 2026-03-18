# Phase 3: Training Room - Frontend API Reference

Base URL: `https://test-2.ghettopigeon.com/api/v1`

All endpoints require Firebase Auth token: `Authorization: Bearer <idToken>`

---

## 1. List NFTs by Address

**`GET /training/nfts/:address`**

Returns all ChainBoi NFTs owned by a wallet address with level, rank, badge, and traits.

### Request
```
GET /training/nfts/0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0
Authorization: Bearer <idToken>
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "count": 2,
    "nfts": [
      {
        "tokenId": 1,
        "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
        "level": 3,
        "rank": "Captain",
        "badge": "captain",
        "imageUri": "ipfs://bafybei.../chainboi-1.png",
        "metadataUri": "ipfs://...",
        "traits": [
          { "trait_type": "Background", "value": "Combat Red" },
          { "trait_type": "Skin", "value": "Pale Recruit" },
          { "trait_type": "Weapon", "value": "War Bow" },
          { "trait_type": "Suit", "value": "Covert Ops Carbon Suit" },
          { "trait_type": "Eyes", "value": "Battle Hardened" },
          { "trait_type": "Mouth", "value": "Viking Beard" },
          { "trait_type": "Helmet", "value": "Cryo Enforcer" },
          { "trait_type": "Level", "value": 3 },
          { "trait_type": "Rank", "value": "Captain" },
          { "trait_type": "Kills", "value": 10 },
          { "trait_type": "Score", "value": 500 },
          { "trait_type": "Games Played", "value": 5 }
        ]
      }
    ]
  }
}
```

### Errors
| Status | Message |
|--------|---------|
| 400 | Invalid wallet address |
| 401 | Not authenticated |
| 503 | NFT contract not configured |

---

## 2. Get NFT Detail

**`GET /training/nft/:tokenId`**

Returns full details for a single ChainBoi NFT including owner, traits, in-game stats, and next level cost.

### Request
```
GET /training/nft/1
Authorization: Bearer <idToken>
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "tokenId": 1,
    "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
    "owner": "0x469622d0fb5ed43b2e7c45e98d355f2cf03816a0",
    "level": 3,
    "rank": "Captain",
    "badge": "captain",
    "traits": [
      { "trait_type": "Background", "value": "Combat Red" },
      { "trait_type": "Skin", "value": "Pale Recruit" },
      { "trait_type": "Weapon", "value": "War Bow" },
      { "trait_type": "Suit", "value": "Covert Ops Carbon Suit" },
      { "trait_type": "Eyes", "value": "Battle Hardened" },
      { "trait_type": "Mouth", "value": "Viking Beard" },
      { "trait_type": "Helmet", "value": "Cryo Enforcer" },
      { "trait_type": "Level", "value": 3 },
      { "trait_type": "Rank", "value": "Captain" },
      { "trait_type": "Kills", "value": 10 },
      { "trait_type": "Score", "value": 500 },
      { "trait_type": "Games Played", "value": 5 }
    ],
    "imageUri": "ipfs://bafybei.../chainboi-1.png",
    "metadataUri": "ipfs://...",
    "inGameStats": {"kills": 10, "score": 500, "gamesPlayed": 5},
    "nextLevelCost": 0.004,
    "isMaxLevel": false
  }
}
```

### Errors
| Status | Message |
|--------|---------|
| 400 | tokenId must be a valid positive integer |
| 404 | Token does not exist |
| 503 | NFT contract not configured |

---

## 3. Level Up

**`POST /training/level-up`**

Level up a ChainBoi NFT by paying AVAX. The frontend must first send the AVAX payment transaction, then submit the txHash to this endpoint for verification and on-chain level update.

### Flow
1. Frontend reads the cost from `GET /training/level-up/cost?tokenId=X`
2. Frontend prompts user's wallet to send `cost` AVAX to the prize pool address: `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e`
3. Frontend receives the transaction hash from the wallet
4. Frontend calls `POST /training/level-up` with `{ tokenId, txHash }`
5. Backend verifies payment, updates level on-chain
6. Backend pins badge image to IPFS, updates on-chain level, syncs traits to MongoDB + IPFS
7. Backend returns new level, rank, and contract transaction hash

### Request
```
POST /training/level-up
Content-Type: application/json
Authorization: Bearer <idToken>

{
  "tokenId": 1,
  "txHash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "tokenId": 1,
    "previousLevel": 2,
    "newLevel": 3,
    "rank": "Captain",
    "cost": 0.003,
    "contractTxHash": "0xabc..."
  }
}
```

### Errors
| Status | Message |
|--------|---------|
| 400 | tokenId is required |
| 400 | txHash is required |
| 400 | txHash must be a valid transaction hash |
| 400 | No wallet address linked. Please login first. |
| 400 | NFT is already at maximum level |
| 400 | Failed to verify NFT ownership. Token may not exist. |
| 400 | Transaction not found / Insufficient payment / Too old |
| 403 | You do not own this NFT |
| 404 | User not found |
| 409 | This transaction has already been used |
| 429 | Too many requests (rate limited: 10/min) |
| 500 | Failed to update NFT level on-chain |
| 503 | NFT contract / Prize pool / Deployer wallet not configured |

---

## 4. Get Level-Up Cost

**`GET /training/level-up/cost`**

Returns the AVAX cost for the next level-up. Supports three modes:

### Mode 1: By Token ID (recommended)
```
GET /training/level-up/cost?tokenId=1
```

Response:
```json
{
  "success": true,
  "data": {
    "currentLevel": 2,
    "nextLevel": 3,
    "cost": 0.003,
    "currency": "AVAX",
    "isMaxLevel": false,
    "rank": "Sergeant",
    "nextRank": "Captain"
  }
}
```

### Mode 2: By Current Level
```
GET /training/level-up/cost?currentLevel=2
```
Same response format as Mode 1.

### Mode 3: Full Cost Table (no params)
```
GET /training/level-up/cost
```

Response:
```json
{
  "success": true,
  "data": {
    "costs": {"1": 0.001, "2": 0.002, "3": 0.003, "4": 0.004, "5": 0.005, "6": 0.006, "7": 0.007},
    "currency": "AVAX",
    "maxLevel": 7
  }
}
```

### At Max Level Response
```json
{
  "success": true,
  "data": {
    "currentLevel": 7,
    "nextLevel": null,
    "cost": null,
    "currency": "AVAX",
    "isMaxLevel": true,
    "rank": "Field Marshal",
    "nextRank": null
  }
}
```

---

## 5. Tournament Eligibility

**`GET /training/eligibility/:tokenId`**

Check which tournaments an NFT qualifies for based on its level.

### Request
```
GET /training/eligibility/1
Authorization: Bearer <idToken>
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "tokenId": 1,
    "level": 3,
    "rank": "Captain",
    "eligibleLevels": [1, 2, 3],
    "activeTournaments": [
      {
        "tournamentId": "...",
        "level": 2,
        "status": "active",
        "prizePool": 4,
        "startTime": "2026-03-05T12:00:00Z",
        "endTime": "2026-03-10T12:00:00Z"
      }
    ],
    "upcomingTournaments": []
  }
}
```

Level 0 (Private) NFTs are not eligible for any tournaments.

---

## Rank Progression

| Level | Rank | Cost (AVAX) | Badge |
|-------|------|-------------|-------|
| 0 | Private | - | None |
| 1 | Corporal | 0.001 | Corporal medal |
| 2 | Sergeant | 0.002 | Sergeant medal |
| 3 | Captain | 0.003 | Captain medal |
| 4 | Major | 0.004 | Major medal |
| 5 | Colonel | 0.005 | Colonel medal |
| 6 | Major General | 0.006 | Major General medal |
| 7 | Field Marshal | 0.007 | Field Marshal medal |

**Total cost to max level: 0.028 AVAX** (testnet — costs are configurable per-level in settings)

Badge overlays are generated via Cloudinary URL transforms (top-right corner of the NFT image) and then pinned to IPFS. After level-up, the `imageUri` in API responses points to the IPFS-pinned badge image (`ipfs://{cid}/chainboi-{tokenId}.png`). Cloudinary is used as a generation tool only, not for serving. Level 0 (Private) has no badge — `imageUri` points to the original IPFS image.

---

## Dynamic Metadata Endpoint

This public endpoint serves real-time ERC-721 metadata for ChainBois NFTs. The on-chain `tokenURI()` points here, so explorers and marketplaces fetch live data automatically.

### `GET /api/v1/metadata/:tokenId.json`

**Auth:** None (public — marketplaces must access this)

**Response (level 2 example):**
```json
{
  "name": "ChainBoi #1",
  "description": "ChainBois - Military-themed gaming NFTs on Avalanche...",
  "image": "ipfs://bafybei.../chainboi-1.png",
  "external_url": "https://chainbois-true.vercel.app/nft/1",
  "collection": "ChainBois Genesis",
  "attributes": [
    { "trait_type": "Background", "value": "Combat Red" },
    { "trait_type": "Skin", "value": "Pale Recruit" },
    { "trait_type": "Weapon", "value": "War Bow" },
    { "trait_type": "Suit", "value": "Covert Ops Carbon Suit" },
    { "trait_type": "Eyes", "value": "Battle Hardened" },
    { "trait_type": "Mouth", "value": "Viking Beard" },
    { "trait_type": "Helmet", "value": "Cryo Enforcer" },
    { "trait_type": "Level", "value": 2, "display_type": "number", "max_value": 7 },
    { "trait_type": "Rank", "value": "Sergeant" },
    { "trait_type": "Kills", "value": 42, "display_type": "number" },
    { "trait_type": "Games Played", "value": 15, "display_type": "number" },
    { "trait_type": "Score", "value": 12500, "display_type": "number" }
  ]
}
```

**How it works:**
- Level and rank are read from the on-chain contract (real-time)
- Base traits (Background, Skin, etc.) come from MongoDB
- Game stats (Kills, Score, Games Played) come from MongoDB (synced from Firebase)
- Dynamic traits (Level, Rank, Kills, Score, Games Played) are always included with current live values via `buildCurrentTraits()`
- Badge overlay is generated via Cloudinary (top-right corner) and then **pinned to IPFS**. The `image` field points to the IPFS-pinned badge image for levels 1-7. Cloudinary is used as a generation tool only, not for serving.
- Level 0 (Private) has no badge — `image` points to the original IPFS image

---

## Weapon Metadata Endpoint

Public endpoint serving ERC-721 metadata for weapon NFTs.

### `GET /api/v1/metadata/weapon/:tokenId.json`

**Auth:** None (public -- marketplaces must access this)

**Response:**
```json
{
  "name": "AR M4 MK18",
  "description": "A pinnacle of tactical excellence...",
  "image": "ipfs://...",
  "external_url": "https://chainbois-true.vercel.app/weapon/1",
  "collection": "ChainBois Weapons",
  "attributes": [
    { "trait_type": "Weapon Name", "value": "AR M4 MK18" },
    { "trait_type": "Category", "value": "assault" },
    { "trait_type": "Tier", "value": "base" }
  ]
}
```

**How it works:**
- Weapon name, category, and tier are read from MongoDB
- Image URL points to the weapon's IPFS image
- The on-chain `tokenURI()` on the WeaponNFT contract points here

---

## Airdrop & Rarity Endpoints

### Public Endpoints (no auth)

#### `GET /api/v1/airdrop/rarity`

Paginated rarity leaderboard for all NFTs.

**Query params:** `?page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "nfts": [
      {
        "tokenId": 42,
        "name": "ChainBoi #42",
        "rank": 1,
        "rarityScore": 156.7,
        "rarityTier": "legendary",
        "percentile": 2.0,
        "traitCount": 7
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

#### `GET /api/v1/airdrop/rarity/:tokenId`

Rarity details for a single NFT.

#### `GET /api/v1/airdrop/traits-pool`

Active airdrop pool configuration and status.

#### `GET /api/v1/airdrop/trait-history`

History of past trait-based airdrop distributions.

### Admin Endpoints (Backend Dev Only -- not for frontend integration)

These endpoints are documented in the Setup Guide. They require Firebase admin auth and are not used by the frontend.

#### `POST /api/v1/airdrop/traits-pool`

Create or configure an airdrop pool.

#### `POST /api/v1/airdrop/calculate-rarity`

Trigger rarity score recalculation for all NFTs.

#### `POST /api/v1/airdrop/distribute`

Manually trigger a trait-based airdrop distribution.

---

## Key Addresses

| Wallet | Address | Purpose |
|--------|---------|---------|
| Prize Pool | `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e` | Level-up payments go here |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | NFT contract (EIP-4906) |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | Weapon NFT contract |
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | $BATTLE ERC-20 token |

---

## TypeScript Types

```typescript
interface ChainBoiNft {
  tokenId: number;
  contractAddress: string;
  level: number;
  rank: string;
  badge: string;
  imageUri: string;
  metadataUri: string;
  traits: { trait_type: string; value: any }[];
}

interface NftDetail extends ChainBoiNft {
  owner: string;
  inGameStats: { kills: number; score: number; gamesPlayed: number };
  nextLevelCost: number | null;
  isMaxLevel: boolean;
}

interface LevelUpResult {
  tokenId: number;
  previousLevel: number;
  newLevel: number;
  rank: string;
  cost: number;
  contractTxHash: string;
}

interface LevelUpCost {
  currentLevel: number;
  nextLevel: number | null;
  cost: number | null;
  currency: string;
  isMaxLevel: boolean;
  rank: string;
  nextRank: string | null;
}

interface CostTable {
  costs: Record<string, number>;
  currency: string;
  maxLevel: number;
}

interface Eligibility {
  tokenId: number;
  level: number;
  rank: string;
  eligibleLevels: number[];
  activeTournaments: TournamentSummary[];
  upcomingTournaments: TournamentSummary[];
}

interface TournamentSummary {
  tournamentId: string;
  level: number;
  status: string;
  prizePool: number;
  startTime: string;
  endTime: string;
}
```
