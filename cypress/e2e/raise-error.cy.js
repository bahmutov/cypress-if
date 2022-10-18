/// <reference types="cypress" />
// @ts-check

import '../../src'

it('raises an error if wrong number of elements', () => {
  // prevent ".raise" from failing the test
  Cypress.Commands.overwrite('raise', cy.stub().as('raise'))

  cy.visit('cypress/index.html')
  // we have 3 items
  cy.get('#fruits li').should('have.length', 3)
  // force an error
  cy.get('#fruits li')
    .if('have.length', 1)
    .then(cy.spy().as('if'))
    .log('right number of elements')
    .else()
    .log('too many elements')
    .then(cy.spy().as('else'))
    .raise('Too many elements')
  cy.get('@else').should('have.been.calledOnce')
  cy.get('@if').should('not.have.been.called')
})

it('raises an error if not the right number of elements', () => {
  // prevent ".raise" from failing the test
  Cypress.Commands.overwrite('raise', cy.stub().as('raise'))

  cy.visit('cypress/index.html')
  // we have 3 items
  cy.get('#fruits li').should('have.length', 3)
  // force an error
  cy.get('#fruits li')
    .if('not.have.length', 1)
    .log('wrong number of items')
    .then(cy.spy().as('else'))
    .raise('Too many elements')
  cy.get('@else').should('have.been.calledOnce')
})

it('raises an error instance', () => {
  // prevent ".raise" from failing the test
  Cypress.Commands.overwrite('raise', cy.stub().as('raise'))

  cy.visit('cypress/index.html')
  // we have 3 items
  cy.get('#fruits li').should('have.length', 3)
  // force an error
  cy.get('#fruits li')
    .if('not.have.length', 1)
    .log('wrong number of items')
    .then(cy.spy().as('else'))
    // when using an Error instance (and not a string)
    // the error stack will point at this spec location
    .raise(new Error('Too many elements'))
  cy.get('@else').should('have.been.calledOnce')
})

it.skip('raises an error if element does not exist', () => {
  // prevent ".raise" from failing the test
  Cypress.Commands.overwrite('raise', cy.stub().as('raise'))

  cy.visit('cypress/index.html')
  // force an error
  cy.get('#does-not-exist')
    .if('not.exist')
    .log('no such element')
    .then(cy.spy().as('else'))
    .raise('Cannot find it')
  cy.get('@else').should('have.been.calledOnce')
})
