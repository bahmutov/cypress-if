/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('cy.url support', () => {
  it('checks if url contains a give string (it does)', () => {
    cy.visit('cypress/index.html')
    cy.url().should('include', 'index.html').and('include', 'localhost')
    cy.url()
      .if('includes', 'index.html')
      .log('includes index.html')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })

  it('url does not contain a string', () => {
    cy.visit('cypress/index.html')
    cy.url()
      .if('includes', 'acme.co')
      .log('running on production')
      .then(cy.spy().as('if'))
      .else()
      .log('running NOT on production')
      .then(cy.spy().as('else'))
    cy.get('@else').should('have.been.called')
    cy.get('@if').should('not.have.been.called')
  })
})
