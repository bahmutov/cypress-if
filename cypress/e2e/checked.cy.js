/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('checkbox', () => {
  it('checks the box when it is not checked already', () => {
    cy.visit('cypress/checkbox.html')
    cy.get('#enrolled').if('not.checked').check()
  })

  it('does nothing if the box is already checked', () => {
    cy.visit('cypress/checkbox.html')
    cy.get('#agreed').if('not.checked').check()
  })

  context('with else() branches', () => {
    it('logs a message when nothing to check', () => {
      cy.visit('cypress/checkbox.html')
      cy.get('#agreed')
        .if('not.checked')
        .check()
        .else()
        .log('**already agreed**')
    })

    it('handles if().else() short chain', () => {
      cy.visit('cypress/checkbox.html')
      cy.get('#enrolled').if('checked').else().check()
      cy.get('#enrolled').should('be.checked')
    })

    it('checks the button if not checked', () => {
      cy.visit('cypress/checkbox.html')
      cy.get('#enrolled')
        .if('checked')
        // .log('**already enrolled**')
        .else()
        .check()
      cy.get('#enrolled').should('be.checked')
    })

    it('passes the subject to the else() branch', () => {
      cy.visit('cypress/checkbox.html')
      cy.get('#enrolled')
        .if('checked')
        .log('**already enrolled**')
        // the checkbox should be passed into .else()
        .else()
        .check()
      cy.get('#enrolled').should('be.checked')
    })
  })
})
