const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    fixturesFolder: false,
    supportFile: false,
    viewportWidth: 200,
    viewportHeight: 200,
    defaultCommandTimeout: 1000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
