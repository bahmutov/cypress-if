/**
 * A function that returns true if the value is good for "if" branch
 * No Cypress commands allowed.
 */
type PredicateFn = (x: any) => boolean

/**
 * A function that uses Chai assertions inside.
 * No Cypress commands allowed.
 */
type AssertionFn = (x: any) => void

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
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param callback Predicate function (returning a Boolean value)
     * @example
     *  cy.wrap(1).if(n => n % 2 === 0)...
     */
    if(callback: PredicateFn): Chainable<any>

    /**
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param callback Function with Chai assertions
     * @example
     *  cy.wrap(1).if(n => expect(n).to.equal(1))...
     */
    if(callback: AssertionFn): Chainable<any>

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

    /**
     * A simple way to throw an error
     * @example
     *  cy.get('li')
     *    .if('not.have.length', 3)
     *    .raise('wrong number of todo items')
     */
    raise(x: string | Error): Chainable<void>
  }
}
