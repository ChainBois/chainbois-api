# Phase 4: Battleground + Leaderboard - Frontend API Reference

Base URL: `https://test-2.ghettopigeon.com/api/v1`

All tournament/leaderboard endpoints are **public** (no auth required).

---

## 1. List All Tournaments

**`GET /tournaments`**

Returns all 7 tournament levels with current status, prize pools, and player counts.

### Response (200)
```json
{
  "success": true,
  "data": [
    {
      "level": 1,
      "status": "active",
      "startTime": "2026-03-11T17:00:00.000Z",
      "endTime": "2026-03-16T17:00:00.000Z",
      "cooldownEndTime": "2026-03-18T17:00:00.000Z",
      "prizePool": 2,
      "prizeDistribution": {
        "first": 1,
        "second": 0.7,
        "third": 0,
        "thirdBattle": 100
      },
      "playerCount": 12,
      "rank": "Corporal"
    },
    {
      "level": 2,
      "status": "upcoming",
      "startTime": "2026-03-11T17:00:00.000Z",
      "endTime": "2026-03-16T17:00:00.000Z",
      "cooldownEndTime": "2026-03-18T17:00:00.000Z",
      "prizePool": 4,
      "prizeDistribution": {
        "first": 2,
        "second": 1.4,
        "third": 0,
        "thirdBattle": 200
      },
      "playerCount": 0,
      "rank": "Sergeant"
    }
  ]
}
```

### Tournament Statuses
| Status | Meaning |
|--------|---------|
| `upcoming` | Tournament scheduled, not yet started |
| `active` | Tournament in progress, scores accumulating |
| `cooldown` | Tournament ended, winners determined, next one pending |
| `completed` | Fully archived |
| `none` | No tournament created for this level yet |

---

## 2. Tournament Detail

**`GET /tournaments/:level`**

Returns full details for a tournament level including top 10 leaderboard.

### Request
```
GET /tournaments/1
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "level": 1,
    "status": "active",
    "startTime": "2026-03-11T17:00:00.000Z",
    "endTime": "2026-03-16T17:00:00.000Z",
    "cooldownEndTime": "2026-03-18T17:00:00.000Z",
    "prizePool": 2,
    "prizeDistribution": {
      "first": 1,
      "second": 0.7,
      "third": 0,
      "thirdBattle": 100
    },
    "winners": [],
    "playerCount": 12,
    "rank": "Corporal",
    "leaderboard": [
      {
        "rank": 1,
        "uid": "abc123",
        "username": "TopPlayer",
        "highScore": 4500,
        "totalScore": 12000,
        "gamesPlayed": 8
      }
    ]
  }
}
```

### Errors
| Status | Message |
|--------|---------|
| 400 | Invalid level. Must be 1-7 |
| 404 | No tournament found for level X |

---

## 3. Tournament Leaderboard

**`GET /tournaments/:level/leaderboard`**

Paginated leaderboard for a tournament level.

### Query Parameters
| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `limit` | 10 | 100 | Results per page |
| `page` | 1 | - | Page number |

### Request
```
GET /tournaments/1/leaderboard?limit=20&page=1
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "level": 1,
    "leaderboard": [
      {
        "rank": 1,
        "uid": "abc123",
        "username": "TopPlayer",
        "highScore": 4500,
        "totalScore": 12000,
        "gamesPlayed": 8
      }
    ],
    "totalPlayers": 42,
    "page": 1,
    "totalPages": 3
  }
}
```

---

## 4. Tournament Countdown

**`GET /tournaments/:level/countdown`**

Returns time remaining for the current tournament phase.

### Response (200)
```json
{
  "success": true,
  "data": {
    "level": 1,
    "status": "active",
    "timeRemaining": 172800,
    "startTime": "2026-03-11T17:00:00.000Z",
    "endTime": "2026-03-16T17:00:00.000Z",
    "cooldownEndTime": "2026-03-18T17:00:00.000Z"
  }
}
```

`timeRemaining` is in **seconds**:
- `upcoming`: seconds until tournament starts
- `active`: seconds until tournament ends
- `cooldown`: seconds until cooldown ends

---

## 5. Tournament Winners

**`GET /tournaments/:level/winners`**

Current and historical winners for a tournament level.

### Query Parameters
| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `weeks` | 4 | 12 | Number of weeks of history |

### Response (200)
```json
{
  "success": true,
  "data": {
    "level": 1,
    "current": {
      "weekNumber": 10,
      "year": 2026,
      "winners": [
        {
          "rank": 1,
          "address": "0x1234...",
          "username": "Winner1",
          "points": 4500,
          "paid": true,
          "txHash": "0xabc...",
          "paidAt": "2026-03-16T17:05:00.000Z"
        },
        {
          "rank": 2,
          "address": "0x5678...",
          "username": "RunnerUp",
          "points": 3200,
          "paid": true,
          "txHash": "0xdef...",
          "paidAt": "2026-03-16T17:05:30.000Z"
        },
        {
          "rank": 3,
          "address": "0x9abc...",
          "username": "ThirdPlace",
          "points": 2100,
          "paid": true,
          "txHash": "0xghi...",
          "paidAt": "2026-03-16T17:06:00.000Z"
        }
      ],
      "prizePool": 2
    },
    "history": [
      {
        "weekNumber": 9,
        "year": 2026,
        "winners": [],
        "totalPayout": 1.7
      }
    ]
  }
}
```

---

## 6. Tournament History

**`GET /tournaments/history`**

Paginated historical tournament data across all levels.

### Query Parameters
| Param | Default | Max | Description |
|-------|---------|-----|-------------|
| `limit` | 20 | 100 | Results per page |
| `page` | 1 | - | Page number |
| `level` | - | - | Filter by tournament level (1-7) |

### Response (200)
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "year": 2026,
        "weekNumber": 10,
        "tournamentLevel": 1,
        "winners": [
          {
            "rank": 1,
            "address": "0x1234...",
            "username": "Winner1",
            "highScore": 4500,
            "prizeAmount": 1,
            "prizeCurrency": "AVAX",
            "txHash": "0xabc..."
          }
        ],
        "totalPayout": 1.7
      }
    ],
    "total": 5,
    "page": 1,
    "totalPages": 1
  }
}
```

---

## Global Leaderboard (from Phase 1)

These endpoints were already implemented and remain unchanged.

**`GET /leaderboard`** | **`GET /leaderboard/:period`**

Periods: `30min`, `1hour`, `24hours`, `2days`, `week`, `month`, `year`, `all`

**`GET /leaderboard/rank/:uid`** (requires auth: `Authorization: Bearer <idToken>`)

---

## Prize Distribution

| Level | Rank | 1st (AVAX) | 2nd (AVAX) | 3rd ($BATTLE) | Total Pool |
|-------|------|-----------|-----------|---------------|------------|
| 1 | Corporal | 1.0 | 0.7 | 100 | 2 AVAX |
| 2 | Sergeant | 2.0 | 1.4 | 200 | 4 AVAX |
| 3 | Captain | 3.0 | 2.1 | 300 | 6 AVAX |
| 4 | Major | 4.0 | 2.8 | 400 | 8 AVAX |
| 5 | Colonel | 5.0 | 3.5 | 500 | 10 AVAX |
| 6 | Major General | 6.0 | 4.2 | 600 | 12 AVAX |
| 7 | Field Marshal | 7.0 | 4.9 | 700 | 14 AVAX |

- 1st and 2nd place receive AVAX from the prize pool wallet
- 3rd place receives $BATTLE tokens from the rewards wallet (fixed amounts)
- Prizes are auto-distributed at tournament end (no manual claiming)
- Failed payouts are automatically retried every 6 hours

---

## Tournament Schedule

| Event | Time (EST) | UTC |
|-------|-----------|-----|
| Start | Wednesday 12:00 PM | Wednesday 17:00 |
| End | Monday 12:00 PM | Monday 17:00 |
| Cooldown End | Wednesday 12:00 PM | Wednesday 17:00 |

- Duration: 5 days (120 hours)
- Cooldown: 2 days (48 hours)
- All 7 levels run simultaneously
- Level 0 (Private) NFTs are **not eligible** for any tournament

---

## Real-Time Updates (Socket.IO)

Connect to the `/tournaments` namespace for real-time leaderboard and tournament events.

### Connection
```javascript
import { io } from "socket.io-client";

const socket = io("https://test-2.ghettopigeon.com/tournaments");

// Subscribe to a specific tournament level
socket.emit("join:level", 1);

// Listen for leaderboard updates (every 5 min during active tournaments)
socket.on("leaderboard:update", (data) => {
  // { level: 1, leaderboard: [{ rank, uid, username, highScore, totalScore, gamesPlayed }] }
  console.log("Leaderboard update:", data);
});

// Listen for tournament lifecycle events
socket.on("tournament:started", (data) => {
  // { level, startTime, endTime, prizePool }
  console.log("Tournament started:", data);
});

socket.on("tournament:ended", (data) => {
  // { level, winners: [{ rank, address, username, points, paid, txHash }] }
  console.log("Tournament ended:", data);
});

// Unsubscribe from a level
socket.emit("leave:level", 1);
```

---

## Key Addresses

| Wallet | Address | Purpose |
|--------|---------|---------|
| Prize Pool | `0xc81F02E4bbA2F891E5D831f2dDDD9eDD61F3F92e` | AVAX prizes (1st/2nd) |
| Rewards | TBD (run `node scripts/generateWallets.js`) | $BATTLE prizes (3rd) |
| ChainBoisNFT | `0xB2FDDb56D85073BCBE245D46dbC1BE4D4541305b` | NFT contract |
| BattleToken | `0xcC704c908A37A78d944a8310F8ebc0c0456CbeC0` | $BATTLE ERC-20 |

---

## TypeScript Types

```typescript
interface TournamentSummary {
  level: number;
  status: "upcoming" | "active" | "cooldown" | "completed" | "none";
  startTime: string | null;
  endTime: string | null;
  cooldownEndTime: string | null;
  prizePool: number;
  prizeDistribution: {
    first: number;   // AVAX
    second: number;  // AVAX
    third: number;   // Always 0 (3rd gets $BATTLE)
    thirdBattle: number; // $BATTLE amount
  };
  playerCount: number;
  rank: string;
}

interface TournamentDetail extends TournamentSummary {
  winners: TournamentWinner[];
  leaderboard: LeaderboardEntry[];
}

interface TournamentWinner {
  rank: number;
  address: string;
  username: string;
  points: number;
  paid: boolean;
  txHash: string;
  paidAt: string | null;
}

interface LeaderboardEntry {
  rank: number;
  uid: string;
  username: string;
  highScore: number;
  totalScore: number;
  gamesPlayed: number;
}

interface CountdownData {
  level: number;
  status: string;
  timeRemaining: number; // seconds
  startTime: string;
  endTime: string;
  cooldownEndTime: string;
}

interface TournamentHistory {
  year: number;
  weekNumber: number;
  tournamentLevel: number;
  winners: HistoryWinner[];
  totalPayout: number; // AVAX only
}

interface HistoryWinner {
  rank: number;
  address: string;
  username: string;
  highScore: number;
  prizeAmount: number;
  prizeCurrency: "AVAX" | "BATTLE";
  txHash: string;
}
```
