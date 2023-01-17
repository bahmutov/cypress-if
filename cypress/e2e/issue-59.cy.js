/// <reference types="cypress" />
// @ts-check

import '../../src'

// https://github.com/bahmutov/cypress-if/issues/59

function bar() {
  return (
    cy
      .wrap('testing')
      .if()
      .then(() => cy.wrap('got it'))
      .else()
      .then(() => cy.wrap('else do'))
      // to correctly STOP the chaining if/else
      // from putting anything chained of bar()
      // need to add .finally() command
      .finally()
  )
}

it('stops the chaining', () => {
  bar().then((it) => {
    cy.log(`result: ${it}`)
  })
})
