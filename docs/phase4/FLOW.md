# Phase 4: Battleground + Leaderboard - Flow Documentation

## What Phase 4 Covers

Phase 4 implements weekly tournaments at 7 difficulty levels, automated prize distribution (AVAX + $BATTLE), real-time leaderboard via Socket.IO, and Discord webhook notifications.

---

## Architecture Diagram

```
+--------------------------------------------------------------------+
|                     FRONTEND (React)                                |
|                                                                     |
|  1. View tournament tiers  -> GET /tournaments                     |
|  2. View tier detail       -> GET /tournaments/:level              |
|  3. View leaderboard       -> GET /tournaments/:level/leaderboard  |
|  4. View countdown         -> GET /tournaments/:level/countdown    |
|  5. View past winners      -> GET /tournaments/:level/winners      |
|  6. View history           -> GET /tournaments/history             |
|  7. Real-time updates      -> Socket.IO /tournaments namespace     |
|                                                                     |
|  ALL ENDPOINTS ARE PUBLIC (no auth required)                       |
+------------------------------+-------------------------------------+
                               |
                               v
+--------------------------------------------------------------------+
|                     CHAINBOIS API                                   |
|                                                                     |
|  Battleground Controller (6 public endpoints)                      |
|                                                                     |
|  Background Jobs:                                                   |
|  +------------------+  +-------------------+  +------------------+ |
|  | tournamentJob    |  | syncScoresJob     |  | failedPayoutJob  | |
|  | (every hour)     |  | (every 5 min)     |  | (every 6 hours)  | |
|  |                  |  |                   |  |                  | |
|  | Create upcoming  |  | Firebase -> Mongo |  | Retry failed     | |
|  | Activate on time |  | Score deltas      |  | prize payouts    | |
|  | End + distribute |  | WeeklyLeaderboard |  |                  | |
|  | Complete cooldown|  | Socket.IO emit    |  |                  | |
|  +------------------+  +-------------------+  +------------------+ |
|                                                                     |
|  Socket.IO (/tournaments namespace)                                |
|  - leaderboard:update (on score sync)                              |
|  - tournament:started (on activation)                              |
|  - tournament:ended (on completion, includes winners)              |
+--------------------------------------------------------------------+
         |                    |                     |
         v                    v                     v
  +-----------+       +-------------+       +-------------+
  | MongoDB   |       | Avalanche   |       | Discord     |
  |           |       | C-Chain     |       | Webhooks    |
  | Tournament|       |             |       |             |
  | Weekly LB |       | sendAvax()  |       | Winners     |
  | LB History|       | transfer    |       | Low balance |
  | Failed    |       |  Battle()   |       | Failed pay  |
  |  Payouts  |       |             |       |             |
  +-----------+       +-------------+       +-------------+
```

---

## Tournament Lifecycle

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

### Tournament Schedule
- **Start**: Wednesday 12:00 PM EST (17:00 UTC)
- **Duration**: 120 hours (5 days) -> ends Monday 12:00 PM EST
- **Cooldown**: 48 hours -> ends Wednesday 12:00 PM EST
- **Cycle**: Weekly, all 7 levels run simultaneously

### Cron Job Logic (Every Hour)
1. **Create upcoming**: If no upcoming/active tournament exists for a level, create one for next Wednesday
2. **Activate**: Set status to "active" when `startTime <= now`
3. **End + distribute**: When `endTime <= now`, call `prizeService.distributePrizes()`
4. **Complete**: When `cooldownEndTime <= now`, set to "completed" (frees level for next tournament)

---

## Prize Distribution Flow

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
  - prize_pool wallet -> sendAvax() -> winner address
  - Amount: prizePool * 50% (PRIZE_DISTRIBUTION.FIRST)

2nd Place (AVAX):
  - prize_pool wallet -> sendAvax() -> winner address
  - Amount: prizePool * 35% (PRIZE_DISTRIBUTION.SECOND)

3rd Place ($BATTLE):
  - rewards wallet -> transferBattleTokens() -> winner address
  - Amount: BATTLE_PRIZES_PER_LEVEL[level] (fixed per level)

For each payout:
  - Decrypt wallet key from MongoDB
  - Check balance sufficient
  - If insufficient: create FailedPayout + Discord alert
  - If success: record Transaction, update tournament.winners[]
  - Create LeaderboardHistory record
  - Send Discord winner notification
```

---

## Score Sync Flow (How Leaderboard Gets Populated)

```
Unity Game                Firebase RTDB              API (syncScoresJob)         MongoDB
    |                         |                           |                        |
    | Player gets score       |                           |                        |
    |  in game session        |                           |                        |
    |------------------------>|                           |                        |
    |  writes Score: 5000     |                           |                        |
    |                         |                           |                        |
    |                         |  Every 5 min cron polls   |                        |
    |                         |<--------------------------|                        |
    |                         |  Read users/{uid}/Score   |                        |
    |                         |-------------------------->|                        |
    |                         |                           |                        |
    |                         |                           | Calculate delta         |
    |                         |                           | Firebase 5000 -         |
    |                         |                           | MongoDB 4500 = 500      |
    |                         |                           |                        |
    |                         |                           | Anti-cheat validate     |
    |                         |                           | (cap, velocity, daily)  |
    |                         |                           |                        |
    |                         |                           | Update User             |
    |                         |                           | score, pointsBalance   |
    |                         |                           |----------------------->|
    |                         |                           |                        |
    |                         |                           | Upsert Weekly LB       |
    |                         |                           | (tournament's week/yr) |
    |                         |                           |----------------------->|
    |                         |                           |                        |
    |                         |                           | Create ScoreChange     |
    |                         |                           |----------------------->|
    |                         |                           |                        |
    |                         |                           | Emit Socket.IO         |
    |                         |                           | leaderboard:update     |
```

### Critical: Tournament-Linked Scores
The `syncScoresJob` queries active tournaments and uses the tournament's stored `weekNumber`/`year` (not calendar week) when upserting `WeeklyLeaderboard`. This ensures scores during a tournament window land in the correct bucket regardless of calendar week boundaries.

---

## Socket.IO Events

| Event | Emitted When | Data |
|-------|-------------|------|
| `leaderboard:update` | After score sync changes a level's leaderboard | `{ level, leaderboard: [top10] }` |
| `tournament:started` | Tournament status changes to "active" | `{ level, startTime, endTime }` |
| `tournament:ended` | Tournament ends, prizes distributed | `{ level, winners: [...] }` |

**Namespace**: `/tournaments`
**Rooms**: `level:1` through `level:7` (client joins specific level rooms)

---

## Failed Payout Retry

```
failedPayoutJob (every 6 hours)
        |
        v
Query FailedPayout where resolved: false AND retryCount < 5
        |
        v
For each failed payout:
  - AVAX: sendAvax() from prize_pool wallet
  - $BATTLE: transferBattleTokens() from rewards wallet
  - Success: resolved = true, save resolvedTxHash
  - Failure: retryCount++
  - If retryCount >= 5: critical Discord alert
```

---

## Key Files

| File | Purpose |
|------|---------|
| `controllers/battlegroundController.js` | 6 public tournament endpoints |
| `services/prizeService.js` | Prize calculation + distribution + retry |
| `jobs/tournamentJob.js` | Tournament lifecycle cron (every hour) |
| `jobs/failedPayoutJob.js` | Retry failed payouts (every 6 hours) |
| `jobs/syncScoresJob.js` | Firebase -> MongoDB score sync (every 5 min) |
| `config/socketio.js` | Socket.IO init + tournament namespace |
| `utils/weekUtils.js` | Shared getWeekInfo() utility |
