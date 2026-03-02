# ChainBois - Overall Feature Document & Flow Diagrams

**Version:** 1.0 | **Date:** March 2, 2026

---

## 1. System Overview Flow

```
                              ┌──────────────────────────┐
                              │     CHAINBOIS PLATFORM    │
                              └──────────┬───────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
    ┌─────────▼─────────┐    ┌──────────▼──────────┐    ┌─────────▼─────────┐
    │    FRONTEND        │    │    UNITY GAME        │    │  WALLET MGT API   │
    │    (Next.js)       │    │    (PC + Mobile)     │    │  (Separate Repo)  │
    │                    │    │                      │    │                   │
    │ • Landing Page     │    │ • Battle Royale      │    │ • Key Storage     │
    │ • Training Room    │    │ • Frontline          │    │ • Tx Signing      │
    │ • Battleground     │    │ • Search & Destroy   │    │ • Account Mgmt    │
    │ • Armory           │    │ • Team Deathmatch    │    │                   │
    │ • Inventory        │    │ • Domination         │    │                   │
    │ • Mint Page        │    │ • Kill Confirmed     │    │                   │
    └─────────┬─────────┘    └──────────┬──────────┘    └─────────┬─────────┘
              │                          │                          │
              │  Bearer JWT              │  API Key + HMAC          │  x-client-id
              │  + x-client-id           │                          │  + IP whitelist
              │                          │                          │
              └──────────────────────────┼──────────────────────────┘
                                         │
                              ┌──────────▼───────────────┐
                              │    CHAINBOIS MAIN API    │
                              │    (Express.js)          │
                              │                          │
                              │ Modules:                 │
                              │ ┌──────┐ ┌──────┐       │
                              │ │ Auth │ │Train │       │
                              │ └──────┘ └──────┘       │
                              │ ┌──────┐ ┌──────┐       │
                              │ │Battle│ │Armory│       │
                              │ └──────┘ └──────┘       │
                              │ ┌──────┐ ┌──────┐       │
                              │ │ Inv  │ │ Mint │       │
                              │ └──────┘ └──────┘       │
                              │ ┌──────┐ ┌──────┐       │
                              │ │ Game │ │Points│       │
                              │ └──────┘ └──────┘       │
                              └──────────┬───────────────┘
                                         │
              ┌──────────────┬───────────┼───────────┬──────────────┐
              │              │           │           │              │
    ┌─────────▼──┐  ┌───────▼───┐  ┌────▼───┐  ┌───▼────┐  ┌─────▼─────┐
    │  MongoDB   │  │  Firebase  │  │ Redis  │  │Cloudinary│ │  Pinata   │
    │            │  │  Realtime  │  │        │  │          │ │  (IPFS)   │
    │ Users      │  │  DB        │  │ Cache  │  │ NFT      │ │           │
    │ NFTs       │  │            │  │ Queues │  │ Images   │ │ Metadata  │
    │ Tournaments│  │ Game Sync  │  │ Socket │  │ Badges   │ │ JSON      │
    │ Scores     │  │ Levels     │  │        │  │          │ │           │
    └────────────┘  └───────────┘  └────────┘  └──────────┘ └───────────┘
                                         │
                              ┌──────────▼───────────────┐
                              │   AVALANCHE C-CHAIN      │
                              │   (Fuji Testnet)         │
                              │                          │
                              │ Contracts:               │
                              │ • $BATTLE (ERC-20)       │
                              │ • ChainBois NFT (ERC-721)│
                              │ • Weapon NFT (ERC-721)   │
                              │ • LevelUp                │
                              │ • Prize Distribution     │
                              │ • Points Conversion      │
                              └──────────────────────────┘
```

---

## 2. Authentication Flow

```
  User                    Frontend                 Backend                  Blockchain
   │                         │                        │                        │
   │  Click Connect Wallet   │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │                        │                        │
   │  Thirdweb Wallet Modal  │                        │                        │
   │◄────────────────────────│                        │                        │
   │                         │                        │                        │
   │  Approve Connection     │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │                        │                        │
   │                         │ POST /auth/connect      │                        │
   │                         │ { address }             │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Find/Create User      │
   │                         │                        │  Generate Nonce        │
   │                         │◄───────────────────────│                        │
   │                         │ { nonce, isNewUser }    │                        │
   │                         │                        │                        │
   │  Sign Nonce Message     │                        │                        │
   │◄────────────────────────│                        │                        │
   │────────────────────────►│                        │                        │
   │                         │                        │                        │
   │                         │ POST /auth/verify       │                        │
   │                         │ { address, signature,   │                        │
   │                         │   nonce }               │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Verify Signature      │
   │                         │                        │  Create JWT            │
   │                         │                        │  Set Refresh Cookie    │
   │                         │◄───────────────────────│                        │
   │                         │ { accessToken, user }   │                        │
   │                         │ + httpOnly cookie       │                        │
   │                         │                        │                        │
   │  Authenticated ✓        │                        │                        │
   │◄────────────────────────│                        │                        │
```

---

## 3. NFT Minting Flow (Hackathon Claim)

```
  Judge/User              Frontend                 Backend               Blockchain
   │                         │                        │                        │
   │  Visit /claim           │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │ GET /mint/status        │                        │
   │                         │───────────────────────►│                        │
   │                         │◄───────────────────────│                        │
   │                         │ { remaining, price }    │                        │
   │                         │                        │                        │
   │  Click "Claim NFT"     │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │ POST /mint/claim        │                        │
   │                         │ { address }             │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Check claim limit     │
   │                         │                        │  Prepare mint tx       │
   │                         │                        │                        │
   │                         │                        │───────────────────────►│
   │                         │                        │  Mint NFT (from        │
   │                         │                        │  platform wallet)      │
   │                         │                        │◄───────────────────────│
   │                         │                        │  txHash                │
   │                         │                        │                        │
   │                         │                        │  Create NFT record     │
   │                         │                        │  Upload metadata       │
   │                         │                        │                        │
   │                         │◄───────────────────────│                        │
   │                         │ { tokenId, txHash,      │                        │
   │                         │   nftData }             │                        │
   │                         │                        │                        │
   │  NFT Claimed! ✓         │                        │                        │
   │◄────────────────────────│                        │                        │
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
   │                         │                        │  Calculate cost (1 AVAX)│
   │                         │                        │  Prepare unsigned tx   │
   │                         │◄───────────────────────│                        │
   │                         │ { unsignedTx, cost }    │                        │
   │                         │                        │                        │
   │  Sign Transaction       │                        │                        │
   │  (Wallet Popup)         │                        │                        │
   │◄────────────────────────│                        │                        │
   │────────────────────────►│                        │                        │
   │                         │                        │                        │
   │                         │ POST /training/confirm  │                        │
   │                         │ { tokenId, signedTx }   │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │───────────────────────►│
   │                         │                        │  Submit tx             │
   │                         │                        │  Wait confirmation     │
   │                         │                        │◄───────────────────────│
   │                         │                        │                        │
   │                         │                        │  Update MongoDB level  │
   │                         │                        │  Update Firebase       │
   │                         │                        │  New Cloudinary URL    │
   │                         │                        │  Re-pin metadata IPFS  │
   │                         │                        │  Trigger reindex       │
   │                         │                        │  Emit ERC-4906 event   │
   │                         │                        │                        │
   │                         │◄───────────────────────│                        │
   │                         │ { nft: { level: 3,      │                        │
   │                         │   badge: "level_3",     │                        │
   │                         │   imageUri: "..." } }   │                        │
   │                         │                        │                        │
   │  Level Up Animation ✓   │                        │                        │
   │◄────────────────────────│                        │                        │
```

---

## 5. Game Integration Flow

```
  Unity Game                              Backend                    Blockchain
   │                                         │                          │
   │  Game Launch / Player Login              │                          │
   │                                         │                          │
   │  POST /game/verify-assets               │                          │
   │  { address, gameApiKey }                │                          │
   │────────────────────────────────────────►│                          │
   │                                         │  Verify API key          │
   │                                         │  Query Data API          │
   │                                         │─────────────────────────►│
   │                                         │  Get NFTs + Tokens       │
   │                                         │◄─────────────────────────│
   │                                         │                          │
   │                                         │  Determine unlocks:      │
   │                                         │  Level 3 = 16 characters │
   │                                         │  + owned weapons         │
   │◄────────────────────────────────────────│                          │
   │  { characters: [...16],                 │                          │
   │    weapons: [...],                      │                          │
   │    playerType: "web3",                  │                          │
   │    level: 3 }                           │                          │
   │                                         │                          │
   │  POST /game/session/start               │                          │
   │  { address, gameMode, nftTokenId }      │                          │
   │────────────────────────────────────────►│                          │
   │                                         │  Create GameSession      │
   │                                         │  Start anti-cheat timer  │
   │◄────────────────────────────────────────│                          │
   │  { sessionId }                          │                          │
   │                                         │                          │
   │  ... GAMEPLAY (5-30 min) ...            │                          │
   │                                         │                          │
   │  POST /game/session/end                 │                          │
   │  { sessionId, score: 3200, kills: 15,   │                          │
   │    hmac: "abc123..." }                  │                          │
   │────────────────────────────────────────►│                          │
   │                                         │  Verify HMAC signature   │
   │                                         │  Validate session timing │
   │                                         │  Check score ≤ 5000      │
   │                                         │  Anti-cheat checks       │
   │                                         │  Update points balance   │
   │                                         │  Update Firebase         │
   │                                         │  Update leaderboard      │
   │◄────────────────────────────────────────│                          │
   │  { pointsEarned: 3200,                 │                          │
   │    totalPoints: 18400,                  │                          │
   │    rank: 5 }                            │                          │
```

---

## 6. Tournament Lifecycle

```
Tournament Cron Job (runs every hour on PM2 instance 0)

    ┌─────────────────────────────────────────────────────────┐
    │                  TOURNAMENT LIFECYCLE                     │
    │                                                          │
    │  Wednesday 12PM EST         Monday 12PM EST              │
    │       │                          │                       │
    │       ▼                          ▼                       │
    │  ┌─────────┐              ┌─────────┐                   │
    │  │  START   │──5 days────►│   END   │                   │
    │  │Tournament│              │Tournament│                   │
    │  └─────────┘              └────┬────┘                   │
    │       │                        │                         │
    │       │                        ▼                         │
    │       │                  ┌──────────┐                    │
    │       │                  │Calculate │                    │
    │       │                  │ Winners  │                    │
    │       │                  │(Top 3)   │                    │
    │       │                  └────┬─────┘                    │
    │       │                       │                          │
    │       │                       ▼                          │
    │       │                  ┌──────────┐                    │
    │       │                  │  COOLDOWN │                   │
    │       │                  │  48 hours │                   │
    │       │                  └────┬─────┘                    │
    │       │                       │                          │
    │       │                       ▼ Wednesday 12PM EST       │
    │       │                  ┌──────────┐                    │
    │       └──────────────────│  RESTART │                    │
    │                          │Tournament│                    │
    │                          └──────────┘                    │
    │                                                          │
    │  Prize Collection Window: Up to 1 week after END         │
    │  Armory: CLOSED during cooldown                          │
    │  Points during cooldown: Reset at tournament start       │
    └─────────────────────────────────────────────────────────┘
```

### Prize Collection Flow

```
  Winner                  Frontend                 Backend               Blockchain
   │                         │                        │                        │
   │  See "Collect Prize"    │                        │                        │
   │  button on Battleground │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │ POST /tournaments/      │                        │
   │                         │   {level}/collect-prize │                        │
   │                         │ { address }             │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Verify winner         │
   │                         │                        │  Check not expired     │
   │                         │                        │  Check not collected   │
   │                         │                        │                        │
   │                         │                        │  1st/2nd: Send AVAX   │
   │                         │                        │  3rd: Send $BATTLE    │
   │                         │                        │───────────────────────►│
   │                         │                        │  Transfer tx           │
   │                         │                        │◄───────────────────────│
   │                         │                        │                        │
   │                         │                        │  Mark collected        │
   │                         │                        │  Record transaction    │
   │                         │◄───────────────────────│                        │
   │                         │ { txHash, amount,       │                        │
   │                         │   currency }            │                        │
   │  Prize Collected! ✓     │                        │                        │
   │◄────────────────────────│                        │                        │
```

---

## 7. Armory Purchase Flow

```
  User                    Frontend                 Backend               Blockchain
   │                         │                        │                        │
   │  Browse Weapons         │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │ GET /armory/weapons     │                        │
   │                         │───────────────────────►│                        │
   │                         │◄───────────────────────│                        │
   │                         │ { weapons: [...] }      │                        │
   │  Weapons displayed      │                        │                        │
   │◄────────────────────────│                        │                        │
   │                         │                        │                        │
   │  Click "Buy" on SCAR   │                        │                        │
   │────────────────────────►│                        │                        │
   │                         │ POST /armory/purchase/  │                        │
   │                         │   weapon               │                        │
   │                         │ { weaponId, address }   │                        │
   │                         │───────────────────────►│                        │
   │                         │                        │  Check $BATTLE balance │
   │                         │                        │  Check supply          │
   │                         │                        │  Check armory open     │
   │                         │                        │                        │
   │                         │                        │  Deduct $BATTLE:       │
   │                         │                        │  50% burn, 50% liq    │
   │                         │                        │───────────────────────►│
   │                         │                        │  Burn tx               │
   │                         │                        │◄───────────────────────│
   │                         │                        │                        │
   │                         │                        │  Mint Weapon NFT       │
   │                         │                        │───────────────────────►│
   │                         │                        │  to user wallet        │
   │                         │                        │◄───────────────────────│
   │                         │                        │                        │
   │                         │                        │  Record transaction    │
   │                         │                        │  Sync to game (Firebase)│
   │                         │◄───────────────────────│                        │
   │                         │ { weapon, txHash }      │                        │
   │  Weapon Purchased! ✓    │                        │                        │
   │◄────────────────────────│                        │                        │
```

---

## 8. Points Conversion Flow

```
  Points Earned       ChainBoi Money         $BATTLE Token          AVAX
  (In-Game)           (Platform Currency)     (ERC-20)              (Native)
       │                     │                     │                    │
       │  1:1 conversion     │                     │                    │
       │────────────────────►│                     │                    │
       │  (Off-chain,        │  1:1 conversion     │                    │
       │   deducts from      │────────────────────►│                    │
       │   accumulated       │  (On-chain tx,      │  Market rate       │
       │   points first)     │   mints $BATTLE)    │───────────────────►│
       │                     │                     │  (DEX swap or      │
       │                     │                     │   direct conversion)│
       │                     │                     │                    │

  Deduction Priority:
  1. Accumulated (pre-tournament) points first
  2. Current tournament points only if accumulated insufficient

  Restrictions:
  - Web2 players: Cannot convert to $BATTLE (no wallet)
  - Armory closed during tournament cooldown
```

---

## 9. Web2 → Web3 Upgrade Flow

```
  Web2 Player                Frontend                 Backend               Blockchain
   │                            │                        │                        │
   │  Playing as Web2           │                        │                        │
   │  (4 characters, no NFT)   │                        │                        │
   │                            │                        │                        │
   │  Click "Upgrade to Web3"  │                        │                        │
   │───────────────────────────►│                        │                        │
   │                            │                        │                        │
   │  Connect Wallet            │                        │                        │
   │  (Thirdweb)                │                        │                        │
   │◄──────────────────────────►│                        │                        │
   │                            │                        │                        │
   │                            │ POST /player/          │                        │
   │                            │   normie-upgrade       │                        │
   │                            │ { address }            │                        │
   │                            │──────────────────────►│                        │
   │                            │                       │  Calculate cost:        │
   │                            │                       │  120% × floor price     │
   │                            │◄──────────────────────│                        │
   │                            │ { cost, unsignedTx }  │                        │
   │                            │                       │                        │
   │  Sign Payment              │                       │                        │
   │◄──────────────────────────►│                       │                        │
   │                            │                       │                        │
   │                            │ POST /player/         │                        │
   │                            │   normie-upgrade/     │                        │
   │                            │   confirm             │                        │
   │                            │──────────────────────►│                        │
   │                            │                       │───────────────────────►│
   │                            │                       │  Transfer Normie NFT   │
   │                            │                       │  Remove normie flag    │
   │                            │                       │◄───────────────────────│
   │                            │                       │                        │
   │                            │                       │  Reset points to 0     │
   │                            │                       │  Update playerType     │
   │                            │                       │  Full character access │
   │                            │◄──────────────────────│                        │
   │                            │ { user, nft }         │                        │
   │  Now Web3 Player! ✓        │                       │                        │
   │◄──────────────────────────►│                       │                        │
```

---

## 10. Feature Matrix: Hackathon MVP vs Full Product

| Feature | Hackathon (Phase 1) | Post-Hackathon (Phase 2+) |
|---------|:-------------------:|:-------------------------:|
| Wallet Connect (Thirdweb) | ✅ | ✅ |
| JWT Authentication | ✅ | ✅ |
| ChainBoi NFT Minting | ✅ (claim page) | ✅ (full mint) |
| NFT Display (Training Room) | ✅ | ✅ |
| Level-Up System | ✅ | ✅ |
| Badge Overlays (Cloudinary) | ✅ | ✅ |
| Tournament System | ✅ (seeded data OK) | ✅ (automated) |
| Leaderboard | ✅ (basic) | ✅ (real-time) |
| Prize Collection | ✅ | ✅ (automated) |
| Weapon Catalog | ✅ | ✅ |
| Weapon Purchase ($BATTLE) | ✅ | ✅ |
| Points Conversion | ✅ | ✅ |
| Inventory Display | ✅ | ✅ |
| Game Asset Verification | ✅ | ✅ |
| Game Session / Score | ✅ | ✅ |
| Anti-Cheat | ✅ (basic) | ✅ (full) |
| WebSocket (live updates) | ✅ (basic) | ✅ (full) |
| Loot Boxes | ❌ | ✅ |
| Armor Purchase | ❌ | ✅ |
| Airdrop System | ❌ | ✅ |
| Battlepass | ❌ | ✅ |
| Secondary Marketplace | ❌ | ✅ |
| Web2 Player System | ❌ | ✅ |
| Normie NFT Upgrade | ❌ | ✅ |
| Burn Mechanism | ❌ | ✅ |
| $BATTLE → AVAX Cash-out | ❌ | ✅ |
| Mythic Upgrade System | ❌ | ✅ |
| Merchandise Page | ❌ | ✅ |
| APEX Integration | ❌ | ✅ |

---

## 11. Database Relationships

```
  User (address)
   │
   ├──── owns ──── ChainBoiNFT (tokenId)
   │                    │
   │                    ├── level (0-7)
   │                    ├── badge
   │                    └── traits []
   │
   ├──── owns ──── WeaponNFT (tokenId)
   │                    │
   │                    ├── category
   │                    ├── blueprintTier
   │                    └── mythicLevel
   │
   ├──── has ──── Points
   │               ├── accumulated
   │               ├── tournament
   │               └── chainboiMoney
   │
   ├──── plays ──── GameSession
   │                    │
   │                    ├── score
   │                    ├── kills
   │                    └── verified
   │
   ├──── competes ──── Tournament (level)
   │                      │
   │                      ├── leaderboard []
   │                      ├── winners []
   │                      └── prizePool
   │
   └──── tracked by ──── SecurityProfile
                             │
                             ├── threatScore
                             ├── violations []
                             └── status
```

---

## 12. Implementation Order & Dependencies

```
  Phase 0: Foundation
  ├── Express scaffolding
  ├── MongoDB models
  ├── Auth system
  ├── avaxUtils.js
  └── Error handling
       │
       ▼
  Phase 1: Smart Contracts
  ├── BattleToken.sol
  ├── ChainBoisNFT.sol
  ├── WeaponNFT.sol
  └── Deploy to Fuji
       │
       ▼
  Phase 2: NFT Art & Minting ──────────────────── (needs traits ZIP)
  ├── HashLips configuration
  ├── Art generation
  ├── IPFS upload
  ├── Cloudinary upload
  └── Mint endpoints
       │
       ▼
  Phase 3: Training Room ─────── depends on: Phase 1 (contracts), Phase 2 (NFTs)
  ├── NFT query
  ├── Level-up flow
  └── Badge system
       │
       ▼
  Phase 4: Game Integration ──── depends on: Phase 3 (NFT levels)
  ├── Asset verification
  ├── Session management
  ├── Anti-cheat
  └── Points sync
       │
       ▼
  Phase 5: Battleground ─────── depends on: Phase 4 (points/scores)
  ├── Tournament cron
  ├── Leaderboard
  └── Prize distribution
       │
       ▼
  Phase 6: Armory ──────────── depends on: Phase 1 ($BATTLE), Phase 4 (points)
  ├── Weapon catalog
  ├── Purchase flow
  └── Points conversion
       │
       ▼
  Phase 7: Inventory ──────── depends on: Phase 2, 3, 6 (all assets)
  ├── Asset aggregation
  └── Transaction history
       │
       ▼
  Phase 8: Polish & Docs
  ├── Test suite
  ├── Postman collection
  ├── Frontend docs
  └── Demo prep
```

---

## 13. Security Architecture Summary

```
  ┌─────────────────────────────────────────────────────┐
  │                    SECURITY LAYERS                   │
  │                                                     │
  │  Layer 1: Network                                   │
  │  ├── HTTPS only                                     │
  │  ├── CORS whitelist                                 │
  │  ├── Rate limiting (100-1000 req/min)               │
  │  └── IP blocking (suspicious behavior)              │
  │                                                     │
  │  Layer 2: Application                               │
  │  ├── Helmet (security headers)                      │
  │  ├── NoSQL injection prevention (mongoSanitize)     │
  │  ├── XSS prevention                                 │
  │  ├── HPP (parameter pollution)                      │
  │  └── Endpoint whitelist validation                  │
  │                                                     │
  │  Layer 3: Authentication                            │
  │  ├── JWT (15min expiry) for frontend                │
  │  ├── API Key + HMAC for game client                 │
  │  ├── x-client-id + IP whitelist for wallet-mgt      │
  │  └── Refresh tokens (httpOnly cookies)              │
  │                                                     │
  │  Layer 4: Authorization                             │
  │  ├── Role-based (user/admin)                        │
  │  ├── Ownership verification (NFT/wallet)            │
  │  └── Game session validation                        │
  │                                                     │
  │  Layer 5: Anti-Cheat                                │
  │  ├── Session tracking                               │
  │  ├── Score plausibility checks                      │
  │  ├── Velocity/timing analysis                       │
  │  ├── Daily earning caps                             │
  │  └── Threat scoring → cooldown → temp → perm ban    │
  │                                                     │
  │  Layer 6: Data                                      │
  │  ├── AES encryption for wallet keys                 │
  │  ├── Separate wallet-mgt service                    │
  │  └── Transaction ledger (audit trail)               │
  └─────────────────────────────────────────────────────┘
```

---

**Next Steps:**
1. Review this document and the PRD
2. Approve or request changes
3. Begin Phase 0: Foundation implementation
