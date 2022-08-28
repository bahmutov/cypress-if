/// <reference types="cypress" />
import '../../src'

it(
  'closes the survey dialog if it is open',
  { viewportWidth: 500, viewportHeight: 500 },
  () => {
    cy.visit('close-dialog.html')
    cy.get('dialog#survey')
      .if('visible')
      .wait(1000)
      .contains('button', 'Close')
      .click()
    // if there is a dialog on top,
    // then the main text is not visible
    cy.get('#main').should('be.visible')
  },
)
