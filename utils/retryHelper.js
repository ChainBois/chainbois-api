const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (asyncFn, maxRetries = 3, initialDelay = 200) => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await asyncFn();
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      const delay =
        initialDelay * Math.pow(2, attempt - 1) + Math.random() * 100;
      await sleep(delay);
    }
  }
};

module.exports = { withRetry, sleep };
