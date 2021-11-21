module.exports = {
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'json', 'lcov', 'text-summary', 'clover'],
  collectCoverageFrom: ['packages/*/src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/packages/*/__tests__/**/*.spec.ts'],
  watchPathIgnorePatterns: ['<rootDir>/node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};
