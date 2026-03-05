# Phase 3: Training Room - Frontend API Reference

Base URL: `https://your-api-domain.com/api/v1`

All endpoints require Firebase Auth token: `Authorization: Bearer <idToken>`

---

## 1. List NFTs by Address

**`GET /training/nfts/:address`**

Returns all ChainBoi NFTs owned by a wallet address with level, rank, and unlocked characters.

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
        "contractAddress": "0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5",
        "level": 3,
        "rank": "Captain",
        "badge": "captain",
        "imageUri": "ipfs://...",
        "metadataUri": "ipfs://...",
        "characters": ["Private_A", "Private_B", "...", "Captain_D"],
        "weapons": ["AR M4 MK18", "AM-18", "M-9 Bayonet", "M32A1 MSGL"]
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
    "contractAddress": "0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5",
    "owner": "0x469622d0fb5ed43b2e7c45e98d355f2cf03816a0",
    "level": 3,
    "rank": "Captain",
    "badge": "captain",
    "traits": [{"trait_type": "Background", "value": "Blue"}],
    "imageUri": "ipfs://...",
    "metadataUri": "ipfs://...",
    "inGameStats": {"kills": 10, "score": 500, "gamesPlayed": 5},
    "characters": ["Private_A", "...", "Captain_D"],
    "weapons": ["AR M4 MK18", "AM-18", "M-9 Bayonet", "M32A1 MSGL"],
    "nextLevelCost": 2,
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
5. Backend verifies payment, updates level on-chain, syncs to MongoDB + Firebase
6. Backend returns new level, rank, and unlocked characters

### Request
```
POST /training/level-up
Authorization: Bearer <idToken>
Content-Type: application/json

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
    "cost": 2,
    "contractTxHash": "0xabc...",
    "characters": ["Private_A", "...", "Captain_D"],
    "weapons": ["AR M4 MK18", "AM-18", "M-9 Bayonet", "M32A1 MSGL"]
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
    "cost": 2,
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
    "costs": {"1": 1, "2": 1, "3": 2, "4": 2, "5": 3, "6": 3, "7": 5},
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

Level 0 (Trainee) NFTs are not eligible for any tournaments.

---

## Rank Progression

| Level | Rank | Cost (AVAX) | Characters Unlocked |
|-------|------|-------------|---------------------|
| 0 | Trainee | - | Private A-D |
| 1 | Corporal | 1 | + Corporal A-D |
| 2 | Sergeant | 1 | + Sergeant A-D |
| 3 | Captain | 2 | + Captain A-D |
| 4 | Major | 2 | + Major A-D |
| 5 | Colonel | 3 | + Colonel A-D |
| 6 | Major General | 3 | + Major General A-D |
| 7 | Field Marshal | 5 | + Field Marshal A-D |

**Total cost to max level: 17 AVAX**

---

## Key Addresses

| Wallet | Address | Purpose |
|--------|---------|---------|
| Prize Pool | `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e` | Level-up payments go here |
| ChainBoisNFT | `0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5` | NFT contract |

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
  characters: string[];
  weapons: string[];
}

interface NftDetail extends ChainBoiNft {
  owner: string;
  traits: { trait_type: string; value: any }[];
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
  characters: string[];
  weapons: string[];
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
