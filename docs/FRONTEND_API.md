# ChainBois API - Frontend API Reference

Base URL: `https://your-server.com/api/v1`

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

Get the token from Firebase Auth SDK:
```javascript
const token = await firebase.auth().currentUser.getIdToken();
```

---

## Endpoints

### Auth

#### POST /auth/create-user
Create a new user (Firebase Auth + Firebase RTDB).

**Public** - No auth required.

| Field    | Type   | Required | Notes                     |
|----------|--------|----------|---------------------------|
| email    | string | yes      | Valid email format         |
| password | string | yes      | Min 6 characters (Firebase)|
| username | string | yes      | Max 100 characters         |

**Request:**
```json
{
  "email": "player@example.com",
  "password": "secure123",
  "username": "ChainBoi_001"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "uid": "firebase_uid_string" }
}
```

**Errors:**
- 400: Missing required fields
- 400: "Email is already registered" (duplicate email)

---

#### POST /auth/login
Login with wallet address. Checks on-chain NFT ownership.

**Protected** - Requires Firebase token.

| Field   | Type   | Required | Notes                          |
|---------|--------|----------|--------------------------------|
| address | string | yes      | Valid Ethereum/Avalanche address|

**Request:**
```json
{
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "string",
      "username": "string",
      "address": "0x...",
      "playerType": "web2 | web3",
      "pointsBalance": 500,
      "battleTokenBalance": 0,
      "level": 2,
      "score": 1500,
      "highScore": 1500,
      "gamesPlayed": 10,
      "hasNft": true,
      "nftTokenId": 42,
      "isBanned": false,
      "hasClaimed": false,
      "lastLogin": "2026-03-03T12:00:00.000Z"
    },
    "assets": {
      "hasNft": true,
      "nftTokenId": 42,
      "level": 2
    },
    "weapons": [
      { "tokenId": 1, "name": "AK-47" }
    ]
  }
}
```

**Side effects:**
- Creates user in MongoDB if first login
- Writes `{ hasNFT, level, weapons }` to Firebase RTDB (for Unity game)
- Auto-upgrades WEB2 → WEB3 when NFT detected
- Auto-downgrades WEB3 → WEB2 when NFT lost

**Errors:**
- 400: "Please provide a valid EVM wallet address"
- 400: "This wallet address is already linked to another account"
- 403: Banned user (permanent or temporary ban message)

---

#### GET /auth/me
Get current user's profile.

**Protected** - Requires Firebase token.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { /* same shape as login response */ }
  }
}
```

---

#### POST /auth/logout
Logout: revokes Firebase refresh tokens, clears game data in Firebase RTDB.

**Protected** - Requires Firebase token.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Game

#### POST /game/verify-assets
Re-fetch on-chain NFT ownership and update user data.

**Protected** - Requires Firebase token.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hasNft": true,
    "nftTokenId": 42,
    "level": 2,
    "ownedWeaponNfts": [{ "name": "AK-47", "tokenId": 1 }],
    "characters": ["Recruit_A", "Recruit_B", "Recruit_C", "Recruit_D", ...],
    "baseWeapons": ["Pistol", "Knife", "Shotgun", "SMG"]
  }
}
```

Returns 503 if `CHAINBOIS_NFT_ADDRESS` is not configured.

---

#### POST /game/set-avatar
Set active ChainBoi NFT. Verifies on-chain ownership.

**Protected** - Requires Firebase token.

| Field   | Type   | Required | Notes           |
|---------|--------|----------|-----------------|
| tokenId | number | yes      | NFT token ID    |

**Request:**
```json
{ "tokenId": 1 }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tokenId": 1,
    "level": 0,
    "characters": ["Recruit_A", "Recruit_B", "Recruit_C", "Recruit_D"],
    "baseWeapons": ["Pistol", "Knife", "Shotgun", "SMG"]
  }
}
```

**Errors:**
- 400: Missing tokenId
- 403: User doesn't own that NFT
- 503: Contract not configured

---

#### GET /game/characters/:address
Get unlocked characters and weapons for an address.

**Protected** - Requires Firebase token. BOLA-protected: user can only query their own address.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "level": 2,
    "characters": ["Recruit_A", "Recruit_B", ..., "Veteran_C", "Veteran_D"],
    "baseWeapons": ["Pistol", "Knife", "Shotgun", "SMG"]
  }
}
```

Characters unlocked: 4 per level (0-7). Level 0 = Recruit_A-D, Level 1 = +Soldier_A-D, etc. Without NFT, only level 0 characters.

---

#### GET /game/download/:platform
Download game build. Streams zip file.

**Public** - No auth required.

| Param    | Values     |
|----------|-----------|
| platform | win, mac  |

Returns binary stream with headers:
- `Content-Disposition: attachment; filename="ChainBoisWin.zip"`
- `Content-Type: application/octet-stream`

**Errors:**
- 400: "Invalid platform. Use 'win' or 'mac'." (invalid platform name)
- 404: "Game file not available yet" (valid platform but file not found on server)

---

#### GET /game/info
Get game download count and platform availability.

**Public** - No auth required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "downloads": 150,
    "trailer": "https://youtube.com/...",
    "platforms": { "win": true, "mac": false }
  }
}
```

---

### Health

#### GET /health (at /api/v1/health)
API health check.

**Public** - No auth required.

**Response (200/503):**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "uptime": 12345,
    "timestamp": "2026-03-03T12:00:00.000Z",
    "services": { "mongodb": "connected" }
  }
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Description of what went wrong"
}
```

| Status | Meaning                                    |
|--------|--------------------------------------------|
| 400    | Bad request / validation error             |
| 401    | Missing or invalid Firebase token          |
| 403    | Forbidden (banned, ownership check failed) |
| 404    | Resource not found                         |
| 429    | Rate limit exceeded                        |
| 503    | Service unavailable (contract not configured)|

### Settings

#### GET /settings
Get public game settings (costs, thresholds, etc.).

**Public** - No auth required.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tournamentSchedule": {
      "startDay": 3,
      "startHour": 12,
      "durationHours": 120,
      "cooldownHours": 48
    },
    "prizePools": { "1": 2, "2": 4, "3": 6, "4": 8, "5": 10, "6": 12, "7": 14 },
    "levelUpCost": 1,
    "maxPointsPerMatch": 5000,
    "burnRate": 0.5,
    "teamRevenueSplit": 0.25,
    "awardPoolSplit": 0.75,
    "armoryClosedDuringCooldown": true,
    "claimLimit": 1,
    "claimEnabled": true,
    "downloads": 150,
    "trailer": "https://youtube.com/..."
  }
}
```

Note: The `contracts` field is excluded from the response for security (`-contracts` in the select query).

---

## Rate Limits

| Endpoint Group | Limit          | Message |
|---------------|----------------|---------|
| Auth (`create-user` and `login` only) | 20 req / 15 min | "Too many auth attempts. Please try again later." |
| General (all `/api/*`) | 10,000 req / 1 hour | "Too many requests from this IP, please try again in an hour!" |

Auth endpoints (`create-user` and `login`) have a stricter limit. All other endpoints fall under the general API-wide limit.

## Player Types

| Type | Description | Can Convert Points | Can Enter Tournaments | Gets Rewards |
|------|-------------|-------------------|----------------------|-------------|
| WEB2 | No wallet/NFT | No | No | No |
| WEB3 | Has wallet + NFT | Yes | Yes | Yes |
