module.exports = {
  testEnvironment: "node",
  testMatch: ["**/dist/tests/unit/**/*.test.js"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/", // Ignorer complètement le dossier tests/
    ".*\\.ts$", // Ignorer tous les fichiers .ts
  ],
  collectCoverageFrom: [
    "dist/**/*.js",
    "!dist/**/*.d.ts",
    "!dist/**/__tests__/**",
    "!dist/tests/**",
  ],
  setupFilesAfterEnv: ["<rootDir>/dist/src/utils/testSetup.js"],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/dist/src/$1",
  },
  clearMocks: true,
  restoreMocks: true,
  // Forcer Jest à ignorer les fichiers TypeScript
  transformIgnorePatterns: ["node_modules/(?!(.*\\.ts$))", ".*\\.ts$"],
};
