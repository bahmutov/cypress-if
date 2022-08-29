/// <reference types="cypress" />
import '../../src'

it(
  'closes the survey dialog',
  { viewportWidth: 500, viewportHeight: 500 },
  () => {
    cy.visit('cypress/close-dialog.html', {
      onBeforeLoad(win) {
        // trick the app to open the dialog
        cy.stub(win.Math, 'random').returns(0)
      },
    })
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

it(
  'skips the commands since the dialog is closed',
  { viewportWidth: 500, viewportHeight: 500 },
  () => {
    cy.visit('cypress/close-dialog.html', {
      onBeforeLoad(win) {
        // trick the app to close the dialog
        cy.stub(win.Math, 'random').returns(1)
      },
    })
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

describe('cy.contains support', () => {
  it(
    'clicks the close survey button',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      cy.visit('cypress/close-dialog.html', {
        onBeforeLoad(win) {
          // trick the app to open the dialog
          cy.stub(win.Math, 'random').returns(0)
        },
      })
      cy.contains('dialog#survey button', 'Close')
        .if('visible')
        .wait(1000)
        .click()
      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
    },
  )

  it(
    'skips click when the button is hidden',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      cy.visit('cypress/close-dialog.html', {
        onBeforeLoad(win) {
          // trick the app to hide the dialog
          cy.stub(win.Math, 'random').returns(1)
        },
      })
      cy.contains('dialog#survey button', 'Close')
        .if('visible')
        .wait(1000)
        .click()
      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
    },
  )
})
