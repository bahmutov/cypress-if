// @ts-check

import '../../src'

describe('DOM matchers', { defaultCommandTimeout: 4_000 }, () => {
  beforeEach(() => {
    cy.visit('cypress/success-or-error.html')
    cy.contains('h1', 'Success or error')
  })

  it('matches success or error', () => {
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

  it('can run commands with matched elements', () => {
    cy.contains('button', 'Run task').click()
    cy.depends({
      '#success': ($el) => {
        expect($el, 'success')
          .to.have.length(1)
          .and.to.have.text('Task completed successfully!')
        cy.log('Success path')
      },
      '#error': ($el) => {
        expect($el, 'error')
          .to.have.length(1)
          .and.to.have.text('Task failed with an error.')
        cy.log('Error path')
      },
    })
  })

  it('can raise an error for matched selector', () => {
    cy.on('fail', (err) => {
      const allowedMessages = [
        'Task completed successfully!',
        'Task failed with an error.',
      ]
      const validMessage = allowedMessages.includes(err.message)
      if (!validMessage) {
        throw err
      }
    })

    cy.contains('button', 'Run task').click()
    cy.depends({
      '#success': new Error('Task completed successfully!'),
      '#error': new Error('Task failed with an error.'),
    })
  })
})

it('closes dialog if open', { viewportWidth: 800, viewportHeight: 600 }, () => {
  cy.visit('cypress/close-dialog.html')
  cy.depends({
    'dialog[open]': ($dialog) => {
      cy.wrap($dialog).find('button#close').click()
    },
    'dialog:hidden': 'dialog is already closed',
  })
})
