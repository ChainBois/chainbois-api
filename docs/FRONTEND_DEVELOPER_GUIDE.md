# ChainBois - Frontend Developer Guide

Complete integration guide for the frontend developer. This covers everything you need to build the ChainBois web application that connects to our API.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Tech Stack & Setup](#2-tech-stack--setup)
3. [Authentication Flow](#3-authentication-flow)
4. [API Client Setup](#4-api-client-setup)
5. [User Registration](#5-user-registration)
6. [Login with Wallet](#6-login-with-wallet)
7. [User Dashboard](#7-user-dashboard)
8. [Asset Verification](#8-asset-verification)
9. [Avatar Selection](#9-avatar-selection)
10. [Character & Weapon Display](#10-character--weapon-display)
11. [Game Download](#11-game-download)
12. [Error Handling](#12-error-handling)
13. [Player Types](#13-player-types)
14. [Complete API Reference](#14-complete-api-reference)
15. [FAQ](#15-faq)

---

## 1. Overview

### What the Frontend Does

The ChainBois frontend is a web application where users:
1. Create an account (email/password via Firebase)
2. Connect their Avalanche wallet
3. View their NFT assets, characters, and weapons
4. Download the game
5. (Future phases) Level up NFTs, buy weapons, view leaderboards

### What the Frontend Does NOT Do

- **Does NOT** talk to the blockchain directly (the backend handles all on-chain queries)
- **Does NOT** read from Firebase RTDB (all data comes through the API)
- **Does NOT** need to know about smart contract ABIs or addresses

### Architecture

```
User's Browser
    │
    ├── Firebase Auth SDK (email/password sign-in, get ID token)
    │
    ├── Thirdweb SDK (wallet connection, get address)
    │
    └── Axios/Fetch → ChainBois API (all game data)
                         │
                         ├── MongoDB (user profiles, scores)
                         ├── Avalanche (NFT ownership, levels)
                         └── Firebase RTDB (writes for Unity game)
```

---

## 2. Tech Stack & Setup

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
  apiKey: "YOUR_FIREBASE_WEB_API_KEY",       // from Firebase Console
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "chainbois",
  storageBucket: "chainbois.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

> **Note**: The Firebase **web** API key is different from the **Admin SDK** service account. Ask for the web config from whoever set up the Firebase project.

### API Client

```javascript
// lib/api.js
import axios from "axios";
import { auth } from "./firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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
      clientId="YOUR_THIRDWEB_CLIENT_ID"
    >
      {children}
    </ThirdwebProvider>
  );
}
```

---

## 3. Authentication Flow

There are two types of authentication happening:

1. **Firebase Auth** — handles email/password, gives you an ID token
2. **Wallet Connection** — Thirdweb connects to MetaMask/Core/etc, gives you an address

Both are needed for full login.

### Complete Flow Diagram

```
STEP 1: User creates account (one-time)
  ├── Frontend: collect email + password + username
  ├── Frontend: POST /auth/create-user { email, password, username }
  ├── Backend: creates Firebase Auth user + writes to Firebase RTDB
  └── Frontend: receives { uid }

STEP 2: User signs into Firebase (every session)
  ├── Frontend: signInWithEmailAndPassword(auth, email, password)
  └── Firebase SDK: sets auth.currentUser (has ID token)

STEP 3: User connects wallet (every session)
  ├── Frontend: Thirdweb ConnectWallet button
  └── User approves in MetaMask → frontend gets address

STEP 4: Login to ChainBois API
  ├── Frontend: POST /auth/login { address }
  │   (Authorization header added automatically by interceptor)
  ├── Backend: checks NFTs on-chain, creates/updates user
  └── Frontend: receives { user, assets, weapons }

STEP 5: Display dashboard
  ├── Show user profile (username, level, score, playerType)
  ├── Show NFT status (hasNft, nftTokenId, level)
  ├── Show unlocked characters and weapons
  └── Show available actions (download game, level up, etc.)
```

---

## 4. API Client Setup

### Response Format

All API responses follow this format:

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

> **Important**: In development mode the error text is in the `error` field, not `message`. Your error interceptor should handle both: `error.response?.data?.message || error.response?.data?.error`.

### HTTP Status Codes

| Code | Meaning | Frontend Action |
|------|---------|-----------------|
| 200 | Success | Display data |
| 201 | Created | Display success message |
| 400 | Bad request | Show validation error to user |
| 401 | Unauthorized | Refresh Firebase token, re-login |
| 403 | Forbidden | Show ban message or "not your NFT" |
| 404 | Not found | Show "not found" message |
| 429 | Rate limited | Show the backend's message (auth: "try again later", general: "try again in an hour") |
| 503 | Service unavailable | Show "contracts not configured yet" |

---

## 5. User Registration

### POST /api/v1/auth/create-user

**No auth required** — this is a public endpoint.

```javascript
// Example: Registration form handler
const handleRegister = async (email, password, username) => {
  try {
    // Step 1: Create user via API
    const { data } = await api.post("/auth/create-user", {
      email,
      password,
      username,
    });

    const uid = data.data.uid;
    console.log("User created:", uid);

    // Step 2: Sign into Firebase to get auth token
    await signInWithEmailAndPassword(auth, email, password);

    // User is now logged into Firebase
    // Next: connect wallet and call /auth/login
    return uid;
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    // Display message to user
    throw new Error(message);
  }
};
```

**Validation rules:**
- `email`: must be valid email format
- `password`: minimum 6 characters (Firebase requirement)
- `username`: non-empty, max 100 characters

**Error responses:**
- `400`: "Please provide a valid email address"
- `400`: "Password must be at least 6 characters"
- `400`: "Username is required"
- `400`: "Email is already registered" (duplicate email)

---

## 6. Login with Wallet

### POST /api/v1/auth/login

**Requires Firebase token** in Authorization header.

```javascript
import { useAddress } from "@thirdweb-dev/react";

const LoginButton = () => {
  const address = useAddress(); // From Thirdweb wallet connection

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

      // Store in your state management (Context, Redux, Zustand, etc.)
      setUser(user);
      setAssets(assets);
      setWeapons(weapons);

      // user.playerType tells you if they're "web2" or "web3"
      if (user.playerType === "web3") {
        console.log("Web3 user! Has NFT #" + assets.nftTokenId);
        console.log("Level:", assets.level);
        console.log("Weapons:", weapons.map(w => w.name));
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

**What the response tells you:**

```javascript
const { user, assets, weapons } = response.data.data;

// User profile
user.uid;              // Firebase UID
user.username;         // Display name
user.address;          // "0xabc..."
user.playerType;       // "web2" or "web3"
user.pointsBalance;    // Redeemable game points
user.battleTokenBalance; // $BATTLE tokens
user.level;            // NFT level (0-7)
user.score;            // Cumulative game score
user.highScore;        // All-time high score
user.gamesPlayed;      // Total games played
user.hasNft;           // true/false
user.nftTokenId;       // Number or null
user.isBanned;         // true/false
user.hasClaimed;       // true/false (has claimed free NFT)
user.lastLogin;        // ISO date string

// On-chain assets (freshly checked)
assets.hasNft;         // true/false
assets.nftTokenId;     // Number or null
assets.level;          // 0-7

// Weapon NFTs owned
weapons;               // [{ tokenId: 1, name: "AK-47" }, ...]
```

**Login error responses:**
- `400`: "Please provide a valid EVM wallet address" (missing or invalid address)
- `400`: "This wallet address is already linked to another account" (address collision)
- `403`: "Account permanently banned for repeated violations" (permanent ban)
- `403`: "Account temporarily banned. Try again later." (temporary ban)

---

## 7. User Dashboard

### GET /api/v1/auth/me

Returns user profile from the database (fast, no blockchain call).

```javascript
const fetchProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data.data.user;
};

// Example component
const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile().then(setUser);
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
          <p>Characters Unlocked: {4 + user.level * 4}</p>
        </div>
      )}

      {!user.hasNft && (
        <div>
          <h2>Get a ChainBoi NFT</h2>
          <p>Purchase an NFT to unlock premium characters and enter tournaments!</p>
        </div>
      )}
    </div>
  );
};
```

### Logout

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

## 8. Asset Verification

### POST /api/v1/game/verify-assets

Call this to re-check NFT ownership without re-logging in. Useful for a "Refresh" button.

```javascript
const refreshAssets = async () => {
  try {
    const { data } = await api.post("/game/verify-assets");
    const result = data.data;

    // result = {
    //   hasNft: true,
    //   nftTokenId: 42,
    //   level: 2,
    //   ownedWeaponNfts: [{ name: "AK-47", tokenId: 1 }],
    //   characters: ["Recruit_A", "Recruit_B", ...],
    //   baseWeapons: ["Pistol", "Knife", "Shotgun", "SMG"]
    // }

    return result;
  } catch (error) {
    if (error.response?.status === 503) {
      // Contracts not deployed yet - show graceful message
      console.log("NFT contracts not available yet");
    }
    throw error;
  }
};
```

**Returns 503** if contracts are not configured (during development before Phase 2 deployment).

---

## 9. Avatar Selection

### POST /api/v1/game/set-avatar

If a user owns multiple ChainBoi NFTs, they can set which one is their active avatar.

```javascript
const setActiveAvatar = async (tokenId) => {
  try {
    const { data } = await api.post("/game/set-avatar", { tokenId });
    const result = data.data;

    // result = {
    //   tokenId: 42,
    //   level: 2,
    //   characters: ["Recruit_A", ..., "Veteran_D"],
    //   baseWeapons: ["Pistol", "Knife", "Shotgun", "SMG"]
    // }

    return result;
  } catch (error) {
    if (error.response?.status === 403) {
      alert("You don't own this NFT!");
    }
    throw error;
  }
};
```

---

## 10. Character & Weapon Display

### GET /api/v1/game/characters/:address

Returns unlocked characters and base weapons for the user's address.

```javascript
const getCharacters = async (address) => {
  const { data } = await api.get(`/game/characters/${address}`);
  return data.data;

  // {
  //   level: 2,
  //   characters: [
  //     "Recruit_A", "Recruit_B", "Recruit_C", "Recruit_D",
  //     "Soldier_A", "Soldier_B", "Soldier_C", "Soldier_D",
  //     "Veteran_A", "Veteran_B", "Veteran_C", "Veteran_D"
  //   ],
  //   baseWeapons: ["Pistol", "Knife", "Shotgun", "SMG"]
  // }
};
```

**Important**: This endpoint is BOLA-protected. The user can only query their own address (must match the logged-in user's address). Querying another address returns 403.

### Character Unlock Table

| Level | Characters Added | Running Total | Names |
|-------|-----------------|---------------|-------|
| 0 | 4 | 4 | Recruit_A, Recruit_B, Recruit_C, Recruit_D |
| 1 | 4 | 8 | Soldier_A, Soldier_B, Soldier_C, Soldier_D |
| 2 | 4 | 12 | Veteran_A, Veteran_B, Veteran_C, Veteran_D |
| 3 | 4 | 16 | Elite_A, Elite_B, Elite_C, Elite_D |
| 4 | 4 | 20 | Spec_Ops_A, Spec_Ops_B, Spec_Ops_C, Spec_Ops_D |
| 5 | 4 | 24 | Commander_A, Commander_B, Commander_C, Commander_D |
| 6 | 4 | 28 | General_A, General_B, General_C, General_D |
| 7 | 4 | 32 | Legend_A, Legend_B, Legend_C, Legend_D |

**Base weapons** (always available regardless of NFT): Pistol, Knife, Shotgun, SMG

### Weapon Types

Two categories:
- **Base weapons**: Not NFTs. Always available to all players. Names: Pistol, Knife, Shotgun, SMG
- **Premium weapons (NFTs)**: Owned as ERC-721 tokens. Returned in the `weapons` array from `/auth/login`. Examples: AK-47, M4A1, Sniper-Rifle, etc.

---

## 11. Game Download

### GET /api/v1/game/download/:platform

**No auth required.** Streams a zip file.

```javascript
// Direct link - open in new tab or use anchor tag
const downloadUrl = `${API_BASE_URL}/game/download/win`;
// or /game/download/mac

// HTML:
// <a href="http://api.chainbois.com/api/v1/game/download/win">Download for Windows</a>
```

### GET /api/v1/game/info

**No auth required.** Returns download count and platform availability.

```javascript
const getGameInfo = async () => {
  const { data } = await api.get("/game/info");
  return data.data;

  // {
  //   downloads: 150,
  //   trailer: "https://youtube.com/...",
  //   platforms: { win: true, mac: false }
  // }
};

// Example component
const DownloadSection = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    getGameInfo().then(setInfo);
  }, []);

  return (
    <div>
      <h2>Download ChainBois</h2>
      <p>{info?.downloads || 0} downloads</p>
      {info?.platforms?.win && (
        <a href={`${API_BASE_URL}/game/download/win`}>Download for Windows</a>
      )}
      {info?.platforms?.mac && (
        <a href={`${API_BASE_URL}/game/download/mac`}>Download for Mac</a>
      )}
      {info?.trailer && (
        <a href={info.trailer} target="_blank">Watch Trailer</a>
      )}
    </div>
  );
};
```

---

## 12. Error Handling

### Recommended Error Interceptor

```javascript
// lib/api.js
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    // Dev mode uses "error" key, production uses "message"
    const message = error.response?.data?.message || error.response?.data?.error || "Something went wrong";

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

## 13. Player Types

### Web2 vs Web3

| Feature | WEB2 (No NFT) | WEB3 (Has NFT) |
|---------|---------------|-----------------|
| Play game | Yes | Yes |
| Base characters (4) | Yes | Yes |
| Base weapons (4) | Yes | Yes |
| Premium characters | No | Yes (based on level) |
| Premium weapon NFTs | No | Yes |
| Convert points → $BATTLE | No | Yes (Phase 5) |
| Enter tournaments | No | Yes (Phase 4) |
| Win prizes | No | Yes (Phase 4) |
| Level up NFT | No | Yes (Phase 3) |

### How to Determine Player Type

```javascript
const user = loginResponse.data.data.user;

if (user.playerType === "web3") {
  // Show full dashboard: NFT info, level, premium characters, tournament entry
} else {
  // Show basic dashboard: score, games played
  // Show CTA: "Get a ChainBoi NFT to unlock premium features!"
}
```

### Auto-Detection

The backend automatically detects player type:
- **Upgrade to WEB3**: User logs in with wallet, backend detects ChainBoi NFT on-chain
- **Downgrade to WEB2**: User logs in, backend detects NFT was sold/transferred

You don't need to implement any detection logic. Just read `user.playerType` from the API response.

---

## 14. Complete API Reference

### Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://your-server.com/api/v1
```

### Auth Endpoints

#### POST /auth/create-user
- **Auth**: None (public)
- **Body**: `{ email: string, password: string, username: string }`
- **Response**: `{ success: true, data: { uid: string } }`
- **Status**: 201 Created

#### POST /auth/login
- **Auth**: Firebase token required
- **Body**: `{ address: string }` (valid EVM address)
- **Response**: `{ success: true, data: { user: UserObject, assets: AssetObject, weapons: WeaponArray } }`
- **Status**: 200 OK

#### GET /auth/me
- **Auth**: Firebase token required
- **Response**: `{ success: true, data: { user: UserObject } }`
- **Status**: 200 OK

#### POST /auth/logout
- **Auth**: Firebase token required
- **Response**: `{ success: true, message: "Logged out successfully" }`
- **Status**: 200 OK

### Game Endpoints

#### POST /game/verify-assets
- **Auth**: Firebase token required
- **Response**: `{ success: true, data: { hasNft, nftTokenId, level, ownedWeaponNfts, characters, baseWeapons } }`
- **Status**: 200 OK / 503 if contracts not configured

#### POST /game/set-avatar
- **Auth**: Firebase token required
- **Body**: `{ tokenId: number }`
- **Response**: `{ success: true, data: { tokenId, level, characters, baseWeapons } }`
- **Status**: 200 OK / 403 if not owner

#### GET /game/characters/:address
- **Auth**: Firebase token required (can only query own address)
- **Response**: `{ success: true, data: { level, characters, baseWeapons } }`
- **Status**: 200 OK

#### GET /game/download/:platform
- **Auth**: None (public)
- **Params**: `platform` = "win" or "mac"
- **Response**: Binary file stream (zip)
- **Status**: 200 OK / 400 if invalid platform / 404 if file not found

#### GET /game/info
- **Auth**: None (public)
- **Response**: `{ success: true, data: { downloads, trailer, platforms } }`
- **Status**: 200 OK

### Health & Settings

#### GET /health
- **Auth**: None (public)
- **Response**: `{ success: true, data: { status, uptime, timestamp, services } }`
- **Status**: 200 OK / 503 if unhealthy

#### GET /settings
- **Auth**: None (public)
- **Response**: `{ success: true, data: { tournamentSchedule, prizePools, levelUpCost, maxPointsPerMatch, burnRate, teamRevenueSplit, awardPoolSplit, armoryClosedDuringCooldown, claimLimit, claimEnabled, downloads, trailer } }`
- **Status**: 200 OK
- **Note**: The `contracts` field is excluded from the response for security

### Type Definitions

```typescript
// For TypeScript projects
interface UserObject {
  uid: string;
  username: string;
  address: string;
  playerType: "web2" | "web3";
  pointsBalance: number;
  battleTokenBalance: number;
  level: number;            // 0-7
  score: number;
  highScore: number;
  gamesPlayed: number;
  hasNft: boolean;
  nftTokenId: number | null;
  isBanned: boolean;
  hasClaimed: boolean;
  lastLogin: string;        // ISO 8601 date
}

interface AssetObject {
  hasNft: boolean;
  nftTokenId: number | null;
  level: number;             // 0-7
}

interface WeaponObject {
  tokenId: number;
  name: string;              // e.g., "AK-47"
}

interface VerifyAssetsResponse {
  hasNft: boolean;
  nftTokenId: number | null;
  level: number;
  ownedWeaponNfts: WeaponObject[];
  characters: string[];      // e.g., ["Recruit_A", "Recruit_B", ...]
  baseWeapons: string[];     // ["Pistol", "Knife", "Shotgun", "SMG"]
}

interface GameInfo {
  downloads: number;
  trailer: string;           // YouTube URL
  platforms: {
    win: boolean;
    mac: boolean;
  };
}
```

---

## 15. FAQ

### Q: Do I need to interact with the blockchain from the frontend?

**No.** All blockchain interactions happen on the backend. The frontend only needs:
- Firebase Auth SDK (for email/password login)
- Thirdweb SDK (for wallet connection - just to get the address)
- Axios/Fetch (to call our API)

### Q: What if the contracts aren't deployed yet?

The API handles this gracefully. Endpoints that need contract interaction (`verify-assets`, `set-avatar`) return **503** with message "NFT contract not configured". The `login` endpoint still works - it just returns `hasNft: false`.

### Q: How do I show a user's NFT image?

The NFT image is on IPFS. You can construct the URL:
```javascript
// After login, if user has an NFT:
const imageUrl = `https://gateway.pinata.cloud/ipfs/${imagesCid}/${user.nftTokenId}.png`;
```
Ask the backend team for the `imagesCid` after NFTs are minted.

### Q: How often should I call verify-assets?

Only when the user explicitly clicks "Refresh" or when you suspect their NFT status changed (e.g., after they say they bought/sold an NFT). The `login` endpoint already checks assets on every login.

### Q: What happens if a user is banned?

The `login` endpoint returns **403** with one of these messages:
- `"Account permanently banned for repeated violations"` (permanent ban)
- `"Account temporarily banned. Try again later."` (temporary ban, expires after 24h)

Display the backend's message directly to the user. The `me` endpoint still returns their profile with `isBanned: true`.

### Q: How does the game interact with the website?

The game redirects users to the website to connect their wallet. After the user logs in on the website, the backend writes `{ hasNFT, level, weapons }` to Firebase Realtime Database. The game reads this data from Firebase and unlocks content. No API calls from the game are needed.

### Q: What's the difference between "score" and "pointsBalance"?

- `score`: Cumulative game score synced from Firebase (what the game writes)
- `pointsBalance`: Redeemable points that can be converted to $BATTLE tokens (Phase 5)

Points are earned proportionally to score changes. They're separate because points can be "spent" (converted to tokens) while score keeps accumulating.

### Q: Do I need to handle token refresh?

The Firebase SDK handles token refresh automatically. Tokens last 1 hour. If you get a 401, call `user.getIdToken(true)` to force a refresh (see error interceptor in Section 12).

### Q: What wallet should I use for testing?

Any EVM wallet works: MetaMask, Core, Rabby, etc. For testnet:
1. Add Avalanche Fuji network to your wallet (Chain ID: 43113, RPC: `https://api.avax-test.network/ext/bc/C/rpc`)
2. The backend team can provide test wallet addresses that already have NFTs
3. Or get testnet AVAX from https://faucet.avax.network/ and buy/receive NFTs

### Q: Where's the Postman collection?

`docs/POSTMAN_COLLECTION.json` — import this into Postman, set the `base_url` and `firebase_token` variables, and you can test all endpoints manually.
