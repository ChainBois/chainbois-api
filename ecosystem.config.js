module.exports = {
  apps: [
    {
      name: "chainbois-api",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      kill_timeout: 15000,
      listen_timeout: 15000,
      shutdown_with_message: true,
      restart_delay: 5000,
      exp_backoff_restart_delay: 100,
    },
  ],
};
