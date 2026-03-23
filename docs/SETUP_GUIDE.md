# ChainBois API - Setup Guide

## Prerequisites

- Node.js 18+ (LTS recommended)
- MongoDB 6+ (local or Atlas)
- PM2 (`npm install -g pm2`)
- Git

## 1. Clone and Install

```bash
git clone <repo-url> chainbois-api
cd chainbois-api
npm install
```

## 2. Environment Configuration

Copy the example and fill in values:

```bash
cp .env.example .env
```

### Required Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/chainbois_testnet
MONGODB_URI_PROD=mongodb://localhost:27017/chainbois_mainnet
NETWORK=dev   # "prod" for mainnet

# Avalanche
AVAX_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43113
AVAX_DATA_API_URL=https://data-api.avax.network

# Firebase Admin (database URL only - credentials loaded from JSON file, see step 4)
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Wallet Encryption
ALGORITHM=aes-256-cbc
KEY=<64-char-hex-string>

# Contract Addresses (after deployment)
BATTLE_TOKEN_ADDRESS=
CHAINBOIS_NFT_ADDRESS=
WEAPON_NFT_ADDRESS=

# Deployer Key (for scripts only)
DEPLOYER_PRIVATE_KEY=

# IPFS (Pinata)
PINATA_JWT=

# Discord (optional)
DISCORD_WEBHOOK_URL=
```

### Generate Encryption Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Database Setup

### Local MongoDB
```bash
# Start MongoDB
mongod --dbpath /data/db

# Create databases
mongosh
> use chainbois_testnet
> use chainbois_mainnet
```

### MongoDB Atlas
Create two clusters or two databases in one cluster:
- `chainbois_testnet` - for Fuji testnet
- `chainbois_mainnet` - for Avalanche mainnet

## 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create project "chainbois"
3. Enable Authentication → Email/Password
4. Enable Realtime Database
5. Go to Project Settings → Service Accounts → Generate New Private Key
6. Download the JSON file and save it as `config/chainbois-firebase-config.json`
7. Set `FIREBASE_DATABASE_URL` in `.env` (the only Firebase env var needed)

## 5. Discord Webhook (Optional)

1. Go to Discord server → Channel Settings → Integrations → Webhooks
2. Create webhook, name it "ChainBois Bot"
3. Copy webhook URL to `.env` as `DISCORD_WEBHOOK_URL`

## 6. Deploy Smart Contracts

### Generate Platform Wallets
```bash
node scripts/generateWallets.js
```
This creates 4 wallets (deployer, nft_store, weapon_store, prize_pool) and prints the deployer private key. Copy it to `.env` as `DEPLOYER_PRIVATE_KEY`.

### Fund Deployer
Go to [Avalanche Faucet](https://faucet.avax.network/) and request testnet AVAX for the deployer address (printed by the script above).

### Deploy Contracts
```bash
npx hardhat run scripts/deploy.js --network fuji
```
Copy the printed contract addresses to `.env`.

### Verify Contracts (Optional)
```bash
npx hardhat verify --network fuji <BATTLE_TOKEN_ADDRESS>
npx hardhat verify --network fuji <CHAINBOIS_NFT_ADDRESS>
npx hardhat verify --network fuji <WEAPON_NFT_ADDRESS>
```

## 7. Generate and Upload NFT Art

### Upload Traits
```bash
# From your local machine:
scp traits.zip user@server:/tmp/traits.zip
```

### Generate Art
```bash
node scripts/generateNftArt.js /tmp/traits.zip 20   # 20 for testnet
```

### Upload to IPFS
```bash
node scripts/uploadToIpfs.js chainbois
```

### Upload Weapon Images
```bash
scp weapons.zip user@server:/tmp/weapons.zip
node scripts/uploadToIpfs.js weapons /tmp/weapons.zip
```

## 8. Mint NFTs

### Mint ChainBois NFTs
```bash
node scripts/mintChainbois.js 20    # 20 for testnet, 4032 for mainnet
```

### Mint Weapon NFTs
```bash
node scripts/mintWeapons.js
```

## 9. Create Test Wallets

```bash
node scripts/fundTestWallets.js
```

This creates 3 test wallets, funds them with AVAX and $BATTLE, and transfers NFTs to test_user_1.

## 10. Start the Server

### Development
```bash
node server.js
```

### Production (PM2)
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Auto-start on reboot
```

### Verify
```bash
curl http://localhost:5000/api/v1/health
```

## 11. Run Tests

### Unit Tests (Phase 0 + Phase 1)
```bash
npm test
```

### Integration Tests (requires deployed contracts)
```bash
node scripts/testIntegration.js
```

## Switching to Mainnet

1. Back up your testnet `.env`:
   ```bash
   cp .env .env.testnet
   ```

2. Update `.env` with mainnet values:
   ```env
   AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc
   AVAX_CHAIN_ID=43114
   NETWORK=prod
   MONGODB_URI_PROD=mongodb://...chainbois_mainnet
   ```

3. Generate new platform wallets (or reuse testnet ones):
   ```bash
   node scripts/generateWallets.js
   ```

4. Fund deployer with real AVAX

5. Deploy contracts to mainnet:
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

6. Update `.env` with new contract addresses

7. Generate full art collection:
   ```bash
   node scripts/generateNftArt.js /tmp/traits.zip 4032
   ```

8. Upload to IPFS and mint:
   ```bash
   node scripts/uploadToIpfs.js chainbois
   node scripts/mintChainbois.js 4032
   node scripts/mintWeapons.js
   ```

9. Restart server:
   ```bash
   pm2 restart all
   ```

## Troubleshooting

### "AVAX_RPC_URL and AVAX_CHAIN_ID must be configured"
Set both `AVAX_RPC_URL` and `AVAX_CHAIN_ID` in `.env`.

### "BATTLE_TOKEN_ADDRESS not configured"
Deploy contracts first, then set the addresses in `.env`.

### "Encryption KEY and ALGORITHM must be set"
Generate an encryption key (see step 2) and set `KEY` and `ALGORITHM` in `.env`.

### Firebase token errors
Ensure `config/chainbois-firebase-config.json` exists and matches your Firebase project. Download from Firebase Console → Project Settings → Service Accounts → Generate New Private Key.

### Minting fails mid-batch
Just re-run the mint script. It reads `totalSupply()` from the contract and skips already-minted tokens.

## Frontend Integration

For frontend wallet connection and automatic chain switching (Fuji/Mainnet):
- [Wallet Connect & Chain Switching Flow](WALLET_CONNECT_FLOW.md) — full user flow for faucet and website
- [Chain Switching Guide](CHAIN_SWITCHING_GUIDE.md) — technical implementation with EIP-3085/3326

The faucet and website automatically prompt users to add and switch to Avalanche Fuji — no manual network configuration needed.

## Project Structure

```
chainbois-api/
├── abis/                  # Compiled contract ABIs
├── config/                # DB, Firebase, Redis, constants
├── contracts/             # Solidity source files
├── controllers/           # Express route handlers
├── deployments/           # Deployment artifacts (gitignored)
├── docs/                  # API docs, Postman, setup guide
├── jobs/                  # Cron jobs (Firebase sync)
├── middleware/            # Auth, anti-cheat, validation
├── models/                # Mongoose schemas
├── routes/                # Express routes
├── scripts/               # Deployment, minting, testing scripts
├── utils/                 # Blockchain, crypto, error utilities
├── __tests__/             # Jest test suites
├── app.js                 # Express middleware stack
├── server.js              # Entry point
├── hardhat.config.js      # Solidity compiler config
├── ecosystem.config.js    # PM2 config
└── package.json
```
