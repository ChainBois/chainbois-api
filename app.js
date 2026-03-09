const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middleware/errorHandler");
const { generalLimiter } = require("./middleware/rateLimiter");
const validateEndpoint = require("./middleware/validateEndpoint");
const errorLogger = require("./middleware/logger");

// Route imports
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const trainingRoomRoutes = require("./routes/trainingRoomRoutes");
const battlegroundRoutes = require("./routes/battlegroundRoutes");
const armoryRoutes = require("./routes/armoryRoutes");
const pointsRoutes = require("./routes/pointsRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const metadataRoutes = require("./routes/metadataRoutes");
const airdropRoutes = require("./routes/airdropRoutes");
const healthRoutes = require("./routes/healthRoutes");
const metricsRoutes = require("./routes/metricsRoutes");
const claimRoutes = require("./routes/claimRoutes");

const app = express();

// Enable trust proxy for rate limiting behind reverse proxy
app.set("trust proxy", 1);

// Expose shutdown state for connection tracking (set by server.js)
app.locals.isShuttingDown = false;
app.locals.activeConnections = 0;

// 0. Connection tracking and shutdown rejection (must be first)
app.use((req, res, next) => {
  if (app.locals.isShuttingDown) {
    res.set("Connection", "close");
    return res.status(503).json({
      success: false,
      message: "Server is shutting down",
    });
  }
  app.locals.activeConnections++;
  let decremented = false;
  const decrement = () => {
    if (!decremented) {
      decremented = true;
      app.locals.activeConnections = Math.max(0, app.locals.activeConnections - 1);
    }
  };
  res.on("finish", decrement);
  res.on("close", decrement);
  next();
});

// 1. Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      reportOnly: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// 2. Cookie parser
app.use(cookieParser());

// 2b. Claim route — open CORS (Vercel-hosted faucet page)
// Mounted BEFORE the restrictive global CORS so cross-origin requests are not rejected.
// Includes its own JSON parser since this runs before the global body parser.
app.use(
  "/api/v1/claim",
  cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type"] }),
  express.json({ limit: "1mb" }),
  claimRoutes
);

// 3. CORS
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new AppError("Not allowed by CORS", 403));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-client-id",
      "x-requested-with",
    ],
  })
);

// 4. Body parser (1mb limit to prevent DoS)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 5. Data sanitization
app.use(mongoSanitize());

// 6. XSS prevention
app.use(xss());

// 7. Parameter pollution prevention
app.use(hpp());

// 8. Rate limiting
app.use("/api", generalLimiter);

// 9. Endpoint validation
app.use(validateEndpoint);

// 10. Compression
app.use(compression());

// 11. Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(errorLogger);

// 12. Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/game", gameRoutes);
app.use("/api/v1/training", trainingRoomRoutes);
app.use("/api/v1/tournaments", battlegroundRoutes);
app.use("/api/v1/armory", armoryRoutes);
app.use("/api/v1/points", pointsRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
// Metadata route: override restrictive headers so external indexers
// (Glacier, OpenSea, Thirdweb) can fetch NFT metadata
app.use(
  "/api/v1/metadata",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  metadataRoutes
);
app.use("/api/v1/airdrop", airdropRoutes);
app.use("/api/v1/metrics", metricsRoutes);
app.use("/api/v1", healthRoutes);

// 13. 404 catch-all
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 14. Global error handler
app.use(globalErrorHandler);

module.exports = app;
