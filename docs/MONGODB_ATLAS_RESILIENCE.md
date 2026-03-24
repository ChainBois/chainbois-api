# MongoDB Atlas Connection Resilience Guide

> **Purpose:** Prevent and survive transient MongoDB Atlas connectivity issues (timeouts, node elections, maintenance windows). Copy-paste the recommended connection config into any Node.js + Mongoose project. Written after a real outage where Atlas nodes became temporarily unreachable, causing 500s across all endpoints.

---

## The Problem

MongoDB Atlas clusters (especially free/shared tier M0-M5) periodically experience:

- **Node elections** — the primary steps down and a secondary is promoted (~5-7 seconds of unavailability)
- **Maintenance windows** — Atlas patches/restarts nodes one at a time (rolling)
- **Network blips** — transient TCP failures between your server and Atlas (AWS/GCP cross-region)
- **Stale connections** — NATs and firewalls silently kill idle TCP sockets; the driver doesn't know until it tries to use them

With default Mongoose settings, any of these cause:
```
connection <monitor> to X.X.X.X:27017 timed out
```
...which cascades into 500 errors on every endpoint and failing cron jobs until you manually restart the server.

---

## The Fix

### Mongoose Connection Config

Replace your `mongoose.connect()` options with these:

```javascript
const mongoose = require("mongoose");

const connectDB = async function () {
  const uri = process.env.MONGODB_URI;

  const conn = await mongoose.connect(uri, {
    // ── Timeouts ──────────────────────────────────────────────
    // How long to wait for a suitable server (primary/secondary).
    // 10s gives Atlas enough time to complete a failover election
    // (typically 5-7s). The default 30s is too long for request timeouts;
    // 5s is too short for elections.
    serverSelectionTimeoutMS: 10000,

    // How long to wait for a response after sending a command.
    // 45s is generous — prevents premature kills on slow aggregations.
    socketTimeoutMS: 45000,

    // ── Heartbeat ─────────────────────────────────────────────
    // How often the driver pings each node to check health.
    // 10s (default 30s) means a dead node is detected in ~10s,
    // so the driver routes around it faster after a failure.
    heartbeatFrequencyMS: 10000,

    // ── Connection Pool ───────────────────────────────────────
    // Max connections per node. Size this to your expected concurrency.
    // Too high = resource waste + slow cleanup after outage.
    // Too low = requests queue behind each other.
    maxPoolSize: 10,

    // Keep at least this many connections warm at all times.
    // Avoids the ~200ms TCP+TLS handshake cost on the first request
    // after an idle period.
    minPoolSize: 2,

    // Close connections idle longer than this (5 minutes).
    // Prevents stale sockets that have been silently killed by
    // firewalls, NATs, or load balancers. Without this, the driver
    // tries to use a dead socket → timeout → 500 error.
    maxIdleTimeMS: 300000,

    // ── Retry ─────────────────────────────────────────────────
    // Automatically retry writes/reads once on transient network errors.
    // This is the single most impactful setting — a momentary blip
    // retries transparently instead of returning an error to the caller.
    // On by default in Mongoose 7+ but explicit is clearer.
    retryWrites: true,
    retryReads: true,
  });

  // ── Event Listeners ───────────────────────────────────────────
  // Log connection state changes so you can see what's happening
  // in your server logs without guessing.

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected — driver will attempt to reconnect automatically");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Reconnected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err.message);
  });

  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

module.exports = connectDB;
```

### What Each Setting Does During an Outage

```
Atlas node goes down (election, maintenance, network blip)
  │
  ├─ heartbeatFrequencyMS: 10000
  │    Driver detects the dead node within ~10s (instead of ~30s default)
  │
  ├─ serverSelectionTimeoutMS: 10000
  │    Waits up to 10s for a new primary to be elected
  │    (elections typically take 5-7s — so 10s gives enough headroom)
  │
  ├─ retryWrites: true / retryReads: true
  │    If a write/read was in-flight when the node died, the driver
  │    automatically retries it once on the new primary
  │
  ├─ maxIdleTimeMS: 300000
  │    Stale connections from before the outage are cleaned up,
  │    preventing "zombie socket" errors on the next request
  │
  ├─ minPoolSize: 2
  │    After reconnection, 2 connections are immediately established
  │    so the first requests don't wait for TCP+TLS handshake
  │
  └─ Event listeners
       Logs "[MongoDB] Disconnected" and "[MongoDB] Reconnected"
       so you can see exactly when it happened in your server logs
```

---

## What You Do NOT Need To Do

- **No manual reconnection logic** — Mongoose's driver auto-reconnects. Adding your own `setTimeout` reconnect loops conflicts with the driver and makes things worse.
- **No PM2 restart on disconnect** — The driver recovers on its own. Restarting the process just adds downtime.
- **No connection string changes** — The `mongodb+srv://` URI already handles DNS-based discovery of all replica set nodes.

---

## Diagnosing Future Outages

### Quick Check Script

Run this from your server to test connectivity:

```bash
# 1. Can you reach Atlas nodes via TCP?
for host in $(dig +short _mongodb._tcp.<YOUR_CLUSTER>.mongodb.net SRV | awk '{print $4}'); do
  echo -n "$host → "
  nc -zv $host 27017 -w 5 2>&1 | tail -1
done

# 2. Can Mongoose connect and ping?
node -e "
  const mongoose = require('mongoose');
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => mongoose.connection.db.admin().ping())
    .then(() => { console.log('OK'); process.exit(0); })
    .catch(err => { console.error('FAIL:', err.message); process.exit(1); });
"
```

### Common Causes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `connection timed out` then recovers after 1-2 min | Atlas node election / maintenance | The config above handles this automatically |
| `connection timed out` and never recovers | IP whitelist changed, or Atlas cluster paused (M0 free tier pauses after 60 days of inactivity) | Check Atlas Network Access; resume cluster |
| `IP not whitelisted` error | Server IP changed (new deploy, VPS migration) | Add new IP to Atlas → Network Access → IP Access List |
| Intermittent timeouts during peak traffic | Connection pool exhausted | Increase `maxPoolSize` (e.g., 20-50 for production) |
| Timeout after long idle period (e.g., overnight) | Stale sockets killed by firewall/NAT | `maxIdleTimeMS: 300000` prevents this |

### What To Check in Atlas Dashboard

1. **Cluster → Metrics** — look for spikes in connections, opcounters, or elections
2. **Cluster → Activity Feed** — shows maintenance events, failovers, scaling
3. **Network Access** — confirm `0.0.0.0/0` or your server's IP is listed
4. **Cluster state** — free tier clusters pause after 60 days of inactivity

---

## Atlas Tier Considerations

| Tier | Elections | Maintenance | Recommendation |
|------|-----------|-------------|----------------|
| M0 (free) | More frequent, longer | Shared infrastructure, no control | Fine for hackathons. Accept occasional blips. |
| M2/M5 (shared) | Less frequent | Still shared | Better than M0 but same architecture |
| M10+ (dedicated) | Rare, fast | Scheduled, rolling, zero-downtime | Use for production. You control maintenance windows. |

Free/shared tier clusters share underlying infrastructure with other users. Node elections and maintenance happen more often and with less predictability than dedicated clusters. The connection config above is specifically tuned to survive these events gracefully.

---

## Production Recommendations (Beyond Hackathon)

For a production deployment, also consider:

1. **Upgrade to M10+** — dedicated nodes, faster elections, scheduled maintenance windows
2. **Enable Atlas alerts** — get notified on high connection counts, replication lag, elections
3. **Multi-region replica set** — survives an entire AZ outage
4. **Increase `maxPoolSize`** — size it to your peak concurrent requests (e.g., 50-100)
5. **Add application-level health checks** — your load balancer should hit `/health` and route away from instances with `mongodb: "disconnected"`

---

## Applying To Your Project

1. Copy the `mongoose.connect()` config block above into your database connection file
2. Adjust `maxPoolSize` based on your traffic (10 for dev/hackathon, 50+ for production)
3. Make sure your error handler doesn't crash the process on MongoDB errors — return a 503 instead
4. Deploy and verify with: `curl your-api.com/health`
