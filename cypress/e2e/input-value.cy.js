/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('Input element', () => {
  it('types again if the value was corrupted', () => {
    cy.visit('cypress/funky-input.html')
    cy.get('#name')
      .type('Cypress', { delay: 20 })
      .if('not.have.value', 'Cypress')
      .clear()
      .type('Cypress')
      .else()
      .log('Input has expected value')
      .finally()
      .should('have.value', 'Cypress')
  })

  it('have.value positive', () => {
    cy.wrap(Cypress.$('<input value="foo" >'))
      .if('have.value', 'foo')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('be.calledOnce')
    cy.get('@else').should('not.be.called')
  })

  it('have.value negative', () => {
    cy.wrap(Cypress.$('<input value="foo" >'))
      .if('have.value', 'bar')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@else').should('be.calledOnce')
    cy.get('@if').should('not.be.called')
  })

  it('have.value positive', () => {
    cy.wrap(Cypress.$('<input value="foo" >'))
      .if('have.value', 'foo')
      .then(cy.spy().as('if'))
      .else()
      .then(cy.spy().as('else'))
    cy.get('@if').should('be.calledOnce')
    cy.get('@else').should('not.be.called')
  })

  context('not.have.value', () => {
    it('positive', () => {
      cy.wrap(Cypress.$('<input value="foo" >'))
        .if('not.have.value', 'foo')
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@else').should('be.calledOnce')
      cy.get('@if').should('not.be.called')
    })

    it('negative', () => {
      cy.wrap(Cypress.$('<input value="foo" >'))
        .if('not.have.value', 'bar')
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@if').should('be.calledOnce')
      cy.get('@else').should('not.be.called')
    })
  })
})
