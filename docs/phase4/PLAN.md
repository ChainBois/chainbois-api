# Phase 4: Battleground + Leaderboard - Implementation Plan

## Context

Phase 3 (Training Room) is complete. The leaderboard controller and routes are already implemented (time-filtered queries via ScoreChange aggregation). All models needed for Phase 4 exist as placeholders. Score syncing from Firebase is running (5min cron). Discord service has both alert and leaderboard notification functions ready.

**Key constraint**: $BATTLE token has fixed supply, stored in a rewards wallet. Use `transferBattleTokens()` from rewards wallet, NOT `mintBattleTokens()`.

**Note on $BATTLE decimals**: The BattleToken.sol contract inherits from OpenZeppelin ERC20 without overriding `decimals()`, so it uses the default 18 decimals. The `contractUtils.js` functions (`formatEther`/`parseEther`) are therefore correct. The `BATTLE_TOKEN_DECIMALS: 6` in `constants.js` is stale and should be corrected to 18 as a pre-task.

---

## What Already Exists

| Component | Status | Notes |
|-----------|--------|-------|
| Tournament model | EXISTS | level, status, times, prizePool, winners |
| WeeklyLeaderboard model | EXISTS | uid, address, tournamentLevel, year, weekNumber, highScore, totalScore |
| LeaderboardHistory model | EXISTS | weekNumber, tournamentLevel, winners[], totalPayout (**needs year field**) |
| FailedPayout model | EXISTS | address, amount, currency, reason, retryCount, resolved |
| ScoreChange model | EXISTS | uid, score, scoreChange, timestamp (granular for time filters) |
| GameSession model | EXISTS | uid, sessionId, score, kills |
| Leaderboard controller | EXISTS | getLeaderboard (time-filtered), getUserRank |
| Leaderboard routes | EXISTS | GET /, GET /:period, GET /rank/:uid |
| Battleground routes | PLACEHOLDER | All return 501, mounted at /api/v1/tournaments |
| Discord service | EXISTS | sendDiscordAlert, sendLeaderboardNotification (`utils/discordService.js`) |
| syncScoresJob | EXISTS | Firebase -> MongoDB + WeeklyLeaderboard + ScoreChange |
| contractUtils | EXISTS | transferBattleTokens, getBattleBalance (18 decimals, correct) |
| avaxUtils | EXISTS | sendAvax, getAvaxBalance |
| Settings model | EXISTS | tournamentSchedule, prizePools (Map) |
| Constants | EXISTS | TOURNAMENT, PRIZE_POOLS, PRIZE_DISTRIBUTION, TOURNAMENT_STATUS |
| socket.io | DEPENDENCY | In package.json but not wired up |
| Redis | EXISTS | Config + client ready |
| Wallet model | EXISTS | role enum: ["admin", "prize_pool", "nft_store", "weapon_store", "deployer", "test"] |

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `config/constants.js` | MODIFY | Add WALLET_ROLES.REWARDS, fix BATTLE_TOKEN_DECIMALS to 18, add BATTLE_PRIZES_PER_LEVEL |
| `models/walletModel.js` | MODIFY | Add "rewards" to role enum |
| `models/tournamentModel.js` | MODIFY | Add weekNumber + year fields for reliable prize queries |
| `models/leaderboardHistoryModel.js` | MODIFY | Add year field, update unique index |
| `models/failedPayoutModel.js` | MODIFY | Add tournamentId for traceability |
| `models/settingsModel.js` | MODIFY | Fix battleTokenDecimals default 6 -> 18 |
| `scripts/generateWallets.js` | MODIFY | Add rewards to PLATFORM_WALLETS |
| `utils/weekUtils.js` | CREATE | Shared getWeekInfo() used by syncScoresJob + tournament job |
| `services/prizeService.js` | CREATE | Prize calculation + distribution logic (AVAX + $BATTLE) |
| `controllers/battlegroundController.js` | CREATE | Tournament endpoints (6 endpoints) |
| `routes/battlegroundRoutes.js` | MODIFY | Replace placeholders with real controller |
| `jobs/tournamentJob.js` | CREATE | Tournament lifecycle cron |
| `jobs/failedPayoutJob.js` | CREATE | Retry failed prize payouts |
| `config/socketio.js` | CREATE | Socket.IO server init with singleton getIO/setIO pattern |
| `server.js` | MODIFY | Add Socket.IO init, tournament cron, failed payout retry cron |
| `jobs/syncScoresJob.js` | MODIFY | Extract getWeekInfo to shared util, emit Socket.IO leaderboard updates |
| `docs/phase4/FRONTEND_API.md` | CREATE | Frontend API reference |
| `docs/phase4/POSTMAN_COLLECTION.json` | CREATE | Postman collection |

---

## Pre-Task: Fix Existing Issues

Before implementing Phase 4, fix these pre-existing issues:

1. **Fix `BATTLE_TOKEN_DECIMALS`**: Change from 6 to 18 in `config/constants.js` (contract uses OZ default 18). Also fix `settingsModel.js` default from 6 to 18.
2. **Add `year` field to LeaderboardHistory model**: Add `year: { type: Number, required: true }` and update unique index to `{ year: 1, weekNumber: -1, tournamentLevel: 1 }`.
3. **Add `weekNumber` and `year` to Tournament model**: So prize distribution always queries the correct leaderboard entries regardless of when the cron fires.

### Critical Design Fix: Tournament-Linked Scores

The calendar-based `getWeekInfo()` week boundaries do NOT align with the Wed-Mon tournament schedule. Depending on the year, scores from Saturday-Monday could land in a different week number than Wednesday-Friday scores, causing prize distribution to miss ~50% of tournament scores.

**Solution**: `syncScoresJob` must derive `weekNumber`/`year` from the **active tournament** for each user's level, not from the calendar. Steps:
1. At the start of each sync cycle, query all active tournaments: `Tournament.find({ status: "active" })`
2. Build a level-to-tournament map: `{ [level]: { weekNumber, year } }`
3. When upserting WeeklyLeaderboard, use the tournament's stored `weekNumber`/`year` (set at tournament creation from its `startTime`)
4. If no active tournament exists for a user's level, skip the WeeklyLeaderboard upsert (scores still saved to User + ScoreChange)

This ensures all scores during a tournament window land in the same weekNumber bucket, regardless of calendar week boundaries.

---

## Task 1: Constants + Model Updates

### `config/constants.js`
- Add `REWARDS: "rewards"` to `WALLET_ROLES`
- Fix `BATTLE_TOKEN_DECIMALS: 18`
- Add `BATTLE_PRIZES_PER_LEVEL` map — fixed $BATTLE amounts for 3rd place per level:
  ```javascript
  BATTLE_PRIZES_PER_LEVEL: {
    1: 100,    // Level 1: 100 $BATTLE
    2: 200,    // Level 2: 200 $BATTLE
    3: 300,    // etc.
    4: 400,
    5: 500,
    6: 600,
    7: 700,
  },
  ```
  This eliminates the need for an AVAX-to-$BATTLE exchange rate. 3rd place gets fixed $BATTLE, not AVAX-equivalent. (Configurable in Settings if needed later.)

### `models/walletModel.js`
- Add `"rewards"` to the role enum array

### `models/tournamentModel.js`
- Add `weekNumber: { type: Number, required: true }`
- Add `year: { type: Number, required: true }`
- Add index `{ year: 1, weekNumber: 1, level: 1 }`
- Update `prizeDistribution` sub-schema: add `thirdBattle: { type: Number, default: 0 }` to clearly distinguish AVAX prizes (first/second) from $BATTLE prize (thirdBattle)

### `models/leaderboardHistoryModel.js`
- Add `year: { type: Number, required: true }`
- Update unique index to `{ year: 1, weekNumber: -1, tournamentLevel: 1 }`

### `models/failedPayoutModel.js`
- Add `tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament", default: null }` for traceability

### `scripts/generateWallets.js`
- Add `{ role: "rewards" }` to `PLATFORM_WALLETS` array

---

## Task 2: Shared Week Utility

**Create**: `utils/weekUtils.js`

Extract `getWeekInfo()` from `syncScoresJob.js` into a shared utility. Also add `getWeekInfoFromDate(date)` for deriving week number from a specific date (used when creating tournaments from their startTime):

```javascript
const getWeekInfo = function (date) {
  const d = date || new Date();
  const startOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return { weekNumber, year: d.getFullYear() };
};

module.exports = { getWeekInfo };
```

**Modify**: `jobs/syncScoresJob.js`:
- Replace inline `getWeekInfo` with import from `utils/weekUtils.js`
- **Critical change**: Query active tournaments at start of sync cycle, build level-to-tournament map, use tournament's stored weekNumber/year when upserting WeeklyLeaderboard (see Pre-Task design fix)

---

## Task 3: Prize Distribution Service

**Create**: `services/prizeService.js`

### `distributePrizes(tournament)`

1. Get top 3 from `WeeklyLeaderboard` for `tournament.year`, `tournament.weekNumber`, `tournament.level`, sorted by `highScore` desc
2. If no players, skip (mark tournament completed with empty winners)
3. If fewer than 3 players, distribute to whoever played (skip empty positions)
4. **1st place (AVAX)**: `tournament.prizePool * PRIZE_DISTRIBUTION.FIRST`
   - Lookup prize_pool wallet: `Wallet.findOne({ role: WALLET_ROLES.PRIZE_POOL }).select("+key +iv")`
   - Decrypt key: `const prizePoolKey = await decrypt(wallet.key, wallet.iv)`
   - Check balance: `const balance = await getAvaxBalance(wallet.address)`
   - If sufficient: `const receipt = await sendAvax(prizePoolKey, winner.address, String(amount))`
   - If insufficient: create FailedPayout + Discord alert via `sendDiscordAlert()`
5. **2nd place (AVAX)**: Same as 1st with different percentage
6. **3rd place ($BATTLE)**: Fixed amount from `BATTLE_PRIZES_PER_LEVEL[tournament.level]`
   - Lookup rewards wallet: `Wallet.findOne({ role: WALLET_ROLES.REWARDS }).select("+key +iv")`
   - Decrypt key: `const rewardsKey = await decrypt(wallet.key, wallet.iv)`
   - Check balance: `const balance = await getBattleBalance(wallet.address)`
   - If sufficient: `const receipt = await transferBattleTokens(winner.address, amount, rewardsKey)`
   - If insufficient: create FailedPayout + Discord alert
7. Record each successful payout as Transaction with type `TRANSACTION_TYPES.PRIZE_PAYOUT`
8. Update `tournament.winners[]` with `{ rank, address, username, points, paid, txHash, paidAt }`
9. Save tournament with `status: "cooldown"`
10. Create LeaderboardHistory record (with `year` field)
11. Send Discord notification via `sendLeaderboardNotification()`
12. Return results summary

### `retryFailedPayouts()`

1. Find all `FailedPayout` where `resolved: false` and `retryCount < 5`
2. For each:
   - If `currency === "AVAX"`: use `sendAvax()` from prize_pool wallet
   - If `currency === "BATTLE"`: use `transferBattleTokens()` from rewards wallet
3. On success: `resolved = true`, set `resolvedTxHash`, create Transaction record
4. On failure: `retryCount++`, `lastRetry = new Date()`
5. If `retryCount >= 5`: send critical Discord alert

---

## Task 4: Tournament Lifecycle Cron Job

**Create**: `jobs/tournamentJob.js`

Runs **every hour**. Manages the full tournament lifecycle for all 7 levels.

### Tournament Schedule (from Settings)
- **Start**: Wednesday 12:00 PM EST (17:00 UTC)
- **Duration**: 120 hours (5 days) -> ends Monday 12:00 PM EST
- **Cooldown**: 48 hours -> ends Wednesday 12:00 PM EST
- **Cycle**: Weekly, 7 levels run simultaneously

### Lifecycle Steps

Each run checks all 7 levels:

**Step 1: Create upcoming tournaments**
- For each level 1-7, check if a tournament with `status: "upcoming"` or `status: "active"` exists
- If not, calculate the next Wednesday 12 PM EST from now
- Create tournament with:
  - `status: "upcoming"`
  - `startTime`, `endTime`, `cooldownEndTime` calculated
  - `prizePool` from `settings.prizePools.get(String(level))`
  - `prizeDistribution` calculated from `PRIZE_DISTRIBUTION` percentages + `BATTLE_PRIZES_PER_LEVEL`
  - `weekNumber` and `year` from start time (not current time)
  - `winners: []`

**Step 2: Activate tournaments**
- `Tournament.find({ status: "upcoming", startTime: { $lte: now } })`
- Set `status = "active"` for each
- Emit Socket.IO event: `tournament:started`

**Step 3: End tournaments + distribute prizes**
- `Tournament.find({ status: "active", endTime: { $lte: now } })`
- For each: call `prizeService.distributePrizes(tournament)`
- Emit Socket.IO event: `tournament:ended` with winners

**Step 4: Complete cooldown**
- `Tournament.find({ status: "cooldown", cooldownEndTime: { $lte: now } })`
- Set `status = "completed"` for each
- This frees the level for Step 1 to create the next tournament

### Next Wednesday Calculation

```javascript
const getNextWednesday = function (fromDate) {
  const d = new Date(fromDate);
  const day = d.getUTCDay(); // 0=Sun, 3=Wed
  const daysUntilWed = (3 - day + 7) % 7;

  if (daysUntilWed === 0) {
    // Today IS Wednesday - check if start time hasn't passed yet
    d.setUTCHours(17, 0, 0, 0); // 12 PM EST = 17:00 UTC
    if (d > fromDate) return d; // Still before start time today
    // Already passed today's start, go to next week
    d.setUTCDate(d.getUTCDate() + 7);
    return d;
  }

  d.setUTCDate(d.getUTCDate() + daysUntilWed);
  d.setUTCHours(17, 0, 0, 0);
  return d;
};
```

### Cron Re-entry Guard

Add a module-level `let isRunning = false` flag to prevent overlapping executions if blockchain calls are slow:

```javascript
let isRunning = false;
const tournamentJob = async function () {
  if (isRunning) return;
  isRunning = true;
  try { /* ... lifecycle steps ... */ }
  finally { isRunning = false; }
};
```

### Registration in `server.js`

```javascript
cron.schedule("0 * * * *", tournamentJob); // Every hour
```

---

## Task 5: Failed Payout Retry Job

**Create**: `jobs/failedPayoutJob.js`

Simple wrapper that calls `prizeService.retryFailedPayouts()`. Runs every 6 hours.

```javascript
cron.schedule("0 */6 * * *", failedPayoutJob); // Every 6 hours
```

---

## Task 6: Battleground Controller

**Create**: `controllers/battlegroundController.js`

All endpoints are **PUBLIC** (no auth required per PRD).

Every endpoint that accepts `:level` validates: `const level = parseInt(req.params.level); if (isNaN(level) || level < 1 || level > MAX_LEVEL) return next(new AppError(..., 400))`.

### `GET /tournaments` -- List all tournament tiers

Find the latest tournament per level (prefer active/upcoming over completed):

```javascript
const tournaments = await Tournament.find({
  status: { $in: ["upcoming", "active", "cooldown"] }
}).sort({ level: 1 }).lean();
```

If a level has no active tournament, fill it from the most recent completed one (or return a placeholder).

For each tournament, also query the player count:
```javascript
const playerCount = await WeeklyLeaderboard.countDocuments({
  year: tournament.year,
  weekNumber: tournament.weekNumber,
  tournamentLevel: tournament.level
});
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "level": 1,
      "status": "active",
      "startTime": "...",
      "endTime": "...",
      "cooldownEndTime": "...",
      "prizePool": 2,
      "prizeDistribution": { "first": 1, "second": 0.7, "thirdBattle": 100 },
      "playerCount": 12
    }
  ]
}
```

### `GET /tournaments/:level` -- Tournament detail

Same as list but for single level + include top 10 leaderboard snapshot.

### `GET /tournaments/:level/leaderboard` -- Top players

Query `WeeklyLeaderboard` for the current active tournament's `year`+`weekNumber`+`level`:
```javascript
const entries = await WeeklyLeaderboard.find({
  year: tournament.year,
  weekNumber: tournament.weekNumber,
  tournamentLevel: level,
})
.sort({ highScore: -1 })
.limit(limit)
.lean();
```

Response: `{ leaderboard: [{ rank, uid, username, highScore, totalScore, gamesPlayed }] }`

### `GET /tournaments/:level/countdown` -- Time remaining

```json
{
  "success": true,
  "data": {
    "level": 1,
    "status": "active",
    "timeRemaining": 172800,
    "startTime": "...",
    "endTime": "..."
  }
}
```

### `GET /tournaments/:level/winners` -- Current/past winners

Return winners from the most recent completed tournament for this level + historical winners from LeaderboardHistory.

Query params: `?weeks=4` (default 4, max 12).

### `GET /tournaments/history` -- Historical data

Paginated LeaderboardHistory, sorted by weekNumber desc. Optional `?level=` filter.

---

## Task 7: Update Battleground Routes

**Modify**: `routes/battlegroundRoutes.js`

Replace all 501 placeholders:

```javascript
const battlegroundController = require("../controllers/battlegroundController");

// Static routes BEFORE parameterized
router.get("/", battlegroundController.listTournaments);
router.get("/history", battlegroundController.getHistory);

// Parameterized routes
router.get("/:level", battlegroundController.getTournamentDetail);
router.get("/:level/leaderboard", battlegroundController.getTournamentLeaderboard);
router.get("/:level/countdown", battlegroundController.getCountdown);
router.get("/:level/winners", battlegroundController.getWinners);
```

---

## Task 8: Socket.IO Integration

**Create**: `config/socketio.js`

Use a module-level singleton pattern (avoids `app.locals` fragility and circular imports):

```javascript
let io = null;

const initSocketIO = function (httpServer, allowedOrigins) {
  const { Server } = require("socket.io");
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  const tournamentNs = io.of("/tournaments");
  tournamentNs.on("connection", (socket) => {
    // Client joins a level room
    socket.on("join:level", (level) => {
      socket.join(`level:${level}`);
    });
    socket.on("leave:level", (level) => {
      socket.leave(`level:${level}`);
    });
  });

  return io;
};

const getIO = function () {
  return io;
};

module.exports = { initSocketIO, getIO };
```

### Integration points:
1. **server.js**: Parse `CORS_ORIGINS` env var directly (same logic as app.js) and call `initSocketIO(server, allowedOrigins)` after `app.listen()`
2. **syncScoresJob**: Import `getIO()`, after updating WeeklyLeaderboard, emit `leaderboard:update` to affected level rooms
3. **tournamentJob**: Import `getIO()`, emit `tournament:started` and `tournament:ended`
4. **server.js graceful shutdown**: Import `getIO()`, call `io.close()` before `server.close()`

---

## Task 9: Wire Up in server.js

**Modify**: `server.js`

1. After `app.listen()`, call `initSocketIO(server, allowedOrigins)` with the HTTP server instance
2. Register tournament cron: `cron.schedule("0 * * * *", tournamentJob)`
3. Register failed payout retry: `cron.schedule("0 */6 * * *", failedPayoutJob)`
4. In `gracefulShutdown()`: add `io.close()` before `server.close()` (import `getIO`)
5. Update console log for cron jobs list

---

## Task 10: Update syncScoresJob for Socket.IO

**Modify**: `jobs/syncScoresJob.js`

1. Import `getWeekInfo` from `utils/weekUtils.js` instead of inline function
2. Import `getIO` from `config/socketio.js`
3. After the main loop completes, if any scores were updated, emit `leaderboard:update` for affected tournament levels:

```javascript
if (updatedLevels.size > 0) {
  const io = getIO();
  if (io) {
    const ns = io.of("/tournaments");
    for (const level of updatedLevels) {
      // Fetch top 10 for this level
      const top10 = await WeeklyLeaderboard.find({
        year, weekNumber, tournamentLevel: level
      }).sort({ highScore: -1 }).limit(10).lean();
      ns.to(`level:${level}`).emit("leaderboard:update", { level, leaderboard: top10 });
    }
  }
}
```

Track `updatedLevels` as a Set during the main loop.

---

## Design Decision: tournamentLevel Lock

When a user levels up mid-tournament, their `tournamentLevel` in `WeeklyLeaderboard` changes for new score entries. This is **accepted behavior** for MVP:
- Users naturally promote to higher tournament tiers when they level up
- Their previous week's scores at the old level remain intact
- This matches the game design: leveling up gives access to higher-tier tournaments

If this needs to change later, we can lock the `tournamentLevel` to the first entry for that uid+week.

---

## Execution Order (respecting dependencies)

1. **Task 1**: Constants + model updates (no dependencies)
2. **Task 2**: Shared week utility (no dependencies)
3. **Task 3**: Prize service (depends on Tasks 1, 2)
4. **Task 6**: Battleground controller (depends on Task 1 for model changes)
5. **Task 7**: Update routes (depends on Task 6)
6. **Task 4**: Tournament cron job (depends on Tasks 2, 3)
7. **Task 5**: Failed payout retry job (depends on Task 3)
8. **Task 8**: Socket.IO config (independent)
9. **Task 9**: Wire up server.js (depends on Tasks 4, 5, 8)
10. **Task 10**: Update syncScoresJob (depends on Tasks 2, 8)
11. Review round 1
12. Tests
13. Documentation (FRONTEND_API.md, POSTMAN_COLLECTION.json)
14. Review round 2
15. Deploy + verify

---

## Existing Code to Reuse

| Function | File | Used For |
|----------|------|----------|
| `transferBattleTokens(to, amount, key)` | `utils/contractUtils.js` | 3rd place $BATTLE prize |
| `getBattleBalance(address)` | `utils/contractUtils.js` | Check rewards wallet balance |
| `sendAvax(fromKey, to, amount)` | `utils/avaxUtils.js` | 1st/2nd place AVAX prizes |
| `getAvaxBalance(address)` | `utils/avaxUtils.js` | Check prize pool balance |
| `decrypt(key, iv)` | `utils/cryptUtils.js` | Decrypt wallet keys for signing |
| `sendLeaderboardNotification()` | `utils/discordService.js` | Winner Discord notification |
| `sendDiscordAlert()` | `utils/discordService.js` | Low balance / failed payout alerts |
| `catchAsync` / `AppError` | `utils/` | Controller error handling |

---

## Verification Checklist

- [ ] Rewards wallet created via generateWallets.js
- [ ] Tournament cron creates upcoming tournaments for all 7 levels
- [ ] Tournaments transition: upcoming -> active -> cooldown -> completed
- [ ] Prize distribution sends AVAX to 1st/2nd from prize_pool wallet
- [ ] Prize distribution sends $BATTLE to 3rd from rewards wallet
- [ ] FailedPayout records created for insufficient balance
- [ ] Failed payouts retried and resolved
- [ ] Discord notifications sent for winners
- [ ] Discord alerts sent for low balance / failed payouts
- [ ] All 6 battleground endpoints return correct data
- [ ] Level parameter validation (1-7) on all :level routes
- [ ] Socket.IO emits events on tournament state changes
- [ ] Socket.IO emits leaderboard updates on score sync
- [ ] Socket.IO has proper CORS configuration
- [ ] Graceful shutdown closes Socket.IO connections
- [ ] WeeklyLeaderboard entries accumulate correctly
- [ ] LeaderboardHistory populated (with year) after tournament end
- [ ] Edge cases: 0 players, 1 player, 2 players
- [ ] Edge cases: insufficient AVAX or $BATTLE balance
- [ ] Tournament weekNumber/year stored at creation time
- [ ] Week numbers consistent between syncScoresJob and tournament queries
