// @ts-check

import '../../src'

it('submits the terms forms', () => {
  cy.visit('cypress/terms.html')
  cy.get('#agreed')
    .if('not.checked')
    .click()
    .else()
    .log('The user already agreed')
  cy.get('button#submit').click()
})

it('submits the terms forms using cy.then', () => {
  cy.visit('cypress/terms.html')
  cy.get('#agreed').then(($input) => {
    if ($input.is(':checked')) {
      cy.log('The user already agreed')
    } else {
      cy.wrap($input).click()
    }
  })
  cy.get('button#submit').click()
})
