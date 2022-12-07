/// <reference types="cypress" />
// @ts-check

import '../../src'

it('clicks on the button that appears if there are more than 6 items', () => {
  cy.visit('cypress/list.html')
  // in 50% of the tests the page will show > 5 items
  // and will show the button "Load more"
  cy.get('#fruits li')
    .if('have.length.above', 5)
    .root()
    .contains('button', 'Load more')
    .click()
    .else()
    .log('Few items, no button')
})
