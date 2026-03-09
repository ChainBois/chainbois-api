# ChainBois - NFT, Weapon & Token System

Complete documentation of the NFT lifecycle, weapon system, $BATTLE token, metadata flow, and costs.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [ChainBoi NFTs (ERC-721)](#2-chainboi-nfts-erc-721)
3. [Weapon NFTs (ERC-721)](#3-weapon-nfts-erc-721)
4. [$BATTLE Token (ERC-20)](#4-battle-token-erc-20)
5. [Metadata System](#5-metadata-system)
6. [NFT Art Generation Pipeline](#6-nft-art-generation-pipeline)
7. [On-Chain vs Off-Chain Data](#7-on-chain-vs-off-chain-data)
8. [Level-Up System (Phase 3)](#8-level-up-system-phase-3)
9. [Weapon Purchase Flow (Phase 5)](#9-weapon-purchase-flow-phase-5)
10. [Points → $BATTLE Conversion (Phase 5)](#10-points--battle-conversion-phase-5)
11. [Cost Breakdown](#11-cost-breakdown)
12. [What You Need to Provide](#12-what-you-need-to-provide)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ChainBois Platform                        │
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ ChainBoi │    │  Weapon  │    │ $BATTLE  │              │
│  │   NFTs   │    │   NFTs   │    │  Token   │              │
│  │ ERC-721  │    │ ERC-721  │    │ ERC-20   │              │
│  │ 4032 max │    │ ~10-30   │    │ 10M cap  │              │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘              │
│       │               │               │                     │
│  Pre-minted to    Pre-minted to    Fixed supply in           │
│  nft_store        weapon_store     rewards wallet            │
│  wallet           wallet           (transfers only)          │
│       │               │               │                     │
│  Users buy ←─── Users buy ←─── Users earn via               │
│  from platform   from platform   points conversion          │
│  (Phase 3+)      (Phase 5+)     (Phase 5+)                 │
│       │               │               │                     │
│  Level 0-7        Named on-chain   Dynamic rate             │
│  stored on-chain  (AK-47, etc)    Auto-burn (deflationary)  │
│       │               │                                     │
│  Unlocks chars    Premium weapons                           │
│  in game          in game                                   │
└─────────────────────────────────────────────────────────────┘
```

### Three Token Types

| Token | Standard | Supply | Purpose |
|-------|----------|--------|---------|
| ChainBoi NFT | ERC-721 | 4,032 (mainnet) / 50 (testnet) | Character avatars with on-chain level |
| Weapon NFT | ERC-721 | ~10-30 (your choice) | Premium weapons for gameplay |
| $BATTLE Token | ERC-20 (Capped) | 10,000,000 fixed (pre-minted to rewards wallet) | In-game currency, tournament prizes, airdrops |

---

## 2. ChainBoi NFTs (ERC-721)

### Contract: `ChainBoisNFT.sol`

- **Name**: "ChainBois"
- **Symbol**: "CBOI"
- **Token IDs**: Start at 1, auto-increment
- **Owner**: Deployer wallet (platform-controlled)

### Lifecycle

```
1. GENERATION
   Trait images → HashLips → 4032 unique PNGs + metadata JSONs
                                    ↓
2. IPFS UPLOAD
   Images → Pinata IPFS → imagesCID
   Metadata (with image URIs) → Pinata IPFS → metadataCID
                                    ↓
3. MINTING
   deployer calls contract.mint(nft_store_address) × 4032
   contract.setBaseURI("ipfs://{metadataCID}/")
   All NFTs now owned by nft_store wallet
                                    ↓
4. USER PURCHASE (Phase 3+)
   User pays AVAX → backend verifies payment on-chain
   → nft_store transfers NFT to user's wallet
   → Backend updates MongoDB, Firebase
                                    ↓
5. IN-GAME USE
   Backend reads NFT ownership via Glacier Data API
   Backend reads level from contract.getLevel(tokenId)
   Writes { hasNFT: true, level: N } to Firebase
   Unity game reads Firebase → unlocks characters
                                    ↓
6. LEVEL-UP (Phase 3+)
   User pays AVAX → backend calls contract.setLevel(tokenId, newLevel)
   Level stored on-chain permanently
   Backend updates IPFS metadata with new level
   Backend triggers Glacier reindex
                                    ↓
7. SECONDARY MARKET
   Users can trade NFTs freely on Joepegs, Campfire, etc.
   When new owner logs in, backend detects new ownership
   Previous owner auto-downgraded to WEB2
   New owner auto-upgraded to WEB3
```

### What an NFT Gives You

| Level | Characters Unlocked | Cumulative Total |
|-------|-------------------|-----------------|
| 0 (no NFT) | Recruit A, B, C, D | 4 |
| 0 (with NFT) | Same as above | 4 |
| 1 | +Soldier A, B, C, D | 8 |
| 2 | +Veteran A, B, C, D | 12 |
| 3 | +Elite A, B, C, D | 16 |
| 4 | +Spec_Ops A, B, C, D | 20 |
| 5 | +Commander A, B, C, D | 24 |
| 6 | +General A, B, C, D | 28 |
| 7 | +Legend A, B, C, D | 32 |

Without an NFT (WEB2 players): only the 4 base characters.

### On-Chain Data

Stored directly in the smart contract:

```solidity
mapping(uint256 => uint8) public nftLevel;  // tokenId → level (0-7)
```

- `ownerOf(tokenId)` → current owner address
- `getLevel(tokenId)` → level (0-7)
- `totalSupply()` → total minted
- `tokenURI(tokenId)` → `{baseURI}{tokenId}.json` (IPFS link)

---

## 3. Weapon NFTs (ERC-721)

### Contract: `WeaponNFT.sol`

- **Name**: "ChainBois Weapons"
- **Symbol**: "CBWEP"
- **Token IDs**: Start at 1, auto-increment
- **Owner**: Deployer wallet

### How Weapons Work

```
WEAPON TYPES:

┌─────────────────────────────────────────┐
│ BASE WEAPONS (always available, NOT NFTs)│
│ • Pistol                                 │
│ • Knife                                  │
│ • Shotgun                                │
│ • SMG                                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ PREMIUM WEAPONS (NFTs, purchasable)      │
│ • AK-47        (tokenId: 1)             │
│ • M4A1         (tokenId: 2)             │
│ • Sniper Rifle (tokenId: 3)             │
│ • Rocket Launcher (tokenId: 4)          │
│ • Flamethrower (tokenId: 5)             │
│ • ... (whatever you provide)            │
└─────────────────────────────────────────┘
```

### Weapon Lifecycle

```
1. CREATION
   You provide weapon images (one PNG per weapon)
   Filename = weapon name (e.g., "AK-47.png")
                        ↓
2. IPFS UPLOAD
   Images uploaded → imagesCID
   Auto-generated metadata → metadataCID
                        ↓
3. MINTING
   deployer calls contract.mint(weapon_store, "AK-47") for each weapon
   Weapon name stored on-chain: weaponName[tokenId] = "AK-47"
   All weapons now owned by weapon_store wallet
                        ↓
4. USER PURCHASE (Phase 5 - Armory)
   User pays AVAX → backend verifies payment
   → weapon_store transfers weapon NFT to user
   → Backend writes weapon list to Firebase
   → Game reads Firebase → unlocks weapon in-game
                        ↓
5. IN-GAME DISPLAY
   Backend detects weapon ownership via Glacier Data API
   Returns weapon names from Glacier metadata (falls back to "Weapon #N")
   Writes weapon list to Firebase for Unity
```

### On-Chain Data

```solidity
mapping(uint256 => string) public weaponName;  // tokenId → "AK-47"
```

- `weaponName(tokenId)` → weapon name string
- `ownerOf(tokenId)` → current owner address
- `tokenURI(tokenId)` → `{baseURI}{tokenId}.json` (IPFS link)

### How Weapon Names Flow

```
Upload:   "AK-47.png" filename
           ↓
IPFS:     metadata: { "name": "Weapon #1 - AK-47", "attributes": [{"trait_type": "Weapon Name", "value": "AK-47"}] }
           ↓
Mint:     contract.mint(weapon_store, "AK-47") → stores "AK-47" on-chain
           ↓
Lookup:   Glacier API returns NFT with metadata including name
           ↓
API:      Backend reads name from Glacier metadata (w.metadata.name), falls back to "Weapon #N"
           ↓
Response: { "weapons": [{ "tokenId": 1, "name": "AK-47" }] }
           ↓
Firebase: { weapons: ["AK-47"] }
           ↓
Game:     Unity reads Firebase → player has AK-47
```

---

## 4. $BATTLE Token (ERC-20 Capped)

### Contract: `BattleToken.sol`

- **Name**: "Battle Token"
- **Symbol**: "BATTLE"
- **Decimals**: 18 (standard)
- **Max Supply**: 10,000,000 (ERC20Capped — enforced on-chain, cannot be exceeded)
- **Supply Model**: All 10M tokens pre-minted to the rewards wallet at deployment. No further minting occurs.

### Token Flow

```
EARNING $BATTLE:
  Player earns points in-game (score synced via Firebase)
  Player converts points → $BATTLE at DYNAMIC rate (based on rewards health)
  Backend TRANSFERS from rewards wallet (not minted)
  Rate examples: ABUNDANT tier = 1:1, SCARCE tier = 1:0.3

SPENDING $BATTLE:
  Level-up NFT: costs AVAX — paid to prize_pool wallet
  Weapon purchase: costs $BATTLE — paid to weapon_store wallet

WEAPON STORE SWEEP (every 6 hours):
  weapon_store $BATTLE balance checked
  If > 10 BATTLE: split by health tier
    → X% permanently BURNED (supply decreases forever)
    → Y% recycled back to rewards wallet
  Burn/recycle ratio adjusts dynamically (50/50 at healthy → 10/90 at critical)

TOURNAMENT PRIZES:
  1st: 60% of pool (AVAX from level-ups)
  2nd: 25% of pool (AVAX)
  3rd: 15% of pool ($BATTLE from rewards wallet)

AUTO-BURN:
  Permanent on-chain burn via contract.burn(amount)
  Total supply can NEVER increase — truly deflationary
  Burn rate decreases as supply drops (asymptotic sustainability)
```

### Dynamic Tokenomics (Health Tiers)

| Tier | Rewards Health | Conversion Rate | Airdrop Multiplier | Burn Rate | Recycle Rate |
|------|---------------|-----------------|--------------------|-----------|----|
| ABUNDANT | ≥75% | 1 pt → 1 BATTLE | 100% | 50% | 50% |
| HEALTHY | 50-75% | 1 pt → 0.75 BATTLE | 75% | 40% | 60% |
| MODERATE | 30-50% | 1 pt → 0.5 BATTLE | 50% | 30% | 70% |
| SCARCE | 15-30% | 1 pt → 0.3 BATTLE | 30% | 20% | 80% |
| CRITICAL | <15% | 1 pt → 0.15 BATTLE | 15% | 10% | 90% |

Health % = `rewardsBalance / 10,000,000 * 100`

### Key Functions

```javascript
// Transfer from rewards wallet for conversions/prizes
transferBattleTokens(toAddress, amount, signerPrivateKey)

// Check a user's or wallet's balance
getBattleBalance(walletAddress)  // returns "100.0" (formatted)

// Permanently burn tokens (weapon_store sweep)
burnBattleTokens(amount, signerPrivateKey)

// Check remaining total supply
getBattleTotalSupply()  // returns formatted total
```

---

## 5. Metadata System

### ChainBoi NFT Metadata (on IPFS)

Each ChainBoi NFT has a JSON metadata file stored on IPFS. The contract's `tokenURI(tokenId)` returns `ipfs://{metadataCID}/{tokenId}.json`.

**Initial metadata (at mint time):**

```json
{
  "name": "ChainBoi #42",
  "description": "ChainBois Genesis Collection",
  "image": "ipfs://QmImagesCID/42.png",
  "dna": "a8b3c7d4e9f2...",
  "edition": 42,
  "date": 1709472000000,
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Body", "value": "Armored" },
    { "trait_type": "Eyes", "value": "Cyber" },
    { "trait_type": "Mouth", "value": "Mask" },
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

**After level-up and gameplay (updated periodically):**

```json
{
  "name": "ChainBoi #42",
  "description": "ChainBois Genesis Collection",
  "image": "ipfs://QmImagesCID/42.png",
  "dna": "a8b3c7d4e9f2...",
  "edition": 42,
  "date": 1709472000000,
  "attributes": [
    { "trait_type": "Background", "value": "Blue" },
    { "trait_type": "Body", "value": "Armored" },
    { "trait_type": "Eyes", "value": "Cyber" },
    { "trait_type": "Mouth", "value": "Mask" },
    { "trait_type": "Accessory", "value": "Crown" },
    { "trait_type": "Level", "value": "3" },
    { "trait_type": "Tournament Wins", "value": "2" }
  ],
  "collection": "ChainBois Genesis",
  "level": 3,
  "badges": ["Tournament Winner", "100 Kills"],
  "inGameStats": {
    "kills": 247,
    "score": 15000,
    "gamesPlayed": 45
  }
}
```

### How Metadata Gets Updated

NFT metadata lives on IPFS (immutable), but we can:

1. **Update metadata JSON files** locally → re-upload to Pinata → get new CID
2. **Update `baseURI`** on the contract to point to the new CID
3. **Trigger Glacier reindex** so marketplaces/explorers fetch the new metadata

**This happens periodically in batch** (not per-action):

```
Player levels up NFT #42
  → on-chain: contract.setLevel(42, 3)        ← instant, on-chain
  → MongoDB: user.level = 3                   ← instant
  → Firebase: { level: 3 }                    ← instant (game reads this)
  → IPFS metadata: NOT updated immediately     ← batch update later

Batch metadata update (cron or manual):
  → Read all NFT levels/stats from MongoDB
  → Update JSON metadata files
  → Re-upload to Pinata → new metadataCID
  → contract.setBaseURI(newBaseURI)
  → Glacier reindex for affected tokens
```

**Why batch updates?**
- IPFS uploads cost money (Pinata free tier has limits)
- Each baseURI update is a gas-costing transaction
- Game doesn't read from IPFS metadata - it reads from Firebase
- IPFS metadata is primarily for marketplaces/explorers

### Weapon NFT Metadata (on IPFS)

```json
{
  "name": "Weapon #1 - AK-47",
  "description": "ChainBois Weapon: AK-47",
  "image": "ipfs://QmWeaponImagesCID/AK-47.png",
  "attributes": [
    { "trait_type": "Weapon Name", "value": "AK-47" }
  ]
}
```

Weapon metadata is static - it doesn't change after minting. The weapon name is also stored on-chain for faster lookup.

---

## 6. NFT Art Generation Pipeline

### Complete Pipeline Diagram

```
YOU PROVIDE:                    SCRIPTS DO:                     OUTPUT:

traits.zip ─────────────→ generateNftArt.js ─────────→ build/chainbois/
  ├── 01_Background/            │                          ├── images/
  │   ├── Blue#50.png           │ 1. Clone HashLips         │   ├── 1.png
  │   └── Red#30.png            │ 2. Extract traits          │   ├── 2.png
  ├── 02_Body/                  │ 3. Configure engine        │   └── ...20.png
  │   ├── Default#60.png        │ 4. Generate art            └── json/
  │   └── Armored#25.png        │ 5. Add game metadata           ├── 1.json
  └── ...                       │ 6. Copy to build/               ├── 2.json
                                ↓                                 └── ...20.json
                                                                      │
                                                                      ↓
                         uploadToIpfs.js chainbois ────────→ IPFS (Pinata)
                                │                              ├── images/ → imagesCID
                                │ 1. Upload images             └── metadata/ → metadataCID
                                │ 2. Update JSON with URIs
                                │ 3. Upload metadata           deployments/
                                │ 4. Save CIDs                   └── fuji-ipfs-chainbois.json
                                ↓
                         mintChainbois.js 20 ──────────────→ On-Chain
                                │                              ├── Token #1 → nft_store
                                │ 1. Set baseURI               ├── Token #2 → nft_store
                                │ 2. Batch mint to nft_store   └── ...Token #20 → nft_store
                                │ 3. Track progress
                                ↓

weapons.zip ─────────────→ uploadToIpfs.js weapons ────→ IPFS (Pinata)
  ├── AK-47.png                 │                          ├── images/ → imagesCID
  ├── M4A1.png                  │ 1. Extract images         └── metadata/ → metadataCID
  └── ...                       │ 2. Create metadata
                                │ 3. Upload both            deployments/
                                ↓ 4. Save CIDs               └── fuji-ipfs-weapons.json

                         mintWeapons.js ───────────────→ On-Chain
                                │                          ├── Token #1 "AK-47" → weapon_store
                                │ 1. Set baseURI            ├── Token #2 "M4A1" → weapon_store
                                │ 2. Mint each weapon       └── ...
                                │ 3. Pass name on-chain
                                ↓
```

### HashLips Art Engine Details

[HashLips](https://github.com/HashLips/hashlips_art_engine) is the most widely-used tool for generative NFT art. It:

1. Takes layered PNG folders as input
2. Randomly combines one trait from each layer
3. Uses DNA hashing to ensure uniqueness
4. Respects rarity weights (`#weight` in filenames)
5. Outputs numbered PNGs + matching metadata JSONs

Our `generateNftArt.js` script wraps HashLips:
- Auto-clones the repo (one-time)
- Programmatically writes the config file based on your trait folders
- Adds ChainBois-specific metadata fields (`level`, `badges`, `inGameStats`)
- Handles the full execution and copies output

---

## 7. On-Chain vs Off-Chain Data

### Where Data Lives

| Data | Location | Why |
|------|----------|-----|
| NFT ownership | Smart Contract | Trustless, tradeable on marketplaces |
| NFT level (0-7) | Smart Contract | Permanent, verifiable, affects gameplay |
| Weapon name | Smart Contract | Permanent, verifiable |
| NFT image | IPFS (Pinata) | Decentralized, immutable per CID |
| NFT metadata JSON | IPFS (Pinata) | Decentralized, readable by marketplaces |
| User profile | MongoDB | Fast queries, mutable |
| Game score | Firebase RTDB → MongoDB | Real-time (Firebase) + persistent (MongoDB) |
| Points balance | MongoDB | Backend-managed, no on-chain gas cost |
| $BATTLE balance | Smart Contract + MongoDB | On-chain is source of truth, MongoDB is cache |
| Leaderboard | MongoDB | Complex queries, sorted, time-boxed |
| Security/ban data | MongoDB | Backend-only, not player-visible |

### Data Flow for a Login

```
1. User connects wallet on frontend
2. Frontend sends POST /auth/login { address: "0x..." }
3. Backend queries Glacier Data API:
   - "What ERC-721 tokens does 0x... own from contract CHAINBOIS_NFT_ADDRESS?"
   - Returns: [{ tokenId: 42, ... }]
4. Backend queries smart contract:
   - contract.getLevel(42) → 3
5. Backend queries Glacier again:
   - "What ERC-721 tokens does 0x... own from contract WEAPON_NFT_ADDRESS?"
   - Returns: [{ tokenId: 1, metadata: { name: "AK-47" } }]
6. Backend updates MongoDB user:
   - hasNft: true, nftTokenId: 42, level: 3, playerType: "web3"
7. Backend writes to Firebase RTDB:
   - users/{uid}: { hasNFT: true, level: 3, weapons: ["AK-47"] }
8. Game reads Firebase → unlocks level 3 characters + AK-47
```

---

## 8. Level-Up System (Phase 3)

### How Level-Up Will Work

```
Player at Level 2 wants to reach Level 3:

1. Frontend displays: "Level Up to Level 3 — Cost: 1 AVAX"
2. User sends 1 AVAX to prize_pool wallet via their connected wallet
3. Frontend sends txHash to backend: POST /training/level-up { txHash }
4. Backend verifies on-chain:
   - tx exists, status=1, correct sender/receiver, amount >= 1 AVAX, age < 5 min
5. Backend calls contract:
   - contract.setLevel(tokenId, 3)  ← deployer signs this
6. Backend updates:
   - MongoDB: user.level = 3
   - Firebase: { level: 3 }
7. Frontend refreshes → shows 16 characters unlocked
```

### Level-Up Costs

| From → To | Cost | Currency | Paid To |
|-----------|------|----------|---------|
| 0 → 1 | 1 AVAX | AVAX | prize_pool wallet |
| 1 → 2 | 1 AVAX | AVAX | prize_pool wallet |
| 2 → 3 | 1 AVAX | AVAX | prize_pool wallet |
| ... | ... | ... | ... |
| 6 → 7 | 1 AVAX | AVAX | prize_pool wallet |

Level-up AVAX goes to the prize pool, funding tournament rewards.

---

## 9. Weapon Purchase Flow (Phase 5)

### How Weapon Purchase Will Work

```
1. Frontend shows Armory: available weapon NFTs in weapon_store
2. User selects "AK-47" — Price: X AVAX
3. User sends AVAX to weapon_store wallet
4. Frontend sends txHash: POST /armory/purchase { txHash, tokenId }
5. Backend verifies payment on-chain
6. Backend transfers weapon NFT: weapon_store → user's wallet
7. Backend updates:
   - MongoDB: adds weapon to user's inventory
   - Firebase: { weapons: ["AK-47"] }
8. Game reads Firebase → player now has AK-47 in-game
```

---

## 10. Points → $BATTLE Conversion (Phase 5)

### How Conversion Works

```
1. Player has 500 points (earned by playing)
2. Frontend shows: "Convert 500 points → X $BATTLE" (dynamic rate)
3. Player confirms
4. Backend:
   - Checks rewards wallet health tier
   - Calculates effective BATTLE: 500 * multiplier (e.g. 500 * 0.75 = 375 at HEALTHY tier)
   - Deducts 500 from user.pointsBalance in MongoDB
   - Transfers 375 $BATTLE from rewards wallet to user
5. 375 $BATTLE tokens now in user's wallet
6. Visible on-chain and in wallet apps
```

Conversion rate: **Dynamic** — based on rewards wallet health tier. At ABUNDANT (≥75% of supply remaining): 1:1. At CRITICAL (<15%): 1:0.15. See Dynamic Tokenomics section above.

---

## 11. Cost Breakdown

### Testnet Deployment (Fuji)

| Item | AVAX Cost | USD Equivalent* |
|------|-----------|-----------------|
| Deploy 3 contracts | ~0.15 | Free (testnet) |
| Set baseURI (2 contracts) | ~0.01 | Free (testnet) |
| Mint 20 ChainBoi NFTs | ~0.06 | Free (testnet) |
| Mint 10 Weapon NFTs | ~0.04 | Free (testnet) |
| Mint $BATTLE to 3 test wallets | ~0.01 | Free (testnet) |
| Fund 3 test wallets (1 AVAX each) | 3.00 | Free (testnet) |
| Transfer NFTs to test users | ~0.01 | Free (testnet) |
| **Total** | **~3.3** | **Free** |

*Testnet AVAX has no real value - obtained free from faucet.

### Mainnet Deployment (Avalanche)

| Item | AVAX Cost | USD Equivalent* |
|------|-----------|-----------------|
| Deploy 3 contracts | ~0.15 | ~$3 |
| Mint 4,032 ChainBoi NFTs | ~12.0 | ~$240 |
| Mint ~20 Weapon NFTs | ~0.08 | ~$2 |
| Set baseURI (2 contracts) | ~0.01 | ~$0.20 |
| **Total** | **~12.3** | **~$246** |

*Assuming AVAX ≈ $20. Actual cost depends on AVAX price and network gas.

### Ongoing Operational Costs

| Operation | Frequency | AVAX Cost |
|-----------|-----------|-----------|
| Mint $BATTLE for prizes | Per tournament | ~0.01 per mint |
| Level-up (setLevel) | Per user action | ~0.003 |
| Transfer NFT to buyer | Per sale | ~0.005 |
| Metadata batch update | Weekly/monthly | ~0.01 (setBaseURI) |
| IPFS pinning (Pinata) | Monthly | Free tier / $20/month |

### Pinata IPFS Costs

| Tier | Price | Storage | Uploads |
|------|-------|---------|---------|
| Free | $0 | 1 GB | 500 |
| Pro | $20/month | 25 GB | Unlimited |

For testnet (20 NFTs + 10 weapons): Free tier is plenty.
For mainnet (4,032 NFTs + 20 weapons): Free tier might be tight. Pro recommended.

---

## 12. What You Need to Provide

### Summary Checklist

| Item | Format | When Needed | Notes |
|------|--------|-------------|-------|
| Trait layer images | ZIP of folders of PNGs | Before Step 6 | See format requirements below |
| Weapon images | ZIP of PNGs | Before Step 8b | Filename = weapon name |
| Pinata account | JWT token | Before Step 8 | Free tier works for testnet |
| Firebase credentials | Service account JSON | Before Step 1 | Project ID, client email, private key |
| AVAX for gas | Testnet: free faucet | Before Step 3 | Mainnet: ~13 AVAX |
| Discord webhook URL | URL string | Optional | For prize notifications |

### Trait Images Requirements

**Folder structure:**
```
traits.zip
├── 01_Background/     ← Number prefix for layer order
│   ├── Blue#50.png    ← "#50" = rarity weight (higher = more common)
│   ├── Red#30.png
│   └── Gold#20.png
├── 02_Body/
│   ├── Default#60.png
│   └── Armored#40.png
├── 03_Eyes/
│   └── ...
├── 04_Mouth/
│   └── ...
└── 05_Accessory/
    └── ...
```

**Image specs:**
- Format: PNG with transparency
- Size: All must be the same dimensions (1024x1024 recommended)
- Layers stack bottom-to-top (01_ is background, last folder is foreground)
- Need enough combinations for your target: 5 layers × 5 traits = 3,125 unique

### Weapon Images Requirements

**Folder structure:**
```
weapons.zip
├── AK-47.png
├── M4A1.png
├── Sniper-Rifle.png
├── Rocket-Launcher.png
└── ...
```

**Image specs:**
- Format: PNG, JPG, or WEBP
- Size: 512x512 or 1024x1024 (consistent)
- Filename becomes the on-chain weapon name (minus extension)
- Typically 5-30 weapons
