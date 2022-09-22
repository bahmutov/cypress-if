/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('cy.find', () => {
  it('takes the if branch', () => {
    cy.visit('cypress/checkbox.html')
    cy.get('#app1')
      .find('#enrolled')
      .if('exist')
      .then(cy.spy().as('if'))
      .log('checkbox found')
      .else()
      .log('checkbox not found')
      .then(cy.spy().as('else'))
    cy.get('@if').should('have.been.called')
    cy.get('@else').should('not.have.been.called')
  })

  it('takes the else branch', () => {
    cy.visit('cypress/checkbox.html')
    // the checkbox should not be checked
    cy.get('#enrolled').should('not.be.checked')

    cy.get('#app1')
      .find('#enrolled')
      .if('checked')
      .then(cy.spy().as('if'))
      .log('checkbox found')
      .else()
      .log('checkbox not found')
      .then(cy.spy().as('else'))
    cy.get('@else').should('have.been.called')
    cy.get('@if').should('not.have.been.called')
  })
})
