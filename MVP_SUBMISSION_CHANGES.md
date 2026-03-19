# MVP Submission Form — Changes Only

Use this to update your previously submitted answers. Only the questions with changes are listed below. Questions 1, 4, 5, 6, 7, 10 have NO changes.

---

## Question 2: Technical Documentation

**Add these 6 lines to the Backend section, after "Pinata SDK for IPFS metadata hosting":**

```
- `utils/pinataUtils.js` — dedicated utility for pinning images and JSON to IPFS via Pinata
- `buildCurrentTraits()` system — NFT traits always include current Level, Rank, Kills, Score, and Games Played with live values
- Badge overlay flow: Cloudinary generates badge image → pinned to IPFS via Pinata → Cloudinary copy deleted → imageUri in API responses points to permanent IPFS badge image
- Enriched NFT/weapon responses: every endpoint returns full token data (contractAddress, imageUri, metadataUri, traits, inGameStats)
- Weapon metadata endpoint: `GET /metadata/weapon/:tokenId.json`
- 263 automated tests across the full API suite
```

---

## Question 3: Architecture Design Overview

**Replace Data Flow point 4 (Level-up) entirely. Old:**

> 4. Level-up (Training Room): User pays AVAX via frontend → backend verifies payment → increments on-chain level on ChainBoisNFT contract → emits EIP-4906 MetadataUpdate event → generates new badge overlay URL (Cloudinary transform) → updates metadata on IPFS → updates Firebase with new level → game reflects new rank and unlocked characters.

**New:**

> 4. Level-up (Training Room): User pays AVAX via frontend → backend verifies payment → increments on-chain level on ChainBoisNFT contract → emits EIP-4906 MetadataUpdate event → badge overlay generated via Cloudinary URL transform, downloaded, and pinned to IPFS as a permanent image → metadata JSON built with all traits (Level, Rank, Kills, Score, Games Played) + IPFS image URL, also pinned to IPFS → previous level's Cloudinary image deleted (saves free tier quota, skipped for level 0) → MongoDB updated with new IPFS imageUri, metadataUri, and traits → updates Firebase with new level → game reflects new rank and unlocked characters.

---

## Question 8: What is Currently Playable

**Replace the Dynamic Metadata bullet. Old:**

> - Dynamic Metadata — NFT metadata updates in real-time with level, army rank, stats, and badge overlays without re-uploading to IPFS

**New:**

> - Dynamic Metadata — NFT metadata updates in real-time with level, army rank, stats, and IPFS-pinned badge overlay images

---

## Question 9: Smart Contracts Deployed

**Replace the ChainBoisNFT paragraph (the long one starting with "ChainBoisNFT goes beyond..."). Old:**

> ChainBoisNFT goes beyond standard ERC-721 by storing each NFT's level directly on-chain via an nftLevel mapping (mapping(uint256 => uint8)). When a player levels up their ChainBoi, the contract updates this on-chain level and emits an EIP-4906 MetadataUpdate event — a standard signal that tells indexers, marketplaces (OpenSea, Joepegs), and block explorers (Snowtrace, Glacier) to re-fetch the token's metadata. The backend serves dynamic metadata at /api/v1/metadata/:tokenId that reflects the player's current army rank name (an 8-tier progression from Private → Corporal → Sergeant → Captain → Major → Colonel → Major General → Field Marshal), real-time stats (games played, points earned, tournaments won), and Cloudinary-generated badge overlay images. When a level-up occurs, the entire flow is automatic: the on-chain level changes, MetadataUpdate fires, marketplaces fetch the new metadata URL, and the NFT's displayed image, rank, and stats update everywhere — all without re-uploading anything to IPFS. The contract also includes emitBatchMetadataUpdate() for triggering bulk metadata refreshes after batch off-chain changes (e.g., after a tournament concludes and multiple players' stats change simultaneously).

**New:**

> ChainBoisNFT goes beyond standard ERC-721 by storing each NFT's level directly on-chain via an nftLevel mapping (mapping(uint256 => uint8)). When a player levels up their ChainBoi, the contract updates this on-chain level and emits an EIP-4906 MetadataUpdate event — a standard signal that tells indexers, marketplaces (OpenSea, Joepegs), and block explorers (Snowtrace, Glacier) to re-fetch the token's metadata. The backend serves dynamic metadata at /api/v1/metadata/:tokenId that reflects the player's current army rank name (an 8-tier progression from Private → Corporal → Sergeant → Captain → Major → Colonel → Major General → Field Marshal), real-time stats (games played, points earned, tournaments won), and badge overlay images pinned permanently to IPFS. During level-up, the badge overlay is generated via Cloudinary URL transforms, downloaded and pinned to IPFS through Pinata, and the Cloudinary copy is deleted — the `imageUri` in API responses points to the permanent IPFS badge image. Metadata JSON (including all traits and the IPFS image URL) is also pinned to IPFS. The entire flow is automatic: the on-chain level changes, MetadataUpdate fires, marketplaces fetch the new metadata URL, and the NFT's displayed image, rank, and stats update everywhere. The contract also includes emitBatchMetadataUpdate() for triggering bulk metadata refreshes after batch off-chain changes (e.g., after a tournament concludes and multiple players' stats change simultaneously).

---

## Question 11: Playtesting Results

**Replace the test count line. Old:**

> - 286 automated tests passing across the full API test suite, covering: authentication, game sync, training room, armory, points conversion, inventory, leaderboard, NFT metadata, airdrops, claims, and platform metrics.

**New:**

> - 263 automated tests passing across the full API test suite (refactored from 286 — removed obsolete character/weapon unlock tests), covering: authentication, game sync, training room, armory, points conversion, inventory, leaderboard, NFT metadata, airdrops, claims, and platform metrics.

**Add this new line immediately after the test count line:**

> - IPFS badge pinning verified on testnet — Token #1 is Level 1 Corporal with badge image pinned at ipfs://bafybeihz3ugt56zztjzqj7syfe4h7vdmvplowzr7drdvfekjna2g2x52ny/chainboi-1.png.
