# Avalanche & EVM Explorer Guide

A comprehensive guide for navigating blockchain explorers on Avalanche (and EVM chains in general). Written for someone new to EVM/Avalanche.

---

## Table of Contents

1. [Key Concepts](#key-concepts)
2. [Avalanche Explorers (Fuji Testnet)](#avalanche-explorers-fuji-testnet)
3. [How to Search](#how-to-search)
4. [Viewing NFTs](#viewing-nfts)
5. [Viewing Tokens (ERC-20)](#viewing-tokens-erc-20)
6. [Viewing Addresses / Wallets](#viewing-addresses--wallets)
7. [Viewing Transactions](#viewing-transactions)
8. [Using the Glacier API (Programmatic)](#using-the-glacier-api-programmatic)
9. [ChainBois Quick Links](#chainbois-quick-links)
10. [Common Gotchas](#common-gotchas)

---

## Key Concepts

### What is an Explorer?
A blockchain explorer is a web interface that reads on-chain data and displays it in a human-friendly format. Think of it like a "search engine" for the blockchain — you can look up any address, transaction, token, or NFT.

### Addresses
Every wallet and smart contract has an address — a 42-character hex string starting with `0x`. Examples:
- Wallet: `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0`
- Contract: `0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5`

There is no visual difference between a wallet address and a contract address. The explorer will show you which one it is when you search for it.

### Transactions
Every on-chain action produces a transaction hash (txHash) — a 66-character hex string starting with `0x`. Example:
- `0xddb792f7281d1bfc8be6df8831792e58e935d89912b48c08f4323a33f8119464`

### Contract Types
- **ERC-20**: Fungible tokens (like $BATTLE). Every token is identical and divisible.
- **ERC-721**: Non-fungible tokens / NFTs (like ChainBois, Weapons). Each token is unique with a tokenId.
- **ERC-1155**: Multi-token standard (supports both fungible and non-fungible in one contract). Not used in ChainBois.

### Networks
- **Mainnet (C-Chain)**: Production Avalanche network. Chain ID: 43114
- **Fuji Testnet**: Test network with free test AVAX. Chain ID: 43113
- Always make sure you're on the correct network in the explorer. Testnet and Mainnet have separate explorers or URL prefixes.

### Metadata & Attributes
NFT metadata is stored off-chain (usually IPFS) and referenced by the contract's `tokenURI`. Explorers fetch this metadata and display it. The standard format is:
```json
{
  "name": "ChainBoi #1",
  "description": "...",
  "image": "ipfs://...",
  "attributes": [
    { "trait_type": "Background", "value": "Combat Red" },
    { "trait_type": "Level", "value": 0, "display_type": "number" }
  ]
}
```
**Important**: Explorers only index the `attributes` array. Custom top-level fields (like `level`, `inGameStats`) are ignored by most explorers.

---

## Avalanche Explorers (Fuji Testnet)

### 1. Snowtrace (Primary - Recommended)
**URL**: https://testnet.snowtrace.io

Snowtrace is the official Avalanche block explorer, powered by Routescan. It's the most reliable for Avalanche.

| What | URL Pattern |
|------|-------------|
| Address/Wallet | `https://testnet.snowtrace.io/address/{address}` |
| Contract | `https://testnet.snowtrace.io/address/{address}` (same as wallet) |
| Token (ERC-20) | `https://testnet.snowtrace.io/token/{tokenAddress}` |
| NFT (specific) | `https://testnet.snowtrace.io/nft/{contractAddress}/{tokenId}?chainid=43113` |
| Transaction | `https://testnet.snowtrace.io/tx/{txHash}` |

**For Mainnet**: Replace `testnet.snowtrace.io` with `snowtrace.io`

### 2. Avascan (Secondary)
**URL**: https://testnet.avascan.info

Avascan is an independent Avalanche explorer. It has a different UI and sometimes shows different data due to separate indexing.

| What | URL Pattern |
|------|-------------|
| Address/Wallet | `https://testnet.avascan.info/blockchain/c/address/{address}` |
| Token/NFT Contract | `https://testnet.avascan.info/blockchain/c/token/{contractAddress}` |
| Transaction | `https://testnet.avascan.info/blockchain/c/tx/{txHash}` |

**Searching NFTs on Avascan**:
1. Go to https://testnet.avascan.info
2. Paste the contract address in the search bar
3. Click the contract result
4. Look for an "Inventory" or "NFT" tab to browse individual tokens

**For Mainnet**: Use `https://avascan.info/blockchain/c/...` (no `testnet.` prefix)

### 3. Routescan (Alternative)
**URL**: https://testnet.routescan.io

Routescan is the engine behind Snowtrace. It supports multiple chains.

| What | URL Pattern |
|------|-------------|
| Address | `https://testnet.routescan.io/address/{address}` |
| Token | `https://testnet.routescan.io/token/{tokenAddress}` |
| Transaction | `https://testnet.routescan.io/tx/{txHash}` |

**Note**: Routescan may redirect or show slightly different URL formats. When in doubt, paste the address in the search bar.

### 4. Glacier API (Programmatic / Most Reliable for NFT Data)
**URL**: https://glacier-api.avax.network

This is Avalanche's native data API. It's not a visual explorer — it returns JSON. But it's the most reliable source for NFT metadata, ownership, and token data. You can use it directly in your browser.

| What | URL Pattern |
|------|-------------|
| NFT Token | `https://glacier-api.avax.network/v1/chains/43113/nfts/collections/{contract}/tokens/{tokenId}` |
| All NFTs in Collection | `https://glacier-api.avax.network/v1/chains/43113/nfts/collections/{contract}/tokens` |
| ERC-20 Token Details | `https://glacier-api.avax.network/v1/chains/43113/tokens/{tokenAddress}` |
| Address Balance | `https://glacier-api.avax.network/v1/chains/43113/addresses/{address}/balances:listErc20` |
| NFTs Owned by Address | `https://glacier-api.avax.network/v1/chains/43113/addresses/{address}/balances:listErc721` |

**For Mainnet**: Replace `43113` with `43114`

---

## How to Search

### On any explorer:
1. **Go to the explorer website** (e.g., https://testnet.snowtrace.io)
2. **Paste into the search bar** any of:
   - An address (wallet or contract): `0x4dE803339...`
   - A transaction hash: `0xddb792f72...`
   - A token name: `BATTLE` or `ChainBoi`
3. **Click the result** — the explorer will auto-detect whether it's an address, tx, or token

### What you'll see for each type:

**For a Contract Address:**
- Contract name, creator, creation tx
- Source code (if verified)
- Read/Write functions (interact with the contract)
- Token transfers, holders
- For NFT contracts: inventory of all tokens

**For a Wallet Address:**
- AVAX balance
- Token holdings (ERC-20, ERC-721)
- Transaction history
- Internal transactions

**For a Transaction:**
- Status (success/failed)
- From/To addresses
- Value transferred
- Gas used and gas price
- Input data (function called)
- Event logs

---

## Viewing NFTs

### On Snowtrace (Visual):
1. Go to: `https://testnet.snowtrace.io/nft/{contract}/{tokenId}?chainid=43113`
2. You'll see:
   - NFT image (if IPFS gateway resolves)
   - Name and description
   - **Attributes/traits** from the `attributes` array
   - Owner address
   - Transfer history

### On Glacier API (JSON):
```
GET https://glacier-api.avax.network/v1/chains/43113/nfts/collections/{contract}/tokens/{tokenId}
```
Returns: tokenUri, owner, metadata with attributes

### Browse All NFTs in a Collection:
```
GET https://glacier-api.avax.network/v1/chains/43113/nfts/collections/{contract}/tokens?pageSize=25
```

### Check What NFTs a Wallet Owns:
```
GET https://glacier-api.avax.network/v1/chains/43113/addresses/{wallet}/balances:listErc721
```

---

## Viewing Tokens (ERC-20)

### On Snowtrace:
- `https://testnet.snowtrace.io/token/{tokenAddress}`
- Shows: name, symbol, total supply, holders, transfers

### On Glacier API:
```
GET https://glacier-api.avax.network/v1/chains/43113/tokens/{tokenAddress}
```

### Check Token Balance of a Wallet:
```
GET https://glacier-api.avax.network/v1/chains/43113/addresses/{wallet}/balances:listErc20
```

---

## Viewing Addresses / Wallets

### On Snowtrace:
- `https://testnet.snowtrace.io/address/{address}`
- Shows: AVAX balance, token holdings, transaction history, internal txs

### On Glacier API:
```
# Native AVAX balance
GET https://glacier-api.avax.network/v1/chains/43113/addresses/{address}/balances:getNative

# ERC-20 token balances
GET https://glacier-api.avax.network/v1/chains/43113/addresses/{address}/balances:listErc20

# NFT holdings
GET https://glacier-api.avax.network/v1/chains/43113/addresses/{address}/balances:listErc721
```

---

## Viewing Transactions

### On Snowtrace:
- `https://testnet.snowtrace.io/tx/{txHash}`
- Shows: status, block, from, to, value, gas, input data, logs

### On Glacier API:
```
GET https://glacier-api.avax.network/v1/chains/43113/transactions/{txHash}
```

---

## Using the Glacier API (Programmatic)

The Glacier API is free and requires no API key. Base URL:
```
https://glacier-api.avax.network
```

### Useful Endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /v1/chains/43113/nfts/collections/{contract}/tokens` | List all NFTs in collection |
| `GET /v1/chains/43113/nfts/collections/{contract}/tokens/{id}` | Get specific NFT |
| `POST /v1/chains/43113/nfts/collections/{contract}/tokens/{id}:reindex` | Force metadata refresh |
| `GET /v1/chains/43113/tokens/{address}` | Get ERC-20 token info |
| `GET /v1/chains/43113/addresses/{addr}/balances:listErc20` | Wallet's ERC-20 balances |
| `GET /v1/chains/43113/addresses/{addr}/balances:listErc721` | Wallet's NFT holdings |
| `GET /v1/chains/43113/addresses/{addr}/balances:getNative` | Wallet's AVAX balance |
| `GET /v1/chains/43113/transactions/{txHash}` | Transaction details |

### Reindexing NFT Metadata:
When you update NFT metadata (e.g., after re-uploading to IPFS and calling `setBaseURI()`), explorers cache the old data. To force a refresh:
```bash
curl -X POST "https://glacier-api.avax.network/v1/chains/43113/nfts/collections/{contract}/tokens/{tokenId}:reindex"
```
**Note**: There is a cooldown period. If you get `"Nft has been recently indexed"`, wait ~1 hour and try again.

### Pagination:
Most list endpoints support `pageSize` and `pageToken`:
```
GET /v1/chains/.../tokens?pageSize=25&pageToken={nextPageToken}
```

---

## ChainBois Quick Links

### Contract Addresses (Fuji Testnet)
| Contract | Address |
|----------|---------|
| ChainBoisNFT (ERC-721) | `0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5` |
| WeaponNFT (ERC-721) | `0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28` |
| BattleToken (ERC-20) | `0xF16214F76f19bD1E6d3349fC199B250a8E441E8C` |
| Deployer Wallet | `0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0` |
| NFT Store Wallet | `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` |

### Snowtrace Links

**ChainBois NFTs:**
- Contract: https://testnet.snowtrace.io/address/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5
- Token #1: https://testnet.snowtrace.io/nft/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5/1?chainid=43113
- Token #50: https://testnet.snowtrace.io/nft/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5/50?chainid=43113

**Weapon NFTs:**
- Contract: https://testnet.snowtrace.io/address/0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28
- Weapon #1: https://testnet.snowtrace.io/nft/0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28/1?chainid=43113

**$BATTLE Token:**
- Token: https://testnet.snowtrace.io/token/0xF16214F76f19bD1E6d3349fC199B250a8E441E8C

**Wallets:**
- Deployer: https://testnet.snowtrace.io/address/0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0
- NFT Store: https://testnet.snowtrace.io/address/0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0

**Transactions:**
- BaseURI Update: https://testnet.snowtrace.io/tx/0xddb792f7281d1bfc8be6df8831792e58e935d89912b48c08f4323a33f8119464

### Avascan Links

**ChainBois NFTs:**
- Contract: https://testnet.avascan.info/blockchain/c/token/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5

**Weapon NFTs:**
- Contract: https://testnet.avascan.info/blockchain/c/token/0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28

**$BATTLE Token:**
- Token: https://testnet.avascan.info/blockchain/c/token/0xF16214F76f19bD1E6d3349fC199B250a8E441E8C

**Tip**: If a direct link 404s on Avascan, go to https://testnet.avascan.info and paste the address into the search bar.

### Glacier API Links (JSON - open in browser)

**ChainBois NFTs:**
- Token #1: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5/tokens/1
- All tokens: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5/tokens

**Weapon NFTs:**
- Token #1: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28/tokens/1
- All tokens: https://glacier-api.avax.network/v1/chains/43113/nfts/collections/0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28/tokens

**$BATTLE Token:**
- Info: https://glacier-api.avax.network/v1/chains/43113/tokens/0xF16214F76f19bD1E6d3349fC199B250a8E441E8C

**Wallet Holdings:**
- NFT Store NFTs: https://glacier-api.avax.network/v1/chains/43113/addresses/0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0/balances:listErc721
- Deployer Balances: https://glacier-api.avax.network/v1/chains/43113/addresses/0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0/balances:listErc20

### IPFS Metadata (Direct)
- Token #1: https://gateway.pinata.cloud/ipfs/bafybeig26yewnliuazj3dvuy5d2mmip67i3bqemfxgbhkpt4xv55ojvrxm/1.json
- Token #50: https://gateway.pinata.cloud/ipfs/bafybeig26yewnliuazj3dvuy5d2mmip67i3bqemfxgbhkpt4xv55ojvrxm/50.json

---

## Common Gotchas

### 1. Metadata Not Updating on Explorers
**Problem**: You updated metadata on IPFS and called `setBaseURI()`, but the explorer still shows old data.
**Why**: Explorers (Snowtrace, Avascan) and Glacier all cache metadata. They don't re-fetch from IPFS on every page load.
**Fix**:
1. Verify the on-chain tokenURI is correct (call `tokenURI(tokenId)` on the contract)
2. Trigger Glacier reindex: `POST .../tokens/{id}:reindex`
3. Wait for Glacier cooldown (~1 hour) if it says "recently indexed"
4. Snowtrace/Avascan will update after Glacier updates (they read from Glacier)

### 2. Explorer Shows 404 for NFT
**Problem**: Direct NFT URL returns 404.
**Fix**: Go to the explorer homepage and paste the contract address in the search bar. Navigate from there. URL formats change and not all explorers support deep-linking to individual NFTs.

### 3. Testnet vs Mainnet
**Problem**: You're looking at the wrong network.
**Fix**:
- Testnet URLs always have `testnet.` prefix (e.g., `testnet.snowtrace.io`)
- Glacier API: use chain ID `43113` for Fuji, `43114` for Mainnet
- Always double-check the chain ID in the URL

### 4. Custom Fields Not Showing
**Problem**: Top-level JSON fields like `level`, `inGameStats` don't appear on explorers.
**Why**: The ERC-721 metadata standard only defines `name`, `description`, `image`, and `attributes`. Explorers only read these standard fields. Custom top-level fields are ignored.
**Fix**: Always duplicate important data into the `attributes` array:
```json
{
  "level": 0,
  "attributes": [
    { "trait_type": "Level", "value": 0, "display_type": "number" }
  ]
}
```

### 5. IPFS Images Not Loading
**Problem**: NFT image shows as broken on the explorer.
**Why**: IPFS gateways can be slow or unavailable. The `ipfs://` URI needs to be resolved through a gateway.
**Fix**: Wait and refresh. Explorers use their own IPFS gateways which may take time. You can verify the image directly:
- `https://gateway.pinata.cloud/ipfs/{CID}/{filename}`
- `https://ipfs.io/ipfs/{CID}/{filename}`

### 6. Glacier API Shows "UNINDEXED"
**Problem**: The `indexStatus` field shows "UNINDEXED" instead of "INDEXED".
**Why**: Glacier hasn't fetched the metadata yet.
**Fix**: Call the reindex endpoint and wait a few minutes.

---

## Explorer Comparison

| Feature | Snowtrace | Avascan | Glacier API |
|---------|-----------|---------|-------------|
| Visual UI | Yes | Yes | No (JSON) |
| NFT images | Yes | Yes | URI only |
| NFT attributes | Yes | Yes | Yes |
| Token holders | Yes | Yes | Yes |
| Contract source | Yes | Yes | No |
| Read/Write contract | Yes | Yes | No |
| API access | Limited | Limited | Full REST API |
| Metadata refresh | Manual (slow) | Manual (slow) | Reindex endpoint |
| Reliability | High | Medium | Highest |
| Fuji testnet | Yes | Yes | Yes |

**Recommendation**: Use Snowtrace for visual browsing, Glacier API for programmatic access and debugging metadata issues.
