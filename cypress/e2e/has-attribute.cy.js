/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('has attribute assertion', () => {
  beforeEach(() => {
    cy.visit('cypress/terms.html')
  })

  it('has attribute present', () => {
    cy.get('#submit')
      .if('have.attr', 'id')
      .log('button has an id')
      .else()
      .raise(new Error('button should have an id'))
  })

  it(
    'has attribute present after delay',
    { defaultCommandTimeout: 2000 },
    () => {
      cy.get('#submit').should('have.attr', 'data-x')
      cy.get('#submit')
        .if('have.attr', 'data-x')
        .invoke('attr', 'data-x')
        .should('equal', '123')
        .else()
        .raise(new Error('data-x not found'))
    },
  )

  it(
    'has attribute with matching value present after delay',
    { defaultCommandTimeout: 2000 },
    () => {
      cy.get('#submit').should('have.attr', 'data-x')
      cy.get('#submit')
        .if('have.attr', 'data-x', '123')
        .log('data-X found')
        .else()
        .raise(new Error('data-x not found'))
    },
  )

  it(
    'has attribute with a different value',
    { defaultCommandTimeout: 2000 },
    () => {
      cy.get('#submit').should('have.attr', 'data-x')
      cy.get('#submit')
        // the attribute is present, but has a different value
        .if('have.attr', 'data-x', '99')
        .raise(new Error('data-x has wrong value'))
        .else('data-x value is correct')
    },
  )
})
