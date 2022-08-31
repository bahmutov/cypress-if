/// <reference types="cypress" />

import '../../src'

describe('else branch', () => {
  it('takes the if branch', () => {
    cy.wrap(42).if('equal', 42).log('if branch').else().log('else branch')
  })

  it('takes the else branch', () => {
    cy.wrap(42).if('equal', 1).log('if branch').else().log('else branch')
  })

  it('can have multiple if-else', () => {
    cy.wrap(1)
      .if('equal', 2)
      .log('is 2')
      .else()
      .if('equal', 3)
      .log('is 3')
      .if('equal', 1)
      .log('is 1')
  })

  context('with checks', () => {
    it('calls actions in the if branch', () => {
      cy.wrap(42)
        .if('equal', 42)
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@if').should('have.been.calledOnce')
      cy.get('@else').should('not.be.called')
    })

    it('calls actions in the else branch', () => {
      cy.wrap(42)
        .if('equal', 1)
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@else').should('have.been.calledOnce')
      cy.get('@if').should('not.be.called')
    })

    it('attaches the .then block correctly', () => {
      cy.wrap(42)
        .if('equal', 1)
        .then(cy.spy().as('if'))
        .else()
        .then(() => {
          cy.spy().as('else1')()
          cy.spy().as('else2')()
        })
      cy.get('@else1').should('have.been.calledOnce')
      cy.get('@else2').should('have.been.calledOnce')
      cy.get('@if').should('not.be.called')
    })
  })
})
