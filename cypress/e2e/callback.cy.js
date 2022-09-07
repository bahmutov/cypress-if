// @ts-check

import '../../src'

describe('assertion callback function', () => {
  context('predicate', () => {
    const isEven = (n) => n % 2 === 0

    it('if branch', () => {
      cy.wrap(42)
        .if(isEven)
        .log('even')
        .then(cy.spy().as('if'))
        .else()
        .log('odd')
        .then(cy.spy().as('else'))
      cy.get('@if').should('have.been.called')
      cy.get('@else').should('not.be.called')
    })

    it('else branch', () => {
      cy.wrap(1)
        .if(isEven)
        .log('even')
        .then(cy.spy().as('if'))
        .else()
        .log('odd')
        .then(cy.spy().as('else'))
      cy.get('@else').should('have.been.called')
      cy.get('@if').should('not.be.called')
    })
  })

  context('Chai assertion', () => {
    const is42 = (n) => expect(n).to.equal(42)

    it('if branch', () => {
      cy.wrap(42)
        .if(is42)
        .log('even')
        .then(cy.spy().as('if'))
        .else()
        .log('odd')
        .then(cy.spy().as('else'))
      cy.get('@if').should('have.been.called')
      cy.get('@else').should('not.be.called')
    })

    it('else branch', () => {
      cy.wrap(1)
        .if(is42)
        .log('even')
        .then(cy.spy().as('if'))
        .else()
        .log('odd')
        .then(cy.spy().as('else'))
      cy.get('@else').should('have.been.called')
      cy.get('@if').should('not.be.called')
    })
  })
})
