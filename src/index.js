Cypress.Commands.add(
  'if',
  { prevSubject: true },
  function (subject, assertion) {
    const cmd = cy.state('current')
    console.log('if', cmd.attributes, 'subject', subject)
    console.log('next command', cmd.next)

    const hasSubject = Boolean(subject)
    let assertionsPassed = true
    if (hasSubject && assertion) {
      try {
        expect(subject).to.be[assertion]
      } catch (e) {
        console.error(e)
        assertionsPassed = false
      }
    }

    if (!hasSubject || !assertionsPassed) {
      let nextCommand = cmd.attributes.next
      while (nextCommand) {
        console.log(
          'skipping the next "%s" command "%s"',
          nextCommand.attributes.type,
          nextCommand.attributes.name,
        )
        // cy.log(`**skipping ${cmd.attributes.next.attributes.name}**`)
        console.log('skipping "%s"', nextCommand.attributes.name)
        console.log(nextCommand.attributes)
        nextCommand.attributes.skip = true

        nextCommand = nextCommand.attributes.next
        if (nextCommand && nextCommand.attributes.type === 'parent') {
          console.log(
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
  console.log(cmd)
  const next = cmd.attributes.next

  if (next && next.attributes.name === 'if') {
    // disable the built-in assertion
    return get(selector).then(
      (getResult) => {
        console.log('internal get result', getResult)
        return getResult
      },
      (noResult) => {
        console.log('no get result', noResult)
        debugger
      },
    )
  }

  return get(selector)
})

// Cypress.Commands.overwrite('click', function (click, subject) {
//   console.log('my click', subject)
//   return click(subject)
// })
