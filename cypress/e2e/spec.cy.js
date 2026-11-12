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

it('clicks on the button if it is visible', () => {
  cy.visit('cypress/index.html')
    .its('console')
    .then((console) => {
      cy.spy(console, 'log').as('log')
    })

  // since the button is hidden, the test will not click it
  cy.get('button#hidden')
    .if('visible')
    .click()
    .else('Hidden button, not clicking')
  // so the log message will not be called
  cy.get('@log').should('not.have.been.called')

  // but we can click on the visible button
  cy.get('button#load').if('visible').click().else('Visible button not clicked')
  cy.get('@log').should('have.been.calledOnce')
})

it('works if nothing is attached', () => {
  cy.wrap(1).if('equal', 1)
  cy.wrap(1)
    .if('not.equal', 1)
    .then((/** @type number */ subject) => {
      expect(subject, 'subject').to.not.equal(1)
    })
})
