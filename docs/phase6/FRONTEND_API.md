# Phase 6: Inventory - Frontend API Reference

Base URL: `https://test-2.ghettopigeon.com/api/v1`

**No authentication required.** All endpoints are public. User is identified by wallet address.

---

## Inventory Endpoints

### 1. Full Inventory (Public)

```
GET /inventory/:address
```

Returns all owned assets categorized: ChainBois, weapons, and balances.

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "chainbois": [
      {
        "tokenId": 5,
        "level": 2,
        "rank": "Sergeant",
        "badge": "sergeant",
        "imageUri": "ipfs://bafybei.../chainboi-5.png",
        "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
        "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/5.json",
        "traits": [
          { "trait_type": "Background", "value": "Combat Red" },
          { "trait_type": "Skin", "value": "Pale Recruit" },
          { "trait_type": "Weapon", "value": "War Bow" },
          { "trait_type": "Suit", "value": "Covert Ops Carbon Suit" },
          { "trait_type": "Eyes", "value": "Battle Hardened" },
          { "trait_type": "Mouth", "value": "Viking Beard" },
          { "trait_type": "Helmet", "value": "Cryo Enforcer" },
          { "trait_type": "Level", "value": 2 },
          { "trait_type": "Rank", "value": "Sergeant" },
          { "trait_type": "Kills", "value": 0 },
          { "trait_type": "Score", "value": 0 },
          { "trait_type": "Games Played", "value": 0 }
        ],
        "stats": { "kills": 0, "score": 0, "gamesPlayed": 0 }
      }
    ],
    "weapons": [
      {
        "tokenId": 2,
        "weaponName": "AR M4 MK18",
        "category": "assault",
        "tier": "base",
        "imageUri": "",
        "contractAddress": "0xa2AFf3105668124A187b1212Ab850bf8b98dD07d",
        "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/weapon/2.json"
      }
    ],
    "balances": {
      "points": 500,
      "battle": 150.0,
      "battleRaw": "150.0"
    },
    "counts": {
      "chainbois": 1,
      "weapons": 1
    }
  }
}
```

### 2. ChainBoi NFTs Only (Public)

```
GET /inventory/:address/nfts
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tokenId": 5,
      "level": 2,
      "rank": "Sergeant",
      "badge": "sergeant",
      "imageUri": "ipfs://bafybei.../chainboi-5.png",
      "traits": [
        { "trait_type": "Background", "value": "Combat Red" },
        { "trait_type": "Skin", "value": "Pale Recruit" },
        { "trait_type": "Weapon", "value": "War Bow" },
        { "trait_type": "Suit", "value": "Covert Ops Carbon Suit" },
        { "trait_type": "Eyes", "value": "Battle Hardened" },
        { "trait_type": "Mouth", "value": "Viking Beard" },
        { "trait_type": "Helmet", "value": "Cryo Enforcer" },
        { "trait_type": "Level", "value": 2 },
        { "trait_type": "Rank", "value": "Sergeant" },
        { "trait_type": "Kills", "value": 0 },
        { "trait_type": "Score", "value": 0 },
        { "trait_type": "Games Played", "value": 0 }
      ],
      "stats": { "kills": 0, "score": 0, "gamesPlayed": 0 },
      "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
      "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/5.json"
    }
  ]
}
```

### 3. Weapon NFTs Only (Public)

```
GET /inventory/:address/weapons
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "tokenId": 2,
      "weaponName": "AR M4 MK18",
      "category": "assault",
      "tier": "base",
      "imageUri": "",
      "metadataUri": "",
      "contractAddress": "0xa2AFf3105668124A187b1212Ab850bf8b98dD07d"
    }
  ]
}
```

### 4. Transaction History (Public)

```
GET /inventory/:address/history?page=1&limit=20&type=weapon_purchase
```

**Query Parameters:**
| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| page | 1 | - | Page number |
| limit | 20 | 100 | Items per page |
| type | - | - | Filter: `level_up`, `weapon_purchase`, `nft_purchase`, `points_conversion`, `prize_payout`, `nft_transfer`, `trait_airdrop`, `rarity_airdrop`, `refund`, `token_burn`, `token_recycle` |

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "type": "nft_purchase",
        "fromAddress": "0x...",
        "toAddress": "0x...",
        "amount": 0.001,
        "currency": "AVAX",
        "txHash": "0x...",
        "status": "confirmed",
        "metadata": { "tokenId": 5 },
        "createdAt": "2026-03-07T..."
      }
    ],
    "total": 3,
    "page": 1,
    "totalPages": 1
  }
}
```

---

## Contract Addresses (Fuji Testnet)

| Contract | Address |
|----------|---------|
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` |
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` |
