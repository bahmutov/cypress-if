/// <reference types="cypress" />
// @ts-check

import '../../src'
import { recurse } from 'cypress-recurse'

it('loads items', { defaultCommandTimeout: 5000 }, () => {
  cy.visit('cypress/items-load-with-error.html')
  cy.contains('h1', 'Items load')
  cy.get('#items li').should('have.length.greaterThan', 1)
})

it('loads items or shows error', { defaultCommandTimeout: 5000 }, () => {
  cy.visit('cypress/items-load-with-error.html')
  cy.contains('h1', 'Items load')

  cy.depends({
    '#items #error': new Error('Items failed to load'),
    '#items #empty': new Error('Items are empty'),
    '#items li': 'Items are loaded',
  })

  cy.get('#items li').should('have.length.greaterThan', 1)
})

it(
  'loads items or shows error with retries',
  { defaultCommandTimeout: 5000, retries: 2 },
  () => {
    cy.visit('cypress/items-load-with-error.html')
    cy.contains('h1', 'Items load')

    cy.depends({
      '#items #error': new Error('Items failed to load'),
      '#items #empty': new Error('Items are empty'),
      '#items li': 'Items are loaded',
    })

    cy.get('#items li').should('have.length.greaterThan', 1)
  },
)

it(
  'loads items or shows error with local and test retries',
  { defaultCommandTimeout: 5000, retries: 2 },
  () => {
    cy.visit('cypress/items-load-with-error.html')
    cy.contains('h1', 'Items load')

    recurse(
      () =>
        cy
          .depends({
            '#items #error': new Error('Items failed to load'),
            '#items #empty': 'Items are empty',
            '#items li': 'Items are loaded',
          })
          .its('selector'),
      (selector) => selector === '#items li',
      {
        log: true,
        timeout: 30_000,
        limit: 5,
        post() {
          cy.log('Empty items, reloading the page')
          cy.reload()
        },
      },
    )

    cy.get('#items li').should('have.length.greaterThan', 1)
  },
)
