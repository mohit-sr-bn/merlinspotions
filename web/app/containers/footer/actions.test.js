/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {signUpToNewsletter, newsletterSignupComplete} from './actions'
import {SIGNUP_SUCCESSFUL, SIGNUP_FAILED} from './constants'

jest.mock(
    'mobify-integration-manager/dist/',
    () => ({
        custom: {
            submitNewsletter: jest.fn(() => Promise.resolve())
        }
    })
)
import IntegrationManager from 'mobify-integration-manager/dist/'

test('signUpToNewsletter submits the form and dispatches the success action on success', () => {
    const mockDispatch = jest.fn()
    mockDispatch.mockImplementation((...args) => args[0])
    IntegrationManager.custom.submitNewsletter.mockClear()
    IntegrationManager.custom.submitNewsletter.mockReturnValueOnce(Promise.resolve())

    const thunk = signUpToNewsletter('/test-form', 'POST', {thing: 'test'})
    expect(typeof thunk).toBe('function')

    return thunk(mockDispatch)
        .then(() => {
            expect(mockDispatch).toBeCalled()
            expect(IntegrationManager.custom.submitNewsletter).toBeCalled()
            expect(mockDispatch.mock.calls[1][0]).toEqual(newsletterSignupComplete(SIGNUP_SUCCESSFUL))
        })
})

test('signUpToNewsletter submits the form and dispatches the failure action on failure', () => {
    const mockDispatch = jest.fn()
    mockDispatch.mockImplementation((...args) => args[0])
    IntegrationManager.custom.submitNewsletter.mockClear()
    IntegrationManager.custom.submitNewsletter.mockReturnValueOnce(Promise.reject())

    const thunk = signUpToNewsletter('/test-form', 'POST', {thing: 'test'})
    expect(typeof thunk).toBe('function')

    return thunk(mockDispatch)
        .then(() => {
            expect(mockDispatch).toBeCalled()
            expect(IntegrationManager.custom.submitNewsletter).toBeCalled()
            expect(mockDispatch.mock.calls[1][0]).toEqual(newsletterSignupComplete(SIGNUP_FAILED))
        })
})
