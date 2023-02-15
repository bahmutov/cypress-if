/// <reference types="cypress" />
// @ts-check

import '../../src'

it('finds the li elements', () => {
  cy.visit('cypress/index.html')
  // if the list exists, it should have three items
  cy.get('#fruits li').if().should('have.length', 3)
  // if the button exists, it should have certain text
  // and then we click on it
  cy.get('button#load').if().should('have.text', 'Load').click()
})

it('skips if the element does not exit', () => {
  cy.visit('cypress/index.html')
  // if the list exists, it should have three items
  cy.get('#veggies li').if().should('have.length', 3)
})

it('skips the click if the button does not exist', () => {
  cy.visit('cypress/index.html')
  // if the button exists, click on it
  cy.get('button#does-not-exist').if().click()
})

it('clicks on the button if it is visible', () => {
  cy.visit('cypress/index.html')
  cy.get('button#hidden').if('visible').click()
  // but we can click on the visible button
  cy.get('button#load').if('visible').click()
})

it('works if nothing is attached', () => {
  cy.wrap(1).if('equal', 1)
  cy.wrap(1).if('not.equal', 1)
})
