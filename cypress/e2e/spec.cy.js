/// <reference types="cypress" />
// @ts-check

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

it('finds the li elements using xpath', () => {
  cy.visit('cypress/index.html')
  // if the list exists, it should have three items
  cy.xpath("//*[@id='fruits']//li").if().should('have.length', 3)
  // if the list exists, it should have three items
  cy.xpath("//*[@id='veggies']//li").if().should('have.length', 3)
  // if the button exists, it should have certain text
  // and then we click on it
  cy.xpath("//button[@id='load']").if().should('have.text', 'Load').click()
  // if the button exists, click on it
  cy.xpath("//button[@id='does-not-exist']").if().click()
})

it('clicks on the button if it is visible', () => {
  cy.visit('cypress/index.html')
  cy.get('button#hidden').if('visible').click()
  // but we can click on the visible button
  cy.get('button#load').if('visible').click()
})

it('clicks on the button if it is visible using xpath', () => {
  cy.visit('cypress/index.html')
  cy.xpath("//button[@id='hidden']").if('visible').click()
  // but we can click on the visible button
  cy.xpath("//button[@id='load']").if('visible').click()
})
