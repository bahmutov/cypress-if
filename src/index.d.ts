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
  type MatchedCommandFn = string | ((elements: JQuery) => void)

  interface SelectorMatchers {
    [key: DOMSelector]: MatchedCommandFn
  }

  interface DependsValue {
    selector: DOMSelector
    elements: JQuery
  }

  // prettier-ignore
  interface Chainable<Subject = any> {
    /**
     * Waits for all given selectors and then yields the first matched selector
     * with the elements. Makes it easy to wait for "success or failure" elements
     * and take an action depending on the found result.
     *
     * @example
     *  ```js
     *  // Simple case: log a message depending on success or error
     *  cy.depends({
     *    '#success': 'Success!',
     *    '#error': 'Error!',
     *  })
     *  ```
     *
     * @example
     *  // Run commands with the matched elements
     *  cy.depends({
     *    '#success': ($el) => {
     *      expect($el, 'success')
     *        .to.have.length(1)
     *        .and.to.have.text('Task completed successfully!')
     *      cy.log('Success path')
     *    },
     *    '#error': ($el) => {
     *      expect($el, 'error')
     *        .to.have.length(1)
     *        .and.to.have.text('Task failed with an error.')
     *      cy.log('Error path')
     *    },
     *    '#timeout': 'Timeout!',
     *  })
     */
    depends<M extends SelectorMatchers>(matchers: M): Chainable
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
