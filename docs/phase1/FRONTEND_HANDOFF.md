# Phase 1 - Frontend Developer Handoff

**Date**: March 4, 2026
**Status**: Phase 1 fully tested (47/47 integration tests passing) and ready for frontend integration.

---

## 1. Documents to Share

Send the frontend developer the following files:

| File | Description | Priority |
|------|-------------|----------|
| `docs/phase1/FRONTEND_API.md` | Complete API reference with code examples, user flows, error handling, TypeScript types | **Must read** |
| `docs/phase1/POSTMAN_COLLECTION.json` | Importable Postman collection with all 16 endpoints, example bodies, and test variables | **Must import** |
| `docs/phase4/FRONTEND_API.md` | Leaderboard endpoint reference with React component examples | **Must read** |
| `docs/phase4/POSTMAN_COLLECTION.json` | Leaderboard-specific Postman collection (also included in Phase 1 collection) | Optional |
| `docs/phase1/TEST_REPORT.md` | Detailed test report showing all request/response pairs, DB flows, edge cases | Reference |
| `docs/phase1/FLOW.md` | Architecture diagrams, endpoint flows, background jobs, anti-cheat system | Reference |

---

## 2. Postman Collections

### How to Import into Postman

**Postman Desktop App:**
1. Download Postman from [postman.com/downloads](https://www.postman.com/downloads/) if not installed
2. Open Postman
3. Click **Import** (top-left corner, next to "New")
4. Either:
   - **Drag and drop** the `POSTMAN_COLLECTION.json` file into the import window
   - Or click **Upload Files**, navigate to `docs/phase1/`, select `POSTMAN_COLLECTION.json`
5. Click **Import** to confirm
6. The collection "ChainBois API - Phase 1 (Auth + Game + Leaderboard)" appears in the sidebar

**Postman Web (browser):**
1. Go to [web.postman.co](https://web.postman.co/)
2. Sign in or create a free account
3. Click **Import** in the sidebar
4. Click **Upload Files** and select the JSON file
5. Click **Import**

**Import both collections** for full coverage:
- `docs/phase1/POSTMAN_COLLECTION.json` - Auth, Game, Leaderboard, Health (17 requests)
- `docs/phase4/POSTMAN_COLLECTION.json` - Leaderboard-specific (5 requests, subset of above)

### How to Export from Postman

If you make changes to the collection and want to share it back:
1. Right-click the collection name in the sidebar
2. Select **Export**
3. Choose **Collection v2.1** format
4. Click **Export** and save the file

### Variables to Set

| Variable | How to Get | Notes |
|----------|-----------|-------|
| `base_url` | Pre-set to `https://your-api-domain.com/api/v1` | The live testnet API |
| `firebase_token` | Sign in via Firebase, call `user.getIdToken()` | Expires after 1 hour |
| `test_address` | Pre-set to `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` | nft_store wallet (50 NFTs) |
| `test_uid` | Get from `/auth/create-user` response | Needed for rank endpoint |

### Quick Test Flow in Postman

1. Run **Create User** (no auth needed) - save the `uid` from response
2. Get a Firebase token (sign in via Firebase SDK or REST API)
3. Set `firebase_token` variable
4. Run **Login** - should return `playerType: "web3"`, `hasNft: true`
5. Run **Get Current User** - returns full profile
6. Run **Verify Assets** - re-checks on-chain
7. Run **Set Avatar** with `{ "tokenId": 1 }` - sets active NFT
8. Run **Get Leaderboard** - returns rankings
9. Run **Logout** - clears session

### Test Wallets Available

| Wallet | Address | Use For |
|--------|---------|---------|
| nft_store | `0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0` | Testing with NFTs (50 ChainBois owned) |
| deployer | `0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0` | Testing without NFTs (web2 flow) |

---

## 3. Documentation Review Results

### Completeness Check

| Area | Covered | Doc |
|------|---------|-----|
| Firebase Auth setup | Yes | FRONTEND_API.md Section 2 |
| Thirdweb wallet setup | Yes | FRONTEND_API.md Section 2 |
| API client with auto-token | Yes | FRONTEND_API.md Section 2 |
| User flows (3 flows) | Yes | FRONTEND_API.md Section 3 |
| Auth endpoints (4) | Yes | FRONTEND_API.md Section 4 |
| Game endpoints (4) | Yes | FRONTEND_API.md Section 5 |
| Health & Settings (2) | Yes | FRONTEND_API.md Section 6 |
| Leaderboard endpoints (3) | Yes | Phase 4 FRONTEND_API.md (linked from Phase 1) |
| Error handling | Yes | FRONTEND_API.md Section 7 |
| Rate limits | Yes | FRONTEND_API.md Section 7 |
| Player types (web2/web3) | Yes | FRONTEND_API.md Section 8 |
| Firebase RTDB structure | Yes | FRONTEND_API.md Section 9 |
| FAQ (12 questions) | Yes | FRONTEND_API.md Section 10 |
| TypeScript types | Yes | FRONTEND_API.md bottom |
| React component examples | Yes | FRONTEND_API.md + Phase 4 |
| Error interceptor code | Yes | FRONTEND_API.md Section 7 |
| Postman collection | Yes | All 16 endpoints with examples |

### Accuracy Check

All endpoints tested against live server with real data. Response formats in docs match actual API responses. Error messages verified against integration tests.

---

## 4. Gaps Fixed During Review

| Issue | Fix Applied |
|-------|-------------|
| Firebase API key was placeholder (`YOUR_FIREBASE_WEB_API_KEY`) | Replaced with actual key: `YOUR_FIREBASE_API_KEY` |
| NFT image IPFS CID was "ask backend team" | Added actual CID: `bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4` |
| Weapon image IPFS CID not included | Added: `bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe` |
| Leaderboard endpoints in separate Phase 4 doc | Added cross-reference section in FRONTEND_API.md linking to Phase 4 docs |
| Postman `test_address` was `0x0000...` | Updated to real nft_store address with 50 NFTs |
| Postman missing leaderboard endpoints | Added all 6 leaderboard requests to Phase 1 collection |
| Thirdweb client ID placeholder | Added comment: "Create at https://thirdweb.com/dashboard" |

---

## 5. What the Frontend Dev Needs from Us

### Already Provided

- [x] Firebase web API key (in FRONTEND_API.md)
- [x] IPFS CIDs for ChainBois images and weapons
- [x] Test wallet addresses with NFTs
- [x] All API endpoint documentation with examples
- [x] Postman collection with example requests/responses
- [x] TypeScript type definitions
- [x] React component examples
- [x] Error handling patterns

### Frontend Dev Must Create/Obtain

| Item | How | Notes |
|------|-----|-------|
| **Thirdweb Client ID** | Create at [thirdweb.com/dashboard](https://thirdweb.com/dashboard) | Free tier works for development |
| **Firebase messagingSenderId** | From Firebase Console > Project Settings > General | May already have this |
| **Firebase appId** | From Firebase Console > Project Settings > General | May already have this |

### Not Needed by Frontend

- Smart contract ABIs (backend handles all on-chain calls)
- MongoDB connection strings
- Private keys or admin credentials
- Firebase Admin SDK service account
- Backend .env file

---

## 6. Quick Start Checklist for Frontend Dev

```
[ ] 1. Read docs/phase1/FRONTEND_API.md (complete API reference)
[ ] 2. Import docs/phase1/POSTMAN_COLLECTION.json into Postman
[ ] 3. Set up Firebase in your project:
       - npm install firebase
       - Use the config from FRONTEND_API.md Section 2
       - Get messagingSenderId and appId from Firebase Console
[ ] 4. Set up Thirdweb:
       - npm install @thirdweb-dev/react @thirdweb-dev/sdk
       - Create client ID at thirdweb.com/dashboard
       - Use Avalanche Fuji (43113) for testnet
[ ] 5. Create API client with auto-token injection (code in FRONTEND_API.md Section 2)
[ ] 6. Test the flow in Postman:
       a. Create user → get uid
       b. Sign in to Firebase → get token
       c. Login with test wallet → see NFT data
       d. Get profile → verify user data
       e. Verify assets → check on-chain
[ ] 7. Build the pages:
       - Login/Register page (create-user + Firebase signIn + login)
       - Dashboard (GET /auth/me)
       - NFT display (use IPFS CID for images)
       - Leaderboard (GET /leaderboard)
       - Download page (GET /game/info)
[ ] 8. Read docs/phase4/FRONTEND_API.md for leaderboard integration
[ ] 9. Implement error interceptor (code in FRONTEND_API.md Section 7)
```

---

## 7. API Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5000/api/v1` |
| Testnet | `https://your-api-domain.com/api/v1` |
| Production | TBD |

---

## 8. IPFS Resources

| Resource | CID | Gateway URL |
|----------|-----|-------------|
| ChainBois NFT Images | `bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4` | `https://gateway.pinata.cloud/ipfs/{CID}/{tokenId}.png` |
| ChainBois NFT Metadata | `bafybeifil5hw3k2hwjdjdmyfgyp5nrza6is4v66dqodupr6kqz6pwrqqyq` | `https://gateway.pinata.cloud/ipfs/{CID}/{tokenId}.json` |
| Weapon Images | `bafybeigabwclqqsu4xz6konsq6dav3wva3xh3vlxcjw72vkoo6wxllxjfe` | `https://gateway.pinata.cloud/ipfs/{CID}/{filename}` |
| Weapon Metadata | `bafybeih23yuyin54zr2exqudgmpcy37x343arfzaspuatg7vahneddv6ry` | `https://gateway.pinata.cloud/ipfs/{CID}/{tokenId}.json` |

### Example Image URLs

```
ChainBoi #1:  https://gateway.pinata.cloud/ipfs/bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/1.png
ChainBoi #25: https://gateway.pinata.cloud/ipfs/bafybeifd4wjgbvnpf7kmcrkjxp7i4ipz3w2aag3elgfj6v364y2meq6ep4/25.png
```

---

## 9. Contracts on Fuji Testnet (Reference Only)

The frontend does NOT interact with contracts directly, but for reference:

| Contract | Address | Explorer |
|----------|---------|----------|
| BattleToken | `0xF16214F76f19bD1E6d3349fC199B250a8E441E8C` | [Snowtrace](https://testnet.snowtrace.io/address/0xF16214F76f19bD1E6d3349fC199B250a8E441E8C) |
| ChainBoisNFT | `0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5` | [Snowtrace](https://testnet.snowtrace.io/address/0x4dE803339c041B0704Ec9FB679dEC245e5Bfb7a5) |
| WeaponNFT | `0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28` | [Snowtrace](https://testnet.snowtrace.io/address/0xb30c39c284a1d2Ccd71Ea886349855E2Fc6b9D28) |

---

## 10. Next Phases (Coming Soon)

| Phase | Feature | Status |
|-------|---------|--------|
| Phase 3 | Training Room (level up NFTs, badges) | Next |
| Phase 4 | Battleground + Tournaments | Leaderboard done, tournaments pending |
| Phase 5 | Armory (weapon purchase, points to $BATTLE) | Planned |
| Phase 6 | Inventory (asset display, tx history) | Planned |

Frontend docs will be delivered after each phase is complete and tested.
