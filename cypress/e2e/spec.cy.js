/// <reference types="cypress" />

import '../../src'

it('finds the li elements', () => {
  cy.visit('cypress/index.html')
  // if the list exists, it should have three items
  cy.get('#fruits li').if().should('have.length', 3)
  // if the list exists, it should have three items
  cy.get('#veggies li').if().should('have.length', 3)
  // if the button exists, it should have certain text
  // and then we click on it
  cy.get('button#load').if().should('have.text', 'Load').click()
  // if the button exists, click on it
  cy.get('button#does-not-exist').if().click()
})

it('clicks on the button if it is visible', () => {
  cy.visit('cypress/index.html')
  cy.get('button#hidden').if('visible').click()
  // but we can click on the visible button
  cy.get('button#load').if('visible').click()
})

describe('cy.contains support', () => {
  it('clicks on the button by text if exists', () => {
    cy.visit('cypress/index.html')
    cy.log('**button exists**')
    cy.contains('button', 'Load').if().click()
    cy.log('**attached assertions are passing**')
    cy.contains('button', 'Load').if().should('be.visible')
    cy.log('**button does not exist**')
    cy.contains('button', 'does-not-exist').if().click()
    cy.log('**attached assertions are skipped**')
    cy.contains('button', 'does-not-exist').if().should('not.exist')
  })
})
