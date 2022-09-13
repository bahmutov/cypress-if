/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('cy.task support', () => {
  before(() => {
    // confirm the task yields 42
    cy.task('get42').should('equal', 42)
  })

  it('runs if branch after cy.task', () => {
    cy.task('get42')
      .if('equals', 42)
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })

  it('runs else branch after cy.task', () => {
    cy.task('get42')
      .if('equals', 99)
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@else').should('have.been.called')
    cy.get('@if').should('not.have.been.called')
  })

  it('throws an error', () => {
    cy.task('throws')
      .if('failed')
      .then(cy.spy().as('if'))
      .log('cy.task has failed')
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })
})
