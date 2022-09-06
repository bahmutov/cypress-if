/// <reference path="../../../src/index.d.ts" />
import '../../../src'

it('executes the IF branch', () => {
  cy.wrap(1)
    .if('equal', 1)
    .then(cy.spy().as('if'))
    .else()
    .then(cy.spy().as('else'))
    .finally()
    .should('equal', 1)
  cy.get('@if').should('have.been.calledOnce')
  cy.get('@else').should('not.be.called')
})

describe('wrapped value', () => {
  it('performs an action if the wrapped value is equal to 42', () => {
    cy.wrap(42).if('equal', 42).then(cy.spy().as('action')).then(cy.log)
    cy.get('@action').should('have.been.calledOnce')
  })

  it('does nothing if it is not 42', () => {
    cy.wrap(1).if('equal', 42).then(cy.spy().as('action')).then(cy.log)
    cy.get('@action').should('not.have.been.called')
  })

  context('.else', () => {
    it('passes the subject to the else branch', () => {
      cy.wrap(1).if('equal', 42).log('if branch').else().should('equal', 1)
    })

    it('passes the subject if().else()', () => {
      cy.wrap(1).if('equal', 42).else().should('equal', 1)
    })
  })
})
