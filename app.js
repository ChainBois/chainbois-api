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
const claimRoutes = require("./routes/claimRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

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
        callback(new Error("Not allowed by CORS"));
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

// 4. Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

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
app.use("/api/v1/claim", claimRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/leaderboard", leaderboardRoutes);
app.use("/api/v1", healthRoutes);

// 13. 404 catch-all
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 14. Global error handler
app.use(globalErrorHandler);

module.exports = app;
