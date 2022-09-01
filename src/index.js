const debug = require('debug')('cypress-if')

function skipRestOfTheChain(cmd, chainerId) {
  while (
    cmd &&
    cmd.attributes.chainerId === chainerId &&
    cmd.attributes.name !== 'finally'
  ) {
    debug('skipping "%s"', cmd.attributes.name)
    cmd.attributes.skip = true
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
          nextCommand.attributes.skip = true

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

Cypress.Commands.add('else', { prevSubject: true }, (subject) => {
  debug('else command, subject', subject)
  // debug('current subject', cy.currentSubject())
  // debug('current command attributes', cy.state('current').attributes)
  // console.log('subjects', cy.state('subjects'))
  if (typeof subject === 'undefined') {
    // find the subject from the "if()" before
    subject = findMyIfSubject(cy.state('current').attributes)
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

Cypress.Commands.overwrite('get', function (get, selector, options) {
  // can we see the next command already?
  const cmd = cy.state('current')
  debug(cmd)
  const next = cmd.attributes.next

  if (next && next.attributes.name === 'if') {
    // disable the built-in assertion
    return get(selector, options).then(
      (getResult) => {
        debug('internal get result', getResult)
        return getResult
      },
      (noResult) => {
        debug('no get result', noResult)
      },
    )
  }

  return get(selector, options)
})

Cypress.Commands.overwrite(
  'contains',
  function (contains, prevSubject, selector, text, options) {
    debug('contains arguments number', arguments.length)
    if (arguments.length === 3) {
      text = selector
      selector = undefined
    }
    debug('contains args', { prevSubject, selector, text, options })

    const cmd = cy.state('current')
    debug(cmd)
    const next = cmd.attributes.next

    if (next && next.attributes.name === 'if') {
      // disable the built-in assertion
      return contains(prevSubject, selector, text, options).then(
        (getResult) => {
          debug('internal contains result', getResult)
          return getResult
        },
        (noResult) => {
          debug('no contains result', noResult)
        },
      )
    }

    return contains(prevSubject, selector, text, options)
  },
)
