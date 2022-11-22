const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    experimentalRunAllSpecs: true,
    fixturesFolder: false,
    supportFile: false,
    viewportWidth: 200,
    viewportHeight: 200,
    defaultCommandTimeout: 1000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        get42() {
          console.log('returning 42')
          return 42
        },

        throws() {
          console.log('throwing an error from cy.task')
          throw new Error('Nope')
        },
      })
    },
  },
})
