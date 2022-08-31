/// <reference types="cypress" />

import '../../src'

describe('wrapped value', () => {
  it('performs an action if the wrapped value is equal to 42', () => {
    cy.wrap(42).if('equal', 42).then(cy.spy().as('action')).then(cy.log)
    cy.get('@action').should('have.been.calledOnce')
  })

  it('does nothing if it is not 42', () => {
    cy.wrap(1).if('equal', 42).then(cy.spy().as('action')).then(cy.log)
    cy.get('@action').should('not.have.been.called')
  })
})
