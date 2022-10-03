/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('aliases', () => {
  it('has an existing alias', () => {
    cy.wrap(42).as('answer')
    cy.get('@answer')
      .if('exist')
      .log('alias exists')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })

  // SKIP: https://github.com/bahmutov/cypress-if/issues/35
  it.skip('has no alias', () => {
    // notice there is no alias with the name "answer"
    cy.get('@answer')
      .if('exist')
      .log('alias exists')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })
})
