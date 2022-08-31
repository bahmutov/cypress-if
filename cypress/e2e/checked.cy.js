/// <reference types="cypress" />

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
})
