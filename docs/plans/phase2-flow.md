# Phase 2: Smart Contracts + NFT Generation - Flow Documentation

## What Phase 2 Covers

Phase 2 deploys the blockchain infrastructure: smart contracts, NFT art generation, IPFS metadata, platform wallets, and pre-minting.

---

## Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                           DEPLOYMENT SCRIPTS (one-time)                            |
|                                                                                   |
|  1. generateWallets.js  ->  Create 5 platform wallets (encrypted in MongoDB)      |
|  2. deploy.js           ->  Deploy 3 contracts to Avalanche Fuji                  |
|  3. generateNftArt.js   ->  HashLips generates 50 ChainBoi images + metadata      |
|  4. uploadToIpfs.js     ->  Pin images + metadata to Pinata IPFS                  |
|  5. mintChainbois.js    ->  Batch mint 50 ChainBoi NFTs to nft_store wallet       |
|  6. mintWeapons.js      ->  Batch mint weapon NFTs to weapon_store wallet         |
|  7. extractAbis.js      ->  Extract ABIs from Hardhat artifacts -> abis/          |
+-----------------------------------------------------------------------------------+
                              |
                    Deployed contracts + ABIs
                              |
                              v
+-----------------------------------------------------------------------------------+
|                         RUNTIME (server uses these)                                |
|                                                                                   |
|  abis/BattleToken.json      <- ABI for $BATTLE ERC-20 interactions               |
|  abis/ChainBoisNFT.json     <- ABI for ChainBoi NFT interactions                 |
|  abis/WeaponNFT.json        <- ABI for Weapon NFT interactions                   |
|                                                                                   |
|  utils/contractUtils.js     <- All contract interactions (mint, transfer, level)  |
|  utils/avaxUtils.js         <- RPC provider, AVAX transfers, balance queries      |
|  utils/cryptUtils.js        <- AES encrypt/decrypt wallet private keys            |
|                                                                                   |
|  .env                       <- Contract addresses, RPC URL, chain ID              |
|  MongoDB wallets collection <- Encrypted platform wallet keys                     |
+-----------------------------------------------------------------------------------+
```

---

## Smart Contracts

### 1. BattleToken (ERC-20)
- **Purpose**: In-game currency ($BATTLE)
- **Supply**: Fixed, minted at deployment to deployer wallet
- **Decimals**: 18 (OpenZeppelin default)
- **Key functions**: `mint(to, amount)` (owner), `transfer()`, `balanceOf()`
- **Usage**: Transferred from rewards wallet for prizes/conversions (NOT minted on demand)

### 2. ChainBoisNFT (ERC-721 + EIP-4906)
- **Purpose**: Player identity NFTs with on-chain level progression
- **Supply**: 50 testnet (4032 mainnet)
- **Token IDs**: Start at 1 (match HashLips editions)
- **Key functions**: `mint(to)`, `setLevel(tokenId, level)`, `getLevel(tokenId)`, `setBaseURI()`, `emitBatchMetadataUpdate()`
- **On-chain state**: `nftLevel` mapping (tokenId -> uint8 level 0-7)

### 3. WeaponNFT (ERC-721)
- **Purpose**: Purchasable weapon NFTs
- **Key functions**: `mint(to, weaponName)`, `getWeaponName(tokenId)`, `setBaseURI()`
- **On-chain state**: `weaponName` mapping (tokenId -> string)

---

## Platform Wallets (5 wallets)

| Role | Purpose | Holds |
|------|---------|-------|
| deployer | Contract owner, signs admin transactions | AVAX for gas |
| nft_store | Holds pre-minted ChainBoi NFTs for claiming | ChainBoi NFTs |
| weapon_store | Holds pre-minted weapon NFTs for sale | Weapon NFTs |
| prize_pool | Level-up AVAX payments go here; prizes sent from here | AVAX |
| rewards | Holds $BATTLE for prizes and points conversion | $BATTLE tokens |

All private keys are AES-encrypted at rest in MongoDB. Decrypted only when needed for signing.

---

## NFT Art Generation Flow

```
User provides traits zip
        |
        v
generateNftArt.js
  1. Clone HashLips art engine -> nft-generation/
  2. Unzip traits -> nft-generation/layers/
  3. Configure: 50 editions, 1024x1024, "ChainBoi" prefix
  4. Run HashLips -> images/ + json/
  5. Post-process metadata:
     - Clean trait names (strip numeric prefix, replace underscores)
     - Add: collection, level: 0, badges: [], inGameStats: {}
  6. Copy to assets/nft-collection/
        |
        v
uploadToIpfs.js
  1. Pin images folder -> images CID
  2. Update metadata JSON image URIs
  3. Pin metadata folder -> metadata CID
  4. Call contract.setBaseURI("ipfs://{metadataCID}/")
        |
        v
mintChainbois.js
  1. Deployer calls mint(nftStoreAddress) x 50
  2. Batch of 20 with 3s pause between batches
  3. Progress saved to deployments/mint-session-chainbois.json
  4. Resume-safe (skips already-minted)
```

---

## Contract Addresses (Fuji Testnet)

| Contract | Address |
|----------|---------|
| BattleToken | `0xF16214F76f19bD1E6d3349fC199B250a8E441E8C` |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` |

---

## Key Files

| File | Purpose |
|------|---------|
| `contracts/*.sol` | Solidity source (3 contracts) |
| `hardhat.config.js` | Hardhat compilation + deployment config |
| `abis/*.json` | Extracted ABIs for runtime (committed to git) |
| `scripts/deploy.js` | Deploy contracts to chain |
| `scripts/generateWallets.js` | Create + encrypt platform wallets |
| `scripts/generateNftArt.js` | HashLips wrapper + post-processing |
| `scripts/uploadToIpfs.js` | Pinata IPFS upload |
| `scripts/mintChainbois.js` | Batch mint ChainBoi NFTs |
| `scripts/mintWeapons.js` | Batch mint weapon NFTs |
| `scripts/extractAbis.js` | Extract ABIs from Hardhat artifacts |
| `deployments/fuji.json` | Deployed contract addresses |
