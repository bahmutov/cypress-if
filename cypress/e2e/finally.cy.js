/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('finally', () => {
  it('executes after the IF path', () => {
    cy.visit('cypress/checkbox.html')
    cy.get('#enrolled').if('not.checked').check().finally().should('be.checked')
  })

  it('executes after the IF path using xpath', () => {
    cy.visit('cypress/checkbox.html')
    cy.xpath("//input[@id='enrolled']")
      .if('not.checked')
      .check()
      .finally()
      .should('be.checked')
  })

  it('executes after the ELSE path', () => {
    cy.visit('cypress/checkbox.html')
    cy.get('#agreed')
      .if('not.checked')
      .check()
      .else()
      .log('already checked')
      .finally()
      .should('be.checked')
  })

  it('executes after the ELSE path using xpath', () => {
    cy.visit('cypress/checkbox.html')
    cy.xpath("//input[@id='agreed']")
      .if('not.checked')
      .check()
      .else()
      .log('already checked')
      .finally()
      .should('be.checked')
  })

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

  it('executes the ELSE branch', () => {
    cy.wrap(1)
      .if('equal', 42)
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
      .finally()
      .should('equal', 1)
    cy.get('@else').should('have.been.calledOnce')
    cy.get('@if').should('not.be.called')
  })

  it('executes the FINALLY command', () => {
    cy.wrap(1)
      .if('equal', 42)
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
      .finally()
      .then(cy.spy().as('finally'))
    cy.get('@else').should('have.been.calledOnce')
    cy.get('@if').should('not.be.called')
    cy.get('@finally').should('have.been.calledOnce')
  })

  it('yields the IF subject without ELSE branch', () => {
    cy.wrap(1)
      .if('equal', 1)
      .then((n) => {
        expect(n, 'if n').to.equal(1)
        console.log('if path, n = %d', n)
        return 101
      })
      .finally()
      .should('equal', 101)
  })

  it('yields the IF subject', () => {
    cy.wrap(1)
      .if('equal', 1)
      .then((n) => {
        expect(n, 'if n').to.equal(1)
        console.log('if path, n = %d', n)
        return 101
      })
      .else()
      .then(() => -1)
      .finally()
      .should('equal', 101)
  })

  it('yields the ELSE subject', () => {
    cy.wrap(1)
      .if('equal', 42)
      .then((n) => {
        expect(n, 'if n').to.equal(1)
        console.log('if path, n = %d', n)
        return 101
      })
      .else()
      .then(() => -1)
      .finally()
      .should('equal', -1)
  })
})
