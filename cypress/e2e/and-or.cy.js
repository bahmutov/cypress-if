/// <reference types="cypress" />
// @ts-check

import '../../src'

describe('AND assertions', () => {
  context('uses && inside the predicate callback', () => {
    it('T && T', () => {
      cy.wrap(42)
        .if((n) => n > 20 && n < 50)
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@if').should('have.been.called')
      cy.get('@else').should('not.have.been.called')
    })

    it('T && F', () => {
      cy.wrap(42)
        .if((n) => n > 20 && n < 40)
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@else').should('have.been.called')
      cy.get('@if').should('not.have.been.called')
    })
  })

  context('uses Chai assertions', () => {
    it('ok and ok', () => {
      cy.wrap(42)
        .if((n) => expect(n).to.be.greaterThan(20).and.to.be.lessThan(50))
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@if').should('have.been.called')
      cy.get('@else').should('not.have.been.called')
    })

    it('ok and not ok', () => {
      cy.wrap(42)
        .if((n) => expect(n).to.be.greaterThan(20).and.to.be.lessThan(40))
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@else').should('have.been.called')
      cy.get('@if').should('not.have.been.called')
    })
  })
})

describe('OR assertions', () => {
  context('uses || inside the predicate callback', () => {
    it('T || F', () => {
      cy.wrap(42)
        .if((n) => n > 20 || n < 10)
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@if').should('have.been.called')
      cy.get('@else').should('not.have.been.called')
    })

    it('F || T', () => {
      cy.wrap(42)
        .if((n) => n > 200 || n < 50)
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@if').should('have.been.called')
      cy.get('@else').should('not.have.been.called')
    })

    it('F || F', () => {
      cy.wrap(42)
        .if((n) => n > 200 || n < -40)
        .then(cy.spy().as('if'))
        .else()
        .then(cy.spy().as('else'))
      cy.get('@else').should('have.been.called')
      cy.get('@if').should('not.have.been.called')
    })
  })

  // note that we cannot easily do OR using Chai assertions
})
