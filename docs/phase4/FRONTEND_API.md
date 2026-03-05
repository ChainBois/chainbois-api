# ChainBois Phase 4 - Leaderboard Frontend API Reference

**Leaderboard and user rank endpoints.**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Endpoints](#2-endpoints)
3. [Type Definitions](#3-type-definitions)
4. [Integration Examples](#4-integration-examples)

---

## 1. Overview

The leaderboard system provides time-filtered score rankings. It supports:

- **All-time leaderboard** -- ranked by cumulative score (queries User model)
- **Time-period leaderboard** -- ranked by score gained within a window (queries ScoreChange model)
- **Custom date ranges** -- arbitrary start/end dates
- **User rank lookup** -- get a specific user's rank for any period
- **Pagination** -- configurable page size up to 500

### How Scores Work

- The Unity game writes cumulative scores to Firebase RTDB
- `syncScoresJob` (runs every 5 minutes) detects score changes and creates `ScoreChange` records
- Each `ScoreChange` records the delta (score gained) for that sync cycle
- Time-period leaderboards aggregate these deltas within the requested window
- All-time leaderboard uses the cumulative `score` field on the User model

---

## 2. Endpoints

### GET /leaderboard

Get the full leaderboard. Defaults to period `"all"` (all-time scores).

**Auth**: None (public)

**Response (200):**
```json
{
  "success": true,
  "period": "all",
  "startDate": null,
  "endDate": null,
  "currentPage": 1,
  "totalPages": 3,
  "totalUsers": 245,
  "leaderboard": [
    {
      "uid": "firebase_uid_1",
      "username": "TopPlayer",
      "scoreGained": 47200,
      "currentScore": 47200,
      "rank": 1
    },
    {
      "uid": "firebase_uid_2",
      "username": "RunnerUp",
      "scoreGained": 41800,
      "currentScore": 41800,
      "rank": 2
    }
  ]
}
```

---

### GET /leaderboard/:period

Get the leaderboard filtered by a time period. `scoreGained` reflects points earned within that window.

**Auth**: None (public)

| Param | Values |
|--------|--------------------------------------------------|
| period | `30min`, `1hour`, `24hours`, `2days`, `week`, `month`, `year`, `all` |

**Query Parameters:**

| Param | Type | Default | Notes |
|-----------|--------|---------|-------------------------------|
| limit | number | 100 | Results per page (max 500) |
| page | number | 1 | Page number |
| startDate | string | -- | ISO 8601 date (custom range) |
| endDate | string | -- | ISO 8601 date (custom range) |

If `startDate` and `endDate` are provided, they override the period's time window.

**Response (200):**
```json
{
  "success": true,
  "period": "24hours",
  "startDate": "2026-03-03T12:00:00.000Z",
  "endDate": "2026-03-04T12:00:00.000Z",
  "currentPage": 1,
  "totalPages": 1,
  "totalUsers": 42,
  "leaderboard": [
    {
      "uid": "firebase_uid_1",
      "username": "HotStreak",
      "scoreGained": 5200,
      "currentScore": 47200,
      "rank": 1
    }
  ]
}
```

**Errors:**
- `400`: "Invalid period. Valid periods: 30min, 1hour, 24hours, 2days, week, month, year, all"

**Example:**
```javascript
const getLeaderboard = async (period = "all", page = 1, limit = 100) => {
  const { data } = await api.get(`/leaderboard/${period}`, {
    params: { page, limit },
  });
  return data;
  // { success, period, startDate, endDate, currentPage, totalPages, totalUsers, leaderboard }
};

// Examples:
const allTime = await getLeaderboard("all");
const last24h = await getLeaderboard("24hours");
const weekly = await getLeaderboard("week", 1, 50);
```

---

### GET /leaderboard/rank/:uid

Get a specific user's rank on the leaderboard.

**Auth**: Firebase token required

| Param | Type | Notes |
|-------|--------|-------------------------------|
| uid | string | Firebase UID (URL parameter) |

**Query Parameters:**

| Param | Type | Default | Notes |
|--------|--------|---------|-------------------------------|
| period | string | "all" | Same period values as above |

**Response (200):**
```json
{
  "success": true,
  "uid": "firebase_uid",
  "period": "all",
  "rank": 15,
  "scoreGained": 12500,
  "currentScore": 12500
}
```

**Errors:**
- `400`: "Invalid period"
- `404`: "User not found"

**Example:**
```javascript
const getUserRank = async (uid, period = "all") => {
  const { data } = await api.get(`/leaderboard/rank/${uid}`, {
    params: { period },
  });
  return data;
  // { success, uid, period, rank, scoreGained, currentScore }
};

// Show user's rank on the dashboard
const myRank = await getUserRank(currentUser.uid, "week");
console.log(`You are ranked #${myRank.rank} this week`);
```

---

## 3. Type Definitions

```typescript
interface LeaderboardEntry {
  uid: string;
  username: string;
  scoreGained: number;
  currentScore: number;
  rank: number;
}

interface LeaderboardResponse {
  success: boolean;
  period: string;
  startDate: string | null;
  endDate: string | null;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  leaderboard: LeaderboardEntry[];
}

interface UserRankResponse {
  success: boolean;
  uid: string;
  period: string;
  rank: number;
  scoreGained: number;
  currentScore: number;
}
```

---

## 4. Integration Examples

### Leaderboard Page Component

```javascript
const LeaderboardPage = () => {
  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const result = await getLeaderboard(period, page, 50);
      setData(result);
    };
    fetchLeaderboard();
  }, [period, page]);

  const periods = ["30min", "1hour", "24hours", "2days", "week", "month", "year", "all"];

  return (
    <div>
      <h1>Leaderboard</h1>

      {/* Period selector */}
      <div>
        {periods.map(p => (
          <button
            key={p}
            onClick={() => { setPeriod(p); setPage(1); }}
            className={period === p ? "active" : ""}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Leaderboard table */}
      {data && (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>{period === "all" ? "Total Score" : "Score Gained"}</th>
            </tr>
          </thead>
          <tbody>
            {data.leaderboard.map(entry => (
              <tr key={entry.uid}>
                <td>#{entry.rank}</td>
                <td>{entry.username}</td>
                <td>{entry.scoreGained.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </button>
          <span>Page {data.currentPage} of {data.totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= data.totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};
```

### User Rank Widget

```javascript
const RankWidget = ({ uid }) => {
  const [rank, setRank] = useState(null);

  useEffect(() => {
    const fetchRank = async () => {
      const data = await getUserRank(uid, "week");
      setRank(data);
    };
    fetchRank();
  }, [uid]);

  if (!rank) return null;

  return (
    <div className="rank-widget">
      <h3>Your Weekly Rank</h3>
      <p className="rank-number">#{rank.rank}</p>
      <p>Score gained this week: {rank.scoreGained.toLocaleString()}</p>
    </div>
  );
};
```

### Custom Date Range

```javascript
// Fetch leaderboard for a specific date range
const getCustomLeaderboard = async (startDate, endDate) => {
  const { data } = await api.get("/leaderboard/all", {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      limit: 100,
    },
  });
  return data;
};

// Example: last 3 days
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
const now = new Date();
const result = await getCustomLeaderboard(threeDaysAgo, now);
```
