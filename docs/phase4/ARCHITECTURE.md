# Phase 4: Battleground + Leaderboard Architecture

## What Phase 4 Implements

Phase 4 is the **tournament and competitive layer**. It manages weekly tournaments across 7 difficulty levels, automated prize distribution, real-time leaderboards, and Discord notifications. It connects five systems:
1. **MongoDB** - Tournament state machine, weekly leaderboard aggregations, failed payout tracking, leaderboard history
2. **Avalanche C-Chain (Fuji)** - AVAX prize payouts from prize_pool wallet, $BATTLE prize payouts from rewards wallet
3. **Socket.IO** - Real-time leaderboard updates and tournament state change events
4. **Discord** - Webhook notifications for tournament winners and payout failures
5. **Firebase** - Score data ingested via `syncScoresJob` (from Phase 1, extended here)

---

## Component Overview

```
+-----------------------------------------------------------------+
|                     Express App (app.js)                         |
|                                                                  |
|  Phase 4 Routes:                                                 |
|  /api/v1/tournaments/* -> battlegroundRoutes.js  (all public)   |
|                                                                  |
|  Socket.IO (server.js):                                          |
|  /tournaments namespace -> level rooms (level:1 through level:7)|
|                                                                  |
|  Cron Jobs (server.js, PM2 primary only):                        |
|  - tournamentJob   -> every hour                                |
|  - failedPayoutJob -> every 6 hours                             |
|  - syncScoresJob   -> every 5 min (extended for tournament LB)  |
+-----------------------------------------------------------------+
```

---

## Directory Structure (Phase 4 additions)

```
chainbois-api/
├── controllers/
│   └── battlegroundController.js  # 6 public tournament endpoints
├── routes/
│   └── battlegroundRoutes.js      # Tournament routes (all public)
├── services/
│   └── prizeService.js            # Prize calculation + distribution + retry
├── jobs/
│   ├── tournamentJob.js           # Tournament lifecycle cron (every hour)
│   └── failedPayoutJob.js         # Retry failed payouts (every 6 hours)
├── models/
│   ├── tournamentModel.js         # Tournament state machine
│   ├── weeklyLeaderboardModel.js  # Per-user per-week per-level scores
│   ├── leaderboardHistoryModel.js # Archived tournament results
│   └── failedPayoutModel.js       # Failed prize payout tracking
├── config/
│   └── socketio.js                # Socket.IO init + /tournaments namespace
└── utils/
    ├── weekUtils.js               # Shared getWeekInfo() utility
    └── discordService.js          # Discord webhook alerts + winner notifications
```

---

## Data Flow Diagrams

### Tournament Lifecycle State Machine

```
Wednesday 12 PM EST                                    Monday 12 PM EST
        |                                                      |
        v                                                      v
  +----------+    +--------+    +----------+    +-----------+
  | UPCOMING |    | ACTIVE |    | COOLDOWN |    | COMPLETED |
  |          |--->|        |--->|          |--->|           |
  | Created  |    | Players|    | Prizes   |    | Archived  |
  | by cron  |    | compete|    | paid out |    | Next one  |
  | before   |    | 5 days |    | 48 hours |    | created   |
  | start    |    |        |    |          |    |           |
  +----------+    +--------+    +----------+    +-----------+
       ^                                              |
       |               Next Wednesday                 |
       +----------------------------------------------+
```

**Schedule**: Start Wednesday 12:00 PM EST (17:00 UTC), 120 hours active, 48 hours cooldown. All 7 levels run simultaneously.

### Tournament Job Logic (Every Hour)

```
tournamentJob()
      |
      v
Step 1: CREATE UPCOMING
  For each level 1-7:
    If no upcoming/active tournament exists:
      Calculate next Wednesday start time
      Create tournament with prizePool from Settings
      |
      v
Step 2: ACTIVATE
  Find tournaments: status=upcoming, startTime <= now
    Set status = "active"
    Emit Socket.IO "tournament:started"
      |
      v
Step 3: END + DISTRIBUTE
  Find tournaments: status=active, endTime <= now
    Set status = "cooldown"
    Call prizeService.distributePrizes()
    Emit Socket.IO "tournament:ended"
      |
      v
Step 4: COMPLETE COOLDOWN
  Find tournaments: status=cooldown, cooldownEndTime <= now
    Set status = "completed"
    (Frees level for next tournament creation in Step 1)
```

### Prize Distribution Flow

```
Tournament ends (endTime <= now)
        |
        v
Query WeeklyLeaderboard
  year + weekNumber + level
  sorted by highScore desc
  top 3 players
        |
        v
+-------+-------+-------+
|  1st  |  2nd  |  3rd  |
| AVAX  | AVAX  | $BTLR |
+---+---+---+---+---+---+
    |       |       |
    v       v       v

1st Place (AVAX):
  prize_pool wallet -> sendAvax() -> winner address
  Amount: prizePool * 50%

2nd Place (AVAX):
  prize_pool wallet -> sendAvax() -> winner address
  Amount: prizePool * 35%

3rd Place ($BATTLE):
  rewards wallet -> transferBattleTokens() -> winner address
  Amount: BATTLE_PRIZES_PER_LEVEL[level] (fixed per level)

For each payout:
  Decrypt wallet key from MongoDB
  Check balance sufficient
    If insufficient: create FailedPayout + Discord alert
    If success: record Transaction, update tournament.winners[]
  Create LeaderboardHistory record
  Send Discord winner notification
```

### Score Sync Integration (syncScoresJob, extended)

```
Unity Game        Firebase         syncScoresJob        MongoDB            Socket.IO
    |                |                  |                  |                    |
    | Score: 5000    |                  |                  |                    |
    |--------------->|                  |                  |                    |
    |                | Cron (5 min)     |                  |                    |
    |                |<-----------------|                  |                    |
    |                |  Score: 5000     |                  |                    |
    |                |----------------->|                  |                    |
    |                |                  |                  |                    |
    |                |                  | 1. Calculate     |                    |
    |                |                  |    delta         |                    |
    |                |                  | 2. Anti-cheat    |                    |
    |                |                  |    validate      |                    |
    |                |                  | 3. Update User   |                    |
    |                |                  |    score, points |                    |
    |                |                  |----------------->|                    |
    |                |                  |                  |                    |
    |                |                  | 4. Query active  |                    |
    |                |                  |    tournaments   |                    |
    |                |                  | 5. Upsert Weekly |                    |
    |                |                  |    Leaderboard   |                    |
    |                |                  |    (tournament's |                    |
    |                |                  |     week/year)   |                    |
    |                |                  |----------------->|                    |
    |                |                  |                  |                    |
    |                |                  | 6. Emit          |                    |
    |                |                  |    leaderboard   |                    |
    |                |                  |    :update       |                    |
    |                |                  |----------------------------------->|
```

**Critical detail**: The `syncScoresJob` uses the tournament's stored `weekNumber`/`year` (not calendar week) when upserting `WeeklyLeaderboard`. This ensures scores during a tournament window land in the correct bucket regardless of calendar week boundaries.

### Failed Payout Retry

```
failedPayoutJob (every 6 hours)
        |
        v
Query FailedPayout where resolved: false AND retryCount < 5
        |
        v
For each failed payout:
  AVAX: sendAvax() from prize_pool wallet
  $BATTLE: transferBattleTokens() from rewards wallet
    Success: resolved = true, save resolvedTxHash, record Transaction
    Failure: retryCount++
    If retryCount >= 5: critical Discord alert
```

---

## Key Design Decisions

1. **All tournament endpoints are public**: No auth required. Tournament data (leaderboards, countdowns, winners) is public information. The leaderboard is populated by the `syncScoresJob` which already handles anti-cheat validation.

2. **Hourly cron for lifecycle management**: The `tournamentJob` runs every hour and handles all state transitions. This provides coarse-grained but reliable lifecycle management without the complexity of scheduled tasks at exact times.

3. **PM2 primary-only cron execution**: `NODE_APP_INSTANCE === "0"` guard prevents duplicate tournament processing in PM2 cluster mode. The `isRunning` flag provides additional protection against overlapping runs within a single instance.

4. **Socket.IO for real-time updates**: The `/tournaments` namespace with `level:N` rooms allows clients to subscribe to specific tournament levels. Events are emitted on score syncs and tournament state changes. Socket.IO failures are non-fatal (wrapped in try/catch).

5. **Separate wallets for AVAX and $BATTLE prizes**: 1st and 2nd place receive AVAX from the `prize_pool` wallet. 3rd place receives $BATTLE from the `rewards` wallet. This separates concerns and allows independent balance management.

6. **Failed payout recovery**: Any prize payment failure creates a `FailedPayout` record. The `failedPayoutJob` retries up to 5 times. After 5 failures, a critical Discord alert is sent for manual intervention.

7. **Tournament-linked leaderboard buckets**: Each tournament stores its own `weekNumber` and `year`. The `WeeklyLeaderboard` uses these values (not live calendar calculations) to ensure score buckets align with tournament windows.

---

## Models/Schemas Introduced

### Tournament

| Field | Type | Description |
|-------|------|-------------|
| `level` | Number (1-7) | Tournament difficulty level |
| `weekNumber` | Number | ISO week number at tournament start |
| `year` | Number | Year at tournament start |
| `status` | String enum | upcoming, active, cooldown, completed |
| `startTime` | Date | Wednesday 17:00 UTC |
| `endTime` | Date | Monday 17:00 UTC (start + 120h) |
| `cooldownEndTime` | Date | Wednesday 17:00 UTC (end + 48h) |
| `prizePool` | Number | AVAX prize pool for this level |
| `prizeDistribution` | Object | `{ first, second, third, thirdBattle }` |
| `winners` | Array | `[{ rank, address, username, points, paid, txHash, paidAt }]` |

Indexes: `(level, status)`, `(startTime desc)`, `(year, weekNumber, level)` unique.

### WeeklyLeaderboard

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String (indexed) | Firebase UID |
| `address` | String | Wallet address |
| `username` | String | Display name |
| `tournamentLevel` | Number | Tournament level this entry tracks |
| `year` | Number | Year |
| `weekNumber` | Number | Week number |
| `highScore` | Number | Best single-session score |
| `totalScore` | Number | Sum of all scores this week |
| `gamesPlayed` | Number | Games played this week |

Unique compound index: `(year, weekNumber, tournamentLevel, uid)`. Sorted index on `highScore` for leaderboard queries.

### LeaderboardHistory

| Field | Type | Description |
|-------|------|-------------|
| `year` | Number | Tournament year |
| `weekNumber` | Number | Tournament week |
| `tournamentLevel` | Number | Level |
| `winners` | Array | `[{ rank, address, username, highScore, prizeAmount, prizeCurrency, txHash }]` |
| `totalPayout` | Number | Total AVAX paid out |

Unique compound index: `(year, weekNumber, tournamentLevel)`.

### FailedPayout

| Field | Type | Description |
|-------|------|-------------|
| `tournamentId` | ObjectId (ref Tournament) | Source tournament |
| `address` | String | Winner's wallet address |
| `amount` | Number | Prize amount |
| `currency` | String enum | AVAX or BATTLE |
| `reason` | String | Failure reason |
| `retryCount` | Number (0-5) | Retry attempts |
| `lastRetry` | Date | Last retry timestamp |
| `resolved` | Boolean | Whether payout succeeded |
| `resolvedTxHash` | String | Successful payout tx hash |

---

## Socket.IO Events

| Event | Emitted When | Data |
|-------|-------------|------|
| `leaderboard:update` | After score sync changes a level's leaderboard | `{ level, leaderboard: [top10] }` |
| `tournament:started` | Tournament status changes to "active" | `{ level, startTime, endTime, prizePool }` |
| `tournament:ended` | Tournament ends, prizes distributed | `{ level, winners: [...] }` |

**Namespace**: `/tournaments`
**Rooms**: `level:1` through `level:7` (client joins specific level rooms via `join:level` event)

---

## Endpoints Summary

All endpoints are under `/api/v1/tournaments` and require no authentication.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/tournaments` | Public | List all 7 tournament tiers with current status |
| GET | `/tournaments/history` | Public | Paginated historical results (filterable by level) |
| GET | `/tournaments/:level` | Public | Tournament detail + top 10 leaderboard |
| GET | `/tournaments/:level/leaderboard` | Public | Paginated leaderboard for a level |
| GET | `/tournaments/:level/countdown` | Public | Time remaining (seconds) for current phase |
| GET | `/tournaments/:level/winners` | Public | Current and past winners for a level |

---

## Smart Contracts (Fuji Testnet)

| Contract | Address | Role in Phase 4 |
|----------|---------|-----------------|
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | 3rd place prize transfers |

### Platform Wallets

| Wallet | Address | Role in Phase 4 |
|--------|---------|-----------------|
| Prize Pool | `0xc81f02e4bba2f891e5d831f2dddd9edd61f3f92e` | Sends AVAX to 1st/2nd place winners |
| Rewards | `0xcb7ba57b0e2613b3e220b191ca01e603c375dfb5` | Sends $BATTLE to 3rd place winners |

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `controllers/battlegroundController.js` | 6 public tournament query endpoints |
| `services/prizeService.js` | Prize calculation, distribution, and retry logic |
| `jobs/tournamentJob.js` | Tournament lifecycle state machine (every hour) |
| `jobs/failedPayoutJob.js` | Failed payout retry (every 6 hours) |
| `jobs/syncScoresJob.js` | Extended to upsert WeeklyLeaderboard + emit Socket.IO |
| `config/socketio.js` | Socket.IO initialization + /tournaments namespace |
| `utils/weekUtils.js` | `getWeekInfo()` shared by syncScoresJob and tournamentJob |
| `utils/discordService.js` | `sendDiscordAlert()` + `sendLeaderboardNotification()` |
| `models/tournamentModel.js` | Tournament state machine schema |
| `models/weeklyLeaderboardModel.js` | Per-user per-week per-level score tracking |
| `models/leaderboardHistoryModel.js` | Archived tournament results |
| `models/failedPayoutModel.js` | Failed prize payout tracking |

---

## Dependencies on Previous Phases

| Dependency | From Phase | Used By |
|------------|-----------|---------|
| `syncScoresJob` | Phase 1 | Extended to upsert WeeklyLeaderboard + emit Socket.IO events |
| `User` model (uid, address, score) | Phase 1 | Score tracking, winner address lookup |
| `Wallet` model (AES-encrypted keys) | Phase 0 | Prize pool + rewards wallet key decryption |
| `Transaction` model | Phase 0 | Recording prize payout transactions |
| `Settings` model (prizePools, tournamentSchedule) | Phase 0 | Prize pool amounts per level, schedule config |
| `contractUtils.js` (transferBattleTokens, getBattleBalance) | Phase 0/2 | $BATTLE prize transfers |
| `avaxUtils.js` (sendAvax, getAvaxBalance) | Phase 0 | AVAX prize transfers |
| `cryptUtils.js` (decrypt) | Phase 0 | Wallet key decryption |
| `config/constants.js` (PRIZE_DISTRIBUTION, BATTLE_PRIZES_PER_LEVEL, MAX_LEVEL) | Phase 0 | Prize calculation, level validation |
| `antiCheat.js` (threat scoring) | Phase 1 | Score validation in syncScoresJob before leaderboard updates |
