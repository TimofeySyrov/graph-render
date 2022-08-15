module.exports = {
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/node_modules/jest-css-modules',
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
