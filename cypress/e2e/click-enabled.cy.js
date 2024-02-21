/// <reference types="cypress" />
// @ts-check

// https://github.com/bahmutov/cypress-if
import '../../src'

it('clicks the button if enabled', () => {
  cy.visit('cypress/enabled-button.html')
  cy.contains('button', 'Click Me')
    // tests using Chai assertion "be.enabled"
    .if('enabled')
    .click()
    .should('have.text', 'Clicked')
    .else('Button is disabled')
})

it('clicks the button if enabled, checks using jQuery is :enabled', () => {
  cy.visit('cypress/enabled-button.html')
  cy.contains('button', 'Click Me')
    .invoke('is', ':enabled')
    .if('equals', true)
    // grab the button again using "cy.document + cy.contains"
    // combination to avoid using the Boolean subject
    // from the previous command
    .document()
    .contains('button', 'Click Me')
    .click()
    .should('have.text', 'Clicked')
    .else('Button is disabled')
})
