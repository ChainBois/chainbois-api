# ChainBois Phase 1 - Frontend API Reference

**Auth, Game, Health & Settings endpoints.**

---

## Table of Contents

1. [Overview and Architecture](#1-overview-and-architecture)
2. [Setup: Firebase, Thirdweb, API Client](#2-setup-firebase-thirdweb-api-client)
3. [User Flows](#3-user-flows)
4. [Auth Endpoints](#4-auth-endpoints)
5. [Game Endpoints](#5-game-endpoints)
6. [Health & Settings](#6-health--settings)
7. [Error Handling](#7-error-handling)
8. [Player Types](#8-player-types)
9. [Firebase RTDB Structure](#9-firebase-rtdb-structure)
10. [FAQ](#10-faq)

---

## 1. Overview and Architecture

### What the Frontend Does

The ChainBois frontend is a web application where users:
1. Create an account (email/password via Firebase)
2. Connect their Avalanche wallet (Thirdweb)
3. View their NFT assets and weapons
4. Download the game
5. View leaderboards (see Leaderboard section below)
6. (Future phases) Level up NFTs, buy weapons, enter tournaments

### What the Frontend Does NOT Do

- **Does NOT** talk to the blockchain directly (the backend handles all on-chain queries)
- **Does NOT** read from or write to Firebase RTDB (all data flows through the API)
- **Does NOT** need to know about smart contract ABIs or addresses
- **Does NOT** register game users (the game writes to Firebase directly; the backend detects new UIDs automatically)

### Architecture Diagram

```
User's Browser
    |
    +-- Firebase Auth SDK (email/password sign-in, get ID token)
    |
    +-- Thirdweb SDK (wallet connection, get address)
    |
    +-- Axios/Fetch --> ChainBois API (all game data)
                           |
                           +-- MongoDB (user profiles, scores, leaderboard)
                           +-- Avalanche C-Chain (NFT ownership, levels)
                           +-- Firebase RTDB (writes for Unity game)

Unity Game
    |
    +-- Firebase Auth SDK (registers users directly)
    |
    +-- Firebase RTDB (writes username + score; reads hasNFT, level, weapons)
    |
    (Backend polls Firebase via cron jobs -- game never calls the API)
```

### How the Pieces Connect

```
+--------------+   +--------------+   +-----------------------------+
| Unity Game   |   |  Frontend    |   |     Backend API             |
| (PC+Mobile)  |   | (Next.js)    |   |     (Express.js)            |
|              |   |              |   |                             |
| Firebase  ---+---+-- Firebase --+---+-- Firebase (poll/write)     |
| Auth         |   | Auth         |   |                             |
|              |   | Thirdweb     |   | Modules:                    |
| Reads:       |   | Wallet       |   | - Auth (Firebase tokens)    |
| - hasNFT     |   |              |   | - Game Sync (Firebase cron) |
| - level      |   | Calls API:   |   | - Leaderboard (Phase 4)     |
| - weapons    |   | Bearer tok   |   | - Training Room (Phase 3)   |
|              |   | + address    |   | - Battleground (Phase 4)    |
| Writes:      |   |              |   | - Armory (Phase 5)          |
| - Score      |   |              |   | - Inventory (Phase 6)       |
| - username   |   |              |   | - Cron Jobs                 |
+--------------+   +--------------+   +-----------------------------+
                                                  |
       +------------+-----------+-----------+-----+
       v            v           v           v
  +---------+ +----------+ +-------+ +-----------+
  | MongoDB | | Firebase | | Redis | | Avalanche |
  |         | | Realtime | |       | | C-Chain   |
  | Users   | | DB       | | Cache | | (Fuji)    |
  | Scores  | |          | | Queue | |           |
  | Txns    | | Game<->  | |       | | Contracts |
  |         | | API Sync | |       | | NFTs      |
  +---------+ +----------+ +-------+ | Tokens    |
                                      +-----------+
```

---

## 2. Setup: Firebase, Thirdweb, API Client

### Required Dependencies

```bash
npm install firebase axios
npm install @thirdweb-dev/react @thirdweb-dev/sdk
```

### Firebase Configuration

```javascript
// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "chainbois",
  storageBucket: "chainbois.appspot.com",
  // messagingSenderId and appId: get from Firebase Console > Project Settings > General
  // messagingSenderId: "YOUR_SENDER_ID",
  // appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

> **Note**: The `apiKey` above is the real Firebase web API key for ChainBois. Get `messagingSenderId` and `appId` from the [Firebase Console](https://console.firebase.google.com/) under **Project Settings > General > Your apps**. These are required for Firebase initialization but are safe to include in frontend code.

### API Client with Auto-Attached Token

```javascript
// lib/api.js
import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://test-2.ghettopigeon.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Automatically attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Thirdweb Wallet Connection

```javascript
// app/providers.js (Next.js App Router example)
import { ThirdwebProvider } from "@thirdweb-dev/react";

// Avalanche Fuji Testnet chain ID
const AVALANCHE_FUJI = 43113;
// const AVALANCHE_MAINNET = 43114;

export function Providers({ children }) {
  return (
    <ThirdwebProvider
      activeChain={AVALANCHE_FUJI}
      clientId="YOUR_THIRDWEB_CLIENT_ID"  // Create at https://thirdweb.com/dashboard
    >
      {children}
    </ThirdwebProvider>
  );
}
```

### Base URLs

```
Development: http://localhost:5000/api/v1
Testnet:     https://test-2.ghettopigeon.com/api/v1
Production:  TBD
```

---

## 3. User Flows

There are two forms of authentication:

1. **Firebase Auth** -- handles email/password, gives you an ID token
2. **Wallet Connection** -- Thirdweb connects to MetaMask/Core/etc, gives you an address

Both are needed for full login on the website.

### Flow A: Game-First User (Web2 to Web3 Upgrade)

This is the most common path. The user starts by playing the game and later visits the website.

```
1. User downloads and plays the game
2. Game registers user via Firebase Auth SDK directly
3. Game writes { username, Score } to Firebase RTDB
4. Game-only player is invisible to the backend (no MongoDB record)
5. syncNewUsersJob (daily midnight) counts them for web2/web3 metrics only

    --- User later visits the website ---

6. User signs in with Firebase (email/password) on the website
7. User connects wallet via Thirdweb
8. Frontend calls: POST /auth/login { address }
   - Backend creates a new MongoDB user (first login)
   - Checks on-chain NFT ownership → upgrades to web3 if NFTs found
   - Links address to the user record
10. Backend checks NFTs on-chain:
    - If NFT found: upgrades playerType "web2" -> "web3"
    - Writes { hasNFT: true, level, weapons } to Firebase RTDB
    - Game reads Firebase and unlocks premium content
11. Frontend receives { user, assets, weapons } and displays dashboard
```

**Key point**: The game registers users via Firebase SDK directly. There is NO API call from the game. The backend discovers new users by polling Firebase.

### Flow B: Website-First User

User creates an account on the website before playing the game.

```
1. User fills signup form (email, password, username)
2. Frontend calls: POST /auth/create-user { email, password, username }
   - Backend creates Firebase Auth user + writes to Firebase RTDB
   - Returns { uid }
3. Frontend signs in with Firebase: signInWithEmailAndPassword(auth, email, password)
4. User connects wallet via Thirdweb
5. Frontend calls: POST /auth/login { address }
   - Backend creates MongoDB user with address
   - Checks NFTs on-chain
   - Writes asset data to Firebase RTDB
6. Frontend receives { user, assets, weapons } and displays dashboard
7. User downloads the game, signs in with same Firebase account
8. Game reads Firebase RTDB and sees { hasNFT, level, weapons }
```

### Flow C: Returning User

User already has an account and is logging in again.

```
1. User signs in with Firebase (email/password)
2. User connects wallet via Thirdweb
3. Frontend calls: POST /auth/login { address }
   - Backend finds user by address (primary lookup)
   - Re-checks NFTs on-chain (detects upgrades or transfers)
   - Updates Firebase RTDB
4. Frontend receives { user, assets, weapons } with fresh data
5. Frontend displays dashboard
```

### Login Lookup Order

The backend uses **address-primary lookup with uid fallback**:

1. First: `User.findOne({ address })` -- finds existing web3 users
2. Fallback: `User.findOne({ uid })` -- finds web2 users who have never linked a wallet

This dual lookup ensures that if a user changes wallets or previously logged in with a different address, they are still found by their Firebase UID.

---

## Blockchain Explorer (Snowtrace)

View all contracts and wallets on the Avalanche Fuji Testnet explorer:

**Contracts:**
| Contract | Address | Explorer |
|----------|---------|----------|
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0) |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b) |
| WeaponNFT | `0xa2AFf3105668124A187b1212Ab850bf8b98dD07d` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xa2AFf3105668124A187b1212Ab850bf8b98dD07d) |

**Platform Wallets:**
| Wallet | Address | Explorer |
|--------|---------|----------|
| Deployer | `0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0` | [View on Snowtrace](https://testnet.snowtrace.io/address/0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0) |
| NFT Store (50 ChainBois) | `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` | [View on Snowtrace](https://testnet.snowtrace.io/address/0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0) |
| Weapon Store (13 weapons) | `0xD40e6631617B7557C28789bAc01648A74753739C` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xD40e6631617B7557C28789bAc01648A74753739C) |
| Prize Pool | `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e` | [View on Snowtrace](https://testnet.snowtrace.io/address/0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e) |

---

## 4. Auth Endpoints

### GET /auth/check-user/:email

Check if a user with a given email already exists in Firebase Auth.

**Auth**: None (public endpoint)

| Param | Type | Required | Validation |
|-------|--------|----------|-------------------------------|
| email | string | yes | Valid email format (URL param) |

**Response (200):**
```json
{
  "success": true,
  "data": { "exists": true }
}
```

**Errors:**
- `400`: "Please provide a valid email address"

**Example:**
```javascript
const checkUserExists = async (email) => {
  const { data } = await api.get(`/auth/check-user/${encodeURIComponent(email)}`);
  return data.data.exists; // true or false
};

// Usage: check before showing signup form
const exists = await checkUserExists("player@example.com");
if (exists) {
  alert("Account already exists. Please log in instead.");
}
```

---

### POST /auth/create-user

Create a new user account. Creates a Firebase Auth user and writes initial data to Firebase RTDB.

**Auth**: None (public endpoint)

| Field | Type | Required | Validation |
|----------|--------|----------|-------------------------------|
| email | string | yes | Valid email format |
| password | string | yes | Min 6 characters (Firebase) |
| username | string | yes | Non-empty, max 100 characters |

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
- `400`: "Please provide a valid email address"
- `400`: "Password must be at least 6 characters"
- `400`: "Username is required"
- `400`: "Username is too long (max 100 characters)"
- `400`: "Email is already registered"

**Example:**
```javascript
const handleRegister = async (email, password, username) => {
  try {
    // Step 1: Create user via API
    const { data } = await api.post("/auth/create-user", {
      email, password, username,
    });
    const uid = data.data.uid;

    // Step 2: Sign into Firebase to get auth token
    await signInWithEmailAndPassword(auth, email, password);

    // User is now logged into Firebase
    // Next: connect wallet and call /auth/login
    return uid;
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    throw new Error(message);
  }
};
```

---

### POST /auth/simulate

Get a valid Firebase ID token for testing without the frontend auth flow.

**Auth**: None (public endpoint)

**When to use**: When testing authenticated endpoints from Postman, curl, or any HTTP client. This replaces the need to go through Firebase Auth SDK sign-in on the frontend.

| Field | Type | Required | Validation |
|-------|--------|----------|-------------------------------|
| email | string | yes | Valid email format |

**Request:**
```json
{
  "email": "goonerlabs@gmail.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "idToken": "eyJhbGciOiJSUzI1NiIs...",
    "uid": "FwXKsWYrXbNB2ZrUhLyRultXtNw1",
    "email": "goonerlabs@gmail.com"
  }
}
```

**How it works:**
1. Looks up the Firebase Auth user by email
2. Creates a Firebase custom token via the Admin SDK
3. Exchanges the custom token for a real ID token via the Firebase REST API
4. Returns the ID token -- use it as `Authorization: Bearer <idToken>` on protected endpoints

**Prerequisites:**
- User must exist in Firebase Auth (use `POST /auth/create-user` first)
- Token expires after 1 hour -- call again when you get 401

**Errors:**
- `404`: No user found with this email
- `400`: Invalid email format

**Example:**
```javascript
// From Postman or curl -- get a token for testing
const getTestToken = async (email) => {
  const { data } = await api.post("/auth/simulate", { email });
  return data.data.idToken;
};

// Usage:
const token = await getTestToken("goonerlabs@gmail.com");
// Use as: Authorization: Bearer <token>
```

```bash
# curl example:
curl -X POST https://test-2.ghettopigeon.com/api/v1/auth/simulate \
  -H "Content-Type: application/json" \
  -d '{"email": "goonerlabs@gmail.com"}'

# Then use the returned idToken:
curl https://test-2.ghettopigeon.com/api/v1/auth/me \
  -H "Authorization: Bearer <idToken from above>"
```

---

### POST /auth/login

Login with wallet address. Checks on-chain NFT ownership, creates or updates the user in MongoDB, and writes asset data to Firebase RTDB for the Unity game.

**Auth**: Firebase token required (Authorization: Bearer)

| Field | Type | Required | Validation |
|---------|--------|----------|-------------------------------|
| address | string | yes | Valid EVM wallet address |

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
      "uid": "firebase_uid",
      "username": "ChainBoi_001",
      "address": "0x1234...5678",
      "playerType": "web3",
      "pointsBalance": 500,

      "level": 2,
      "score": 1500,
      "highScore": 1500,
      "gamesPlayed": 10,
      "hasNft": true,
      "nftTokenId": 42,
      "isBanned": false,

      "lastLogin": "2026-03-03T12:00:00.000Z"
    },
    "assets": [
      {
        "tokenId": 42,
        "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
        "level": 2,
        "rank": "Sergeant",
        "badge": "sergeant",
        "imageUri": "ipfs://bafybei.../chainboi-42.png",
        "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/42.json",
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
          { "trait_type": "Kills", "value": 10 },
          { "trait_type": "Score", "value": 500 },
          { "trait_type": "Games Played", "value": 5 }
        ],
        "inGameStats": { "kills": 10, "score": 500, "gamesPlayed": 5 }
      },
      {
        "tokenId": 43,
        "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
        "level": 0,
        "rank": "Private",
        "badge": "private",
        "imageUri": "ipfs://bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/43.png",
        "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/43.json",
        "traits": [
          { "trait_type": "Background", "value": "Tactical Green" },
          { "trait_type": "Skin", "value": "Dark Ops" },
          { "trait_type": "Weapon", "value": "Combat Knife" },
          { "trait_type": "Suit", "value": "Desert Storm" },
          { "trait_type": "Eyes", "value": "Focused" },
          { "trait_type": "Mouth", "value": "Gas Mask" },
          { "trait_type": "Helmet", "value": "Night Vision" },
          { "trait_type": "Level", "value": 0 },
          { "trait_type": "Rank", "value": "Private" },
          { "trait_type": "Kills", "value": 0 },
          { "trait_type": "Score", "value": 0 },
          { "trait_type": "Games Played", "value": 0 }
        ],
        "inGameStats": { "kills": 0, "score": 0, "gamesPlayed": 0 }
      }
    ],
    "weapons": [
      {
        "tokenId": 1,
        "contractAddress": "0xa2AFf3105668124A187b1212Ab850bf8b98dD07d",
        "weaponName": "RENETTI",
        "category": "handgun",
        "tier": "base",
        "imageUri": "ipfs://...",
        "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/weapon/1.json"
      }
    ]
  }
}
```

**Side effects:**
- Creates user in MongoDB if first login
- Finds existing web2 user by uid if address lookup fails (web2 to web3 upgrade)
- Links wallet address to user
- Writes `{ hasNFT, level, weapons }` to Firebase RTDB (for Unity game)
- All wallet-connected users are created as WEB3 (connecting a wallet = permanent web3 status)
- Does NOT downgrade back to WEB2 if NFT is sold/transferred

**Errors:**
- `400`: "Please provide a valid EVM wallet address"
- `400`: "This wallet address is already linked to another account"
- `403`: "Account permanently banned for repeated violations"
- `403`: "Account temporarily banned. Try again later."

**Example:**
```javascript
import { useAddress } from "@thirdweb-dev/react";

const LoginButton = () => {
  const address = useAddress();

  const handleLogin = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }
    if (!auth.currentUser) {
      alert("Please sign in with your email first");
      return;
    }

    try {
      const { data } = await api.post("/auth/login", { address });
      const { user, assets, weapons } = data.data;

      // Store in your state management
      setUser(user);
      setAssets(assets);
      setWeapons(weapons);

      if (user.playerType === "web3") {
        console.log("Web3 user! Owns " + assets.length + " ChainBoi NFTs");
        assets.forEach(nft => console.log(`  NFT #${nft.tokenId} (Level ${nft.level})`));
        console.log("Weapons:", weapons.map(w => w.weaponName));
      } else {
        console.log("Web2 user - no NFT detected");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={!address}>
      Login with Wallet
    </button>
  );
};
```

---

### GET /auth/me

Get current user's profile from the database (fast, no blockchain call).

**Auth**: Firebase token required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "firebase_uid",
      "username": "ChainBoi_001",
      "address": "0x1234...5678",
      "playerType": "web3",
      "pointsBalance": 500,

      "level": 2,
      "score": 1500,
      "highScore": 1500,
      "gamesPlayed": 10,
      "hasNft": true,
      "nftTokenId": 42,
      "isBanned": false,

      "lastLogin": "2026-03-03T12:00:00.000Z"
    }
  }
}
```

**Example:**
```javascript
const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await api.get("/auth/me");
      setUser(data.data.user);
    };
    fetchProfile();
  }, []);

  if (!user) return <Loading />;

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Player Type: {user.playerType === "web3" ? "Premium (NFT Holder)" : "Free Player"}</p>
      <p>Score: {user.score.toLocaleString()}</p>
      <p>High Score: {user.highScore.toLocaleString()}</p>
      <p>Games Played: {user.gamesPlayed}</p>
      <p>Points Balance: {user.pointsBalance}</p>

      {user.hasNft && (
        <div>
          <h2>Your ChainBoi NFT</h2>
          <p>Token ID: #{user.nftTokenId}</p>
          <p>Level: {user.level}</p>
        </div>
      )}

      {!user.hasNft && (
        <div>
          <h2>Get a ChainBoi NFT</h2>
          <p>Purchase an NFT to unlock premium features and enter tournaments!</p>
        </div>
      )}
    </div>
  );
};
```

---

### POST /auth/logout

End user session: revokes Firebase refresh tokens and clears game-session data in Firebase RTDB.

**Auth**: Firebase token required

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Example:**
```javascript
const handleLogout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (e) {
    // Ignore errors - we're logging out anyway
  }

  // Sign out of Firebase
  await auth.signOut();

  // Clear local state
  setUser(null);
  setAssets(null);
};
```

---

## 5. Game Endpoints

### POST /game/verify-assets

Re-check on-chain NFT ownership and sync to Firebase. Call this when the user explicitly clicks a "Refresh" button.

**Auth**: Firebase token required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hasNft": true,
    "nftTokenId": 42,
    "level": 2,
    "assets": [
      {
        "tokenId": 42,
        "contractAddress": "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b",
        "level": 2,
        "rank": "Sergeant",
        "badge": "sergeant",
        "imageUri": "ipfs://bafybei.../chainboi-42.png",
        "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/42.json",
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
          { "trait_type": "Kills", "value": 10 },
          { "trait_type": "Score", "value": 500 },
          { "trait_type": "Games Played", "value": 5 }
        ],
        "inGameStats": { "kills": 10, "score": 500, "gamesPlayed": 5 }
      }
    ],
    "ownedWeaponNfts": [
      {
        "tokenId": 1,
        "contractAddress": "0xa2AFf3105668124A187b1212Ab850bf8b98dD07d",
        "weaponName": "RENETTI",
        "category": "handgun",
        "tier": "base",
        "imageUri": "ipfs://...",
        "metadataUri": "https://test-2.ghettopigeon.com/api/v1/metadata/weapon/1.json"
      }
    ]
  }
}
```

**Errors:**
- `400`: "No wallet address linked. Please login first."
- `404`: "User not found"
- `503`: "NFT contract not configured"

**Example:**
```javascript
const refreshAssets = async () => {
  try {
    const { data } = await api.post("/game/verify-assets");
    return data.data;
    // { hasNft, nftTokenId, level, assets: [{ tokenId, level, ... }], ownedWeaponNfts }
  } catch (error) {
    if (error.response?.status === 503) {
      console.log("NFT contracts not available yet");
    }
    throw error;
  }
};
```

---

### POST /game/set-avatar

Set which ChainBoi NFT (symbol: CB) is the user's active avatar. Verifies on-chain ownership.

**Auth**: Firebase token required

| Field | Type | Required | Validation |
|---------|--------|----------|----------------------------------|
| tokenId | number | yes | Valid non-negative integer |

**Request:**
```json
{ "tokenId": 42 }
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tokenId": 42,
    "level": 2
  }
}
```

**Errors:**
- `400`: "tokenId is required"
- `400`: "tokenId must be a valid non-negative integer"
- `400`: "No wallet address linked"
- `400`: "Failed to verify NFT ownership. Token may not exist."
- `403`: "You do not own this NFT"
- `404`: "User not found"
- `503`: "NFT contract not configured"

**Example:**
```javascript
const setActiveAvatar = async (tokenId) => {
  try {
    const { data } = await api.post("/game/set-avatar", { tokenId });
    return data.data; // { tokenId, level }
  } catch (error) {
    if (error.response?.status === 403) {
      alert("You don't own this NFT!");
    }
    throw error;
  }
};
```

---

### GET /game/download/:platform

Download the game build. Streams a file directly to the browser.

**Auth**: None (public)

| Param | Values | File Served |
|----------|-------------|-------------|
| platform | `win` | `ChainBoisWin.zip` (~100-500MB) |
| platform | `apk` | `ChainBois.apk` (~50-200MB) |

Returns binary stream with headers:
- `Content-Disposition: attachment; filename="ChainBoisWin.zip"` (or ChainBois.apk)
- `Content-Type: application/octet-stream`
- `Content-Length: <file size in bytes>`

**Errors:**
- `400`: "Invalid platform. Use 'win' or 'apk'."
- `404`: "Game file not available yet" — file hasn't been uploaded to the server

**Example:**
```javascript
// Direct link - open in new tab or use anchor tag
const downloadWin = `${API_BASE_URL}/game/download/win`;
const downloadApk = `${API_BASE_URL}/game/download/apk`;

// HTML:
// <a href="https://test-2.ghettopigeon.com/api/v1/game/download/win">Download for Windows</a>
// <a href="https://test-2.ghettopigeon.com/api/v1/game/download/apk">Download APK (Android)</a>
```

#### Server Setup: Uploading Game Builds

The game builds must be placed on the server before downloads work. The server expects these exact filenames in the project root (`/root/chainbois-api/`):

| File | Expected Name | Notes |
|------|---------------|-------|
| Windows build | `ChainBoisWin.zip` | Must be a .zip (not raw .exe) |
| Android build | `ChainBois.apk` | APK file as-is |

**Step 1: Prepare the Windows build locally**

The .exe must be zipped first — the server serves it as a .zip:

```bash
# From your local machine (WSL / Linux terminal):
cd ~/Apostrophe
zip ChainBoisWin.zip ChainBois.exe
```

**Step 2: Upload both files to the server via SCP**

```bash
# Upload the Windows zip:
scp -i /home/goonerlabs/.ssh/id_rsa_puffs \
  ~/Apostrophe/ChainBoisWin.zip \
  root@167.71.160.74:/root/chainbois-api/ChainBoisWin.zip

# Upload the APK:
scp -i /home/goonerlabs/.ssh/id_rsa_puffs \
  ~/Apostrophe/ChainBois.apk \
  root@167.71.160.74:/root/chainbois-api/ChainBois.apk
```

**Step 3: Verify on the server**

```bash
# SSH into the server:
ssh root@167.71.160.74 -i /home/goonerlabs/.ssh/id_rsa_puffs

# Check the files exist and have size:
ls -lh /root/chainbois-api/ChainBoisWin.zip /root/chainbois-api/ChainBois.apk

# Verify via the API (no server restart needed):
curl http://localhost:3000/api/v1/game/info
# Expected: "platforms": { "win": true, "apk": true }

# Test download (first few bytes):
curl -I http://localhost:3000/api/v1/game/download/win
# Should return: Content-Disposition: attachment; filename="ChainBoisWin.zip"

curl -I http://localhost:3000/api/v1/game/download/apk
# Should return: Content-Disposition: attachment; filename="ChainBois.apk"
```

**No server restart is needed** — the controller checks file existence per-request.

**To update game builds later**, just SCP the new files with the same names. The old files get overwritten immediately.

---

### GET /game/info

Get game download count and platform availability.

**Auth**: None (public)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "downloads": 150,
    "trailer": "https://youtube.com/...",
    "platforms": { "win": true, "apk": true }
  }
}
```

**Example:**
```javascript
const DownloadSection = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const { data } = await api.get("/game/info");
      setInfo(data.data);
    };
    fetchInfo();
  }, []);

  return (
    <div>
      <h2>Download ChainBois</h2>
      <p>{info?.downloads || 0} downloads</p>
      {info?.platforms?.win && (
        <a href={`${API_BASE_URL}/game/download/win`}>Download for Windows</a>
      )}
      {info?.platforms?.apk && (
        <a href={`${API_BASE_URL}/game/download/apk`}>Download APK (Android)</a>
      )}
      {info?.trailer && (
        <a href={info.trailer} target="_blank" rel="noopener noreferrer">Watch Trailer</a>
      )}
    </div>
  );
};
```

---

## 6. Health & Settings

### GET /health

API health check.

**Auth**: None (public)

**Response (200 or 503):**
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

### GET /settings

Get public game settings (costs, thresholds, schedule, etc.).

**Auth**: None (public)

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
    "levelUpCosts": { "1": 0.001, "2": 0.002, "3": 0.003, "4": 0.004, "5": 0.005, "6": 0.006, "7": 0.007 },
    "battleTokenDecimals": 18,
    "maxPointsPerMatch": 5000,
    "burnRate": 0.5,
    "teamRevenueSplit": 0.25,
    "awardPoolSplit": 0.75,
    "armoryClosedDuringCooldown": true,
    "nftPrice": 0.001,
    "downloads": 150,
    "trailer": "https://youtube.com/..."
  }
}
```

> **Note**: The `contracts` field is excluded from the response for security.

---

## 7. Error Handling

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error (production):**
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

**Error (development):**
```json
{
  "success": false,
  "error": "Human-readable error description",
  "stack": "Error stack trace..."
}
```

> **Important**: In development mode the error text is in the `error` field, not `message`. Your error interceptor should handle both.

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|-------------------------------|-------------------------------|
| 200 | Success | Display data |
| 201 | Created | Display success message |
| 400 | Bad request / validation error | Show validation error to user |
| 401 | Missing or invalid Firebase token | Refresh Firebase token, re-login |
| 403 | Forbidden (banned, ownership check) | Show ban message or "not your NFT" |
| 404 | Not found | Show "not found" message |
| 429 | Rate limited | Show the backend's message |
| 503 | Service unavailable | Show "contracts not configured yet" |

### Rate Limits

| Endpoint Group | Limit | Message |
|----------------------------------------------|------------------|-----------------------------------------------|
| Auth (`create-user` and `login` only) | 20 req / 15 min | "Too many auth attempts. Please try again later." |
| General (all `/api/*`) | 10,000 req / 1 hr | "Too many requests from this IP, please try again in an hour!" |

### Recommended Error Interceptor

```javascript
// lib/api.js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message
      || error.response?.data?.error
      || "Something went wrong";

    switch (status) {
      case 401:
        // Token expired - try refreshing
        try {
          const user = auth.currentUser;
          if (user) {
            await user.getIdToken(true); // force refresh
            // Retry the original request
            const config = error.config;
            const newToken = await user.getIdToken();
            config.headers.Authorization = `Bearer ${newToken}`;
            return api(config);
          }
        } catch (refreshError) {
          // Force re-login
          await auth.signOut();
          window.location.href = "/login";
        }
        break;

      case 403:
        // Banned or ownership check failed
        // Show the backend's message - it's human-readable
        break;

      case 429:
        // Rate limited - the backend sends "Too many requests..."
        break;

      case 503:
        // Contract not configured - graceful degradation
        console.warn("Service unavailable:", message);
        break;
    }

    return Promise.reject(error);
  }
);
```

---

## 8. Player Types

### Web2 vs Web3

| Feature | WEB2 (No NFT) | WEB3 (Has NFT) |
|-------------------------------|----------------|-----------------|
| Play game | Yes | Yes |
| Base characters (4 Privates) | Yes | Yes |
| Base weapons (M4, RENETTI, GUTTER KNIFE, RPG) | Yes | Yes |
| Premium characters | No | Yes (based on level) |
| Premium weapon NFTs | No | Yes |
| Convert points to $BATTLE | No | Yes (Phase 5) |
| Enter tournaments | No | Yes (Phase 4) |
| Win prizes | No | Yes (Phase 4) |
| Level up NFT | No | Yes (Phase 3) |

### How to Determine Player Type

```javascript
const user = loginResponse.data.data.user;

if (user.playerType === "web3") {
  // Show full dashboard: NFT info, level, premium features, tournament entry
} else {
  // Show basic dashboard: score, games played
  // Show CTA: "Get a ChainBoi NFT to unlock premium features!"
}
```

### Auto-Detection

The backend automatically manages player type:
- **WEB3**: All users who connect a wallet are permanently WEB3. Connecting a wallet = web3 status, regardless of NFT ownership.
- **WEB2**: Game-only players who have never connected a wallet (only exist in Firebase, not in MongoDB).

There is no downgrade from WEB3 to WEB2 — once a user connects a wallet, they remain web3 even if they sell their NFTs. You do not need to implement any detection logic. Just read `user.playerType` from the API response.

---

## 9. Firebase RTDB Structure

The backend writes game data to Firebase for the Unity game to read. The frontend does **not** need to read or write Firebase RTDB directly. All frontend data flows through the API.

```
users/
  {uid}/
    username: "string"         // Written by game on registration OR by backend on create-user
    Score: 1500                // Cumulative score, written by game
    hasNFT: true               // Written by backend on login/verify-assets
    level: 2                   // Written by backend on login/verify-assets
    weapons: ["RENETTI"]       // Written by backend on login/verify-assets (null if none)
```

### Who writes what:

| Field | Written by | When |
|----------|------------|---------------------------------------------|
| username | Game (Firebase SDK) or Backend (create-user) | On registration |
| Score | Game (Firebase SDK) | During gameplay |
| hasNFT | Backend | On login, verify-assets, logout |
| level | Backend | On login, verify-assets |
| weapons | Backend | On login, verify-assets, logout |

---

## Leaderboard Endpoints

Leaderboard endpoints are documented separately in **`docs/phase4/FRONTEND_API.md`** and include:

- `GET /leaderboard` - All-time leaderboard (public)
- `GET /leaderboard/:period` - Time-filtered: 30min, 1hour, 24hours, 2days, week, month, year (public)
- `GET /leaderboard/rank/:uid` - User's rank for any period (requires auth)

All leaderboard endpoints support pagination (`limit`, `page` query params) and custom date ranges (`startDate`, `endDate`).

Postman collection for leaderboard: `docs/phase4/POSTMAN_COLLECTION.json`

---

## 10. FAQ

### Q: Do I need to interact with the blockchain from the frontend?

**No.** All blockchain interactions happen on the backend. The frontend only needs:
- Firebase Auth SDK (for email/password login)
- Thirdweb SDK (for wallet connection -- just to get the address)
- Axios/Fetch (to call the API)

### Q: What if the contracts are not deployed yet?

The API handles this gracefully. Endpoints that need contract interaction (`verify-assets`, `set-avatar`) return **503** with message "NFT contract not configured". The `login` endpoint still works -- it just returns `hasNft: false` with cached data.

### Q: How do I show a user's NFT image?

Use the `imageUri` field from the API response. For level 0 NFTs, this points to the original IPFS image. For leveled-up NFTs (level 1+), the `imageUri` points to an IPFS-pinned badge image (`ipfs://{cid}/chainboi-{tokenId}.png`) — the badge overlay is generated via Cloudinary and then pinned to IPFS. Cloudinary is used as a generation tool only, not for serving.

```javascript
// Use the imageUri directly from the API response
const imageUrl = asset.imageUri;
// Convert ipfs:// to a gateway URL if needed:
const gatewayUrl = imageUrl.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
```

For the original (pre-level-up) images, you can also construct the URL using the ChainBois images CID:
```javascript
const CHAINBOIS_IMAGES_CID = "bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4";
const imageUrl = `https://gateway.pinata.cloud/ipfs/${CHAINBOIS_IMAGES_CID}/${user.nftTokenId}.png`;
```

For weapon images:
```javascript
const WEAPONS_IMAGES_CID = "bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe";
const weaponImageUrl = `https://gateway.pinata.cloud/ipfs/${WEAPONS_IMAGES_CID}/${weaponFileName}`;
```

### Q: How often should I call verify-assets?

Only when the user explicitly clicks "Refresh" or when you suspect their NFT status changed (e.g., after they bought or sold an NFT). The `login` endpoint already checks assets on every login.

### Q: What happens if a user is banned?

The `login` endpoint returns **403** with one of these messages:
- `"Account permanently banned for repeated violations"` (permanent ban)
- `"Account temporarily banned. Try again later."` (temporary ban, expires after 24h)

Display the backend's message directly to the user. The `me` endpoint still returns their profile with `isBanned: true`.

### Q: How does the game interact with the website?

The game registers users via Firebase Auth SDK and writes `{ username, Score }` to Firebase RTDB. Game-only players are invisible to the backend until they visit the website — `syncNewUsersJob` (daily midnight) only counts them for web2/web3 platform metrics. When a user visits the website and connects their wallet via login, the backend creates their MongoDB record and upgrades them to web3 if they own an NFT. The game reads `{ hasNFT, level, weapons }` from Firebase RTDB to unlock content. The game never calls the API directly.

### Q: Does the game register users via the API?

**No.** The game uses the Firebase SDK directly to register users and write data to Firebase RTDB. Game-only players do not get MongoDB records — they remain invisible to the leaderboard and points system until they visit the website and log in. The `syncNewUsersJob` (daily midnight) only counts them for platform metrics. This means game developers do not need to make any changes to integrate with the backend.

### Q: What is the difference between "score" and "pointsBalance"?

- `score`: Cumulative game score synced from Firebase (what the game writes)
- `pointsBalance`: Redeemable points that can be converted to $BATTLE tokens (18 decimals) in Phase 5

Points are earned proportionally to score changes. They are separate because points can be "spent" (converted to tokens) while score keeps accumulating.

### Q: Do I need to handle token refresh?

The Firebase SDK handles token refresh automatically. Tokens last 1 hour. If you get a 401, call `user.getIdToken(true)` to force a refresh (see the error interceptor in Section 7).

### Q: What wallet should I use for testing?

Any EVM wallet works: MetaMask, Core, Phantom, Coinbase Wallet, Trust Wallet, etc. For testnet:
1. The website and faucet **automatically add and switch to Avalanche Fuji** — no manual network setup needed. Just click Approve when your wallet prompts you.
2. Claim a free starter pack (2 NFTs + 8 weapons + 1000 $BATTLE) at https://chainbois-testnet-faucet.vercel.app
3. Get testnet AVAX from https://core.app/tools/testnet-faucet/ (needed for level-ups)

### Q: Where is the Postman collection?

`docs/phase1/POSTMAN_COLLECTION.json` -- import this into Postman, set the `base_url` and `firebase_token` variables, and you can test all endpoints manually. To get a `firebase_token` without the frontend auth flow, use `POST /auth/simulate` with your email (see Section 4).

### Q: What are the ChainBois NFT details?

- **Symbol**: CB
- **Total Supply**: 4,032 (4,000 public + 32 reserved)
- **Testnet Supply**: 50
- **$BATTLE Token**: 18 decimal places

---

## Type Definitions

For TypeScript projects:

```typescript
interface UserObject {
  uid: string;
  username: string;
  address: string;
  playerType: "web2" | "web3";
  pointsBalance: number;
  level: number;            // 0-7 (highest level across all owned NFTs)
  score: number;
  highScore: number;
  gamesPlayed: number;
  hasNft: boolean;
  nftTokenId: number | null; // first owned NFT's tokenId (for quick access)
  isBanned: boolean;
  lastLogin: string;        // ISO 8601 date
}

interface ChainBoiAsset {
  tokenId: number;
  contractAddress: string;   // "0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b"
  level: number;             // 0-7
  rank: string;              // e.g., "Sergeant"
  badge: string;             // e.g., "sergeant"
  imageUri: string;          // IPFS URI
  metadataUri: string;       // metadata endpoint URL
  traits: { trait_type: string; value: any }[];
  inGameStats: { kills: number; score: number; gamesPlayed: number };
}

interface WeaponObject {
  tokenId: number;
  contractAddress: string;   // "0xa2AFf3105668124A187b1212Ab850bf8b98dD07d"
  weaponName: string;        // e.g., "RENETTI"
  category: string;          // e.g., "handgun"
  tier: string;              // e.g., "base"
  imageUri: string;          // IPFS URI
  metadataUri: string;       // metadata endpoint URL
}

// Login response: data.assets is ChainBoiAsset[]
// Login response: data.weapons is WeaponObject[]

interface VerifyAssetsResponse {
  hasNft: boolean;
  nftTokenId: number | null;  // first NFT's tokenId (convenience)
  level: number;              // highest level across owned NFTs (convenience)
  assets: ChainBoiAsset[];    // all owned ChainBoi NFTs with full data
  ownedWeaponNfts: WeaponObject[];
}

interface SetAvatarResponse {
  tokenId: number;
  level: number;
}

interface GameInfo {
  downloads: number;
  trailer: string;           // YouTube URL
  platforms: {
    win: boolean;
    apk: boolean;
  };
}
```
