# Phase 2: Smart Contracts, NFT Generation & Token Deployment

## Overview
Deploy smart contracts ($BATTLE token, ChainBois NFT, Weapon NFT) on Avalanche Fuji testnet, generate ChainBoi NFT collection with HashLips art engine, upload metadata to IPFS via Pinata, pre-mint NFTs to platform wallets, create test wallets, and run full integration tests validating the Phase 1 + Phase 2 flow end-to-end.

**Env-based switching**: All contract addresses, RPC URLs, and DB URIs are already env-var driven. For testnet vs mainnet, user swaps `.env` file (or uses `.env.testnet` / `.env.mainnet`). DB switches via `NETWORK=prod` env var (existing pattern in `config/db.js`). RPC/chain via `AVAX_RPC_URL` + `AVAX_CHAIN_ID` (existing pattern in `utils/avaxUtils.js`).

---

## Prerequisites
1. User provides zipped traits folder for ChainBoi collection (`/layers/` structure)
2. User provides zipped weapon images
3. Pinata API keys for IPFS uploads
4. Fuji testnet AVAX for deployment (faucet: https://faucet.avax.network)
5. Discord webhook URL for notifications (optional for Phase 2)

---

## Architecture

### Smart Contracts (Solidity, deployed via Hardhat)

**1. $BATTLE Token (ERC-20)**
- Standard ERC-20 with owner-only `mint(to, amount)` function
- Owner = deployer (backend platform wallet)
- No max supply cap initially (mint as needed for rewards)
- `burn(amount)` for future deflationary mechanics

**2. ChainBois NFT (ERC-721)**
- Standard ERC-721 with auto-increment tokenId starting at 1 (to match HashLips edition numbering)
- Owner-only `mint(to)` returns new tokenId
- `setBaseURI(uri)` for metadata updates (IPFS CID changes)
- Override `tokenURI(tokenId)` to return `{baseURI}{tokenId}.json` (OZ default omits `.json`)
- Mapping: `tokenId → level` (uint8, 0-7) stored on-chain
- `setLevel(tokenId, level)` owner-only (backend calls after level-up payment verified)
- `getLevel(tokenId)` public view
- Pre-mint to platform `nft_store` wallet (small batch for testnet, full collection for mainnet)

**3. Weapon NFT (ERC-721)**
- Standard ERC-721 with auto-increment tokenId starting at 1
- Owner-only `mint(to, weaponName)` stores weapon name on-chain
- Override `tokenURI` to append `.json` (same as ChainBoisNFT)
- `setBaseURI(uri)` for metadata
- `getWeaponName(tokenId)` public view
- Pre-mint weapons to platform `weapon_store` wallet

### Platform Wallets (4 wallets)
1. **deployer** - Deploys contracts, owns them, holds admin keys
2. **nft_store** - Holds pre-minted ChainBoi NFTs for sale
3. **weapon_store** - Holds pre-minted Weapon NFTs for sale
4. **prize_pool** - Holds $BATTLE tokens for tournament prizes

All wallet private keys AES-encrypted in MongoDB via existing `cryptUtils.js` + `walletModel.js`.

### IPFS Metadata (Pinata)
- Upload generated images → get images CID
- Generate metadata JSON with image URIs → upload → get metadata CID
- Set contract `baseURI` to `ipfs://{metadataCID}/`
- For dynamic updates (level, badges): re-upload metadata, update baseURI, call reindex

---

## Files to Create

### New Files (14)

1. **`contracts/BattleToken.sol`** - ERC-20 $BATTLE token
2. **`contracts/ChainBoisNFT.sol`** - ERC-721 with level mapping, tokenURI override
3. **`contracts/WeaponNFT.sol`** - ERC-721 with weapon names, tokenURI override
4. **`hardhat.config.js`** - Hardhat config with Fuji/Mainnet networks
5. **`scripts/deploy.js`** - Deploy all 3 contracts, save to `deployments/{network}.json`
6. **`scripts/extractAbis.js`** - Extract ABIs from Hardhat artifacts → `abis/` directory
7. **`scripts/generateWallets.js`** - Generate 4 platform wallets, encrypt & save to DB
8. **`scripts/mintChainbois.js`** - Batch mint ChainBoi NFTs to nft_store (deployer calls mint)
9. **`scripts/mintWeapons.js`** - Batch mint Weapon NFTs to weapon_store
10. **`scripts/uploadToIpfs.js`** - Upload images + metadata to Pinata IPFS
11. **`scripts/generateNftArt.js`** - Clone HashLips + configure + run + post-process metadata
12. **`scripts/fundTestWallets.js`** - Create test user wallets, fund with testnet AVAX + $BATTLE + NFTs
13. **`scripts/testIntegration.js`** - Standalone integration test script (hits real blockchain)
14. **`abis/`** - Directory with extracted ABI JSON files (committed to git)

### New Directories
- **`contracts/`** - Solidity source files
- **`abis/`** - Extracted ABI JSONs for runtime use
- **`deployments/`** - Network-specific deployment info (gitignored)
- **`nft-generation/`** - HashLips engine clone + layers + build output (gitignored)
- **`build/`** - Processed NFT images/metadata ready for IPFS upload (gitignored)

### Modified Files (4)

1. **`utils/contractUtils.js`** - Replace placeholder ABIs with real compiled ABIs loaded from `abis/` directory
2. **`models/walletModel.js`** - Add "deployer" and "test" to role enum
3. **`package.json`** - Add dependencies (see below)
4. **`.gitignore`** - Add Hardhat, nft-generation, deployments, build directories

**No changes needed**: `utils/avaxUtils.js` (already env-var driven), `config/db.js` (already supports prod/dev switching)

**Dependencies** (package.json):
- devDependencies: `hardhat`, `@nomicfoundation/hardhat-toolbox`, `@openzeppelin/contracts` (Solidity compilation only)
- dependencies: `pinata-sdk`, `form-data` (used by IPFS upload script)

**New directory**: `abis/` - Contains extracted ABI JSON files from Hardhat compilation artifacts (BattleToken.json, ChainBoisNFT.json, WeaponNFT.json). These are committed to git so runtime doesn't need Hardhat.

---

## Implementation Order

### Step 1: Project Setup & Dependencies
```
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
npm install pinata-sdk form-data
```

Create `hardhat.config.js`:
- Networks: `fuji` (43113) and `mainnet` (43114)
- RPC URLs hardcoded per network in config (standard Hardhat pattern - Fuji and Mainnet public RPCs)
- Deployer private key from env: `DEPLOYER_PRIVATE_KEY`
- Solidity 0.8.20, evmVersion: "cancun" (required for Avalanche)
- Snowtrace verification via `@nomicfoundation/hardhat-verify` with Snowtrace API URL

### Step 2: Smart Contracts

**BattleToken.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BattleToken is ERC20, Ownable {
    constructor() ERC20("Battle Token", "BATTLE") Ownable(msg.sender) {}
    function mint(address to, uint256 amount) external onlyOwner { _mint(to, amount); }
    function burn(uint256 amount) external { _burn(msg.sender, amount); }
}
```

**ChainBoisNFT.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ChainBoisNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId = 1; // Start at 1 to match HashLips editions
    string private _baseTokenURI;
    mapping(uint256 => uint8) public nftLevel;

    constructor() ERC721("ChainBois", "CBOI") Ownable(msg.sender) {}

    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Override to append .json (OZ default: baseURI + tokenId, no extension)
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        return bytes(base).length > 0 ? string.concat(base, tokenId.toString(), ".json") : "";
    }

    function setLevel(uint256 tokenId, uint8 level) external onlyOwner {
        require(level <= 7, "Max level is 7");
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        nftLevel[tokenId] = level;
    }

    function getLevel(uint256 tokenId) external view returns (uint8) {
        return nftLevel[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1; // Subtract 1 since _nextTokenId starts at 1
    }
}
```

**WeaponNFT.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WeaponNFT is ERC721, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId = 1;
    string private _baseTokenURI;
    mapping(uint256 => string) public weaponName;

    constructor() ERC721("ChainBois Weapons", "CBWEP") Ownable(msg.sender) {}

    function mint(address to, string calldata name) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        weaponName[tokenId] = name;
        return tokenId;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        string memory base = _baseURI();
        return bytes(base).length > 0 ? string.concat(base, tokenId.toString(), ".json") : "";
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }
}
```

### Step 3: Hardhat Deploy Script (`scripts/deploy.js`)

Deploys all 3 contracts sequentially:
1. Deploy BattleToken → save address
2. Deploy ChainBoisNFT → save address
3. Deploy WeaponNFT → save address
4. Write addresses to `deployments/{network}.json`
5. Print addresses + verification commands

**Output file** `deployments/fuji.json`:
```json
{
  "network": "fuji",
  "chainId": 43113,
  "deployer": "0x...",
  "contracts": {
    "BattleToken": "0x...",
    "ChainBoisNFT": "0x...",
    "WeaponNFT": "0x..."
  },
  "deployedAt": "2026-03-03T..."
}
```

After deployment:
- Script prints addresses + Snowtrace verification commands
- User copies addresses to `.env`:
```
BATTLE_TOKEN_ADDRESS=0x...
CHAINBOIS_NFT_ADDRESS=0x...
WEAPON_NFT_ADDRESS=0x...
```
- User runs verification: `npx hardhat verify --network fuji <address>`

### Step 4: Generate Platform Wallets (`scripts/generateWallets.js`)

Uses existing `avaxUtils.createWallet()` and `cryptUtils.encrypt()`:
1. Generate 4 wallets (deployer, nft_store, weapon_store, prize_pool)
2. Encrypt private keys with AES
3. Save to MongoDB via `Wallet.create()`
4. Print addresses for user to fund via faucet
5. **DEPLOYER ONLY**: Also print the private key ONCE so user can copy to `.env` as `DEPLOYER_PRIVATE_KEY` (needed for Hardhat deploy and scripts). All other keys stay encrypted in DB only.
6. Skip wallets that already exist (idempotent)

### Step 5: NFT Art Generation (`scripts/generateNftArt.js`)

**Prerequisites**: User SCP's traits zip to server

**HashLips Integration Strategy**:
- Clone hashlips_art_engine into `nft-generation/` subdirectory (gitignored)
- Run `cd nft-generation && npm install` to install canvas + dependencies
- Our script configures HashLips's `src/config.js` programmatically before running

Process:
1. Clone hashlips_art_engine to `nft-generation/` (if not already present)
2. Unzip user's traits folder to `nft-generation/layers/`
3. Auto-detect layer folders and configure `src/config.js`:
   - `growEditionSizeTo`: configurable via CLI arg (default 20 for testnet, 4032 for mainnet)
   - `layersOrder` auto-detected from folder names (alphabetical, or user-specified order file)
   - Canvas size: 1024x1024
   - `namePrefix: "ChainBoi"`
   - `description: "ChainBois Genesis Collection"`
4. Run HashLips: `cd nft-generation && node index.js`
5. Output: `nft-generation/build/images/` + `nft-generation/build/json/`
6. Post-process metadata JSONs (our script):
   - Add `level: 0`, `badges: []`, `inGameStats: {}` fields
   - Add `collection: "ChainBois Genesis"`
   - Image URI placeholder (filled after IPFS upload in Step 6)
7. Copy output to `build/chainbois/` for IPFS upload

**Note**: `nft-generation/` is gitignored. The script is idempotent - re-running with same layers regenerates.

**.gitignore additions for Phase 2**:
```
# Hardhat
artifacts/
cache/
typechain-types/

# NFT Generation
nft-generation/
build/

# Deployments (contain addresses, session state)
deployments/

# Pinata/IPFS secrets handled by .env gitignore
```

### Step 6: Upload to IPFS (`scripts/uploadToIpfs.js`)

Uses Pinata SDK:
1. Pin entire `build/images/` folder → get images CID
2. Update all metadata JSONs: `image: "ipfs://{imagesCID}/{tokenId}.png"`
3. Pin entire `build/json/` folder → get metadata CID
4. Save CIDs to `deployments/{network}-ipfs.json`
5. Call `chainboisNft.setBaseURI("ipfs://{metadataCID}/")` on-chain

For weapons:
1. User provides weapon images zip
2. Unzip, create simple metadata JSON per weapon
3. Pin images → get CID
4. Update metadata → pin → get CID
5. Call `weaponNft.setBaseURI("ipfs://{weaponMetadataCID}/")`

### Step 7: Batch Mint NFTs (`scripts/mintChainbois.js`)

**Important**: Deployer wallet calls `mint(to)` since only owner can mint. The `to` parameter is the nft_store address.

**Testnet vs Mainnet**: Pass count as CLI arg. For testnet: `node scripts/mintChainbois.js 20`. For mainnet: `node scripts/mintChainbois.js 4032`.

Follows reference project resilient minting pattern:
1. Load deployer wallet key from DB (decrypt)
2. Get nft_store wallet address from DB
3. Use ethers.js NonceManager to handle rapid sequential transactions
4. Mint in batches of 20, 3-second pause between batches (safe for public RPC)
5. Track progress in `deployments/mint-session-chainbois.json`:
   ```json
   {
     "status": "in_progress",
     "totalTarget": 20,
     "completed": [{ "tokenId": 1, "txHash": "0x...", "mintedAt": "ISO-8601" }],
     "failed": [{ "tokenId": 3, "error": "...", "timestamp": "ISO-8601" }],
     "currentBatch": 1,
     "lastUpdate": "ISO-8601"
   }
   ```
6. Save progress after each mint (survives disconnections)
7. Resume-safe: re-running checks `chainboisNft.totalSupply()` and skips already-minted
8. Parse Transfer event from receipt to confirm actual tokenId (can't read return value from state-changing tx)
9. After all minted, verify with `chainboisNft.totalSupply()`
10. Retry failed mints at the end

`scripts/mintWeapons.js` - Same pattern for weapon NFTs:
1. Load deployer wallet key, weapon_store address
2. Mint each weapon with name from image filename
3. Track progress in `deployments/mint-session-weapons.json`
4. Typically small count (10-30 weapons)

### Step 8: Fund Test Wallets (`scripts/fundTestWallets.js`)

1. Generate 3 test user wallets (test_user_1, test_user_2, test_user_3)
2. Encrypt & save to DB with role="test"
3. Fund each with 1 AVAX from deployer (for gas)
4. Mint 100 $BATTLE to each from deployer
5. Transfer 1 ChainBoi NFT to test_user_1 from nft_store
6. Transfer 1 Weapon NFT to test_user_1 from weapon_store
7. Print summary of test wallet addresses + balances

### Step 9: Update Existing Code for Real Contracts

**`utils/avaxUtils.js`** - No changes needed. Already reads from env vars:
- `AVAX_RPC_URL` (set to Fuji or Mainnet URL)
- `AVAX_CHAIN_ID` (43113 for Fuji, 43114 for Mainnet)
- `AVAX_DATA_API_URL` (same Data API serves both networks, chain ID in URL path)

**`utils/contractUtils.js`** changes:
- Replace placeholder ABIs with `require("../abis/ChainBoisNFT.json").abi` etc.
- Fix ABI mismatches from Phase 0 placeholders:
  - `tokenLevel` → `getLevel` (actual contract function name)
  - Remove `reserve(address, uint256)` (doesn't exist in our contract)
  - Weapon mint: `mint(address, string uri)` → `mint(address, string name)`
  - Add `weaponName(uint256)` getter for weapon names
  - Add `nftLevel(uint256)` getter (public mapping auto-getter)
- Fix `getNftLevel()`: call `contract.getLevel(tokenId)` instead of `contract.tokenLevel(tokenId)`
- Fix `mintWeaponNft()`: parameter is weapon name, not URI
- Contract address env vars already used - no changes needed there

**`models/walletModel.js`** changes:
- Add "deployer" and "test" to role enum:
  ```js
  enum: ["admin", "prize_pool", "nft_store", "weapon_store", "deployer", "test"]
  ```

### Step 10: Integration Testing

**Two types of tests**:

**A. Automated script** (`scripts/testIntegration.js`) - NOT Jest (hits real blockchain):
- Standalone Node.js script, run manually: `node scripts/testIntegration.js`
- Connects to deployed contracts on Fuji
- Verifies: contract deployment (totalSupply, owner), NFT ownership queries, lookupNftAssets with real addresses, $BATTLE token minting/balance, wallet encryption/decryption round-trip
- Outputs pass/fail for each check with descriptive messages
- Requires `.env` configured with Fuji contract addresses

**B. Manual test flow** (documented in testing guide, Postman):
1. Start server with Fuji `.env`
2. Create Firebase user via `POST /auth/create-user`
3. Login with test_user_1 address via `POST /auth/login`
   - Verify response shows `hasNft: true`, correct `level`, weapons
4. Call `GET /game/characters/{address}` → verify unlocked content matches level
5. Call `POST /game/verify-assets` → verify re-reads on-chain correctly
6. Check Firebase RTDB → verify `hasNFT`, `level`, `weapons` written
7. Manually write Score to Firebase RTDB for test user
8. Trigger `syncScoresJob` manually → verify MongoDB updated
9. Call `GET /auth/me` → verify score, highScore, pointsBalance updated
10. Login with test_user_2 (no NFT) → verify `hasNft: false`, Web2 player
11. Check leaderboard entry created for test_user_1

**C. Phase 1 regression** - Run `npm test` to verify all 187 existing tests still pass

---

## Environment Variables (New for Phase 2)

Existing env vars (already in use from Phase 0/1):
```env
# Network & RPC (already configured per environment)
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc  # Fuji for testnet
AVAX_CHAIN_ID=43113                                        # 43114 for mainnet
AVAX_DATA_API_URL=https://data-api.avax.network            # Same for both

# Database switching (already exists)
NETWORK=dev                    # Set to "prod" for mainnet DB
MONGODB_URI=mongodb://...chainbois_testnet
MONGODB_URI_PROD=mongodb://...chainbois_mainnet

# Wallet Encryption (already exists)
ENCRYPTION_ALGORITHM=aes-256-cbc
ENCRYPTION_KEY=...
```

New env vars for Phase 2:
```env
# Contract Addresses (from deployment output - needed at runtime)
BATTLE_TOKEN_ADDRESS=0x...
CHAINBOIS_NFT_ADDRESS=0x...
WEAPON_NFT_ADDRESS=0x...

# Deployer Key (from generateWallets output - used by Hardhat deploy + scripts only)
# NOT needed at runtime - scripts decrypt wallet keys from DB for operations
DEPLOYER_PRIVATE_KEY=0x...

# IPFS (Pinata - used by upload script only)
PINATA_API_KEY=...
PINATA_SECRET_KEY=...
```

**Switching to mainnet**: Copy `.env` to `.env.testnet`, create new `.env` with mainnet values:
- `AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc`
- `AVAX_CHAIN_ID=43114`
- `NETWORK=prod`
- New contract addresses from mainnet deployment

---

## Postman Collection Structure

```
ChainBois API v1
├── Auth
│   ├── POST /auth/create-user
│   ├── POST /auth/login
│   ├── GET /auth/me
│   └── POST /auth/logout
├── Game
│   ├── POST /game/verify-assets
│   ├── POST /game/set-avatar
│   ├── GET /game/characters/:address
│   ├── GET /game/download/:platform
│   └── GET /game/info
└── Health
    └── GET /health
```

Each request includes:
- Description of what it does
- Required headers (Authorization: Bearer {token})
- Request body example
- Expected response example
- Pre-request script to set auth token (Postman variable)

---

## Frontend Documentation Deliverables

1. **`docs/FRONTEND_API.md`** - Complete API reference:
   - All endpoints, methods, headers, bodies, responses
   - Authentication flow diagram
   - Error codes and handling
   - Rate limits per endpoint

2. **`docs/FRONTEND_INTEGRATION.md`** - Integration guide:
   - Setup steps (install deps, configure env)
   - Auth flow: create user → login → get token → use token
   - Asset verification flow
   - How to read unlocked content
   - WebSocket/polling patterns for real-time data

3. **`docs/POSTMAN_COLLECTION.json`** - Importable Postman collection

4. **`docs/SETUP_GUIDE.md`** - Manual setup for deployment:
   - Server setup (Node.js, PM2, MongoDB, Redis)
   - Environment variables reference
   - Discord webhook setup
   - Database creation (testnet + mainnet)
   - SCP commands for uploading trait/weapon zips
   - Contract deployment steps
   - NFT generation and minting steps
   - Switching from testnet to mainnet

---

## Testing Checklist

### Automated - Integration Script (`node scripts/testIntegration.js`)
- [ ] Contract compilation succeeds (hardhat compile)
- [ ] Deployed contracts return correct owner, totalSupply, names
- [ ] Platform wallet generation + encryption/decryption round-trip
- [ ] getErc721Balances returns minted NFTs for nft_store address
- [ ] lookupNftAssets returns correct data for test_user_1 (has NFT)
- [ ] lookupNftAssets returns defaults for test_user_2 (no NFT)
- [ ] getNftLevel returns 0 for freshly minted NFT
- [ ] setNftLevel + getNftLevel round-trip works
- [ ] $BATTLE token mint + balance query works
- [ ] getWeaponName returns correct name for minted weapon

### Automated - Jest Regression (`npm test`)
- [ ] All 187 Phase 0+1 tests still pass with no changes

### Manual (Postman)
- [ ] Create user → login → verify NFT detected → get characters
- [ ] Login without NFT → verify Web2 player type
- [ ] Set avatar → verify ownership check
- [ ] Write score to Firebase → trigger sync → verify MongoDB + leaderboard
- [ ] Download game files (if zips present)
- [ ] Check rate limiting works
- [ ] Test with expired/invalid Firebase tokens
- [ ] Verify testnet → mainnet switch works (different .env)

---

## Risk Mitigation

1. **Fuji faucet limits**: Faucet gives ~2 AVAX per request. For testnet, only mint 20 NFTs (~0.06 AVAX), well within faucet budget. Full 4032 mint reserved for mainnet.
2. **Batch mint nonce**: Use ethers.js NonceManager to prevent nonce conflicts in rapid transactions
3. **IPFS storage**: Pinata free tier = 500MB. For testnet (20 images), this is fine. For mainnet (4032 images at ~500KB each = ~2GB), need paid plan ($20/mo) or use NFT.Storage (free, backed by IPFS/Filecoin).
4. **Contract bugs**: Use OpenZeppelin battle-tested base contracts, minimal custom logic
5. **Key management**: All private keys encrypted at rest, never logged, select: false in Mongoose
6. **Resume safety**: All batch operations save progress to JSON, can resume after interruption
7. **HashLips engine**: Cloned as subdirectory (gitignored), not modified. Can update independently.

---

## Estimated Gas Costs

**Testnet (Fuji)** - small batch for testing:
- Contract deployment: ~0.05 AVAX × 3 = ~0.15 AVAX
- Mint 20 ChainBoi NFTs: ~0.003 AVAX × 20 = ~0.06 AVAX
- Mint ~10 Weapon NFTs: ~0.003 AVAX × 10 = ~0.03 AVAX
- Token mints + transfers: ~0.01 AVAX
- Fund 3 test wallets: 1 AVAX × 3 = 3 AVAX
- **Total estimated**: ~3.3 AVAX (2 faucet requests)

**Mainnet** - full collection:
- Contract deployment: ~0.15 AVAX
- Mint 4032 ChainBoi NFTs: ~12 AVAX
- Mint weapons: ~0.06 AVAX
- **Total estimated**: ~13 AVAX

---

## Implementation Sequence Summary

**Code writing (can do without user assets/keys):**
1. Install dependencies (hardhat, openzeppelin, pinata-sdk)
2. Write smart contracts (3 .sol files)
3. Write hardhat.config.js
4. Compile contracts (`npx hardhat compile`)
5. Write extractAbis.js → run to populate `abis/` directory
6. Update contractUtils.js to load from `abis/`
7. Update walletModel.js role enum
8. Write deploy script
9. Write wallet generation script
10. Write NFT art generation script (HashLips wrapper)
11. Write IPFS upload script
12. Write batch mint scripts (chainbois + weapons)
13. Write test wallet funding script
14. Write integration test script
15. Write Postman collection JSON
16. Write frontend documentation (API docs, integration guide, setup guide)
17. Run Phase 1 test suite → verify all 187 still pass
18. Recursive review until zero issues

**Execution (requires user input / deployed infra):**
19. User provides: Pinata API keys, funds deployer via faucet
20. Generate platform wallets → user funds deployer
21. Deploy contracts to Fuji
22. User provides traits zip → generate art → upload to IPFS → set baseURIs
23. User provides weapon images zip → upload to IPFS → set baseURI
24. Batch mint NFTs + weapons to platform wallets
25. Create + fund test wallets
26. Run integration test script
27. Run manual Postman test flow
28. Recursive test until zero issues
