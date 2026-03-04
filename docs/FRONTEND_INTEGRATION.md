# ChainBois - Frontend Integration Guide

## Overview

The ChainBois frontend is a web application where users connect wallets, view NFTs, and interact with the game platform. The Unity game communicates via Firebase Realtime Database (not directly with the API).

## Architecture

```
User Browser → Frontend (React/Next.js) → ChainBois API → MongoDB
                                                         → Firebase RTDB ← Unity Game
                                                         → Avalanche C-Chain (NFTs, Tokens)
```

## Setup

### 1. Install Dependencies
```bash
npm install firebase axios
# or with Thirdweb for wallet connection:
npm install @thirdweb-dev/react @thirdweb-dev/sdk
```

### 2. Firebase Configuration
```javascript
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "chainbois",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
```

### 3. API Client Setup
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "https://your-server.com/api/v1",
  timeout: 15000,
});

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## User Flows

### Flow A: New User Registration
```
1. User fills signup form (email, password, username)
2. Frontend calls: POST /auth/create-user { email, password, username }
3. Frontend signs in with Firebase: signInWithEmailAndPassword(auth, email, password)
4. User connects wallet via Thirdweb
5. Frontend calls: POST /auth/login { address }
6. Backend checks NFTs on-chain, returns user profile
7. Frontend displays user dashboard
```

### Flow B: Returning User Login
```
1. User signs in with Firebase (email/password)
2. User connects wallet via Thirdweb
3. Frontend calls: POST /auth/login { address }
4. Backend refreshes NFT data, returns profile
5. Frontend displays dashboard with latest data
```

### Flow C: Game Redirect (Web2 → Web3 Upgrade)
```
1. User plays game (Web2, no wallet)
2. Game redirects user to website for wallet connection
3. User connects wallet on website
4. Frontend calls: POST /auth/login { address }
5. Backend detects NFT → upgrades to WEB3
6. Backend writes { hasNFT: true, level, weapons } to Firebase RTDB
7. Game reads Firebase → unlocks premium content
```

## API Integration Examples

### Create User
```javascript
const createUser = async (email, password, username) => {
  const { data } = await api.post("/auth/create-user", {
    email, password, username,
  });
  // Sign in with Firebase
  await signInWithEmailAndPassword(auth, email, password);
  return data.data.uid;
};
```

### Login with Wallet
```javascript
const login = async (walletAddress) => {
  const { data } = await api.post("/auth/login", {
    address: walletAddress,
  });
  return data.data; // { user, assets, weapons }
};
```

### Get User Profile
```javascript
const getProfile = async () => {
  const { data } = await api.get("/auth/me");
  return data.data.user;
};
```

### Verify Assets (Refresh NFT Data)
```javascript
const verifyAssets = async () => {
  const { data } = await api.post("/game/verify-assets");
  return data.data; // { hasNft, nftTokenId, level, ownedWeaponNfts, characters, baseWeapons }
};
```

### Set Active NFT Avatar
```javascript
const setAvatar = async (tokenId) => {
  const { data } = await api.post("/game/set-avatar", { tokenId });
  return data.data; // { tokenId, level, characters, baseWeapons }
};
```

### Get Unlocked Characters
```javascript
const getCharacters = async (address) => {
  const { data } = await api.get(`/game/characters/${address}`);
  return data.data; // { level, characters, baseWeapons }
};
```

### Get Game Info
```javascript
const getGameInfo = async () => {
  const { data } = await api.get("/game/info");
  return data.data; // { downloads, trailer, platforms }
};
```

## Error Handling

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // Dev mode uses "error" key, production uses "message"
    const message = error.response?.data?.message || error.response?.data?.error || "Unknown error";

    switch (status) {
      case 401:
        // Token expired - refresh and retry
        auth.currentUser?.getIdToken(true);
        break;
      case 403:
        // Banned or ownership check failed
        alert(message);
        break;
      case 429:
        // Rate limited
        alert("Too many requests. Please wait.");
        break;
      case 503:
        // Contract not configured
        console.warn("Service unavailable:", message);
        break;
    }

    return Promise.reject(error);
  }
);
```

## Character Unlock System

Characters unlock based on NFT level:

| Level | Characters Unlocked | Total |
|-------|-------------------|-------|
| 0     | 4 base characters | 4     |
| 1     | +4 characters     | 8     |
| 2     | +4 characters     | 12    |
| 3     | +4 characters     | 16    |
| 4     | +4 characters     | 20    |
| 5     | +4 characters     | 24    |
| 6     | +4 characters     | 28    |
| 7     | +4 characters     | 32    |

Without an NFT (WEB2 players): only level 0 characters (4 total).

Base weapons (always available): Pistol, Knife, Shotgun, SMG.

## Firebase RTDB Structure

The backend writes game data to Firebase for the Unity game to read:

```
users/
  {uid}/
    username: "string"
    Score: 1500          // Cumulative, written by game
    hasNFT: true         // Written by backend on login
    level: 2             // Written by backend on login
    weapons: ["AK-47"]   // Written by backend on login (null if none)
```

The frontend does NOT need to read/write Firebase RTDB directly. All data flows through the API.
