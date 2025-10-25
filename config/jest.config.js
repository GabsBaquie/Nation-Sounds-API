module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/../src", "<rootDir>/../tests"],
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverageFrom: [
    "../src/**/*.ts",
    "!../src/**/*.d.ts",
    "!../src/**/__tests__/**",
    "!../src/tests/**",
  ],
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/../src/$1",
  },
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  verbose: true,
};
