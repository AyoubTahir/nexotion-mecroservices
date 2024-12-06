import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testPathIgnorePatterns: ['node_modules', 'config'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.spec.ts',
    '<rootDir>/tests/unit/**/*.test.ts',
    '<rootDir>/tests/integration/**/*.spec.ts',
    '<rootDir>/tests/integration/**/*.test.ts',
    '<rootDir>/tests/e2e/**/*.spec.ts',
    '<rootDir>/tests/e2e/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },

  // Module path aliases
  moduleNameMapper: {
    '^@notifications/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/index.ts',
    '!**/node_modules/**',
    '!**/tests/**'
  ],

  // Minimum coverage thresholds
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1
    }
  },
};

export default config;