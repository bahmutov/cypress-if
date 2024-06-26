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
  interface Chainable<Subject> {
    /**
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param assertion Chai assertion (optional, existence by default)
     * @param value Assertion value
     * @example
     *  cy.get('#close').if('visible').click()
     *  cy.wrap(1).if('equal', 1).should('equal', 1)
     */
    if(this: Chainable<Subject>, assertion?: string, value?: any): Chainable<Subject>

    /**
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param callback Predicate function (returning a Boolean value)
     * @example
     *  cy.wrap(1).if(n => n % 2 === 0)...
     */
    if(this: Chainable<Subject>, callback: PredicateFn): Chainable<Subject>

    /**
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param callback Function with Chai assertions
     * @example
     *  cy.wrap(1).if(n => expect(n).to.equal(1))...
     */
    if(this: Chainable<Subject>, callback: AssertionFn): Chainable<Subject>

    /**
     * Creates new chain of commands that only
     * execute if the previous `.if()` command skipped
     * the "IF" branch. Note: `.if()` passes its subject
     * to the `.else()`
     * You can also print a message if the ELSE branch
     * is taken
     * @param message Message to print to the console. Optional.
     * @example
     *  cy.get('checkox#agree')
     *    .if('checked').log('Already agreed')
     *    .else().check()
     * @example
     *  cy.get('...')
     *    .if('not.visible').log('Not visible')
     *    .else('visible')
     */
    else(this: Chainable<Subject>, message?: any): Chainable<Subject>

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
    finally(this: Chainable<Subject>): Chainable<Subject>

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
