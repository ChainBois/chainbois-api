# NFT Metadata Update Proof Guide

## Overview

ChainBois NFTs use dynamic metadata with on-chain proof via EIP-4906 events.
This guide explains how to verify metadata updates and demo them for the hackathon video.

---

## How It Works (EVM vs Algorand)

On **Algorand**, `AssetConfig` is a protocol-level transaction — every indexer natively understands it and immediately updates the metadata URL.

On **EVM (Avalanche)**, the approach is different:

1. `tokenURI()` is a **view function** — it returns a URL pointing to JSON metadata
2. `setBaseURI()` is a **state-changing transaction** — it updates where tokenURI points to
3. `setLevel()` is a **state-changing transaction** — it updates on-chain level + emits `MetadataUpdate` event
4. **EIP-4906 events** (`MetadataUpdate`, `BatchMetadataUpdate`) are standardized signals telling indexers "re-fetch metadata"

The key difference: on Algorand, the indexer reacts instantly. On EVM, indexer/explorer reaction depends on whether they listen for EIP-4906 events:

| Platform | Listens for EIP-4906? | Refresh Timing |
|----------|----------------------|----------------|
| OpenSea | Yes | Minutes (mainnet only, no testnet support) |
| Snowtrace/Routescan | No evidence | Hours to days (periodic background jobs) |
| Glacier API | Unknown | Has reindex endpoint (rate-limited) |
| Blockscout | No | Every 48h default (background job) |
| Thirdweb Dashboard | Reads tokenURI directly | Instant |

**Bottom line**: The on-chain proof is always there (transaction + events). Explorer display lag is a caching issue, not a data issue.

---

## Contract: ChainBoisNFT (Fuji Testnet)

- **Address**: `0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3`
- **Chain**: Avalanche Fuji (43113)
- **EIP-4906**: Fully implemented (supportsInterface returns true for 0x49064906)

### Key Functions

```solidity
// View function — returns dynamic URL
tokenURI(uint256 tokenId) → "https://your-api-domain.com/api/v1/metadata/{tokenId}.json"

// State-changing — updates baseURI + emits BatchMetadataUpdate(1, totalSupply)
setBaseURI(string baseURI) → onlyOwner

// State-changing — updates level + emits MetadataUpdate(tokenId)
setLevel(uint256 tokenId, uint8 level) → onlyOwner

// View function — returns on-chain level (0-7)
getLevel(uint256 tokenId) → uint8
```

---

## Existing On-Chain Proof

These transactions are permanent on the Fuji blockchain:

### setBaseURI (switched from IPFS to dynamic API)
- **Tx**: `0x93ea8952e0b9e62632fcab6aa173cc464dfe438d1253c948418644077dbeea78`
- **Block**: 52420667 | **Time**: March 6, 2026 13:22 UTC
- **Event**: `BatchMetadataUpdate(1, 50)` — signals all 50 tokens have new metadata
- **View**: https://testnet.snowtrace.io/tx/0x93ea8952e0b9e62632fcab6aa173cc464dfe438d1253c948418644077dbeea78

### setLevel (token #1 leveled up)
- **Tx**: `0x3dd52b8f8011a06e969fa4d12fb62d4542fdde40baad9ed2ff8fdf63fcd0da8f`
- **Block**: 52426844 | **Time**: March 6, 2026 17:12 UTC
- **Event**: `MetadataUpdate(1)` — signals token #1 metadata changed
- **View**: https://testnet.snowtrace.io/tx/0x3dd52b8f8011a06e969fa4d12fb62d4542fdde40baad9ed2ff8fdf63fcd0da8f

### How to verify on Snowtrace:
1. Open the tx link
2. Click the **"Logs"** tab
3. You will see the `MetadataUpdate` or `BatchMetadataUpdate` event with decoded parameters
4. This is permanent, timestamped, on-chain proof

---

## Hackathon Video Demo Script

### Option A: Run the Demo Script (Recommended)

```bash
# Just verify current state (no level-up)
node scripts/demoMetadataProof.js --verify-only

# Live level-up token #2 (currently level 0 → 1)
node scripts/demoMetadataProof.js 2

# Live level-up token #3 to level 2
node scripts/demoMetadataProof.js 3 2
```

The script outputs everything needed: before/after state, transaction hash, event proof, verification links.

### Option B: Manual Demo Flow

**Scene 1: Show on-chain state is correct**
```bash
# Call tokenURI on-chain — proves contract points to dynamic endpoint
cast call 0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3 \
  "tokenURI(uint256)" 2 --rpc-url https://api.avax-test.network/ext/bc/C/rpc

# Call getLevel on-chain — shows current level
cast call 0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3 \
  "getLevel(uint256)" 2 --rpc-url https://api.avax-test.network/ext/bc/C/rpc
```

**Scene 2: Show dynamic metadata responds instantly**
```bash
# Open in browser or curl
curl -s https://your-api-domain.com/api/v1/metadata/2.json | python3 -m json.tool
```
Point out Level, Rank, and the badge overlay image URL.

**Scene 3: Level up (live)**
Run the demo script. Show the MetadataUpdate event in the output.

**Scene 4: Show instant metadata update**
```bash
# Refresh the same URL — Level and Rank changed instantly
curl -s https://your-api-domain.com/api/v1/metadata/2.json | python3 -m json.tool
```

**Scene 5: Show on-chain proof**
Open the transaction hash on Snowtrace → Logs tab → MetadataUpdate event.

**Scene 6: Show visual proof (Thirdweb)**
Open https://thirdweb.com/avalanche-fuji/0x8F9911E500C7ec8002Ec0050C7DcDEd510c95AB3
Thirdweb reads tokenURI() directly, so it shows current metadata.

---

## Why Glacier/Snowtrace is Stale

Glacier API currently shows old IPFS metadata for all tokens because:

1. We called `setBaseURI()` to switch from `ipfs://...` to `https://your-api-domain.com/api/v1/metadata/`
2. The `BatchMetadataUpdate(1, 50)` event was emitted
3. But Glacier does not actively listen for EIP-4906 events
4. Glacier's background metadata refresh runs on its own schedule (hours to days)
5. The `:reindex` API endpoint exists but has aggressive rate limits and cooldowns

**This is standard behavior** — even OpenSea (the largest NFT marketplace) only recently started supporting EIP-4906, and only on mainnet. This is an industry-wide challenge, not a ChainBois-specific issue.

**The metadata IS updated** — anyone calling `tokenURI()` on the contract and following the URL gets the correct, real-time metadata. The explorer display is just a cache that hasn't caught up.

---

## Verification Checklist

| Check | How | Expected |
|-------|-----|----------|
| tokenURI points to dynamic API | `contract.tokenURI(1)` | `https://your-api-domain.com/api/v1/metadata/1.json` |
| On-chain level is correct | `contract.getLevel(1)` | Current level (e.g., 2) |
| EIP-4906 supported | `contract.supportsInterface(0x49064906)` | `true` |
| Dynamic metadata returns real-time data | `GET /api/v1/metadata/1.json` | Level matches on-chain |
| MetadataUpdate event exists | Query event logs or check Snowtrace tx | Event in logs |
| Badge overlay renders | Check image URL in metadata | Cloudinary URL with rank overlay |
