/// <reference types="cypress" />
import '../../src'

function visit(showDialog = true) {
  cy.visit('cypress/close-dialog.html', {
    onBeforeLoad(win) {
      // trick the app to open / hide the dialog
      cy.stub(win.Math, 'random').returns(showDialog ? 0 : 1)
    },
  })
  const submitForm = cy.stub().as('submitForm')
  if (showDialog) {
    cy.get('dialog#survey').invoke('on', 'submit', submitForm)
  }
}

it(
  'closes the survey dialog',
  { viewportWidth: 500, viewportHeight: 500 },
  () => {
    visit(true)
    cy.get('dialog#survey')
      .if('visible')
      .wait(1000)
      .contains('button', 'Close')
      .click()
    // if there is a dialog on top,
    // then the main text is not visible
    cy.get('#main').should('be.visible')
    // in this test the dialog should have been submitted
    cy.get('@submitForm').should('have.been.calledOnce')
  },
)

it(
  'skips the commands since the dialog is closed',
  { viewportWidth: 500, viewportHeight: 500 },
  () => {
    visit(false)
    cy.get('dialog#survey')
      .if('visible')
      .wait(1000)
      .contains('button', 'Close')
      .click()
    // if there is a dialog on top,
    // then the main text is not visible
    cy.get('#main').should('be.visible')
    // in this test the dialog was never submitted
    cy.get('@submitForm').should('not.have.been.called')
  },
)

describe('cy.then support', () => {
  it(
    'executes the .then callback if the dialog is visible',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      visit(true)
      cy.get('dialog#survey')
        .if('visible')
        .then(() => {
          cy.log('**closing the dialog**')
          cy.contains('dialog#survey button', 'Close').wait(1000).click()
          cy.get('dialog').should('not.be.visible')
        })

      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
      // in this test the dialog should have been submitted
      cy.get('@submitForm').should('have.been.calledOnce')
    },
  )

  it(
    'skips the .then callback if the dialog is hidden',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      visit(false)
      cy.get('dialog#survey')
        .if('visible')
        .then(() => {
          cy.log('**closing the dialog**')
          cy.contains('dialog#survey button', 'Close').wait(1000).click()
          cy.get('dialog').should('not.be.visible')
        })
      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
      // in this test the dialog was never submitted
      cy.get('@submitForm').should('not.have.been.called')
    },
  )
})

describe('cy.contains support', () => {
  it(
    'clicks the close survey button',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      visit(true)
      cy.contains('dialog#survey button', 'Close')
        .if('visible')
        .wait(1000)
        .click()
      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
      // in this test the dialog should have been submitted
      cy.get('@submitForm').should('have.been.calledOnce')
    },
  )

  it(
    'skips click when the button is hidden',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      visit(false)
      cy.contains('dialog#survey button', 'Close')
        .if('visible')
        .wait(1000)
        .click()
      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
      // in this test the dialog was never submitted
      cy.get('@submitForm').should('not.have.been.called')
    },
  )
})

describe('cy.find support', () => {
  it(
    'finds the close button and closes the dialog',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      visit(true)
      // make sure the page has finished loading
      cy.get('#main')
      cy.get('body').find('#close').if('visible').wait(1000).click()
      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
      // in this test the dialog should have been submitted
      cy.get('@submitForm').should('have.been.calledOnce')
    },
  )

  it(
    'skips click when it cannot find the button',
    { viewportWidth: 500, viewportHeight: 500 },
    () => {
      visit(false)
      // make sure the page has finished loading
      cy.get('#main')
      // then check if the close button is present
      cy.get('body').find('#close').if('visible').wait(1000).click()
      // if there is a dialog on top,
      // then the main text is not visible
      cy.get('#main').should('be.visible')
      // in this test the dialog was never submitted
      cy.get('@submitForm').should('not.have.been.called')
    },
  )
})
