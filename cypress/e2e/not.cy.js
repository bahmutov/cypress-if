// @ts-check

import '../../src'

describe('Not', () => {
  it('not.equal', () => {
    cy.wrap(42).if('not.equal', 42).raise(new Error('should not be here'))
  })
})
