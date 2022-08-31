const debug = require('debug')('cypress-if')

function skipRestOfTheChain(cmd) {
  while (cmd) {
    if (cmd.attributes.type === 'parent' && cmd.attributes.name !== 'log') {
      // stop checking because found new chain
      debug('found parent command "%s"', cmd.attributes.name)
      cmd = null
    } else {
      debug('skipping "%s"', cmd.attributes.name)
      cmd.attributes.skip = true
      cmd = cmd.attributes.next
    }
  }
}

function findMyIfSubject(elseCommandAttributes) {
  if (!elseCommandAttributes) {
    return
  }
  if (elseCommandAttributes.name === 'if') {
    return elseCommandAttributes.ifSubject
  }
  if (elseCommandAttributes.prev) {
    return findMyIfSubject(elseCommandAttributes.prev.attributes)
  }
}

Cypress.Commands.add(
  'if',
  { prevSubject: true },
  function (subject, assertion, assertionValue) {
    const cmd = cy.state('current')
    debug('if', cmd.attributes, 'subject', subject, 'assertion?', assertion)
    debug('next command', cmd.next)
    debug('if() current subject', cy.currentSubject())
    // console.log('subjects', cy.state('subjects'))
    // keep the subject, if there is an "else" branch
    // it can look it up to use
    cmd.attributes.ifSubject = subject

    const hasSubject = Boolean(subject)
    let assertionsPassed = true
    if (hasSubject && assertion) {
      try {
        if (assertion.startsWith('not')) {
          const parts = assertion.split('.')
          let assertionReduced = expect(subject).to
          parts.forEach((assertionPart) => {
            assertionReduced = assertionReduced[assertionPart]
          })
        } else {
          if (typeof assertionValue !== 'undefined') {
            expect(subject).to.be[assertion](assertionValue)
          } else {
            expect(subject).to.be[assertion]
          }
        }
      } catch (e) {
        console.error(e)
        assertionsPassed = false
      }
    }

    if (!hasSubject || !assertionsPassed) {
      let nextCommand = cmd.attributes.next
      while (nextCommand) {
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
          debug('skipping "%s"', nextCommand.attributes.name)
          debug(nextCommand.attributes)
          nextCommand.attributes.skip = true

          nextCommand = nextCommand.attributes.next
          if (nextCommand) {
            if (nextCommand.attributes.type === 'parent') {
              debug(
                'stop skipping commands, see a parent command "%s"',
                nextCommand.attributes.name,
              )
              nextCommand = null
            } else if (nextCommand.attributes.name === 'else') {
              debug('stop skipping command on "else" command')
              nextCommand = null
            }
          }
        }
      }

      if (subject) {
        cy.wrap(subject, { log: false })
      }
      return
    } else {
      // skip possible "else" branch
      debug('skipping a possible "else" branch')
      let nextCommand = cmd.attributes.next
      while (nextCommand) {
        debug(
          'next command "%s" type "%s"',
          nextCommand.attributes.name,
          nextCommand.attributes.type,
          nextCommand.attributes,
        )
        if (nextCommand.attributes.type === 'parent') {
          // ignore the "cy.log" - even if it is a parent
          if (nextCommand.attributes.name !== 'log') {
            // stop checking because found new chain
            nextCommand = null
          } else {
            nextCommand = nextCommand.attributes.next
          }
        } else if (nextCommand.attributes.name === 'else') {
          // found the "else" command, start skipping
          debug('found the "else" branch command start')
          skipRestOfTheChain(nextCommand)
          nextCommand = null
        } else {
          nextCommand = nextCommand.attributes.next
        }
      }
    }
    return subject
  },
)

Cypress.Commands.add('else', { prevSubject: true }, (subject) => {
  // debug('else command, subject', subject)
  // debug('current subject', cy.currentSubject())
  // debug('current command attributes', cy.state('current').attributes)
  // console.log('subjects', cy.state('subjects'))
  // debugger
  debugger
  if (typeof subject === 'undefined') {
    // find the subject from the "if()" before
    subject = findMyIfSubject(cy.state('current').attributes)
  }
  if (subject) {
    cy.wrap(subject, { log: false })
  }
})

Cypress.Commands.overwrite('get', function (get, selector) {
  // can we see the next command already?
  const cmd = cy.state('current')
  debug(cmd)
  const next = cmd.attributes.next

  if (next && next.attributes.name === 'if') {
    // disable the built-in assertion
    return get(selector).then(
      (getResult) => {
        debug('internal get result', getResult)
        return getResult
      },
      (noResult) => {
        debug('no get result', noResult)
      },
    )
  }

  return get(selector)
})
