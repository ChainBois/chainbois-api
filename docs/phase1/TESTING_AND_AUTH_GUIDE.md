# Testing & Auth Guide for Frontend Devs

How to create users, get auth tokens, and test authenticated API endpoints from Postman — without needing the frontend running.

---

## Background: What Happened to `chainboisgame@gmail.com`

A user was found in the database with **empty username and email fields**:

```
UID:     vW6JTYnmANMrcIbUXkQ12VjkjPy1
Email:   (empty in MongoDB)
Address: 0xe77d0d2b19b182bed55f6f656425f7cd317f5636
```

**What happened:** This user was created in Firebase Auth (as `chainboisgame@gmail.com` with displayName `ChainBoi`) but the account was **not** created through our `/auth/create-user` endpoint — it was either created directly in the Firebase console or through the Firebase client SDK without going through the backend. Because of this:

- Firebase RTDB had no `username` field for this user (only game state: `hasNFT`, `level`, `weapons`)
- When the user logged in via `/auth/login`, the backend tried to read `username` from Firebase RTDB, got nothing, and created the MongoDB record with an empty username
- The backend also never received or stored the email (the login endpoint only takes `{ address }` in the body — it relied on RTDB for the username)

**Resolution:** The user was deleted from all three systems (Firebase Auth, Firebase RTDB, MongoDB) and the backend login endpoint was hardened to prevent empty usernames in the future (see "Login Hardening" below).

**Additional finding:** Firebase RTDB had duplicate keys: `hasNFT` (written by our backend) and `hasnft` (written by an older version of the Unity game). The backend now writes **both** keys for compatibility with all Unity game versions.

---

## The Correct Way to Create & Test Users

There are two new-ish endpoints that make testing easy without the frontend:

### Step 1: Create User — `POST /api/v1/auth/create-user`

This creates the user in Firebase Auth and Firebase Realtime DB. **No auth token needed.**

```
POST https://test-2.ghettopigeon.com/api/v1/auth/create-user
Content-Type: application/json

{
  "email": "your-email@example.com",
  "password": "YourPassword123",
  "username": "YourGameName"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "uid": "FwXKsWYrXbNB2ZrUhLyRultXtNw1"
  }
}
```

**What this does behind the scenes:**
1. Creates a Firebase Auth account (email + password)
2. Writes to Firebase Realtime DB: `users/{uid}` with `{ username, Score: 0, hasNFT: false, hasnft: false, level: 0 }`
3. Does NOT create a MongoDB record — that happens at login

**Validation:**
- Email must be valid format
- Password must be at least 6 characters
- Username is required (this is what prevented the `chainboisgame@gmail.com` issue — that user bypassed this endpoint)
- Duplicate emails return 400

### Step 2: Get a Token — `POST /api/v1/auth/simulate`

This gives you a valid Firebase ID token without needing the Firebase client SDK or a browser. **No auth token needed.**

```
POST https://test-2.ghettopigeon.com/api/v1/auth/simulate
Content-Type: application/json

{
  "email": "your-email@example.com"
}
```

**Response (200):**
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

**What this does behind the scenes:**
1. Looks up the Firebase Auth user by email (must already exist — use create-user first)
2. Creates a Firebase custom token using the Admin SDK
3. Exchanges that custom token for a real ID token via the Firebase REST API
4. Returns the ID token

**The returned `idToken` is identical to what the frontend gets from `firebase.auth().currentUser.getIdToken()`.** It works with the `decodeToken` middleware on every protected endpoint.

**Errors:**
- 404 — "No user found with this email. Use POST /auth/create-user first."
- 400 — Invalid email format

**Token lifetime:** 1 hour. When you get a 401 "Token has expired", just call `/simulate` again.

### Step 3: Login — `POST /api/v1/auth/login`

Now use the token to login and link a wallet address. This creates your MongoDB user record.

```
POST https://test-2.ghettopigeon.com/api/v1/auth/login
Authorization: Bearer <paste idToken from step 2>
Content-Type: application/json

{
  "address": "0x5220C9d3Ed555C5eC1505609a9572dF7819dc329"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "FwXKsWYrXbNB2ZrUhLyRultXtNw1",
      "username": "goonerlabs",
      "address": "0x5220c9d3ed555c5ec1505609a9572df7819dc329",
      "playerType": "web3",
      "pointsBalance": 0,
      "level": 0,
      "score": 0,
      "highScore": 0,
      "gamesPlayed": 0,
      "hasNft": true,
      "nftTokenId": 1,
      "isBanned": false,
      "lastLogin": "2026-03-19T16:00:00.000Z"
    },
    "assets": [ ... ],
    "weapons": [ ... ]
  }
}
```

**What login does:**
1. Verifies the Firebase ID token (via `decodeToken` middleware)
2. Validates the wallet address
3. Checks ban status
4. Gets username from Firebase RTDB (with fallbacks — see below)
5. Finds or creates MongoDB user
6. Checks on-chain NFT ownership
7. Auto-upgrades `web2` to `web3` if NFTs found (or downgrades if lost)
8. Syncs assets to Firebase RTDB for the Unity game
9. Returns full user profile + NFT assets + weapons

### Step 4: Use the Token for Everything Else

For any authenticated endpoint, add the header:

```
Authorization: Bearer <your idToken>
```

That's it. The token works on all protected endpoints:

| Endpoint | Method | What It Does |
|----------|--------|-------------|
| `/auth/me` | GET | Get your user profile |
| `/auth/logout` | POST | End session, revoke tokens |
| `/game/verify-assets` | POST | Refresh NFT/weapon ownership |
| `/game/set-avatar` | POST | Set active ChainBoi NFT |
| `/training/nfts/:address` | GET | List your NFTs with full data |
| `/training/nft/:tokenId` | GET | Get single NFT detail |
| `/training/level-up` | POST | Level up an NFT |
| `/training/level-up/cost` | GET | Get cost for next level |
| `/training/eligibility/:tokenId` | GET | Check level-up eligibility |
| `/leaderboard/rank/:uid` | GET | Get your leaderboard rank |

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

**Quick test:**
```
POST /auth/simulate  →  { "email": "goonerlabs@gmail.com" }
POST /auth/login     →  { "address": "0x5220C9d3Ed555C5eC1505609a9572dF7819dc329" }
```

To get NFTs for this wallet, use the faucet at: `chainbois-testnet-faucet.vercel.app`

---

## Postman Setup (Recommended)

### Import the Collection

1. Open Postman
2. Click **Import** (top-left)
3. Drag and drop `docs/phase1/POSTMAN_COLLECTION.json`
4. The collection includes a **Simulate Login** request with an auto-store script

### Auto-Store Token

The Simulate Login request in the Postman collection has a **Tests** script that automatically saves the token:

```javascript
if (pm.response.code === 200) {
    const data = pm.response.json().data;
    pm.environment.set("firebase_token", data.idToken);
    pm.environment.set("test_uid", data.uid);
    console.log("Token stored! UID:", data.uid);
}
```

After running Simulate Login once, all other requests in the collection will automatically use the stored `{{firebase_token}}` variable — no manual copy-pasting needed.

### Environment Variables

Create a Postman environment with:

| Variable | Value |
|----------|-------|
| `base_url` | `https://test-2.ghettopigeon.com/api/v1` |
| `firebase_token` | *(auto-set by simulate)* |
| `test_uid` | *(auto-set by simulate)* |
| `test_address` | `0x5220C9d3Ed555C5eC1505609a9572dF7819dc329` |

---

## Login Hardening (What Changed)

To prevent the empty-username issue from happening again, the login endpoint now has a **three-tier fallback** for username:

```
1. Firebase RTDB  →  users/{uid}/username       (primary, set by create-user)
2. Firebase Auth  →  displayName                (fallback, set during auth creation)
3. Firebase Auth  →  email prefix               (last resort, e.g. "chainboisgame")
```

The email from Firebase Auth is also now stored in MongoDB, so even if RTDB is missing data, the user record won't have empty fields.

**Bottom line:** Always use `POST /auth/create-user` to create users — it sets up all three systems correctly. Don't create Firebase Auth users directly through the console or client SDK without also writing to RTDB.

---

## Firebase RTDB Key Note (`hasNFT` vs `hasnft`)

The backend now writes **both** `hasNFT` (camelCase) and `hasnft` (lowercase) to Firebase Realtime DB. This is because different versions of the Unity game read different key names.

If you're reading NFT status from Firebase RTDB on the frontend, use `hasNFT` (the canonical version). But be aware both keys exist and always have the same value.

---

## Endpoints That Do NOT Need Auth

For reference, these endpoints work without any token:

| Endpoint | Method | What It Does |
|----------|--------|-------------|
| `/auth/create-user` | POST | Create a new user |
| `/auth/check-user/:email` | GET | Check if email exists |
| `/auth/simulate` | POST | Get a test token |
| `/armory/*` | GET/POST | Browse and purchase weapons/NFTs |
| `/points/*` | GET/POST | View points and convert to $BATTLE |
| `/inventory/:address/*` | GET | View wallet's inventory |
| `/leaderboard` | GET | Public leaderboard |
| `/metadata/*` | GET | NFT/weapon metadata (for marketplaces) |
| `/claim/*` | GET/POST | Faucet claims |
| `/health` | GET | Health check |
| `/settings` | GET | Game settings |
