# ChainBois - Overall Feature Document & Flow Diagrams

**Version:** 2.0 | **Date:** March 2, 2026 | **MVP Deadline:** March 9, 2026

---

## 1. System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        CHAINBOIS PLATFORM                            │
│                                                                      │
│  ┌────────────┐   ┌────────────┐   ┌─────────────────────────────┐  │
│  │ Unity Game │   │  Frontend  │   │     Backend API             │  │
│  │ (PC+Mobile)│   │ (Next.js)  │   │     (Express.js)            │  │
│  │            │   │            │   │                             │  │
│  │ Firebase ──┼───┼── Firebase ┼───┼── Firebase (poll/write)     │  │
│  │ Auth       │   │ Auth       │   │                             │  │
│  │            │   │ Thirdweb   │   │ Modules:                    │  │
│  │ Reads:     │   │ Wallet     │   │ • Auth (Firebase tokens)    │  │
│  │ • hasNFT   │   │            │   │ • Game Sync (Firebase cron) │  │
│  │ • level    │   │ Calls API: │   │ • Training Room             │  │
│  │ • weapons  │   │ Bearer tok │   │ • Battleground              │  │
│  │            │   │ + address  │   │ • Armory (platform wallets) │  │
│  │ Writes:    │   │            │   │ • Inventory                 │  │
│  │ • score    │   │            │   │ • Points → $BATTLE          │  │
│  │ • username │   │            │   │ • Leaderboard               │  │
│  └────────────┘   └────────────┘   │ • Cron Jobs                 │  │
│                                     │ • Discord Webhooks          │  │
│                                     └──────────────┬──────────────┘  │
│                                                    │                 │
│       ┌────────────┬───────────┬───────────┬───────┘                 │
│       ▼            ▼           ▼           ▼                         │
│  ┌─────────┐ ┌──────────┐ ┌───────┐ ┌───────────┐                   │
│  │ MongoDB │ │ Firebase │ │ Redis │ │ Avalanche │                   │
│  │         │ │ Realtime │ │       │ │ C-Chain   │                   │
│  │ Users   │ │ DB       │ │ Cache │ │ (Fuji)    │                   │
│  │ NFTs    │ │          │ │ Queue │ │           │                   │
│  │ Scores  │ │ Game↔API │ │ Sock  │ │ Contracts │                   │
│  │ Txns    │ │ Sync     │ │       │ │ NFTs      │                   │
│  └─────────┘ └──────────┘ └───────┘ │ Tokens    │                   │
│                                      └───────────┘                   │
│                                                                      │
│  External: Cloudinary (images) | Pinata (IPFS) | Discord (webhooks)  │
│  Marketplace: Joepegs (external, we just link to it)                 │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication Flow (Firebase-based)

```
  User                    Frontend                 Backend                Firebase
   │                         │                        │                      │
   │  Click Connect Wallet   │                        │                      │
   │────────────────────────►│                        │                      │
   │                         │                        │                      │
   │  Thirdweb Wallet Modal  │                        │                      │
   │  (Core/Trust Wallet)    │                        │                      │
   │◄───────────────────────►│                        │                      │
   │                         │                        │                      │
   │                         │  Get Firebase ID token  │                      │
   │                         │─────────────────────────────────────────────►│
   │                         │◄─────────────────────────────────────────────│
   │                         │  firebaseIdToken        │                      │
   │                         │                        │                      │
   │                         │ POST /auth/login        │                      │
   │                         │ Authorization: Bearer   │                      │
   │                         │   <firebaseIdToken>     │                      │
   │                         │ Body: { address }       │                      │
   │                         │───────────────────────►│                      │
   │                         │                        │  verifyIdToken()     │
   │                         │                        │─────────────────────►│
   │                         │                        │◄─────────────────────│
   │                         │                        │  { uid, email }      │
   │                         │                        │                      │
   │                         │                        │  Find/create user    │
   │                         │                        │  Check NFTs on-chain │
   │                         │                        │  Write to Firebase:  │
   │                         │                        │  hasNFT, level, wpns │
   │                         │                        │─────────────────────►│
   │                         │                        │                      │
   │                         │◄───────────────────────│                      │
   │                         │ { user, assets, weapons}│                      │
   │                         │                        │                      │
   │  Authenticated ✓        │                        │                      │
   │◄────────────────────────│                        │                      │
```

---

## 3. Game Integration Flow (Firebase Sync Pattern)

```
  Unity Game              Firebase Realtime DB              Backend API
   │                            │                               │
   │  User registers/logs in    │                               │
   │  (Firebase Auth)           │                               │
   │───────────────────────────►│                               │
   │                            │                               │
   │  Writes: { username,       │                               │
   │    Score: 0 }              │                               │
   │───────────────────────────►│                               │
   │                            │                               │
   │                            │  syncNewUsersJob (every 1min) │
   │                            │◄──────────────────────────────│
   │                            │  Reads /users, finds new UIDs │
   │                            │──────────────────────────────►│
   │                            │                               │  Creates MongoDB user
   │                            │                               │
   │                            │  Backend writes back:         │
   │                            │  { level: 0, hasnft: false }  │
   │                            │◄──────────────────────────────│
   │                            │                               │
   │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
   │    USER VISITS WEBSITE     │                               │
   │    CONNECTS WALLET         │                               │
   │    LOGS IN VIA FRONTEND    │                               │
   │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
   │                            │                               │
   │                            │  Backend verifies NFTs        │
   │                            │  Writes: { hasnft: true,      │
   │                            │    level: 3, weapons: [...] } │
   │                            │◄──────────────────────────────│
   │                            │                               │
   │  Game reads Firebase       │                               │
   │  Sees hasnft=true          │                               │
   │  Unlocks 16 characters     │                               │
   │  Loads owned weapons       │                               │
   │◄───────────────────────────│                               │
   │                            │                               │
   │  ═══ GAMEPLAY ═══         │                               │
   │                            │                               │
   │  Updates score in Firebase │                               │
   │───────────────────────────►│                               │
   │                            │                               │
   │                            │  syncScoresJob (every 5min)   │
   │                            │◄──────────────────────────────│
   │                            │  Reads scores, detects changes│
   │                            │──────────────────────────────►│
   │                            │                               │  Updates MongoDB
   │                            │                               │  Updates leaderboard
   │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
   │    USER EXITS GAME         │                               │
   │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
   │                            │                               │
   │                            │  Clears: { hasnft: false,     │
   │                            │    weapons: [] }              │
   │                            │◄──────────────────────────────│
```

---

## 4. Level-Up Flow

```
  User                    Frontend                 Backend               Blockchain
   │                         │                        │                        │
   │  Select NFT #42         │                        │                        │
   │  Click "Level Up"       │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │ POST /training/level-up │                        │
   │                         │ { tokenId: 42 }         │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Verify ownership      │
   │                         │                        │  Check level < 7       │
   │                         │                        │  Cost: 1 AVAX          │
   │                         │                        │  Prepare unsigned tx   │
   │                         │◄───────────────────────│                        │
   │                         │ { unsignedTx, cost }    │                        │
   │                         │                        │                        │
   │  Sign Transaction       │                        │                        │
   │◄────────────────────────│                        │                        │
   │────────────────────────►│                        │                        │
   │                         │                        │                        │
   │                         │ POST /training/confirm  │                        │
   │                         │ { tokenId, signedTx }   │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Submit tx to chain    │
   │                         │                        │───────────────────────►│
   │                         │                        │  Wait confirmation     │
   │                         │                        │◄───────────────────────│
   │                         │                        │                        │
   │                         │                        │  Update on-chain level │
   │                         │                        │───────────────────────►│
   │                         │                        │◄───────────────────────│
   │                         │                        │                        │
   │                         │                        │  Update MongoDB        │
   │                         │                        │  Update Firebase       │
   │                         │                        │  New Cloudinary URL    │
   │                         │                        │  Re-pin metadata IPFS  │
   │                         │                        │  Emit ERC-4906 event   │
   │                         │◄───────────────────────│                        │
   │                         │ { nft: updated data }   │                        │
   │  Level Up Animation ✓   │                        │                        │
   │◄────────────────────────│                        │                        │
```

---

## 5. Tournament Lifecycle + Auto Prize Distribution

```
┌─────────────────────────────────────────────────────────────────────┐
│                    TOURNAMENT LIFECYCLE                               │
│                                                                      │
│  Wednesday 12PM EST              Monday 12PM EST                     │
│       │                               │                              │
│       ▼                               ▼                              │
│  ┌──────────┐                   ┌──────────┐                         │
│  │  START    │═══ 5 days ══════►│   END    │                         │
│  │Tournament │                   │Tournament│                         │
│  └──────────┘                   └────┬─────┘                         │
│                                      │                               │
│                                      ▼                               │
│                              ┌───────────────┐                       │
│                              │ AUTO-PROCESS   │                       │
│                              │ 1. Sort scores │                       │
│                              │ 2. Pick top 3  │                       │
│                              │ 3. Send prizes │ ◄── From prize pool   │
│                              │    from pool   │     wallet (auto)     │
│                              │ 4. Discord     │                       │
│                              │    notification│ ──► Discord webhook   │
│                              │ 5. Save history│                       │
│                              │ 6. Reset board │ ◄── Delete all weekly │
│                              └───────┬───────┘     leaderboard entries│
│                                      │                               │
│                                      ▼                               │
│                              ┌───────────────┐                       │
│                              │   COOLDOWN     │                       │
│                              │   48 hours     │                       │
│                              │   Armory CLOSED│                       │
│                              └───────┬───────┘                       │
│                                      │                               │
│                                      ▼ Wednesday 12PM EST            │
│                              ┌───────────────┐                       │
│                              │   NEW          │                       │
│                              │   TOURNAMENT   │                       │
│                              └───────────────┘                       │
│                                                                      │
│  If prize send fails → FailedPayout record → auto-retry cron         │
│  If pool balance low → Discord alert to admin                        │
└─────────────────────────────────────────────────────────────────────┘
```

### Discord Notification Example

```
🏆 Week 12 - Level 3 Tournament Winners!

🥇 1st Place: PlayerX - 47,200 pts → 3.0 AVAX sent ✓
🥈 2nd Place: PlayerY - 41,800 pts → 2.1 AVAX sent ✓
🥉 3rd Place: PlayerZ - 38,500 pts → 900 $BATTLE sent ✓

Total Weekly Payout: 5.1 AVAX + 900 $BATTLE
```

---

## 6. Armory Purchase Flow (Buy from Platform Wallets)

```
  User                    Frontend                 Backend               Blockchain
   │                         │                        │                        │
   │  Browse Weapons         │                        │                        │
   │────────────────────────►│ GET /armory/weapons     │                        │
   │                         │───────────────────────►│                        │
   │                         │◄───────────────────────│                        │
   │  Weapons displayed      │ { weapons by category } │                        │
   │◄────────────────────────│                        │                        │
   │                         │                        │                        │
   │  Click "Buy" on SCAR   │                        │                        │
   │────────────────────────►│ GET /armory/weapon/:id  │                        │
   │                         │───────────────────────►│                        │
   │                         │◄───────────────────────│                        │
   │                         │ { price (server-side),  │                        │
   │                         │   platformWalletAddr }  │                        │
   │                         │                        │                        │
   │  Confirm Purchase       │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │  Build $BATTLE transfer │                        │
   │                         │  tx to platform wallet  │                        │
   │  Sign Transaction       │                        │                        │
   │◄────────────────────────│                        │                        │
   │────────────────────────►│                        │                        │
   │                         │                        │                        │
   │                         │ POST /armory/purchase/  │                        │
   │                         │   weapon               │                        │
   │                         │ { weaponId, txHash }    │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Verify on-chain:      │
   │                         │                        │  • Correct sender      │
   │                         │                        │  • Correct receiver    │
   │                         │                        │  • Correct amount      │
   │                         │                        │  • Not stale (<50s)    │
   │                         │                        │  • Supply available    │
   │                         │                        │                        │
   │                         │                        │  Transfer weapon NFT   │
   │                         │                        │  from platform wallet  │
   │                         │                        │  to user wallet        │
   │                         │                        │───────────────────────►│
   │                         │                        │◄───────────────────────│
   │                         │                        │                        │
   │                         │                        │  Update Firebase:      │
   │                         │                        │  weapons: [..., SCAR]  │
   │                         │                        │  (game sees it now)    │
   │                         │                        │                        │
   │                         │                        │  50% of $BATTLE burned │
   │                         │                        │  Record transaction    │
   │                         │◄───────────────────────│                        │
   │                         │ { weapon, txHash }      │                        │
   │  Weapon Purchased! ✓    │                        │                        │
   │  Available in-game now  │                        │                        │
   │◄────────────────────────│                        │                        │
```

---

## 7. Points → $BATTLE Conversion Flow

```
  Points (In-Game)                     $BATTLE (ERC-20)
       │                                     │
       │  1:1 conversion                     │
       │  POST /points/convert               │
       │  { amount }                         │
       │────────────────────────────────────►│
       │                                     │
       │  Backend:                           │
       │  1. Deduct points from MongoDB      │
       │  2. Mint $BATTLE to user wallet     │
       │  3. Record transaction              │
       │                                     │
       │  If user wants AVAX later:          │
       │  They sell $BATTLE on Trader Joe    │
       │  or any DEX themselves.             │
       │  NOT our concern.                   │

  NO "ChainBoi Money" intermediary.
  Direct: Points → $BATTLE → (DEX if they want AVAX)
```

---

## 8. Web2 → Web3 Upgrade Flow (Simple, No Normie NFTs)

```
  Web2 Player                Frontend                 Backend
   │                            │                        │
   │  Playing as Web2           │                        │
   │  (4 characters, basic wpns)│                        │
   │  Points tracked in MongoDB │                        │
   │                            │                        │
   │  Buys ChainBoi NFT        │                        │
   │  (from Joepegs, platform,  │                        │
   │   or any marketplace)      │                        │
   │                            │                        │
   │  Connects wallet on website│                        │
   │───────────────────────────►│                        │
   │                            │ POST /auth/login       │
   │                            │ { address }            │
   │                            │──────────────────────►│
   │                            │                       │  Detect NFT in wallet
   │                            │                       │  Update playerType:
   │                            │                       │    "web2" → "web3"
   │                            │                       │  Accumulated points
   │                            │                       │    now convertible
   │                            │                       │  Progress data written
   │                            │                       │    to NFT metadata
   │                            │                       │  Write Firebase:
   │                            │                       │    hasNFT=true, level
   │                            │◄──────────────────────│
   │                            │ { user, assets }      │
   │  Now Web3 Player! ✓        │                       │
   │  Full character access     │                       │
   │  Can convert pts→$BATTLE   │                       │
   │◄──────────────────────────►│                       │
```

---

## 9. Feature Matrix: Hackathon MVP vs Full Product

| Feature | MVP (March 9) | Phase 2+ |
|---------|:------------:|:--------:|
| Firebase Auth + Wallet Connect | ✅ | ✅ |
| Game ↔ Firebase sync (cron jobs) | ✅ | ✅ |
| Asset verification + Firebase write | ✅ | ✅ |
| NFT creation (pre-minted to platform) | ✅ | ✅ |
| NFT display (Training Room) | ✅ | ✅ |
| Level-Up System + Badge overlays | ✅ | ✅ |
| Tournament lifecycle (cron) | ✅ | ✅ |
| Leaderboard (time-filtered) | ✅ | ✅ |
| Auto prize distribution + Discord | ✅ | ✅ |
| Weapon catalog + purchase from platform | ✅ | ✅ |
| Points → $BATTLE conversion | ✅ | ✅ |
| Inventory display | ✅ | ✅ |
| Anti-Cheat (basic) | ✅ | ✅ (full) |
| WebSocket (live leaderboard) | ✅ | ✅ |
| Web2 player tracking | ✅ | ✅ |
| Web2→Web3 upgrade (simple) | ✅ | ✅ |
| Loot Boxes | ❌ | ✅ |
| Armor system | ❌ | ✅ |
| Airdrop system | ❌ | ✅ |
| Battlepass | ❌ | ✅ |
| Mythic upgrade / chip draws | ❌ | ✅ |
| APEX widget integration | ❌ | ✅ |
| In-house secondary marketplace | ❌ | ✅ |

---

## 10. Implementation Order + Frontend Doc Delivery

```
  Day 1: Phase 0 - Foundation
  ├── Express scaffolding, models, middleware
  ├── avaxUtils, cryptUtils, discordService
  └── 📄 FE Doc: env setup, auth pattern, request format
       │
  Day 2: Phase 1 - Game Integration + Auth     ◄── FRONTEND PRIORITY
  ├── Firebase auth (decodeToken middleware)
  ├── Login (Firebase token + wallet address)
  ├── Asset verification → Firebase write
  ├── Cron: sync new users (1min), sync scores (5min)
  ├── Web2 player support
  └── 📄 FE Doc: auth flow, game endpoints, events
       │
  Day 3: Phase 2 - Smart Contracts + NFTs
  ├── Deploy BattleToken, ChainBoisNFT, WeaponNFT
  ├── Art generation (if traits provided)
  ├── Pre-mint to platform wallets
  └── 📄 FE Doc: contract addresses, NFT data format
       │
  Day 4: Phase 3 - Training Room
  ├── NFT query, level-up flow, badge system
  └── 📄 FE Doc: training room endpoints, level-up UX
       │
  Day 5-6: Phase 4 - Battleground + Leaderboard
  ├── Tournament cron, leaderboard, auto prizes
  ├── Discord notifications
  └── 📄 FE Doc: tournament endpoints, WebSocket events
       │
  Day 7: Phase 5 - Armory + Points
  ├── Weapon purchase from platform wallets
  ├── Points → $BATTLE conversion
  └── 📄 FE Doc: armory endpoints, purchase flow
       │
  Day 8: Phase 6 - Inventory + Polish
  ├── Inventory aggregation, tx history
  └── 📄 FE Doc: inventory endpoints
       │
  Day 8-9: Phase 7 - Testing + Demo
  ├── Full test suite
  ├── Postman collection
  ├── Demo video script
  └── 📄 Complete API documentation
```

---

## 11. Database Relationships

```
  User (uid + address)
   │
   ├── owns ──── ChainBoiNFT (tokenId)
   │                  ├── level (0-7)
   │                  ├── badge
   │                  └── traits []
   │
   ├── owns ──── WeaponNFT (tokenId)
   │                  ├── category
   │                  └── blueprintTier
   │
   ├── has ──── Points (pointsBalance in User model)
   │
   ├── plays ──── GameSession []
   │                  ├── score (max 5000)
   │                  └── verified
   │
   ├── competes ──── WeeklyLeaderboard
   │                      ├── highScore
   │                      ├── totalScore
   │                      └── gamesPlayed
   │
   ├── tracked by ──── SecurityProfile
   │                        ├── threatScore
   │                        └── status
   │
   └── synced via ──── Firebase Realtime DB
                            ├── hasNFT (game reads)
                            ├── level (game reads)
                            ├── weapons (game reads)
                            └── score (game writes)
```

---

**Next Steps:**
1. Review this updated document and the updated PRD
2. Approve or request changes
3. Begin Phase 0: Foundation → deliver FE docs → Phase 1: Game Integration
