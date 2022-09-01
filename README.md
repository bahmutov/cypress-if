# cypress-if ![cypress version](https://img.shields.io/badge/cypress-10.7.0-brightgreen) [![ci](https://github.com/bahmutov/cypress-if/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/bahmutov/cypress-if/actions/workflows/ci.yml)

> Easy conditional if-else logic for your Cypress tests

Tested with `cy.get`, `cy.contains`, `cy.find`, `.then`, `.within` commands

- 📺 [Introduction To Using cypress-if Plugin to Write Conditional Cypress Commands](https://youtu.be/TVwU0OvrVUA)

## Install

Add this package as a dev dependency

```
$ npm i -D cypress-if
# or using Yarn
$ yarn add -D cypress-if
```

Include this package in your spec or support file

```js
import 'cypress-if'
```

Types for the `.if()` and `.else()` commands are described in the [src/index.d.ts](./src/index.d.ts) file.

## Use

Let's say, there is a dialog that might sometimes be visible when you visit the page. You can close it by finding it using the [cy.get](https://on.cypress.io/get) command follows by the `.if()` command. If the dialog really exists, then all commands chained after `.if()` run. If the dialog is not found, then the rest of the chain is skipped.

```js
cy.get('dialog#survey').if().contains('button', 'Close').click()
```

![Dialog was open](./img/dialog-open.gif)

## Assertions

By default, the `.if()` command just checks the existence of the element returned by the `cy.get` command. You might use instead a different assertion, like close a dialog if it is visible:

```js
cy.get('dialog#survey').if('visible').contains('button', 'Close').click()
```

If the dialog was invisible, the visibility assertion fails, and the rest of the commands was skipped

![Dialog was closed](./img/dialog-closed.png)

You can use assertions with arguments

```js
cy.wrap(42).if('equal', 42)...
```

You can use assertions with `not`

```js
cy.get('#enrolled').if('not.checked').check()
```

## else command

You can chain `.else()` command that is only executed if the `.if()` is skipped.

```js
cy.contains('Accept cookies')
  .if('visible')
  .click()
  .else()
  .log('no cookie banner')
```

The subject from the `.if()` command will be passed to the `.else()` chain, this allows you to work with the original element:

```js
cy.get('#enrolled')
  .if('checked')
  .log('**already enrolled**')
  // the checkbox should be passed into .else()
  .else()
  .check()
```

## Multiple commands

Sometimes it makes sense to place the "if" or "else" commands into `.then()` block

```js
cy.get('#survey')
  .if('visible')
  .then(() => {
    cy.log('closing the survey')
    cy.contains('button', 'Close').click()
  })
  .else()
  .then(() => {
    cy.log('Already closed')
  })
```

## Within

You can attach `.within()` command to the `.if()`

```js
cy.get('#survey')
  .if('visible')
  .within(() => {
    // fill the survey
    // click the submit button
  })
```

## finally

You might want to finish if/else command chains and continue afterwards. This is the purpose for the `.finally()` child command:

```js
cy.get('#agreed')
  .if('not.checked')
  .check()
  .else()
  .log('already checked')
  .finally()
  .should('be.checked')
```

## Debugging

This module uses [debug](https://github.com/debug-js/debug#readme) module to output verbose browser console messages when needed. To turn the logging on, open the browser's DevTools console and set the local storage entry:

```js
localStorage.debug = 'cypress-if'
```

If you re-run the tests, you should see the messages appear in the console

![Debug messages in the console](./img/debug.png)

## See also

- [cypress-ngx-ui-testing](https://github.com/swimlane/ngx-ui/tree/master/projects/swimlane/ngx-ui-testing)

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/cypress-if/issues) on Github

## MIT License

Copyright (c) 2022 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
