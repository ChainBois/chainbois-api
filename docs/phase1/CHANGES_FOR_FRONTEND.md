# Phase 1 API Changes — Frontend Integration Update

This document summarizes all breaking and non-breaking changes to Phase 1 API responses since the initial frontend integration (March 9-16, 2026).

---

## Breaking Changes

### 1. `assets` changed from object to array (Login + Verify-Assets)

**Before:**
```json
"assets": {
  "hasNft": true,
  "nftTokenId": 42,
  "level": 2
}
```

**After:**
```json
"assets": [
  {
    "tokenId": 42,
    "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
    "level": 2,
    "rank": "Sergeant",
    "badge": "sergeant",
    "imageUri": "ipfs://bafybei.../chainboi-42.png",
    "metadataUri": "ipfs://...",
    "traits": [
      { "trait_type": "Background", "value": "Combat Red" },
      { "trait_type": "Skin", "value": "Pale Recruit" },
      { "trait_type": "Level", "value": 2 },
      { "trait_type": "Rank", "value": "Sergeant" },
      { "trait_type": "Kills", "value": 0 },
      { "trait_type": "Score", "value": 0 },
      { "trait_type": "Games Played", "value": 0 }
    ],
    "inGameStats": { "kills": 0, "score": 0, "gamesPlayed": 0 }
  }
]
```

**Impact:** Frontend code accessing `assets.nftTokenId` or `assets.level` must iterate `assets[]` array. Users can own multiple ChainBoi NFTs.

### 2. `weapons` changed from name strings to full objects (Login + Verify-Assets)

**Before:**
```json
"weapons": [{ "tokenId": 10, "name": "AK-47" }]
```

**After:**
```json
"weapons": [
  {
    "tokenId": 10,
    "contractAddress": "0xa2AFf3105668124A187b1212Ab850bf8b98dD07d",
    "weaponName": "AK-47",
    "category": "assault",
    "tier": "base",
    "imageUri": "ipfs://...",
    "metadataUri": "ipfs://..."
  }
]
```

**Impact:** `weapon.name` is now `weapon.weaponName`. Full token data now included. **Update:** `name` is also returned as an alias for `weaponName`, along with `imageUrl` (pre-resolved HTTP gateway URL). See [FRONTEND_WEAPON_IMAGE_FIX.md](../FRONTEND_WEAPON_IMAGE_FIX.md) for details.

### 3. Leaderboard responses wrapped in `data` envelope

**Before:**
```json
{ "success": true, "period": "all", "leaderboard": [...] }
```

**After:**
```json
{ "success": true, "data": { "period": "all", "leaderboard": [...] } }
```

**Impact:** The frontend Leaderboard component already handles this via flexible response normalization (tries `data.leaderboard`, `data.data.leaderboard`, etc.), so this should work without changes.

### 4. `battleTokenBalance` removed from user object

Was: `"battleTokenBalance": 0` in user object.
Now: Field absent. Use `GET /armory/balance/:address` for on-chain balance.

### 5. `hasClaimed` removed from user object

Was: `"hasClaimed": false` in user object.
Now: Field absent. Claim feature removed entirely.

---

## Traits Now Include Dynamic Values

Traits now always include current Level, Rank, Kills, Score, and Games Played with live values. The `buildCurrentTraits()` function replaces stale MongoDB traits with live values from the blockchain and game stats. You no longer need to look at separate fields for dynamic data — the `traits` array is the single source of truth for both static art traits and dynamic game traits.

**Example traits array (always returned in full):**
```json
"traits": [
  { "trait_type": "Background", "value": "Combat Red" },
  { "trait_type": "Skin", "value": "Pale Recruit" },
  { "trait_type": "Weapon", "value": "War Bow" },
  { "trait_type": "Suit", "value": "Covert Ops Carbon Suit" },
  { "trait_type": "Eyes", "value": "Battle Hardened" },
  { "trait_type": "Mouth", "value": "Viking Beard" },
  { "trait_type": "Helmet", "value": "Cryo Enforcer" },
  { "trait_type": "Level", "value": 0 },
  { "trait_type": "Rank", "value": "Private" },
  { "trait_type": "Kills", "value": 0 },
  { "trait_type": "Score", "value": 0 },
  { "trait_type": "Games Played", "value": 0 }
]
```

The top-level `level`, `rank`, and `inGameStats` fields are still present for convenience, but the traits array always matches.

---

## Convenience Fields Added (from frontend code review)

After reviewing the frontend codebase (`src/context/Auth.js`), we noticed that the `verifyAssets` handler reads `nftTokenId` and `level` directly from the top-level response:

```javascript
// Auth.js:308-313
const verifiedData = res?.data?.data ?? {}
const nextAssets = {
  hasNft: verifiedData?.hasNft ?? false,
  nftTokenId: verifiedData?.nftTokenId ?? null,
  level: verifiedData?.level ?? user?.level ?? 1,
}
```

Since `assets` changed from an object to an array, these fields would no longer be at the top level. To maintain backwards compatibility, we added **convenience fields** to the `verify-assets` response:

```json
{
  "data": {
    "hasNft": true,
    "nftTokenId": 1,
    "level": 2,
    "assets": [{ "tokenId": 1, "level": 2, "..." }],
    "ownedWeaponNfts": [...]
  }
}
```

- `nftTokenId` = first owned NFT's tokenId (same as `assets[0].tokenId`)
- `level` = highest level across all owned NFTs (same as `Math.max(...assets.map(a => a.level))`)

These fields are **not** on the login response (login uses `applyUserPayload` which destructures `{ user, assets, weapons }` directly — no `nftTokenId`/`level` at top level needed).

---

## Phase 1 Endpoint Integration Status (from code review)

Based on reading the frontend codebase, here is what's currently integrated for Phase 1:

| Endpoint | Frontend Status |
|----------|----------------|
| `POST /auth/login` | Integrated (Auth context) |
| `GET /auth/me` | Integrated (Auth context) |
| `POST /auth/logout` | Integrated (Auth context) |
| `GET /auth/check-user/:email` | Integrated (AccountManagement) |
| `POST /auth/create-user` | Integrated (AccountManagement) |
| `POST /game/verify-assets` | Integrated (Auth context) |
| `POST /game/set-avatar` | Integrated (Auth context) |
| `GET /leaderboard` | Integrated (Homepage Leaderboard) |
| `GET /settings` | Not yet integrated |
| `GET /health` | Not yet integrated |
| `GET /game/info` | Not yet integrated |
| `GET /game/download/:platform` | Not yet integrated |

---

## Non-Breaking Changes

### 6. `battleTokenDecimals` corrected from 6 to 18

Settings endpoint now correctly returns `18` (matching the actual ERC20 deployment).

### 7. Settings fields added/removed

- **Removed:** `claimLimit`, `claimEnabled`
- **Added:** `nftPrice` (0.001), `dynamicTokenomics` (true)
- **Changed:** `trailer` from `null` to `""` (empty string)

### 8. Contract addresses updated (redeployed contracts)

| Contract | Old | New |
|----------|-----|-----|
| BattleToken | `0xF162...E8C` | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` |
| ChainBoisNFT | `0x4dE8...7a5` | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` |
| WeaponNFT | `0xb30c...D28` | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` |

### 9. API base URL finalized

Was: `https://your-api-domain.com/api/v1`
Now: `https://test-2.ghettopigeon.com/api/v1`

---

## TypeScript Type Updates

```typescript
// OLD
interface AssetObject {
  hasNft: boolean;
  nftTokenId: number | null;
  level: number;
}

// NEW
interface ChainBoiAsset {
  tokenId: number;
  contractAddress: string;
  level: number;
  rank: string;
  badge: string;
  imageUri: string;
  metadataUri: string;
  traits: { trait_type: string; value: any }[];
  inGameStats: { kills: number; score: number; gamesPlayed: number };
}

// OLD
interface WeaponObject {
  tokenId: number;
  name: string;
}

// NEW
interface WeaponAsset {
  tokenId: number;
  contractAddress: string;
  weaponName: string;
  category: string;
  tier: string;
  imageUri: string;
  metadataUri: string;
}

// verify-assets response includes convenience fields for backwards compat
interface VerifyAssetsResponse {
  hasNft: boolean;
  nftTokenId: number | null;  // convenience: assets[0].tokenId
  level: number;              // convenience: max level across all NFTs
  assets: ChainBoiAsset[];
  ownedWeaponNfts: WeaponAsset[];
}
```
