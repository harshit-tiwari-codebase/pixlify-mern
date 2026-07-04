const blacklistedTokens = new Set();

const addTokenToBlacklist = (token) => {
  if (token) {
    blacklistedTokens.add(token);
  }
};

const isTokenBlacklisted = (token) => blacklistedTokens.has(token);

module.exports = {
  addTokenToBlacklist,
  isTokenBlacklisted,
};
