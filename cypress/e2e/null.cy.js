/// <reference types="cypress" />
// @ts-check

import '../../src'

// https://github.com/bahmutov/cypress-if/issues/38
describe('null value', () => {
  it('handles null assertion', () => {
    cy.wrap(null)
      .if('null')
      .log('null value')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })

  it('handles not.null assertion', () => {
    cy.wrap(null)
      .if('not.null')
      .log('null value')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@else').should('have.been.called')
    cy.get('@if').should('not.have.been.called')
  })

  it('handles 42 with not.null assertion', () => {
    cy.wrap(42)
      .if('not.null')
      .log('null value')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })
})
