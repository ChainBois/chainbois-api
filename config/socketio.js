const { Server } = require("socket.io");
const { MAX_LEVEL } = require("./constants");

let io = null;

/**
 * Initialize Socket.IO server.
 * @param {Object} httpServer - Node.js HTTP server instance
 * @param {string[]} allowedOrigins - CORS allowed origins
 * @returns {Server} Socket.IO server instance
 */
const initSocketIO = function (httpServer, allowedOrigins) {
  io = new Server(httpServer, {
    cors: {
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      methods: ["GET", "POST"],
    },
  });

  // Tournament namespace
  const tournamentNs = io.of("/tournaments");

  tournamentNs.on("connection", (socket) => {
    // Client joins a level room to receive updates for that level
    socket.on("join:level", (level) => {
      const parsed = parseInt(level);
      if (parsed >= 1 && parsed <= MAX_LEVEL) {
        socket.join(`level:${parsed}`);
      }
    });

    socket.on("leave:level", (level) => {
      const parsed = parseInt(level);
      if (parsed >= 1 && parsed <= MAX_LEVEL) {
        socket.leave(`level:${parsed}`);
      }
    });
  });

  console.log("Socket.IO initialized with /tournaments namespace");
  return io;
};

/**
 * Get the Socket.IO server instance.
 * @returns {Server|null}
 */
const getIO = function () {
  return io;
};

module.exports = { initSocketIO, getIO };
