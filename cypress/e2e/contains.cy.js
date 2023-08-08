/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('cy.contains support', () => {
  beforeEach(() => {
    cy.visit('cypress/index.html')
  })

  it('clicks on the existing button', () => {
    cy.get('#load').invoke('on', 'click', cy.spy().as('clicked'))
    cy.log('**button exists**')
    cy.contains('button', 'Load').if().click()
    cy.get('@clicked').should('have.been.calledOnce')
  })

  it('works with the text only', () => {
    cy.get('#load').invoke('on', 'click', cy.spy().as('clicked'))
    cy.contains('Load').if().click()
    cy.get('@clicked').should('have.been.calledOnce')
  })

  it('passes the attached assertions', () => {
    cy.log('**attached assertions are passing**')
    cy.contains('button', 'Load').if().should('be.visible')
  })

  it('clicks on the button by text if exists', () => {
    cy.log('**button does not exist**')
    cy.contains('button', 'does-not-exist').if().click()
    cy.log('**attached assertions are skipped**')
    cy.contains('button', 'does-not-exist').if().should('not.exist')
  })

  it('passes the timeout', () => {
    cy.contains('button', 'does-not-exist', { timeout: 500 }).if().click()
  })

  it('does not click invisible button', () => {
    cy.log('**button exist but is hidden**')
    cy.contains('button#hidden', 'Cannot see me').if('visible').click()
  })
})
