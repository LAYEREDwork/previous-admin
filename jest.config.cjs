module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '^@backend/(.*)$': '<rootDir>/backend/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['jest', 'node'],
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        baseUrl: '.',
        paths: {
          '@shared/*': ['shared/*'],
          '@backend/*': ['backend/*'],
        },
      },
    }],
  },
  collectCoverageFrom: [
    'backend/**/*.ts',
    '!backend/**/*.d.ts',
  ],
};