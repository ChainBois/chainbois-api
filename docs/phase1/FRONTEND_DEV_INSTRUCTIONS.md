# Frontend Dev Instructions — NFT Display Updates

## What Changed on the Backend

1. **Traits are now always current** — the `traits` array in every API response now includes Level, Rank, Kills, Score, Games Played with live values. You can display traits directly without worrying about stale data.

2. **`imageUri` now reflects badge overlay** — after an NFT levels up, the badge image is generated via Cloudinary, permanently pinned to IPFS, and stored in `imageUri`. Level 0 NFTs still have the original IPFS image (no badge).

3. **`assets` is now an array** — login and verify-assets return `assets: [{ tokenId, level, ... }]` (array of full NFT objects) instead of a single object.

4. **`weapons` are full objects** — `weapon.name` is now `weapon.weaponName`. Each weapon includes `contractAddress`, `category`, `tier`, `imageUri`, `metadataUri`.

---

## Changes Required in Frontend Code

### 1. Use API's `imageUri` for NFT images (shows badge)

**Current code** (`src/utils/ipfsAssetUrls.js`):
```javascript
const CHAINBOIS_CID = 'bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4'
export const getChainBoiImageCandidates = (tokenId) => {
  return IPFS_GATEWAYS.map(gateway => `${gateway}/${CHAINBOIS_CID}/${tokenId}.png`)
}
```

**Problem**: This hardcoded CID always returns the original raw image — **no badge overlay**, even after level-up.

**Fix**: Use the `imageUri` from the API response instead. Add a helper to convert `ipfs://` to gateway URL:

```javascript
// Add to src/utils/ipfsAssetUrls.js:
export const ipfsToGateway = (ipfsUri) => {
  if (!ipfsUri || !ipfsUri.startsWith('ipfs://')) return null
  const path = ipfsUri.replace('ipfs://', '')
  return IPFS_GATEWAYS.map(gateway => `${gateway}/${path}`)
}
```

**Then in components** (TrainingCard, InventoryCard, TrainingAssetDetails):
```javascript
// Instead of:
const imageCandidates = getChainBoiImageCandidates(asset.nftTokenId)

// Use:
const imageCandidates = asset.imageUri
  ? ipfsToGateway(asset.imageUri)
  : getChainBoiImageCandidates(asset.tokenId) // fallback for level 0
```

**Proof**: Token #1 is Level 1 (Corporal). Compare these two URLs:
- Old hardcoded (NO badge): `https://ipfs.io/ipfs/bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/1.png`
- New from API (WITH badge): `https://gateway.pinata.cloud/ipfs/bafybeihz3ugt56zztjzqj7syfe4h7vdmvplowzr7drdvfekjna2g2x52ny/chainboi-1.png`

### 2. Store and pass full asset data

**Current code** (`src/context/Auth.js:308-313`):
```javascript
const nextAssets = {
  hasNft: verifiedData?.hasNft ?? false,
  nftTokenId: verifiedData?.nftTokenId ?? null,
  level: verifiedData?.level ?? user?.level ?? 1,
}
```

**Problem**: This only stores 3 fields. The `imageUri`, `traits`, `rank`, `badge`, `inGameStats` are discarded.

**Fix**: Also store the full `assets` array:
```javascript
const nextAssets = {
  hasNft: verifiedData?.hasNft ?? false,
  nftTokenId: verifiedData?.nftTokenId ?? null,
  level: verifiedData?.level ?? user?.level ?? 1,
}
// Store the full asset objects for NFT display
const fullNfts = Array.isArray(verifiedData?.assets) ? verifiedData.assets : []
const nextWeapons = Array.isArray(verifiedData?.ownedWeaponNfts)
  ? verifiedData.ownedWeaponNfts
  : []

setUser((current) => ({
  ...current,
  hasNft: nextAssets.hasNft,
  nftTokenId: nextAssets.nftTokenId,
  level: nextAssets.level,
  assets: nextAssets,
  nfts: fullNfts,      // NEW: full NFT data with imageUri, traits, etc.
  weapons: nextWeapons,
}))
```

### 3. Display traits from the `traits` array

Each NFT's `traits` array now includes ALL traits with current values:

```json
{
  "traits": [
    { "trait_type": "Background", "value": "Combat Red" },
    { "trait_type": "Skin", "value": "Pale Recruit" },
    { "trait_type": "Weapon", "value": "War Bow" },
    { "trait_type": "Suit", "value": "Covert Ops Carbon Suit" },
    { "trait_type": "Eyes", "value": "Battle Hardened" },
    { "trait_type": "Mouth", "value": "Viking Beard" },
    { "trait_type": "Helmet", "value": "Cryo Enforcer" },
    { "trait_type": "Level", "value": 1 },
    { "trait_type": "Rank", "value": "Corporal" },
    { "trait_type": "Kills", "value": 0 },
    { "trait_type": "Score", "value": 0 },
    { "trait_type": "Games Played", "value": 0 }
  ]
}
```

You can render all traits with a simple map:
```jsx
{nft.traits.map((t) => (
  <div key={t.trait_type}>
    <span className={styles.label}>{t.trait_type}</span>
    <span className={styles.value}>{t.value}</span>
  </div>
))}
```

Level, Rank, Kills, Score, and Games Played are always up-to-date — they reflect the current on-chain level and synced game stats.

### 4. Handle `weaponName` instead of `name`

**Old**: `weapon.name`
**New**: `weapon.weaponName`

Update `getWeaponImageCandidates` calls:
```javascript
// Old:
getWeaponImageCandidates({ tokenId: w.tokenId, name: w.name })

// New:
getWeaponImageCandidates({ tokenId: w.tokenId, name: w.weaponName })
```

---

## API Response Examples (Current State)

### Login Response (`POST /auth/login`)
```json
{
  "success": true,
  "data": {
    "user": { "uid": "...", "username": "...", "level": 1, "..." },
    "assets": [
      {
        "tokenId": 1,
        "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
        "level": 1,
        "rank": "Corporal",
        "badge": "corporal",
        "imageUri": "ipfs://bafybeihz3ugt56zztjzqj7syfe4h7vdmvplowzr7drdvfekjna2g2x52ny/chainboi-1.png",
        "metadataUri": "ipfs://bafybeig5nzs55tyholu5zeczczoo4i6v3c6uoldkhw2az3xc5qpcliupri/1.json",
        "traits": [
          { "trait_type": "Background", "value": "Combat Red" },
          { "trait_type": "Level", "value": 1 },
          { "trait_type": "Rank", "value": "Corporal" },
          "... (12 traits total)"
        ],
        "inGameStats": { "kills": 0, "score": 0, "gamesPlayed": 0 }
      }
    ],
    "weapons": []
  }
}
```

### Verify-Assets Response (`POST /game/verify-assets`)
```json
{
  "success": true,
  "data": {
    "hasNft": true,
    "nftTokenId": 1,
    "level": 1,
    "assets": [{ "same shape as login assets above" }],
    "ownedWeaponNfts": []
  }
}
```

---

## Summary of Field Changes

| Field | Before | After |
|-------|--------|-------|
| `assets` | Single object `{ hasNft, nftTokenId, level }` | Array of full NFT objects |
| `imageUri` | Always raw IPFS (no badge) | IPFS badge image for leveled NFTs |
| `traits` | Had stale Level/Rank values | Always current Level/Rank/Kills/Score/Games Played |
| `weapon.name` | `"AK-47"` | Now `weapon.weaponName` |
| `weapon` objects | `{ tokenId, name }` | Full: `{ tokenId, contractAddress, weaponName, category, tier, imageUri, metadataUri }` |
