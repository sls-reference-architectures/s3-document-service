const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  globalSetup: './test/jest.setup.e2e.js',
  testTimeout: 120000,
};
