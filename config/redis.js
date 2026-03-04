const Redis = require("ioredis");
const dotenv = require("dotenv");
dotenv.config();

let redisClient;

const getRedisClient = function () {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redisClient.on("connect", () => {
      console.log("Redis connected");
    });

    redisClient.on("error", (err) => {
      console.error("Redis error:", err.message);
    });
  }
  return redisClient;
};

const disconnectRedis = function () {
  if (redisClient) {
    redisClient.disconnect();
    redisClient = null;
  }
};

module.exports = { getRedisClient, disconnectRedis };
