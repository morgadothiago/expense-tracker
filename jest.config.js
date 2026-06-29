/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^expo-sqlite$': '<rootDir>/src/storage/__tests__/__mocks__/expo-sqlite.ts',
  },
  collectCoverageFrom: [
    'src/utils/**/*.ts',
    'src/storage/**/*.ts',
    '!src/storage/__tests__/**',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { strict: true } }],
  },
};
