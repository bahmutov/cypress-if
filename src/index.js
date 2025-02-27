const debug = require('debug')('cypress-if')

const [major] = Cypress.version.split('.')
if (major < 12) {
  require('./index-v11')
} else {
  const isIfCommand = (cmd) =>
    cmd && cmd.attributes && cmd.attributes.name === 'if'

  const skipCommand = (cmd) => {
    cmd.attributes.skip = true
    cmd.state = 'skipped'
  }

  function skipRestOfTheChain(cmd, chainerId) {
    while (
      cmd &&
      cmd.attributes.chainerId === chainerId &&
      cmd.attributes.name !== 'finally'
    ) {
      debug('skipping "%s"', cmd.attributes.name)
      skipCommand(cmd)
      cmd = cmd.attributes.next
    }
  }

  function findMyIfSubject(elseCommandAttributes) {
    if (!elseCommandAttributes) {
      return
    }
    if (elseCommandAttributes.name === 'if') {
      return elseCommandAttributes.ifSubject
    }
    if (
      !elseCommandAttributes.skip &&
      !Cypress._.isNil(elseCommandAttributes.subject)
    ) {
      return elseCommandAttributes.subject
    }
    if (elseCommandAttributes.prev) {
      return findMyIfSubject(elseCommandAttributes.prev.attributes)
    }
  }

  function getCypressCurrentSubject() {
    if (typeof cy.currentSubject === 'function') {
      return cy.currentSubject()
    }
    // fallback for Cypress v9 and some early v10 versions
    return cy.state('subject')
  }

  // cy.if command
  Cypress.Commands.add(
    'if',
    { prevSubject: true },
    function (subject, assertion, assertionValue1, assertionValue2) {
      const cmd = cy.state('current')
      debug('if', cmd.attributes, 'subject', subject, 'assertion?', assertion)
      debug('next command', cmd.next)
      debug('if() current subject', getCypressCurrentSubject())
      // console.log('subjects', cy.state('subjects'))
      // keep the subject, if there is an "else" branch
      // it can look it up to use
      cmd.attributes.ifSubject = subject

      // let's be friendly and if the user
      // wrote "if exists" just go with it
      if (assertion === 'exists') {
        assertion = 'exist'
      }

      let hasSubject = Boolean(subject)
      let assertionsPassed = true

      const evaluateAssertion = () => {
        try {
          if (Cypress._.isFunction(assertion)) {
            const result = assertion(subject)
            if (Cypress._.isBoolean(result)) {
              // function was a predicate
              if (!result) {
                throw new Error('Predicate function failed')
              }
            }
          } else if (
            assertion.startsWith('not') ||
            assertion.startsWith('have')
          ) {
            const parts = assertion.split('.')
            let assertionReduced = expect(subject).to
            parts.forEach((assertionPart, k) => {
              if (k === parts.length - 1) {
                if (
                  typeof assertionValue1 !== 'undefined' &&
                  typeof assertionValue2 !== 'undefined'
                ) {
                  assertionReduced = assertionReduced[assertionPart](
                    assertionValue1,
                    assertionValue2,
                  )
                } else if (typeof assertionValue1 !== 'undefined') {
                  assertionReduced =
                    assertionReduced[assertionPart](assertionValue1)
                } else {
                  assertionReduced = assertionReduced[assertionPart]
                }
              } else {
                assertionReduced = assertionReduced[assertionPart]
              }
            })
          } else {
            if (
              typeof assertionValue1 !== 'undefined' &&
              typeof assertionValue2 !== 'undefined'
            ) {
              expect(subject).to.be[assertion](assertionValue1, assertionValue2)
            } else if (typeof assertionValue1 !== 'undefined') {
              expect(subject).to.be[assertion](assertionValue1)
            } else {
              expect(subject).to.be[assertion]
            }
          }
        } catch (e) {
          console.error(e)
          assertionsPassed = false
          if (e.message.includes('Invalid Chai property')) {
            throw e
          }
        }
      }

      // check if the previous command was cy.task
      // and it has failed and it was expected
      if (
        assertion === 'failed' &&
        Cypress._.get(cmd, 'attributes.prev.attributes.name') === 'task' &&
        Cypress._.isError(
          Cypress._.get(cmd, 'attributes.prev.attributes.error'),
        )
      ) {
        debug('cy.task has failed and it was expected')
        // set the subject and the assertions to take the IF branch
        hasSubject = Cypress._.get(cmd, 'attributes.prev.attributes.error')
      } else {
        if (subject === null) {
          if (assertion === 'null') {
            hasSubject = true
            assertionsPassed = true
          } else if (assertion === 'not.null') {
            hasSubject = true
            assertionsPassed = false
          }
        } else if (hasSubject && assertion) {
          evaluateAssertion()
        } else if (subject === undefined && assertion) {
          evaluateAssertion()
          hasSubject = true
        }
      }

      const chainerId = cmd.attributes.chainerId
      if (!chainerId) {
        throw new Error('Command is missing chainer id')
      }

      if (!hasSubject || !assertionsPassed) {
        let nextCommand = cmd.attributes.next
        while (nextCommand && nextCommand.attributes.chainerId === chainerId) {
          debug(
            'skipping the next "%s" command "%s"',
            nextCommand.attributes.type,
            nextCommand.attributes.name,
          )
          // cy.log(`**skipping ${cmd.attributes.next.attributes.name}**`)
          if (nextCommand.attributes.name === 'else') {
            debug('else branch starts right away')
            nextCommand = null
          } else {
            debug('am skipping "%s"', nextCommand.attributes.name)
            debug(nextCommand.attributes)
            skipCommand(nextCommand)

            nextCommand = nextCommand.attributes.next
            if (nextCommand && nextCommand.attributes.name === 'else') {
              debug('stop skipping command on "else" command')
              nextCommand = null
            }
          }
        }

        if (subject) {
          debug('wrapping subject', subject)
          cy.wrap(subject, { log: false })
        }
        return
      } else {
        // skip possible "else" branch
        debug('skipping a possible "else" branch')
        let nextCommand = cmd.attributes.next
        while (nextCommand && nextCommand.attributes.chainerId === chainerId) {
          debug(
            'next command "%s" type "%s"',
            nextCommand.attributes.name,
            nextCommand.attributes.type,
            nextCommand.attributes,
          )

          if (nextCommand.attributes.name === 'else') {
            // found the "else" command, start skipping
            debug('found the "else" branch command start')
            skipRestOfTheChain(nextCommand, chainerId)
            nextCommand = null
          } else {
            nextCommand = nextCommand.attributes.next
          }
        }
      }
      return subject
    },
  )

  Cypress.Commands.add('else', { prevSubject: true }, (subject, text) => {
    debug('else command, subject', subject)
    if (typeof subject === 'undefined') {
      // find the subject from the "if()" before
      subject = findMyIfSubject(cy.state('current').attributes)
    }
    if (typeof text !== 'undefined') {
      cy.log(text)
    } else {
      debug('nothing to log for else branch')
    }
    if (subject) {
      cy.wrap(subject, { log: false })
    }
  })

  Cypress.Commands.add('finally', { prevSubject: true }, (subject) => {
    debug('finally with the subject', subject)

    // notice: cy.log yields "null" 🤯
    // https://github.com/cypress-io/cypress/issues/23400
    if (typeof subject === 'undefined' || subject === null) {
      // find the subject from the "if()" before
      const currentCommand = cy.state('current').attributes
      debug('current command is finally', currentCommand)
      subject = findMyIfSubject(currentCommand)
      debug('found subject', subject)
    }
    if (subject) {
      cy.wrap(subject, { log: false })
    }
  })

  Cypress.Commands.overwriteQuery('get', function (get, selector, options) {
    // can we see the next command already?
    const cmd = cy.state('current')
    debug(cmd)
    const next = cmd.attributes.next

    const innerFn = get.call(this, selector, options)

    if (isIfCommand(next)) {
      if (selector.startsWith('@')) {
        return (subject) => {
          try {
            return innerFn(subject)
          } catch (e) {
            if (e.message.includes('could not find a registered alias for')) {
              return undefined
            }
          }
        }
      }
      // disable the built-in assertion
      return (subject) => {
        const res = innerFn(subject)
        if (res && res.length) {
          debug('internal get result', res)
          return res
        }
        debug('no get result')
      }
    }

    return (subject) => innerFn(subject)
  })

  Cypress.Commands.overwriteQuery(
    'contains',
    function (contains, selector, text, options) {
      debug('cy.contains arguments number', arguments.length)
      if (arguments.length === 2) {
        text = selector
        selector = undefined
      }
      debug('cy.contains args', { selector, text, options })

      const cmd = cy.state('current')
      debug(cmd)
      const next = cmd.attributes.next
      const innerFn = contains.call(this, selector, text, options)

      if (isIfCommand(next)) {
        // disable the built-in assertion
        return (subject) => {
          const res = innerFn(subject)
          if (res && res.length) {
            debug('internal contains result', res)
            return res
          }
          debug('no contains result')
        }
      }

      return (subject) => innerFn(subject)
    },
  )

  Cypress.Commands.overwriteQuery('find', function (find, selector, options) {
    debug('cy.find args', { selector, options })

    const cmd = cy.state('current')
    debug(cmd)
    const next = cmd.attributes.next
    const innerFn = find.call(this, selector, options)

    if (isIfCommand(next)) {
      // disable the built-in assertion
      return (subject) => {
        const res = innerFn(subject)
        if (res && res.length) {
          debug('internal cy.find result', res)
          return res
        }
        debug('no cy.find result')
      }
    }

    return (subject) => innerFn(subject)
  })

  Cypress.Commands.overwrite('task', function (task, args, options) {
    debug('cy.task %o', { args, options })

    const cmd = cy.state('current')
    if (cmd) {
      debug(cmd)
      const next = cmd.attributes.next

      if (isIfCommand(next)) {
        // disable the built-in assertion
        return task(args, options).then(
          (taskResult) => {
            debug('internal task result', taskResult)
            return taskResult
          },
          (error) => {
            debug('task error', error)
            cmd.attributes.error = error
          },
        )
      }
    }

    return task(args, options)
  })

  Cypress.Commands.add('raise', (x) => {
    if (Cypress._.isError(x)) {
      throw x
    }
    const e = new Error(
      String(x) +
        '\n' +
        'cypress-if tip: pass an error instance to have correct stack',
    )
    throw e
  })

  Cypress.Commands.overwriteQuery('not', function (notCommand, selector) {
    debug('cy.not args', { selector })

    const cmd = cy.state('current')
    debug(cmd)
    const next = cmd.attributes.next
    const innerFn = notCommand.call(this, selector)

    if (isIfCommand(next)) {
      // disable the built-in assertion
      return (subject) => {
        const res = innerFn(subject)
        if (res && res.length) {
          debug('internal not result', res)
          return res
        }
        debug('no not result')
      }
    }

    return (subject) => innerFn(subject)
  })
}
