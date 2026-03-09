# Plan: Dynamic Tokenomics, Auto-Burn & Wallet Monitoring

## Context

The $BATTLE token has a fixed supply of 10,000,000 (capped via ERC20Capped). All tokens are pre-minted to the rewards wallet. Currently:
- Weapon purchase $BATTLE sits in weapon_store wallet (dead end, never recirculated)
- No burn mechanism (BURN_RATE constant defined but unused)
- Fixed 1:1 points conversion rate (will drain rewards wallet linearly)
- Fixed airdrop amounts
- No wallet health monitoring

The user wants a **truly deflationary** system where:
1. Tokens are permanently burned (reducing total supply)
2. Rates auto-adjust based on rewards wallet health (so it never runs out)
3. Weapon purchase proceeds are recycled (burned + returned to rewards)
4. Platform wallets are monitored for gas, inventory, and balance health

### Revenue Flow (Current → Proposed)

**Current:**
```
User buys weapon → $BATTLE → weapon_store (sits forever)
User converts points → rewards → user (drains linearly)
Tournament 3rd → rewards → winner (drains)
Airdrops → rewards → holders (drains)
```

**Proposed:**
```
User buys weapon → $BATTLE → weapon_store
  ↓ (periodic sweep)
  ├── X% → BURNED permanently (deflationary)
  └── Y% → rewards wallet (recirculated)

Rates auto-adjust: as rewards drops, outflow slows + recirculation increases
```

---

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `services/tokenomicsService.js` | CREATE | Dynamic rate calculation + health scoring |
| `jobs/tokenomicsJob.js` | CREATE | Periodic sweep: weapon_store → burn + rewards |
| `jobs/walletHealthJob.js` | CREATE | Hourly balance & inventory checks |
| `jobs/platformAuditJob.js` | CREATE | Daily solvency audit |
| `models/burnRecordModel.js` | CREATE | Track each burn event |
| `utils/contractUtils.js` | MODIFY | Add `burnBattleTokens()` utility |
| `config/constants.js` | MODIFY | Add TOKENOMICS + WALLET_HEALTH thresholds |
| `controllers/pointsController.js` | MODIFY | Use dynamic conversion rate |
| `controllers/airdropController.js` | MODIFY | Use dynamic airdrop multiplier |
| `models/settingsModel.js` | MODIFY | Add tokenomics fields |
| `models/platformMetricsModel.js` | MODIFY | Add tokenomics metrics |
| `controllers/metricsController.js` | MODIFY | Include tokenomics in metrics |
| `utils/discordService.js` | MODIFY | Add wallet health alert formatting |
| `server.js` | MODIFY | Register new cron jobs |
| `app.js` | MODIFY | Mount metrics routes (if not already) |

---

## Task 1: Dynamic Tokenomics Service

**File**: `services/tokenomicsService.js`

Core engine that calculates dynamic rates based on rewards wallet health.

### Health Score Calculation

```
Health = rewardsBalance / TOTAL_SUPPLY * 100

Tiers:
  ABUNDANT  (>75%):  multiplier = 1.0
  HEALTHY   (50-75%): multiplier = 0.75
  MODERATE  (30-50%): multiplier = 0.5
  SCARCE    (15-30%): multiplier = 0.3
  CRITICAL  (<15%):  multiplier = 0.15
```

### Dynamic Rates

| Rate | Formula | Effect |
|------|---------|--------|
| Points→BATTLE conversion | `floor(amount * multiplier)` | Fewer BATTLE per point as supply drops |
| Weekly airdrop amount | `baseAmount * multiplier` | Smaller airdrops as supply drops |
| Burn rate (from sweeps) | `1 - multiplier * 0.5` at ABUNDANT → lower burn at CRITICAL | More recirculation when scarce |

**Burn Rate Table:**

| Tier | Multiplier | Burn % | To Rewards % |
|------|-----------|--------|--------------|
| ABUNDANT | 1.0 | 50% | 50% |
| HEALTHY | 0.75 | 40% | 60% |
| MODERATE | 0.5 | 30% | 70% |
| SCARCE | 0.3 | 20% | 80% |
| CRITICAL | 0.15 | 10% | 90% |

### Functions

```javascript
const TOTAL_SUPPLY = 10_000_000;

/**
 * Get current health tier and multiplier based on rewards wallet balance.
 * @param {number} rewardsBalance - Current $BATTLE in rewards wallet
 * @returns {{ tier, multiplier, healthPercent, burnRate, recycleRate }}
 */
const getTokenomicsRates = function (rewardsBalance) { ... };

/**
 * Calculate effective conversion: how much BATTLE for given points amount.
 * At ABUNDANT: 1000 points → 1000 BATTLE
 * At SCARCE: 1000 points → 300 BATTLE
 */
const getConversionAmount = function (pointsAmount, rewardsBalance) { ... };

/**
 * Calculate airdrop amount adjusted for current health.
 * @param {number} baseAmount - The configured weekly amount
 * @param {number} rewardsBalance - Current rewards balance
 */
const getAdjustedAirdropAmount = function (baseAmount, rewardsBalance) { ... };

/**
 * Calculate burn/recycle split for a sweep amount.
 * @param {number} sweepAmount - Total $BATTLE to split
 * @param {number} rewardsBalance - Current rewards balance
 * @returns {{ burnAmount, recycleAmount }}
 */
const getSweepSplit = function (sweepAmount, rewardsBalance) { ... };
```

---

## Task 2: Burn Utility + BurnRecord Model

### 2a: Add `burnBattleTokens()` to `utils/contractUtils.js`

```javascript
/**
 * Burn $BATTLE tokens from the caller's balance.
 * @param {number} amount - Amount to burn (human-readable, not wei)
 * @param {string} signerPrivateKey - Private key of token holder
 */
const burnBattleTokens = async function (amount, signerPrivateKey) {
  const contract = getBattleTokenContract(signerPrivateKey);
  const tx = await contract.burn(ethers.parseEther(String(amount)));
  const receipt = await tx.wait();
  return receipt;
};
```

### 2b: Create `models/burnRecordModel.js`

```javascript
{
  weekNumber: Number,
  year: Number,
  sweepAmount: Number,      // Total swept from weapon_store
  burnAmount: Number,        // Amount permanently burned
  recycleAmount: Number,     // Amount sent to rewards
  burnTxHash: String,
  recycleTxHash: String,
  healthTier: String,        // Tier at time of burn
  rewardsBalanceBefore: Number,
  rewardsBalanceAfter: Number,
  totalSupplyAfter: Number,  // On-chain total supply after burn
  createdAt: Date,
}
```

---

## Task 3: Tokenomics Sweep Job

**File**: `jobs/tokenomicsJob.js`
**Schedule**: `0 */6 * * *` (every 6 hours)

### Logic

1. Get weapon_store wallet from DB + decrypt key
2. Check weapon_store $BATTLE balance
3. If balance > minimum threshold (e.g., 10 BATTLE), proceed:
   a. Get current rewards balance
   b. Calculate health tier + burn/recycle split via `tokenomicsService`
   c. Call `burnBattleTokens(burnAmount, weaponStoreKey)` — permanently destroys tokens
   d. Call `transferBattleTokens(rewardsAddress, recycleAmount, weaponStoreKey)` — recirculate
   e. Create BurnRecord document
   f. Record Transaction for both burn and recycle
   g. Send Discord notification with burn stats
4. If balance <= threshold, skip (nothing to sweep)

### Discord Burn Notification

Send embed with:
- Amount burned + amount recycled
- Current health tier
- Total supply remaining (call `contract.totalSupply()`)
- Rewards wallet balance after
- Color: green for healthy, yellow for moderate, red for scarce

---

## Task 4: Points Conversion — Dynamic Rate

**Modify**: `controllers/pointsController.js`

### Changes to `getPointsBalance`:
- Import `tokenomicsService`
- Calculate dynamic `conversionRate` from `getTokenomicsRates(rewardsBalance)`
- Return `conversionRate` and `maxConvertible` adjusted for rate

### Changes to `convertPoints`:
- Get current rewards balance
- Calculate `effectiveBattle = getConversionAmount(amount, rewardsBalance)`
- Transfer `effectiveBattle` (not raw `amount`)
- Record transaction with both points deducted and BATTLE received
- Return new rate to user

**Example**: User converts 1000 points at SCARCE tier (0.3 multiplier):
- Points deducted: 1000
- BATTLE received: 300
- Transaction records: 1000 points → 300 BATTLE

---

## Task 5: Airdrop — Dynamic Amount

**Modify**: `controllers/airdropController.js`

### Changes to `getSnapshotAndSend`:
- Before distributing, get rewards balance
- Call `getAdjustedAirdropAmount(pool.weeklyDistributionAmount, rewardsBalance)`
- Use adjusted amount for distribution
- Log original vs adjusted in TraitsPool history

---

## Task 6: Wallet Health Job (Hourly)

**File**: `jobs/walletHealthJob.js`
**Schedule**: `0 * * * *` (every hour)

### Checks (from existing plan)

1. **Gas (AVAX) Balance** — all 5 platform wallets
2. **$BATTLE Balance** — rewards wallet
3. **NFT Inventory** — nft_store
4. **Weapon Inventory** — weapon_store per category
5. **Prize Pool Funding** — prize_pool vs upcoming tournament obligations

### Alert Deduplication

In-memory Map keyed by `${walletRole}_${checkType}_${severity}`:
- Only re-alert if severity escalated OR 6 hours since last same-severity alert
- Always log to console

### Implementation

```javascript
const walletHealthJob = async function () {
  const issues = [];

  try {
    await checkGasBalances(issues);
    await checkBattleBalance(issues);
    await checkNftInventory(issues);
    await checkWeaponInventory(issues);
    await checkPrizePoolFunding(issues);
  } catch (e) {
    console.error("[WalletHealth] Job failed:", e.message);
    return;
  }

  if (issues.length === 0) {
    console.log("[WalletHealth] All checks passed");
  } else {
    console.log(`[WalletHealth] ${issues.length} issue(s) found`);
    await sendWalletHealthAlert(issues);
  }
};
```

---

## Task 7: Platform Audit Job (Daily)

**File**: `jobs/platformAuditJob.js`
**Schedule**: `0 3 * * *` (daily 3 AM UTC)

### Checks

1. **Platform Solvency** — Can rewards wallet cover outstanding obligations?
   - Sum active TraitsPool weekly amounts * 52 (annual projection)
   - Sum all user pointsBalance (potential conversion demand)
   - Sum upcoming tournament BATTLE prizes
   - Compare vs rewards balance

2. **On-Chain vs DB Ownership Sync** — Spot-check 10 NFTs + 5 weapons
   - Pick random docs, call on-chain owner, compare to DB

3. **Stuck Purchase Attempts** — Non-terminal status > 24h old

4. **Failed Payout Backlog** — Unresolved FailedPayouts

5. **Tokenomics Health Report** — Current tier, rates, burn stats

### Output

Comprehensive log + Discord summary if issues found.

---

## Task 8: Constants + Settings Updates

### Add to `config/constants.js`:

```javascript
TOKENOMICS: {
  TOTAL_SUPPLY: 10_000_000,
  SWEEP_MIN_THRESHOLD: 10, // Minimum BATTLE to trigger sweep
  HEALTH_TIERS: {
    ABUNDANT:  { min: 75, multiplier: 1.0,  burnRate: 0.5 },
    HEALTHY:   { min: 50, multiplier: 0.75, burnRate: 0.4 },
    MODERATE:  { min: 30, multiplier: 0.5,  burnRate: 0.3 },
    SCARCE:    { min: 15, multiplier: 0.3,  burnRate: 0.2 },
    CRITICAL:  { min: 0,  multiplier: 0.15, burnRate: 0.1 },
  },
},

WALLET_HEALTH: {
  GAS_THRESHOLDS: {
    deployer:     { critical: 0.1, warning: 0.5 },
    nft_store:    { critical: 0.05, warning: 0.2 },
    weapon_store: { critical: 0.05, warning: 0.2 },
    prize_pool:   { critical: 0.05, warning: 0.2 },
    rewards:      { critical: 0.05, warning: 0.2 },
  },
  BATTLE_THRESHOLDS: {
    critical: 10000,
    warning: 50000,
  },
  NFT_THRESHOLDS: {
    critical: 0,
    warning: 5,
  },
  WEAPON_CATEGORY_THRESHOLDS: {
    critical: 0,
    warning: 2,
  },
  ALERT_COOLDOWN_HOURS: 6,
},
```

### Add to `settingsModel.js`:

```javascript
pointsConversionRate: { type: Number, default: 1, min: 0.01 },
// This becomes the display/override; dynamic rate takes precedence when enabled
dynamicTokenomics: { type: Boolean, default: true },
```

---

## Task 9: Discord Alert Formatting

**Modify**: `utils/discordService.js`

### Add `sendWalletHealthAlert(issues)`:
- Groups by severity (critical → warning)
- Consolidated embed with fields per issue
- Color: red if any critical, yellow if only warnings

### Add `sendBurnNotification(burnData)`:
- Embed showing burn amount, recycle amount, health tier
- Total supply remaining
- Green/yellow/red based on tier

---

## Task 10: Server Registration + Metrics Routes

### server.js:
```javascript
const { tokenomicsJob } = require("./jobs/tokenomicsJob");
const { walletHealthJob } = require("./jobs/walletHealthJob");
const { platformAuditJob } = require("./jobs/platformAuditJob");

cron.schedule("0 */6 * * *", tokenomicsJob);     // Every 6 hours
cron.schedule("0 * * * *", walletHealthJob);       // Every hour
cron.schedule("0 3 * * *", platformAuditJob);      // Daily 3 AM UTC
```

### app.js:
- Mount `/api/v1/metrics` → metricsRoutes (if not already mounted)

### Update metricsController.js `computeMetrics`:
- Add tokenomics metrics: total burned, current health tier, rewards balance, total supply

---

## Task 11: Update PlatformMetrics Model

Add to `platformMetricsModel.js`:

```javascript
tokenomics: {
  totalBurned: { type: Number, default: 0 },
  totalRecycled: { type: Number, default: 0 },
  currentHealthTier: { type: String, default: "ABUNDANT" },
  currentMultiplier: { type: Number, default: 1.0 },
  rewardsBalance: { type: Number, default: 0 },
  totalSupplyRemaining: { type: Number, default: 10_000_000 },
  lastSweepDate: { type: Date },
  burnCount: { type: Number, default: 0 },
},
```

---

## Execution Order

1. Add constants (Task 8) — no dependencies
2. Create BurnRecord model (Task 2b) — no dependencies
3. Add `burnBattleTokens` to contractUtils (Task 2a) — no dependencies
4. Create tokenomicsService (Task 1) — depends on constants
5. Create tokenomicsJob (Task 3) — depends on 2a, 2b, 1
6. Modify pointsController (Task 4) — depends on 1
7. Modify airdropController (Task 5) — depends on 1
8. Create walletHealthJob (Task 6) — depends on constants
9. Create platformAuditJob (Task 7) — depends on constants
10. Update discordService (Task 9) — no dependencies
11. Update settings + metrics models (Task 8, 11) — no dependencies
12. Update metricsController (Task 10) — depends on 11
13. Register in server.js + mount routes (Task 10) — depends on all
14. Test suite
15. Documentation

---

## Feature Gap Analysis

### Implemented (Hackathon Phase 1):
- G1 ✅ $BATTLE Token deployed (ERC20Capped, 10M)
- G3 ✅ Trait-based airdrops (weekly, from rewards wallet)
- B1-B5 ✅ Training Room (display, level-up, badges)
- C1-C5, C7-C8 ✅ Battleground (tournaments, auto-prizes, history)
- D1, D3, D7, D9-D10 ✅ Armory (weapons, purchase, points, conversion)
- E1, E5 ✅ Inventory (assets, tx history)
- H2-H5 ✅ Game Integration (Firebase sync, asset verify, points sync)
- A7 ✅ Platform Statistics (metrics endpoint)

### This Plan Implements:
- G5 ✅ Partial Burn Mechanism (dynamic burn from weapon purchases)
- G6 ✅ Redistribution System (recirculation to rewards + dynamic rates)
- Wallet monitoring (not in features.md, but operationally critical)

### Remaining (Post-Hackathon):
- D2: Armor display & purchase (no armor system designed yet)
- D4-D6: Loot boxes (complex probability system)
- D11: $BATTLE → AVAX cashout (DEX integration)
- G2: NFT-based airdrops (by level)
- G4: Token-based airdrops (by holdings)
- G7: Airdrop tracking dashboard
- I1-I4: Battlepass system
- J1-J6: Advanced systems (mythic, buyback, marketplace)
- K1-K2: Merchandise

---

## Verification

- tokenomicsJob: Run manually → should show sweep calculation (weapon_store may have BATTLE from test purchases)
- walletHealthJob: Run manually → should detect low gas in nft_store, weapon_store, prize_pool
- platformAuditJob: Run manually → should pass solvency (rewards ~9.999M)
- Points conversion: Test at different tiers → verify rate adjusts correctly
- Airdrop: Verify adjusted amount logged
- Burns: Verify total supply decreases on-chain after burn
- All existing tests still pass
