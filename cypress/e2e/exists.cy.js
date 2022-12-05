/// <reference types="cypress" />
// @ts-check

import '../../src'

beforeEach(() => {
  cy.visit('cypress/index.html')
})

it('checks an element that exists', () => {
  cy.get('#fruits')
    .if('exist')
    .then(cy.spy().as('if'))
    .else()
    .then(cy.spy().as('else'))
  cy.get('@if').should('have.been.calledOnce')
  cy.get('@else').should('not.have.been.called')
})

it('checks an element that does not exists', () => {
  cy.get('#not-found')
    .if('exist')
    .then(cy.spy().as('if'))
    .else()
    .then(cy.spy().as('else'))
  cy.get('@else').should('have.been.calledOnce')
  cy.get('@if').should('not.have.been.called')
})

// https://github.com/bahmutov/cypress-if/issues/45
it('checks an element that does not exists using not.exist', () => {
  cy.get('#not-found').should('not.exist')
  cy.get('#not-found')
    .if('not.exist')
    .then(cy.spy().as('if'))
    .else()
    .then(cy.spy().as('else'))
  cy.get('@if').should('have.been.calledOnce')
  cy.get('@else').should('not.have.been.called')
})

it('clicks on the element with force: true', () => {
  cy.window()
    .its('console')
    .then((console) => {
      cy.spy(console, 'log').withArgs('clicked').as('logClicked')
    })
  cy.get('#load').if('exist').click({ force: true })
  cy.get('@logClicked').should('have.been.calledOnce')
})
