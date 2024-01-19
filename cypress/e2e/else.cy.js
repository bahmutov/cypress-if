/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('else branch', () => {
  it('takes the if branch', () => {
    cy.wrap(42).if('equal', 42).log('if branch').else().log('else branch')
    cy.log('**built-in log**')
    cy.wrap(42).if('equal', 42).log('if branch').else('else branch')
  })

  it('takes the else branch', () => {
    cy.wrap(42).if('equal', 1).log('if branch').else().log('else branch')
    cy.log('**built-in log**')
    cy.wrap(42).if('equal', 1).log('if branch').else('else branch')
    cy.log('**prints numbers**')
    cy.wrap(42).if('equal', 1).log('if branch').else(42)
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

  it('attaches should', () => {
    cy.wrap(1).if('equal', 1).should('equal', 1).else().should('equal', 2)
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

    it('skips the entire ELSE chain', () => {
      cy.visit('cypress/index.html')
      cy.get('#load')
        .if()
        .log('found it')
        .get('#load')
        .click()
        .else()
        .log('ughh, why execute the else branch')
        .then(() => {
          throw new Error('no!!!')
        })
    })

    it('skips the entire ELSE chain even if it has parent commands', () => {
      cy.visit('cypress/index.html')
      cy.get('#load')
        .if()
        .log('found it')
        .get('#load')
        .click()
        .else()
        .get('#load')
        .log('ughh, why execute the else branch after a parent command')
        .then(() => {
          throw new Error('no!!!')
        })
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
