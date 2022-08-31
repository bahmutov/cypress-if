/// <reference types="cypress" />
// @ts-check

import '../../src'

it('traversals by chain id', () => {
  cy.visit('cypress/index.html')
  cy.get('#does-not-exist', { timeout: 2000 })
    .if()
    .log('hmm') // should be skipped
    .get('#does-not-exist') // should be skipped
    .should('exist') // should be skipped
    .then(() => {
      throw new Error('Hmm, did not skip me')
    })
    .else()
    .log('does not exist')
})
