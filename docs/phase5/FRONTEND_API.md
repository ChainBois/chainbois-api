# Phase 5: Armory + Points - Frontend API Reference

Base URL: `https://test-2.ghettopigeon.com/api/v1`

**No authentication required.** All endpoints are public. User is identified by wallet address.

---

## Armory Endpoints

### 1. List All Weapons (Public)

```
GET /armory/weapons
```

Returns weapons available for purchase, grouped by category. Only shows weapons still in the weapon_store wallet.

**Response:**
```json
{
  "success": true,
  "data": {
    "assault": [
      {
        "tokenId": 1,
        "weaponName": "AR M4 MK18",
        "category": "assault",
        "tier": "base",
        "price": 1,
        "imageUri": ""
      }
    ],
    "smg": [],
    "lmg": [],
    "marksman": [],
    "handgun": [],
    "launcher": [],
    "shotgun": [],
    "melee": []
  }
}
```

### 2. List Weapons by Category (Public)

```
GET /armory/weapons/:category
```

**Valid categories:** `assault`, `smg`, `lmg`, `marksman`, `handgun`, `launcher`, `shotgun`, `melee`

### 3. Weapon Detail (Public)

```
GET /armory/weapon/:weaponId
```

Returns weapon info + payment address for purchase.

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": 1,
    "weaponName": "AR M4 MK18",
    "category": "assault",
    "tier": "base",
    "price": 1,
    "currency": "BATTLE",
    "available": true,
    "description": "",
    "imageUri": "",
    "paymentAddress": "0xD40e..."
  }
}
```

### 4. List ChainBoi NFTs for Sale (Public)

```
GET /armory/nfts
```

Returns ChainBoi NFTs available in the nft_store wallet.

**Response:**
```json
{
  "success": true,
  "data": {
    "nfts": [
      {
        "tokenId": 5,
        "level": 0,
        "badge": "private",
        "imageUri": ""
      }
    ],
    "price": 0.001,
    "currency": "AVAX",
    "available": 45,
    "paymentAddress": "0x469622d0..."
  }
}
```

### 5. ChainBoi NFT Detail (Public)

```
GET /armory/nft/:tokenId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokenId": 5,
    "level": 0,
    "badge": "private",
    "traits": [{ "trait_type": "Background", "value": "Combat Red" }],
    "imageUri": "",
    "price": 0.001,
    "currency": "AVAX",
    "available": true,
    "paymentAddress": "0x469622d0..."
  }
}
```

### 6. Purchase Weapon (Public)

```
POST /armory/purchase/weapon
```

**Flow:**
1. Frontend gets weapon detail (price + paymentAddress)
2. User sends `price` $BATTLE to `paymentAddress` via Thirdweb wallet
3. Frontend gets the txHash from the wallet transaction
4. Frontend calls this endpoint with { address, weaponName, txHash }
5. Backend verifies payment on-chain, transfers weapon NFT to user

**Request:**
```json
{
  "address": "0x1234...",
  "weaponName": "AR M4 MK18",
  "txHash": "0xabc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Weapon purchased successfully",
    "weapon": {
      "tokenId": 1,
      "weaponName": "AR M4 MK18",
      "category": "assault"
    },
    "transferTxHash": "0xdef...",
    "paymentTxHash": "0xabc..."
  }
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | address, weaponName, and txHash are required |
| 400 | Invalid wallet address |
| 400 | Payment not verified |
| 403 | You must own a ChainBoi NFT to purchase weapons |
| 404 | No account found for this wallet. Please login first. |
| 404 | Weapon not available or out of stock |
| 409 | This transaction has already been used |
| 423 | Armory is closed during tournament cooldown |

### 7. Purchase ChainBoi NFT (Public)

```
POST /armory/purchase/nft
```

**Flow:**
1. Frontend gets NFT listing (price + paymentAddress) from `GET /armory/nfts`
2. User sends `price` AVAX to `paymentAddress` via Thirdweb wallet
3. Frontend gets the txHash from the wallet transaction
4. Frontend calls this endpoint with { address, txHash }
5. Backend verifies AVAX payment on-chain, transfers NFT to user

**Request:**
```json
{
  "address": "0x1234...",
  "txHash": "0xdef...",
  "tokenId": 5
}
```

`tokenId` is optional — if omitted, any available NFT is assigned.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "ChainBoi NFT purchased successfully!",
    "tokenId": 5,
    "transferTxHash": "0x...",
    "paymentTxHash": "0xdef..."
  }
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | address and txHash are required |
| 400 | Invalid wallet address |
| 400 | Insufficient payment |
| 400 | Transaction sender does not match your wallet |
| 400 | Payment must be sent to the NFT store wallet |
| 404 | No account found for this wallet. Please login first. |
| 404 | No NFTs available for purchase |
| 409 | This transaction has already been used |

### 8. Get Balance (Public)

```
GET /armory/balance/:address
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "pointsBalance": 500,
    "battleBalance": 150.0,
    "battleBalanceRaw": "150.0"
  }
}
```

---

## Points Endpoints

### 9. Get Points Balance (Public)

```
GET /points/:address
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "0x...",
    "pointsBalance": 500,
    "conversionRate": 1,
    "maxConvertible": 500
  }
}
```

### 10. Convert Points to $BATTLE (Public)

```
POST /points/convert
```

**Request:**
```json
{
  "address": "0x1234...",
  "amount": 200
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Converted 200 points to 200 $BATTLE",
    "pointsDeducted": 200,
    "battleTokensReceived": 200,
    "conversionRate": 1.0,
    "newPointsBalance": 300,
    "txHash": "0x..."
  }
}
```

**Errors:**
| Code | Message |
|------|---------|
| 400 | Valid wallet address is required |
| 400 | amount must be a positive integer |
| 400 | Insufficient points |
| 404 | No account found for this wallet |
| 503 | Insufficient $BATTLE in rewards pool |

### 11. Points History (Public)

```
GET /points/history/:address?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "type": "points_conversion",
        "amount": 200,
        "currency": "BATTLE",
        "txHash": "0x...",
        "status": "confirmed",
        "metadata": { "pointsDeducted": 200 },
        "createdAt": "2026-03-08T..."
      }
    ],
    "total": 3,
    "page": 1,
    "totalPages": 1
  }
}
```

---

## Testnet Pricing

| Item | Price | Currency |
|------|-------|----------|
| ChainBoi NFT | 0.001 AVAX | AVAX |
| Weapons | 1-5 $BATTLE | $BATTLE |
| Points | Dynamic rate | Points -> $BATTLE (rate varies by rewards pool health) |

---

## Contract Addresses (Fuji Testnet)

| Contract | Address |
|----------|---------|
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` |
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` |
