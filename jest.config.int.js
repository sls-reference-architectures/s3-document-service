const baseConfig = require('./jest.config.js');

module.exports = {
  ...baseConfig,
  globalSetup: './test/jest.setup.int.js',
  testTimeout: 120000,
};
