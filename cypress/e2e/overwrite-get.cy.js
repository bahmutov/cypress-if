/// <reference types="cypress" />
// @ts-check

// https://docs.cypress.io/api/cypress-api/custom-queries#Overwriting-Existing-Queries
it('overwrites cy.get', () => {
  Cypress.Commands.overwriteQuery('get', function (originalFn, ...args) {
    console.log('get called with args:', args)

    const currentCommand = cy.state('current')
    console.log({ ...currentCommand.attributes })

    const next = currentCommand.attributes.next
    currentCommand.attributes.next = {
      attributes: {
        type: 'assertion',
        next,
        prev: currentCommand.attributes.prev,
      },
    }

    console.log(currentCommand)

    const innerFn = originalFn.apply(this, args)

    return (subject) => {
      // console.log('get inner function called with subject:', subject)

      const found = innerFn(subject)
      // console.log('found', found)
      return found
    }
  })

  cy.visit('cypress/index.html')
  // cy.get('#load').invoke('css', 'display', 'none')
  // cy.get('#load').then(($button) => {
  //   console.log('$button', $button)
  //   setTimeout(() => {
  //     $button.css('display', 'initial')
  //   }, 500)
  // })
  // cy.get('#load', { timeout: 1000 }).should('be.visible')
  cy.get('#does-not-exist') //.should(Cypress._.noop)
})
