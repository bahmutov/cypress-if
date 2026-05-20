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
  type DOMSelector = string
  type MatchedCommandFn = string

  interface SelectorMatchers {
    [key: DOMSelector]: MatchedCommandFn
  }

  interface DependsValue {
    selector: DOMSelector
    elements: JQuery
  }

  interface Chainable<Subject = any> {
    depends(matchers: SelectorMatchers): Chainable<DependsValue>
  }

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
    if(
      this: Chainable,
      assertion?: string,
      value1?: any,
      value2?: any,
    ): Chainable

    /**
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param callback Predicate function (returning a Boolean value)
     * @example
     *  cy.wrap(1).if(n => n % 2 === 0)...
     */
    if(this: Chainable, callback: PredicateFn): Chainable

    /**
     * Child `.if()` command to start an optional chain
     * depending on the subject
     * @param callback Function with Chai assertions
     * @example
     *  cy.wrap(1).if(n => expect(n).to.equal(1))...
     */
    if(this: Chainable, callback: AssertionFn): Chainable

    /**
     * Creates new chain of commands that only
     * execute if the previous `.if()` command skipped
     * the "IF" branch. Note: `.if()` passes its subject
     * to the `.else()`
     * You can also print a message if the ELSE branch
     * is taken
     * @param message Message to print to the console. Optional.
     * @example
     *  cy.get('checkbox#agree')
     *    .if('checked').log('Already agreed')
     *    .else().check()
     * @example
     *  cy.get('...')
     *    .if('not.visible').log('Not visible')
     *    .else('visible')
     */
    else(this: Chainable, message?: any): Chainable

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
    finally(this: Chainable): Chainable

    /**
     * A simple way to throw an error
     * @example
     *  cy.get('li')
     *    .if('not.have.length', 3)
     *    .raise('wrong number of todo items')
     */
    raise(x: string | Error): Chainable
  }
}
