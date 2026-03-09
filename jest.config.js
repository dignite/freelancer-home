const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/modules/harvest-report-api/setup-tests.ts"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  collectCoverageFrom: [
    "modules/**/*.{ts,js}",
    "pages/**/*.js",
    "!**/*.test.{ts,js}",
    "!modules/harvest-report-api/mock-service-worker/**",
    "!modules/harvest-report-api/harvest-v2-types.ts",
  ],
};

module.exports = createJestConfig(customJestConfig);
