/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import commands from './commands'

export const testStubCommand = (command, ...args) => {
    it(`${command.name} executes without errors`, () => {
        const dispatch = () => Promise.resolve()
        const getState = () => {}

        return command(...args)(dispatch, getState)
            .then((results) => {
                expect(results).toBe(undefined)
            })
    })
}

describe('When executing stub commands', () => {
    let originalLog

    beforeEach(() => {
        // Quiet down the tests...
        originalLog = console.log
        console.log = jest.fn()
    })

    afterEach(() => {
        console.log = originalLog
    })

    Object.keys(commands).forEach((branch) => {
        Object.keys(commands[branch]).forEach((cmd) => {
            // fetchPageData uses the `fetch()` API and creates a `Response` object
            // which isn't supported in the node testing env. We'll skip it for now.
            if (cmd === 'fetchPageData') {
                return
            }

            const args = []

            if (cmd.startsWith('init')) {
                args.push('https://www.example.com')
            }

            testStubCommand(commands[branch][cmd], ...args)
        })
    })
})
