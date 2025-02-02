import nextJest from "next/jest.js";
import type { ConfigSet, JestConfigWithTsJest } from "ts-jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: JestConfigWithTsJest = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "tsconfig.spec.json",
    }],
  },
};

export default createJestConfig(config as ConfigSet);