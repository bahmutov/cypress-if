/// <reference types="cypress" />
// @ts-check

import '../../src'

it('loads items', () => {
  cy.visit('cypress/items-load-with-error.html')
  cy.contains('h1', 'Items load')
})
