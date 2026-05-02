/**
 * jest.config.js — Jest configuration for Fantasy Reading Tracker.
 *
 * Configured for ES modules using the --experimental-vm-modules flag.
 * Run tests with: node --experimental-vm-modules node_modules/.bin/jest
 * (or simply: npm test)
 */

export default {
  // Use the experimental VM modules transform for native ES module support
  testEnvironment: 'node',

  // Transform nothing — we use native ES modules
  transform: {},

  // Resolve .js extensions for ES module imports
  moduleFileExtensions: ['js', 'json'],

  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/*.test.js',
  ],

  // Exclude node_modules
  testPathIgnorePatterns: [
    '/node_modules/',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/app.js',   // app.js has Firebase side-effects; excluded from coverage
  ],

  // Verbose output for better readability
  verbose: true,
};
