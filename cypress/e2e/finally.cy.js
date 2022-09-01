/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('finally', () => {
  it('executes after the IF path', () => {
    cy.visit('cypress/checkbox.html')
    cy.get('#enrolled').if('not.checked').check().finally().should('be.checked')
  })

  it.only('executes after the ELSE path', () => {
    cy.visit('cypress/checkbox.html')
    cy.get('#agreed')
      .if('not.checked')
      .check()
      .else()
      .log('already checked')
      .finally()
      .should('be.checked')
  })
})
