# Dynamic Tokenomics & Auto-Burn Architecture

## Overview

The $BATTLE token has a **fixed supply of 10,000,000** tokens (ERC20Capped). All tokens are pre-minted to the rewards wallet. The tokenomics system ensures the token is **truly deflationary** — total supply permanently decreases over time through automated burns, while dynamic rate adjustment prevents the rewards wallet from running out.

## Fund Flow Diagram

```
                    ┌─────────────────┐
                    │   Game Players  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
     ┌──────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
     │ Buy Weapon  │  │ Convert Pts│  │  Play Game  │
     │ ($BATTLE)   │  │ → $BATTLE  │  │ → Earn Pts  │
     └──────┬──────┘  └─────┬──────┘  └─────────────┘
            │               │
            ▼               ▼
   ┌────────────────┐ ┌────────────────┐
   │  weapon_store  │ │    rewards     │
   │   wallet       │ │    wallet      │◄── Airdrops come from here
   └────────┬───────┘ └───────▲────────┘    Prizes come from here
            │                 │
            │  Sweep Job      │
            │  (every 6h)     │
            ▼                 │
   ┌────────────────┐         │
   │  Split by      │         │
   │  Health Tier   │─────────┘ (recycle %)
   └────────┬───────┘
            │
            ▼ (burn %)
   ┌────────────────┐
   │  PERMANENTLY   │
   │  BURNED 🔥     │
   │  (supply ↓)    │
   └────────────────┘
```

## Health Tiers & Dynamic Rates

Rates adjust based on `rewardsBalance / 10,000,000 * 100`:

| Tier | Health % | Conversion Rate | Airdrop Multiplier | Burn Rate | Recycle Rate |
|------|---------|-----------------|--------------------|-----------|----|
| ABUNDANT | ≥75% | 1 pt → 1 BATTLE | 100% of base | 50% | 50% |
| HEALTHY | 50-75% | 1 pt → 0.75 BATTLE | 75% of base | 40% | 60% |
| MODERATE | 30-50% | 1 pt → 0.5 BATTLE | 50% of base | 30% | 70% |
| SCARCE | 15-30% | 1 pt → 0.3 BATTLE | 30% of base | 20% | 80% |
| CRITICAL | <15% | 1 pt → 0.15 BATTLE | 15% of base | 10% | 90% |

**Key insight**: As supply drops, less goes out (lower conversion/airdrop rates) AND more gets recycled back (lower burn rate). This creates asymptotic sustainability — the system slows down but never stops.

## Tokenomics Sweep Job

**File**: `jobs/tokenomicsJob.js`
**Schedule**: Every 6 hours (`0 */6 * * *`)

1. Check weapon_store $BATTLE balance
2. If balance > 10 BATTLE (sweep threshold):
   - Get current rewards balance
   - Calculate health tier and split ratios
   - Call `burn(burnAmount)` on BattleToken contract (weapon_store signs)
   - Transfer `recycleAmount` from weapon_store to rewards
   - Record BurnRecord in MongoDB
   - Record Transactions for both burn and recycle
   - Send Discord notification

## Points Conversion (Dynamic)

**File**: `controllers/pointsController.js`

- User requests to convert N points
- System calculates `effectiveBattle = floor(N * multiplier)` based on current health
- Deducts N points from user
- Transfers `effectiveBattle` $BATTLE from rewards
- Records conversion rate in transaction metadata
- Returns actual rate to user for transparency

## Airdrop (Dynamic)

**File**: `controllers/airdropController.js`

- Base amount configured in TraitsPool (e.g., 500 BATTLE/week)
- Actual distribution: `baseAmount * multiplier`
- At ABUNDANT: full 500 BATTLE distributed
- At SCARCE: only 150 BATTLE distributed
- Logged for transparency

## Wallet Health Monitoring

**File**: `jobs/walletHealthJob.js`
**Schedule**: Every hour (`0 * * * *`)

### Checks Performed

| Check | Wallets | Critical | Warning |
|-------|---------|----------|---------|
| Gas (AVAX) | All 5 | <0.05-0.1 AVAX | <0.2-0.5 AVAX |
| $BATTLE | rewards | <10,000 | <50,000 |
| NFT Inventory | nft_store | 0 remaining | <5 remaining |
| Weapon Inventory | weapon_store | Any category at 0 | Any category <2 |
| Prize Pool | prize_pool | Deficit for active tournaments | — |

### Alert Deduplication

In-memory Map prevents Discord spam:
- Same-severity alert only re-sent after 6-hour cooldown
- Severity escalation (warning → critical) triggers immediate re-alert
- Max 500 tracked keys (FIFO eviction)

## Platform Audit Job

**File**: `jobs/platformAuditJob.js`
**Schedule**: Daily at 3 AM UTC (`0 3 * * *`)

### Audit Checks

1. **Solvency**: Can rewards cover annual airdrop obligations + pending point conversions + tournament prizes?
2. **Ownership Sync**: Spot-check 10 NFTs + 5 weapons — compare on-chain owner vs DB
3. **Stuck Purchases**: PurchaseAttempts in non-terminal state > 24h
4. **Failed Payouts**: Unresolved FailedPayout documents
5. **Tokenomics Health**: Current tier, burn stats, multiplier

## Data Models

### BurnRecord (`models/burnRecordModel.js`)

Tracks each sweep event:
- `sweepAmount`, `burnAmount`, `recycleAmount`
- `burnTxHash`, `recycleTxHash`
- `healthTier` at time of sweep
- `rewardsBalanceBefore`, `rewardsBalanceAfter`
- `totalSupplyAfter` (on-chain total after burn)

### PlatformMetrics (updated)

New `tokenomics` subdocument:
- `totalBurned`, `totalRecycled`, `burnCount`
- `currentHealthTier`, `currentMultiplier`
- `rewardsBalance`, `totalSupplyRemaining`

## Contract Functions Used

| Function | Contract | Purpose |
|----------|----------|---------|
| `burn(amount)` | BattleToken | Permanently destroy tokens (weapon_store calls) |
| `transfer(to, amount)` | BattleToken | Recycle to rewards wallet |
| `totalSupply()` | BattleToken | Track remaining supply after burns |
| `balanceOf(address)` | BattleToken | Check wallet balances |
| `cap()` | BattleToken | Verify 10M cap (ERC20Capped) |

## Cron Job Summary

| Job | Schedule | Purpose |
|-----|----------|---------|
| tokenomicsJob | Every 6h | Sweep weapon_store → burn + recycle |
| walletHealthJob | Every 1h | Gas, balance, inventory checks |
| platformAuditJob | Daily 3 AM | Solvency + ownership + stuck purchases |
| traitAirdropJob | Wed 8 PM | Weekly trait-based $BATTLE distribution |
| tournamentJob | Every 1h | Tournament lifecycle management |
| purchaseFailsafeJob | Every 5m | Recover stuck purchases |
| failedPayoutJob | Every 6h | Retry failed prize payouts |
| syncScoresJob | Every 5m | Firebase → MongoDB score sync |
| syncNewUsersJob | Daily midnight | Web2/web3 metrics count |
