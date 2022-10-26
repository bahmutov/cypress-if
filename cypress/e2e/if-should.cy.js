/// <reference types="cypress" />
// @ts-check

import '../../src'

it('checks that there are 3 items if they exist', () => {
  cy.visit('cypress/index.html')
  cy.get('#fruits li').if('exist').should('have.length', 3)
})

it('skips assertion if there are no items', () => {
  cy.visit('cypress/index.html')
  cy.get('#does-not-exist li', { timeout: 1000 })
    .if('exist')
    .should('have.length', 3)
  cy.log('all good')
})
