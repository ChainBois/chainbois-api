# Plan: Platform Health Monitoring & Wallet Balance Jobs

## Context

The platform has 5 wallets (deployer, nft_store, weapon_store, prize_pool, rewards) that need monitoring for:
- Gas (AVAX) levels sufficient for on-chain operations
- $BATTLE token balance in rewards wallet for conversions/airdrops/prizes
- NFT/weapon inventory levels in store wallets
- Platform solvency (can we cover all obligations?)

Adapted from reference project patterns (shootOutGame `cronJobs.js` + `auditJob.js`).

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `jobs/walletHealthJob.js` | CREATE | Hourly balance & inventory checks with Discord alerts |
| `jobs/platformAuditJob.js` | CREATE | Daily solvency audit + balance verification |
| `config/constants.js` | MODIFY | Add WALLET_HEALTH thresholds |
| `server.js` | MODIFY | Register new cron jobs |
| `utils/discordService.js` | MODIFY | Add wallet health alert formatting |

---

## Task 1: Wallet Health Job (Hourly)

**File**: `jobs/walletHealthJob.js`
**Schedule**: `0 * * * *` (every hour)

### Checks Performed

#### 1a. Gas (AVAX) Balance Checks — All Platform Wallets

Each wallet needs AVAX for gas to sign transactions. Thresholds:

| Wallet | Critical | Warning | Purpose |
|--------|----------|---------|---------|
| deployer | < 0.1 AVAX | < 0.5 AVAX | Mints, setLevel, contract calls |
| nft_store | < 0.05 AVAX | < 0.2 AVAX | NFT transfers to buyers |
| weapon_store | < 0.05 AVAX | < 0.2 AVAX | Weapon transfers to buyers |
| prize_pool | < 0.05 AVAX | < 0.2 AVAX | AVAX prize payouts |
| rewards | < 0.05 AVAX | < 0.2 AVAX | $BATTLE transfers |

**Logic**:
1. Load all wallets from MongoDB
2. For each wallet, call `getAvaxBalance(address)`
3. Compare against thresholds
4. If critical/warning, send Discord alert with wallet role, address, balance, and recommended action

#### 1b. $BATTLE Token Balance — Rewards Wallet

The rewards wallet is the sole source of $BATTLE for:
- Points-to-$BATTLE conversions
- 3rd place tournament prizes (100-700 BATTLE per level)
- Weekly trait airdrops (500 BATTLE/week)

**Thresholds**:
- Critical: < 10,000 BATTLE (covers ~14 airdrop weeks + minimal conversions)
- Warning: < 50,000 BATTLE
- Info: log current balance

**Logic**:
1. Call `getBattleBalance(rewardsWallet.address)`
2. Compare against thresholds
3. Alert if below

#### 1c. NFT Inventory — NFT Store

Track how many ChainBoi NFTs remain for sale.

**Thresholds**:
- Critical: 0 available (sold out — purchases will fail)
- Warning: < 5 available
- Info: log count

**Logic**:
1. `ChainboiNft.countDocuments({ ownerAddress: nftStoreWallet.address })`
2. Alert if below thresholds

#### 1d. Weapon Inventory — Weapon Store

Track weapons per category.

**Thresholds**:
- Critical: any category has 0 weapons (that category is sold out)
- Warning: any category has < 2 weapons
- Info: log counts by category

**Logic**:
1. Aggregate `WeaponNft` by category where `ownerAddress = weaponStoreWallet.address`
2. Check each category count
3. Alert listing sold-out categories

#### 1e. Prize Pool Balance

The prize_pool wallet needs AVAX for tournament prizes.

**Check**: Upcoming/active tournaments need prize funding.

**Logic**:
1. Find active/upcoming tournaments
2. Sum expected AVAX prizes for those tournaments
3. Check `getAvaxBalance(prizePoolWallet.address)` covers the sum
4. Alert if deficit

### Alert Deduplication

To avoid spamming Discord every hour with the same alert:
- Track last alert time per wallet+severity in memory (Map)
- Only re-alert if: severity escalated, OR 6 hours since last same-severity alert
- Always log to console regardless

### Output

```javascript
const walletHealthJob = async function () {
  const issues = [];

  // Run all checks, collect issues
  await checkGasBalances(issues);
  await checkBattleBalance(issues);
  await checkNftInventory(issues);
  await checkWeaponInventory(issues);
  await checkPrizePoolFunding(issues);

  // Log summary
  if (issues.length === 0) {
    console.log("[WalletHealth] All checks passed");
  } else {
    console.log(`[WalletHealth] ${issues.length} issue(s) found`);
    // Send consolidated Discord alert for critical/warning issues
    await sendHealthAlert(issues);
  }
};
```

---

## Task 2: Platform Audit Job (Daily)

**File**: `jobs/platformAuditJob.js`
**Schedule**: `0 3 * * *` (daily 3 AM UTC)

### Checks Performed

#### 2a. Platform Solvency

Verify the rewards wallet can cover all outstanding obligations:
1. Sum all active TraitsPool `weeklyDistributionAmount` * estimated weeks remaining
2. Check pending points conversions: `User.aggregate` sum of `pointsBalance` across all users
3. Check upcoming tournament $BATTLE prizes
4. Compare total obligations vs `getBattleBalance(rewards)`

#### 2b. On-Chain vs DB Ownership Sync

Spot-check a sample of NFTs/weapons to verify DB ownership matches on-chain:
1. Pick 10 random ChainboiNft docs
2. For each, call `getNftOwner(tokenId)` and compare to `doc.ownerAddress`
3. Flag mismatches (could indicate failed transfers, DB corruption, or external transfers)
4. Same for 5 random WeaponNft docs

#### 2c. Stuck Purchase Attempts

Check for abnormally old PurchaseAttempts still in non-terminal states:
1. `PurchaseAttempt.countDocuments({ status: { $in: ["pending", "processing", "needs_refund"] }, createdAt: { $lt: 24h ago } })`
2. Alert if any found (failsafe should have processed them)

#### 2d. Failed Payout Backlog

Check for unresolved FailedPayouts:
1. `FailedPayout.countDocuments({ resolved: false })`
2. Alert if count > 0 with details

### Output

Comprehensive audit report logged + Discord summary if issues found.

---

## Task 3: Constants

Add to `config/constants.js`:

```javascript
WALLET_HEALTH: {
  GAS_THRESHOLDS: {
    deployer: { critical: 0.1, warning: 0.5 },
    nft_store: { critical: 0.05, warning: 0.2 },
    weapon_store: { critical: 0.05, warning: 0.2 },
    prize_pool: { critical: 0.05, warning: 0.2 },
    rewards: { critical: 0.05, warning: 0.2 },
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

---

## Task 4: Server Registration

Add to `server.js` (inside `isPrimary` block):

```javascript
const { walletHealthJob } = require("./jobs/walletHealthJob");
const { platformAuditJob } = require("./jobs/platformAuditJob");

cron.schedule("0 * * * *", walletHealthJob);      // Every hour
cron.schedule("0 3 * * *", platformAuditJob);      // Daily 3 AM UTC
```

---

## Task 5: Discord Alert Formatting

Extend `utils/discordService.js` with a `sendWalletHealthAlert` function that:
- Groups issues by severity (critical first, then warning)
- Color-codes: red (critical), yellow (warning), green (all clear)
- Includes wallet address (truncated), role, current balance, threshold
- Footer: "Platform Monitor • Wallet Health Check"

---

## Execution Order

1. Add constants (Task 3)
2. Create walletHealthJob.js (Task 1)
3. Create platformAuditJob.js (Task 2)
4. Update discordService.js (Task 5)
5. Register in server.js (Task 4)
6. Test with `node -e "require('./jobs/walletHealthJob').walletHealthJob()"`
7. Run full test suite

---

## Verification

- Run walletHealthJob manually → should detect low weapon inventory (we sent most weapons to test wallet)
- Run platformAuditJob manually → should pass solvency (rewards has ~9,999,000 BATTLE)
- Discord alerts fire for critical issues (if webhook configured)
- All existing tests still pass
