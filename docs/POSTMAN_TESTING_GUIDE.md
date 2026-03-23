# ChainBois API — Postman Testing Guide

How to test authenticated endpoints without the frontend.

---

## Why This Exists

Most ChainBois API endpoints require a Firebase Auth token (`Authorization: Bearer <token>`). Normally, this token comes from the frontend's Firebase Auth SDK after the user signs in with email/password.

The **Simulate Login** endpoint lets you skip the frontend entirely — you give it an email address, and it returns a valid Firebase ID token you can paste into Postman's Authorization header. This is the same token the frontend would get from `firebase.auth().currentUser.getIdToken()`.

---

## Quick Start (3 Steps)

### Step 1: Create a User

If you don't already have a user in Firebase Auth, create one:

```
POST {{base_url}}/auth/create-user
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "YourPassword123",
  "username": "YourUsername"
}
```

**Response:**
```json
{
  "success": true,
  "data": { "uid": "FwXKsWYrXbNB2ZrUhLyRultXtNw1" }
}
```

This creates the user in:
- **Firebase Auth** (email/password credentials)
- **Firebase Realtime DB** (username, Score: 0, hasNFT: false, level: 0)

It does NOT create a MongoDB record yet — that happens when you call `/auth/login`.

### Step 2: Get a Token (Simulate Login)

```
POST {{base_url}}/auth/simulate
Content-Type: application/json

{
  "email": "your-email@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "idToken": "eyJhbGciOiJSUzI1NiIs...(very long string)...",
    "uid": "FwXKsWYrXbNB2ZrUhLyRultXtNw1",
    "email": "your-email@example.com"
  }
}
```

Copy the `idToken` value.

### Step 3: Use the Token

In Postman, for any authenticated request, add the header:

```
Authorization: Bearer <paste idToken here>
```

Or set it as a collection/environment variable (see automation below).

---

## Full Testing Flow

Here's the recommended order for testing the complete API:

```
1. POST /auth/create-user          ← Create Firebase user (no auth)
2. POST /auth/simulate             ← Get ID token (no auth)
3. POST /auth/login                ← Login with token + wallet address (creates MongoDB user)
4. GET  /auth/me                   ← Verify user profile
5. POST /game/verify-assets        ← Check NFT ownership
6. GET  /training/nfts/:address    ← List owned NFTs
7. GET  /inventory/:address        ← View inventory (no auth needed)
8. GET  /armory/weapons            ← Browse weapons (no auth needed)
9. POST /auth/logout               ← End session
```

### Login (Links Wallet)

After getting a token via `/simulate`, call login with your wallet address:

```
POST {{base_url}}/auth/login
Authorization: Bearer {{firebase_token}}
Content-Type: application/json

{
  "address": "0x5220C9d3Ed555C5eC1505609a9572dF7819dc329"
}
```

This:
- Creates your MongoDB user record (if first login)
- Checks your on-chain NFT ownership
- Syncs your assets to Firebase for the Unity game
- Returns your full user profile + NFTs + weapons

---

## Postman Automation

### Auto-Store Token in Environment Variable

In the **Tests** tab of the Simulate Login request, add:

```javascript
if (pm.response.code === 200) {
    const data = pm.response.json().data;
    pm.environment.set("firebase_token", data.idToken);
    pm.environment.set("test_uid", data.uid);
    console.log("Token stored! UID:", data.uid);
}
```

Then set your other requests' Authorization header to: `Bearer {{firebase_token}}`

### Environment Variables

Create a Postman environment with these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `https://test-2.ghettopigeon.com/api/v1` | API base URL |
| `firebase_token` | *(auto-set by simulate)* | Firebase ID token |
| `test_uid` | *(auto-set by simulate)* | Firebase UID |
| `test_address` | `0x5220C9d3Ed555C5eC1505609a9572dF7819dc329` | Your wallet address |

---

## Which Endpoints Need Auth?

### Requires `Authorization: Bearer <token>`:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login` | POST | Login + link wallet |
| `/auth/me` | GET | Get user profile |
| `/auth/logout` | POST | End session |
| `/game/verify-assets` | POST | Refresh NFT ownership |
| `/game/set-avatar` | POST | Set active ChainBoi |
| `/training/nfts/:address` | GET | List owned NFTs |
| `/training/nft/:tokenId` | GET | NFT detail |
| `/training/level-up` | POST | Level up NFT |
| `/training/level-up/cost` | GET | Get level-up cost |
| `/training/eligibility/:tokenId` | GET | Check eligibility |
| `/leaderboard/rank/:uid` | GET | Get user's rank |
| `/metrics/compute` | POST | Recompute metrics (admin) |
| `/airdrop/distribute` | POST | Distribute airdrop (admin) |

### No Auth Required:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/create-user` | POST | Create Firebase user |
| `/auth/check-user/:email` | GET | Check if email exists |
| `/auth/simulate` | POST | Get test token |
| `/armory/*` | GET/POST | Browse + purchase weapons/NFTs |
| `/points/*` | GET/POST | Points + conversion |
| `/inventory/:address/*` | GET | View inventory |
| `/leaderboard` | GET | Public leaderboard |
| `/metadata/*` | GET | NFT/weapon metadata |
| `/claim/*` | GET/POST | Faucet claims |
| `/health` | GET | Health check |
| `/settings` | GET | Game settings |

---

## Token Expiration

Firebase ID tokens expire after **1 hour**. When you get a 401 "Token has expired" response, just call `/auth/simulate` again to get a fresh token.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "No user found with this email" on `/simulate` | Call `/auth/create-user` first |
| "Token has expired" (401) | Call `/simulate` again for a fresh token |
| "This wallet address is already linked to another account" | Use a different wallet address, or delete the other user |
| Empty `assets` array on login | Your wallet doesn't own any ChainBoi NFTs — use the faucet at `chainbois-testnet-faucet.vercel.app` (click Connect Wallet — auto-switches to Fuji) |
| "FIREBASE_API_KEY not configured" | Server-side issue — check `.env` has `FIREBASE_API_KEY` set |

---

## Pre-Configured Test User

A test user is already set up and ready to use:

| Field | Value |
|-------|-------|
| Email | `goonerlabs@gmail.com` |
| Password | `BennyBlanco20` |
| Username | `goonerlabs` |
| Wallet | `0x5220C9d3Ed555C5eC1505609a9572dF7819dc329` |
| UID | `FwXKsWYrXbNB2ZrUhLyRultXtNw1` |

To test immediately:
```
POST /auth/simulate  →  { "email": "goonerlabs@gmail.com" }
POST /auth/login     →  { "address": "0x5220C9d3Ed555C5eC1505609a9572dF7819dc329" }
```
