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

  it('has an existing alias no arguments', () => {
    cy.wrap(42).as('answer')
    cy.get('@answer')
      .if()
      .log('alias exists')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })

  it('has no alias', () => {
    // notice there is no alias with the name "answer"
    cy.get('@answer')
      .if()
      .log('alias exists')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@else').should('have.been.called')
    cy.get('@if').should('not.have.been.called')
  })

  it('alias has null value is treated as non-existent', () => {
    cy.wrap(null).as('nullAlias')
    cy.get('@nullAlias')
      .if()
      .log('alias exists')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@else').should('have.been.called')
    cy.get('@if').should('not.have.been.called')
  })
})
