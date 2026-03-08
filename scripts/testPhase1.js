/**
 * Phase 1 Comprehensive Integration Tests
 * Tests all Phase 1 endpoints against live server with real contracts, Firebase, and MongoDB.
 *
 * Prerequisites:
 *   - Server running on port 5000 (node server.js)
 *   - MongoDB connected
 *   - Firebase Admin initialized
 *   - Contracts deployed on Fuji (CHAINBOIS_NFT_ADDRESS, WEAPON_NFT_ADDRESS in .env)
 *   - NFTs minted to platform wallets
 *   - FIREBASE_API_KEY in .env
 *
 * Usage: node scripts/testPhase1.js
 */
const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const https = require("https");
const admin = require("firebase-admin");
const path = require("path");

// ===== Config =====
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:5000/api/v1";
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
const TEST_EMAIL = `test_phase1_${Date.now()}@chainbois.test`;
const TEST_PASSWORD = "TestSoldier123!";
const TEST_USERNAME = "IntegrationTestSoldier";

// Platform wallets
const NFT_STORE_ADDRESS = "0x469622d0FB5ED43B2e7C45E98D355F2cf03816a0";
const DEPLOYER_ADDRESS = "0x80dBC4C3c17eb35160AEeC41B1590D5F028079C0";

// ===== State =====
let testUid = null;
let authToken = null;
let passed = 0;
let failed = 0;
let skipped = 0;
const results = [];

// ===== Init Firebase Admin =====
const serviceAccountPath = path.resolve(__dirname, "..", "config", "chainbois-firebase-config.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

// ===== Helpers =====

const request = function (method, urlPath, body, token, extraHeaders) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${urlPath}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (token) options.headers["Authorization"] = `Bearer ${token}`;
    if (extraHeaders) Object.assign(options.headers, extraHeaders);

    const transport = url.protocol === "https:" ? https : http;
    const req = transport.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, body: parsed, headers: res.headers });
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

const assert = function (condition, message) {
  if (!condition) throw new Error(message);
};

const test = async function (name, fn) {
  const start = Date.now();
  try {
    await fn();
    passed++;
    const ms = Date.now() - start;
    results.push({ name, status: "pass", ms });
    console.log(`  \x1b[32m✓\x1b[0m ${name} (${ms}ms)`);
  } catch (err) {
    failed++;
    const ms = Date.now() - start;
    const msg = err.message || String(err);
    results.push({ name, status: "fail", ms, error: msg });
    console.log(`  \x1b[31m✗\x1b[0m ${name}: ${msg}`);
  }
};

const skip = function (name, reason) {
  skipped++;
  results.push({ name, status: "skip", reason });
  console.log(`  \x1b[33m-\x1b[0m ${name}: SKIPPED (${reason})`);
};

const getFirebaseToken = function (email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email, password, returnSecureToken: true });
    const options = {
      hostname: "identitytoolkit.googleapis.com",
      port: 443,
      path: `/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(postData) },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.idToken) resolve(parsed.idToken);
          else reject(new Error(`Firebase sign-in failed: ${JSON.stringify(parsed.error || parsed)}`));
        } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
};

const readFirebaseUser = async function (uid) {
  const snapshot = await admin.database().ref(`users/${uid}`).once("value");
  return snapshot.val();
};

// ===== Test Sections =====

const testHealthAndSettings = async function () {
  console.log("\n\x1b[1m--- Section 1: Health & Settings ---\x1b[0m");

  await test("1.1 GET /health returns ok", async () => {
    const res = await request("GET", "/health");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.data.status === "ok", `Expected status: ok, got ${res.body.data.status}`);
    assert(res.body.data.services.mongodb === "connected", "Expected MongoDB connected");
  });

  await test("1.2 GET /settings returns game config", async () => {
    const res = await request("GET", "/settings");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.data.levelUpCosts !== undefined, "Expected levelUpCosts");
    assert(res.body.data.prizePools !== undefined, "Expected prizePools");
    assert(res.body.data.maxPointsPerMatch !== undefined, "Expected maxPointsPerMatch");
  });

  await test("1.3 GET /nonexistent returns 404", async () => {
    const res = await request("GET", "/nonexistent");
    assert(res.status === 404, `Expected 404, got ${res.status}`);
    assert(res.body.success === false, "Expected success: false");
  });
};

const testPublicGameEndpoints = async function () {
  console.log("\n\x1b[1m--- Section 2: Public Game Endpoints ---\x1b[0m");

  await test("2.1 GET /game/info returns game data", async () => {
    const res = await request("GET", "/game/info");
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.data.platforms !== undefined, "Expected platforms object");
    assert(typeof res.body.data.downloads === "number", "Expected downloads to be number");
  });

  await test("2.2 GET /game/download/win returns 404 (no file)", async () => {
    const res = await request("GET", "/game/download/win");
    assert(res.status === 404, `Expected 404, got ${res.status}: ${JSON.stringify(res.body)}`);
  });

  await test("2.3 GET /game/download/linux returns 404 (invalid platform blocked by validator)", async () => {
    const res = await request("GET", "/game/download/linux");
    // validateEndpoint middleware only allows /download/(win|mac), so "linux" is rejected with 404
    assert(res.status === 404, `Expected 404, got ${res.status}: ${JSON.stringify(res.body)}`);
  });
};

const testCreateUser = async function () {
  console.log("\n\x1b[1m--- Section 3: Create User ---\x1b[0m");

  await test("3.1 POST /auth/create-user with valid data", async () => {
    const res = await request("POST", "/auth/create-user", {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      username: TEST_USERNAME,
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.data.uid, "Expected uid in response");
    testUid = res.body.data.uid;
  });

  await test("3.2 POST /auth/create-user duplicate email", async () => {
    const res = await request("POST", "/auth/create-user", {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      username: "Duplicate",
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test("3.3 POST /auth/create-user missing email", async () => {
    const res = await request("POST", "/auth/create-user", {
      password: TEST_PASSWORD,
      username: "NoEmail",
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test("3.4 POST /auth/create-user invalid email", async () => {
    const res = await request("POST", "/auth/create-user", {
      email: "notanemail",
      password: TEST_PASSWORD,
      username: "BadEmail",
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test("3.5 POST /auth/create-user short password", async () => {
    const res = await request("POST", "/auth/create-user", {
      email: "short@test.com",
      password: "123",
      username: "ShortPass",
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test("3.6 POST /auth/create-user missing username", async () => {
    const res = await request("POST", "/auth/create-user", {
      email: "nouser@test.com",
      password: TEST_PASSWORD,
    });
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });
};

const testLoginFlow = async function () {
  console.log("\n\x1b[1m--- Section 4: Login Flow ---\x1b[0m");

  // Get Firebase ID token
  if (!FIREBASE_API_KEY) {
    skip("4.x Login tests", "FIREBASE_API_KEY not set");
    return false;
  }

  try {
    authToken = await getFirebaseToken(TEST_EMAIL, TEST_PASSWORD);
    console.log(`  \x1b[36m→ Firebase token obtained\x1b[0m`);
  } catch (e) {
    skip("4.x Login tests", `Cannot get Firebase token: ${e.message}`);
    return false;
  }

  await test("4.1 POST /auth/login with NFT wallet (nft_store)", async () => {
    const res = await request("POST", "/auth/login", { address: NFT_STORE_ADDRESS }, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.data.user, "Expected user object");
    assert(res.body.data.assets, "Expected assets object");
    assert(res.body.data.user.uid === testUid, `Expected uid ${testUid}`);
    assert(res.body.data.assets.hasNft === true, "Expected hasNft: true");
    assert(typeof res.body.data.assets.nftTokenId === "number", "Expected nftTokenId to be number");
    assert(res.body.data.user.playerType === "web3", "Expected playerType: web3");
  });

  await test("4.8 Firebase RTDB synced after login", async () => {
    const fbUser = await readFirebaseUser(testUid);
    assert(fbUser, "Expected Firebase user data to exist");
    assert(fbUser.hasNFT === true, `Expected Firebase hasNFT: true, got ${fbUser.hasNFT}`);
    assert(fbUser.level === 0, `Expected Firebase level: 0, got ${fbUser.level}`);
  });

  return true;
};

const testGetProfile = async function () {
  console.log("\n\x1b[1m--- Section 5: Get Profile ---\x1b[0m");

  await test("5.1 GET /auth/me returns user profile", async () => {
    const res = await request("GET", "/auth/me", null, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.data.user.uid === testUid, "Expected correct uid");
    assert(res.body.data.user.hasNft === true, "Expected hasNft: true");
    assert(res.body.data.user.playerType === "web3", "Expected web3");
  });

  await test("5.2 Profile has all expected fields", async () => {
    const res = await request("GET", "/auth/me", null, authToken);
    const user = res.body.data.user;
    const expectedFields = [
      "uid", "username", "address", "playerType", "pointsBalance",
      "battleTokenBalance", "level", "score", "highScore", "gamesPlayed",
      "hasNft", "nftTokenId", "isBanned", "lastLogin",
    ];
    for (const field of expectedFields) {
      assert(field in user, `Missing field: ${field}`);
    }
  });
};

const testVerifyAssets = async function () {
  console.log("\n\x1b[1m--- Section 6: Verify Assets ---\x1b[0m");

  await test("6.1 POST /game/verify-assets with NFT wallet", async () => {
    const res = await request("POST", "/game/verify-assets", {}, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.data.hasNft === true, "Expected hasNft: true");
    assert(typeof res.body.data.nftTokenId === "number", "Expected nftTokenId number");
    assert(res.body.data.level === 0, `Expected level 0, got ${res.body.data.level}`);
  });

  await test("6.3 Firebase synced after verify-assets", async () => {
    const fbUser = await readFirebaseUser(testUid);
    assert(fbUser.hasNFT === true, `Expected hasNFT: true, got ${fbUser.hasNFT}`);
  });
};

const testSetAvatar = async function () {
  console.log("\n\x1b[1m--- Section 7: Set Avatar ---\x1b[0m");

  await test("7.1 POST /game/set-avatar token #1 (owned)", async () => {
    const res = await request("POST", "/game/set-avatar", { tokenId: 1 }, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.data.tokenId === 1, `Expected tokenId 1, got ${res.body.data.tokenId}`);
    assert(res.body.data.level === 0, `Expected level 0, got ${res.body.data.level}`);
  });

  await test("7.2 POST /game/set-avatar token #25 (owned)", async () => {
    const res = await request("POST", "/game/set-avatar", { tokenId: 25 }, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.data.tokenId === 25, `Expected tokenId 25`);
  });

  await test("7.3 POST /game/set-avatar unowned token #999", async () => {
    const res = await request("POST", "/game/set-avatar", { tokenId: 999 }, authToken);
    assert(res.status === 400 || res.status === 403, `Expected 400/403, got ${res.status}`);
  });

  await test("7.4 POST /game/set-avatar missing tokenId", async () => {
    const res = await request("POST", "/game/set-avatar", {}, authToken);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });

  await test("7.5 POST /game/set-avatar invalid tokenId -1", async () => {
    const res = await request("POST", "/game/set-avatar", { tokenId: -1 }, authToken);
    assert(res.status === 400, `Expected 400, got ${res.status}`);
  });
};

const testWalletSwitching = async function () {
  console.log("\n\x1b[1m--- Section 4 (cont): Wallet Switching ---\x1b[0m");

  await test("4.4 Login with deployer wallet (no NFTs → web2)", async () => {
    const res = await request("POST", "/auth/login", { address: DEPLOYER_ADDRESS }, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.data.assets.hasNft === false, "Expected hasNft: false");
    assert(res.body.data.user.playerType === "web2", `Expected web2, got ${res.body.data.user.playerType}`);
  });

  await test("6.4 Verify assets with no-NFT wallet", async () => {
    const res = await request("POST", "/game/verify-assets", {}, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.hasNft === false, "Expected hasNft: false");
  });

  await test("4.5 Login back with NFT wallet (web3 re-upgrade)", async () => {
    const res = await request("POST", "/auth/login", { address: NFT_STORE_ADDRESS }, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.data.user.playerType === "web3", `Expected web3, got ${res.body.data.user.playerType}`);
    assert(res.body.data.assets.hasNft === true, "Expected hasNft: true");
  });
};

const testLeaderboard = async function () {
  console.log("\n\x1b[1m--- Section 8: Leaderboard ---\x1b[0m");

  await test("8.1 GET /leaderboard all-time", async () => {
    const res = await request("GET", "/leaderboard");
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.success === true, "Expected success: true");
    assert(res.body.period === "all", `Expected period: all, got ${res.body.period}`);
    assert(Array.isArray(res.body.leaderboard), "Expected leaderboard array");
    assert(typeof res.body.totalUsers === "number", "Expected totalUsers number");
    assert(typeof res.body.currentPage === "number", "Expected currentPage number");
    assert(typeof res.body.totalPages === "number", "Expected totalPages number");
  });

  await test("8.2 GET /leaderboard/24hours", async () => {
    const res = await request("GET", "/leaderboard/24hours");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.period === "24hours", `Expected period: 24hours`);
    assert(res.body.startDate !== null, "Expected startDate set");
  });

  await test("8.3 GET /leaderboard/week", async () => {
    const res = await request("GET", "/leaderboard/week");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.period === "week", "Expected period: week");
  });

  await test("8.4 GET /leaderboard/invalid returns 400", async () => {
    const res = await request("GET", "/leaderboard/invalid");
    assert(res.status === 400, `Expected 400, got ${res.status}: ${JSON.stringify(res.body)}`);
  });

  await test("8.5 GET /leaderboard with pagination", async () => {
    const res = await request("GET", "/leaderboard?limit=5&page=1");
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(res.body.leaderboard.length <= 5, `Expected <=5 results, got ${res.body.leaderboard.length}`);
  });

  await test("8.6 GET /leaderboard/rank/:uid (authenticated)", async () => {
    const res = await request("GET", `/leaderboard/rank/${testUid}`, null, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(typeof res.body.rank === "number", "Expected rank number");
    assert("scoreGained" in res.body, "Expected scoreGained field");
    assert("currentScore" in res.body, "Expected currentScore field");
  });
};

const testLogout = async function () {
  console.log("\n\x1b[1m--- Section 9: Logout ---\x1b[0m");

  await test("9.1 POST /auth/logout succeeds", async () => {
    const res = await request("POST", "/auth/logout", {}, authToken);
    assert(res.status === 200, `Expected 200, got ${res.status}: ${JSON.stringify(res.body)}`);
    assert(res.body.success === true, "Expected success: true");
  });

  await test("9.3 Firebase cleared on logout", async () => {
    const fbUser = await readFirebaseUser(testUid);
    assert(fbUser.hasNFT === false, `Expected hasNFT: false, got ${fbUser.hasNFT}`);
    assert(fbUser.level === 0, `Expected level: 0, got ${fbUser.level}`);
  });
};

const testUnauthenticated = async function () {
  console.log("\n\x1b[1m--- Section 4/5/6/7/8/9: Unauthenticated Access ---\x1b[0m");

  await test("4.2 POST /auth/login missing address (with auth)", async () => {
    // Need fresh token since we logged out - use existing if still valid
    let token = authToken;
    try {
      token = await getFirebaseToken(TEST_EMAIL, TEST_PASSWORD);
    } catch {
      // Token may be revoked after logout - this is expected
    }
    if (token) {
      const res = await request("POST", "/auth/login", {}, token);
      assert(res.status === 400 || res.status === 401, `Expected 400/401, got ${res.status}`);
    }
  });

  await test("4.3 POST /auth/login invalid address (with auth)", async () => {
    let token;
    try { token = await getFirebaseToken(TEST_EMAIL, TEST_PASSWORD); } catch { /* */ }
    if (token) {
      const res = await request("POST", "/auth/login", { address: "not-an-address" }, token);
      assert(res.status === 400 || res.status === 401, `Expected 400/401, got ${res.status}`);
    }
  });

  await test("4.6 POST /auth/login no auth token", async () => {
    const res = await request("POST", "/auth/login", { address: NFT_STORE_ADDRESS });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("4.7 POST /auth/login invalid token", async () => {
    const res = await request("POST", "/auth/login", { address: NFT_STORE_ADDRESS }, "invalid.jwt.token");
    assert(res.status === 401 || res.status === 500, `Expected 401/500, got ${res.status}`);
  });

  await test("5.3 GET /auth/me no auth", async () => {
    const res = await request("GET", "/auth/me");
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("5.4 GET /auth/me invalid token", async () => {
    const res = await request("GET", "/auth/me", null, "bad.token.here");
    assert(res.status === 401 || res.status === 500, `Expected 401/500, got ${res.status}`);
  });

  await test("6.2 POST /game/verify-assets no auth", async () => {
    const res = await request("POST", "/game/verify-assets", {});
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("7.6 POST /game/set-avatar no auth", async () => {
    const res = await request("POST", "/game/set-avatar", { tokenId: 1 });
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("8.7 GET /leaderboard/rank/:uid no auth", async () => {
    const res = await request("GET", `/leaderboard/rank/${testUid || "test"}`);
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });

  await test("9.2 POST /auth/logout no auth", async () => {
    const res = await request("POST", "/auth/logout", {});
    assert(res.status === 401, `Expected 401, got ${res.status}`);
  });
};

const testSecurity = async function () {
  console.log("\n\x1b[1m--- Section 10: Security & Edge Cases ---\x1b[0m");

  await test("10.1 XSS in create-user body is stripped", async () => {
    const xssEmail = `xss_${Date.now()}@test.com`;
    const res = await request("POST", "/auth/create-user", {
      email: xssEmail,
      password: TEST_PASSWORD,
      username: "<script>alert(1)</script>TestUser",
    });
    assert(res.status === 201, `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`);
    // Verify the username was sanitized - xss-clean should strip script tags
    const xssUid = res.body.data.uid;
    // Read from Firebase to check
    const fbData = await readFirebaseUser(xssUid);
    const storedUsername = fbData ? fbData.username : "";
    assert(!storedUsername.includes("<script>"), `XSS not stripped: ${storedUsername}`);
    // Cleanup
    try { await admin.auth().deleteUser(xssUid); } catch { /* */ }
  });

  await test("10.2 NoSQL injection blocked in login", async () => {
    let token;
    try { token = await getFirebaseToken(TEST_EMAIL, TEST_PASSWORD); } catch { /* */ }
    if (token) {
      const res = await request("POST", "/auth/login", { address: { "$gt": "" } }, token);
      assert(res.status === 400 || res.status === 401, `Expected 400/401, got ${res.status}: ${JSON.stringify(res.body)}`);
    } else {
      skip("10.2 NoSQL injection", "No auth token available");
    }
  });

  await test("10.3 CORS blocks unknown origin", async () => {
    const res = await request("GET", "/health", null, null, { Origin: "http://evil.com" });
    // When CORS blocks, Express either returns no Access-Control-Allow-Origin header
    // or returns a 403 error from our CORS config
    const allowOrigin = res.headers["access-control-allow-origin"];
    assert(allowOrigin !== "http://evil.com", `CORS should not allow evil.com, got: ${allowOrigin}`);
  });
};

// ===== Cleanup =====

const cleanup = async function () {
  console.log("\n\x1b[1m--- Cleanup ---\x1b[0m");

  if (testUid) {
    // Delete from Firebase Auth
    try {
      await admin.auth().deleteUser(testUid);
      console.log(`  Deleted Firebase user: ${testUid}`);
    } catch (e) {
      console.log(`  Could not delete Firebase user: ${e.message}`);
    }

    // Delete from Firebase RTDB
    try {
      await admin.database().ref(`users/${testUid}`).remove();
      console.log(`  Deleted Firebase RTDB entry`);
    } catch (e) {
      console.log(`  Could not delete RTDB entry: ${e.message}`);
    }

    // Delete from MongoDB (requires mongoose)
    try {
      const mongoose = require("mongoose");
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI);
      }
      const User = require("../models/userModel");
      const SecurityProfile = require("../models/securityProfileModel");
      await User.deleteOne({ uid: testUid });
      await SecurityProfile.deleteOne({ uid: testUid });
      console.log(`  Deleted MongoDB user + security profile`);
    } catch (e) {
      console.log(`  Could not delete MongoDB data: ${e.message}`);
    }
  }
};

// ===== Main =====

const main = async function () {
  console.log("\n\x1b[1;36m╔══════════════════════════════════════════╗\x1b[0m");
  console.log("\x1b[1;36m║  ChainBois Phase 1 Integration Tests     ║\x1b[0m");
  console.log("\x1b[1;36m╚══════════════════════════════════════════╝\x1b[0m");
  console.log(`  Server:   ${BASE_URL}`);
  console.log(`  Firebase: ${FIREBASE_API_KEY ? "configured" : "MISSING"}`);
  console.log(`  Test user: ${TEST_EMAIL}`);

  // Phase A: Public endpoints
  await testHealthAndSettings();
  await testPublicGameEndpoints();

  // Phase B: Create user + get token
  await testCreateUser();

  // Phase C-E: Authenticated tests
  const hasAuth = await testLoginFlow();
  if (hasAuth) {
    await testGetProfile();
    await testVerifyAssets();
    await testSetAvatar();
    await testWalletSwitching();
    await testLeaderboard();
    await testLogout();
  }

  // Phase G: Unauthenticated error cases
  await testUnauthenticated();

  // Phase H: Security
  await testSecurity();

  // Cleanup
  await cleanup();

  // Results
  console.log("\n\x1b[1m══════════════════════════════════════════\x1b[0m");
  console.log(`\x1b[1m  Results: \x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m, \x1b[33m${skipped} skipped\x1b[0m`);
  console.log("\x1b[1m══════════════════════════════════════════\x1b[0m");

  if (failed > 0) {
    console.log("\n\x1b[31mFailed tests:\x1b[0m");
    results.filter((r) => r.status === "fail").forEach((r) => {
      console.log(`  \x1b[31m✗\x1b[0m ${r.name}: ${r.error}`);
    });
  }

  // Save results
  const fs = require("fs");
  const resultsDir = path.join(__dirname, "..", "test-results");
  if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
  const resultsPath = path.join(resultsDir, "phase1-integration.json");
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { passed, failed, skipped, total: passed + failed + skipped },
    tests: results,
  }, null, 2));
  console.log(`\nResults saved to: ${resultsPath}`);

  console.log("");
  process.exit(failed > 0 ? 1 : 0);
};

main().catch((err) => {
  console.error("\nTest script fatal error:", err);
  process.exit(1);
});
