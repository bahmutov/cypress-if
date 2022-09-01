declare namespace Cypress {
  interface Chainable {
    /**
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param assertion Chai assertion (optional, existence by default)
     * @param value Assertion value
     * @example
     *  cy.get('#close').if('visible').click()
     *  cy.wrap(1).if('equal', 1).should('equal', 1)
     */
    if(assertion?: string, value?: any): Chainable<any>
    /**
     * Creates new chain of commands that only
     * execute if the previous `.if()` command skipped
     * the "IF" branch. Note: `.if()` passes its subject
     * to the `.else()`
     * @example
     *  cy.get('checkox#agree')
     *    .if('checked').log('Already agreed')
     *    .else().check()
     */
    else(): Chainable<any>
    /**
     * Finishes if/else commands and continues
     * with the subject yielded by the original command
     * or if/else path taken
     * @example
     *  cy.get('checkbox')
     *    .if('not.checked').check()
     *    .else().log('already checked')
     *    .finally().should('be.checked')
     */
    finally(): Chainable<any>
  }
}
