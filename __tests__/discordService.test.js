// Test the discord service notification dedup logic
// We don't actually send to Discord, but test the cooldown and structure

jest.mock("axios");
const axios = require("axios");

// Set webhook URL for tests
process.env.DISCORD_ALERTS_WEBHOOK = "https://discord.com/api/webhooks/test/test";
process.env.DISCORD_LEADERBOARD_WEBHOOK = "https://discord.com/api/webhooks/test/leaderboard";

const { sendDiscordAlert, sendLeaderboardNotification, sendAlertNonBlocking } = require("../utils/discordService");

beforeEach(() => {
  jest.clearAllMocks();
  axios.post.mockResolvedValue({ status: 204 });
});

describe("sendDiscordAlert", () => {
  test("sends alert with correct payload structure", async () => {
    const result = await sendDiscordAlert({
      subject: "Low Balance",
      status: "warning",
      poolType: "Prize Pool",
      walletAddress: "0x1234",
      currentBalance: 5,
      requiredAmount: 10,
      unitName: "AVAX",
    });

    expect(result).toBe("sent");
    expect(axios.post).toHaveBeenCalledTimes(1);
    const [url, payload] = axios.post.mock.calls[0];
    expect(url).toBe(process.env.DISCORD_ALERTS_WEBHOOK);
    expect(payload.embeds[0].title).toContain("Low Balance");
    expect(payload.embeds[0].color).toBe(0xffa500); // warning color
  });

  test("sends critical alert with red color", async () => {
    await sendDiscordAlert({
      subject: "Critical Alert",
      status: "critical",
      poolType: "Admin",
      walletAddress: "0x1234",
      currentBalance: 0,
      requiredAmount: 100,
      unitName: "AVAX",
    });

    const [, payload] = axios.post.mock.calls[0];
    expect(payload.embeds[0].color).toBe(0xd32f2f);
    expect(payload.embeds[0].title).toContain("CRITICAL");
  });

  test("deduplicates alerts with same subject within cooldown", async () => {
    const opts = {
      subject: "Dedup Test Unique",
      status: "warning",
      poolType: "Test",
      walletAddress: "0x1234",
      currentBalance: 1,
      requiredAmount: 10,
      unitName: "AVAX",
    };

    const result1 = await sendDiscordAlert(opts);
    const result2 = await sendDiscordAlert(opts);

    expect(result1).toBe("sent");
    expect(result2).toBe("skipped_duplicate");
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  test("returns skipped_misconfigured when webhook not set", async () => {
    const originalUrl = process.env.DISCORD_ALERTS_WEBHOOK;
    delete process.env.DISCORD_ALERTS_WEBHOOK;

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await sendDiscordAlert({
      subject: "No Webhook Test",
      status: "warning",
      poolType: "Test",
      walletAddress: "0x1234",
      currentBalance: 1,
      requiredAmount: 10,
    });
    consoleSpy.mockRestore();

    expect(result).toBe("skipped_misconfigured");
    process.env.DISCORD_ALERTS_WEBHOOK = originalUrl;
  });

  test("throws on axios failure", async () => {
    axios.post.mockRejectedValue(new Error("Network error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(
      sendDiscordAlert({
        subject: "Throw Test Unique",
        status: "warning",
        poolType: "Test",
        walletAddress: "0x1234",
        currentBalance: 1,
        requiredAmount: 10,
      })
    ).rejects.toThrow("Network error");
    consoleSpy.mockRestore();
  });
});

describe("sendLeaderboardNotification", () => {
  test("sends leaderboard notification with correct structure", async () => {
    const result = await sendLeaderboardNotification({
      weekNumber: 1,
      level: 3,
      winners: [
        { rank: 1, username: "Player1", points: 5000, amount: 3, currency: "AVAX", txHash: "0xabc" },
        { rank: 2, username: "Player2", points: 3500, amount: 1.75, currency: "AVAX", txHash: "0xdef" },
        { rank: 3, username: "Player3", points: 2000, amount: 500, currency: "BATTLE", txHash: "" },
      ],
    });

    expect(result).toBe("sent");
    const [, payload] = axios.post.mock.calls[0];
    expect(payload.embeds[0].title).toContain("Week 1");
    expect(payload.embeds[0].title).toContain("Level 3");
    expect(payload.embeds[0].color).toBe(0xffd700);
  });

  test("returns skipped_misconfigured when webhook not set", async () => {
    const originalUrl = process.env.DISCORD_LEADERBOARD_WEBHOOK;
    delete process.env.DISCORD_LEADERBOARD_WEBHOOK;

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await sendLeaderboardNotification({
      weekNumber: 1,
      level: 1,
      winners: [],
    });
    consoleSpy.mockRestore();

    expect(result).toBe("skipped_misconfigured");
    process.env.DISCORD_LEADERBOARD_WEBHOOK = originalUrl;
  });
});

describe("sendAlertNonBlocking", () => {
  test("fires and forgets without throwing", () => {
    // This should not throw even if it fails
    expect(() => {
      sendAlertNonBlocking({
        subject: "NonBlocking Test",
        status: "warning",
        poolType: "Test",
        walletAddress: "0x1234",
        currentBalance: 1,
        requiredAmount: 10,
      });
    }).not.toThrow();
  });
});
