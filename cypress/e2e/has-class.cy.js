/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('has class assertion', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html')
  })

  it('has active class', () => {
    cy.get('#fruits').invoke('addClass', 'active')
    // check if the fruits element has class "active"
    cy.get('#fruits')
      .if('have.class', 'active')
      .log('has class active')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })

  it('has no active class', () => {
    cy.get('#fruits')
      .if('have.class', 'active')
      .log('has class active')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@else').should('have.been.called')
    cy.get('@if').should('not.have.been.called')
  })
})
