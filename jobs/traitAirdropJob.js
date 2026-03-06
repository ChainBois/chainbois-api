const { executeTraitAirdrop } = require("../controllers/airdropController");

const traitAirdropJob = async function () {
  console.log("[Cron] Starting weekly trait airdrop...");

  try {
    const result = await executeTraitAirdrop();
    if (result.success) {
      console.log(`[Cron] Trait airdrop complete: ${result.trait.type}:${result.trait.value} → ${result.eligibleHolders} holders, ${result.totalDistributed} BATTLE distributed`);
    } else {
      console.log(`[Cron] Trait airdrop skipped: ${result.message}`);
    }
  } catch (e) {
    console.error("[Cron] Trait airdrop failed:", e.message);
  }
};

module.exports = { traitAirdropJob };
