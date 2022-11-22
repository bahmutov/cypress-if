/// <reference types="cypress" />
// @ts-check

import '../../src'

it('combines all colors on the page', () => {
  cy.visit('cypress/colors.html')
  for (let k = 1; k < 10; k += 1) {
    cy.get('#colors #color' + k, { timeout: 100 })
      .if('exist')
      .invoke('text')
      .invoke('trim')
      .as('color' + k)
  }
  cy.then(function () {
    const colorNames = [
      this.color1,
      this.color2,
      this.color3,
      this.color4,
      this.color5,
      this.color6,
      this.color7,
      this.color8,
      this.color9,
    ]
      .filter(Boolean)
      .join(', ')
    expect(colorNames, 'color names').to.equal('red, green')
  })
})
