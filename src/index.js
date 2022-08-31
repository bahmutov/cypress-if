const debug = require('debug')('cypress-if')

Cypress.Commands.add(
  'if',
  { prevSubject: true },
  function (subject, assertion) {
    const cmd = cy.state('current')
    debug('if', cmd.attributes, 'subject', subject, 'assertion?', assertion)
    debug('next command', cmd.next)

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
          expect(subject).to.be[assertion]
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
        debug('skipping "%s"', nextCommand.attributes.name)
        debug(nextCommand.attributes)
        nextCommand.attributes.skip = true

        nextCommand = nextCommand.attributes.next
        if (nextCommand && nextCommand.attributes.type === 'parent') {
          debug(
            'stop skipping commands, see a parent command "%s"',
            nextCommand.attributes.name,
          )
          nextCommand = null
        }
      }

      if (subject) {
        cy.wrap(subject, { log: false })
      }
      return
    }
    return subject
  },
)

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
