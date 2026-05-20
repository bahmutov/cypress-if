// @ts-check

import '../../src'

describe('DOM matchers', { defaultCommandTimeout: 4_000 }, () => {
  it('matches success or error', () => {
    cy.visit('cypress/success-or-error.html')
    cy.contains('h1', 'Success or error')

    cy.contains('button', 'Run task').click()
    cy.depends({
      '#success': 'Success!',
      '#error': 'Error!',
    })
      // yields an object with matched selector
      // and the matched elements
      .should('have.keys', ['selector', 'elements'])
      .then(({ selector, elements }) => {
        if (selector === '#success') {
          expect(elements).to.have.length(1)
          expect(elements[0]).to.have.text('Task completed successfully!')
        } else if (selector === '#error') {
          expect(elements).to.have.length(1)
          expect(elements[0]).to.have.text('Task failed with an error.')
        } else {
          throw new Error(`Unexpected selector ${selector}`)
        }
      })
  })
})
