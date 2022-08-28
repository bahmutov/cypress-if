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
      if (cmd.attributes.next) {
        console.log(
          'skipping the next command',
          cmd.attributes.next.attributes.name,
        )
        cmd.attributes.next.attributes.skip = true
        cy.log(`**skipping ${cmd.attributes.next.attributes.name}**`)
        if (subject) {
          cy.wrap(subject)
        }
        return
      }
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

Cypress.Commands.overwrite('click', function (click, subject) {
  console.log('my click', subject)
  return click(subject)
})

it('finds the li elements', () => {
  cy.visit('index.html')
  // if the list exists, it should have three items
  cy.get('#fruits li').if().should('have.length', 3)
  // if the list exists, it should have three items
  cy.get('#veggies li').if().should('have.length', 3)
  // if the button exists, it should have certain text
  // and then we click on it
  cy.get('button#load').if().should('have.text', 'Load').click()
  // if the button exists, click on it
  cy.get('button#does-not-exist').if().click()
})

it('clicks on the button if it is visible', () => {
  cy.visit('index.html')
  cy.get('button#hidden').if('visible').click()
  // but we can click on the visible button
  cy.get('button#load').if('visible').click()
})
