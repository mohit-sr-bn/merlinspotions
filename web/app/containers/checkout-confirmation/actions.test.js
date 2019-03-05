/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {submitRegisterForm} from './actions'
import Immutable from 'immutable'

jest.mock(
    'mobify-integration-manager/dist/',
    () => ({
        account: {
            registerUser: jest.fn(() => Promise.resolve()),
            updateShippingAddress: jest.fn(() => Promise.resolve())
        }
    })
)
import IntegrationManager from 'mobify-integration-manager/dist/'

jest.mock('progressive-web-sdk/dist/store/notifications/actions')
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {CONFIRMATION_FORM_NAME} from '../../store/form/constants'

describe('submitRegisterForm', () => {
    const mockDispatch = jest.fn()
    mockDispatch.mockImplementation((...args) => args[0])

    const confirmationData = {
        email: 'email',
        guid: 'guid',
        orderNumber: 'orderNumber'
    }

    const mockGetState = () => ({
        checkout: Immutable.fromJS({
            email: 'test@email.com',
            shipping: {
                address: {
                    firstname: 'test',
                    lastname: 'test'
                }
            }
        }),
        form: {
            [CONFIRMATION_FORM_NAME]: {
                values: {
                    password: 'Test',
                    password_confirmation: 'Test'
                }
            }
        },
        ui: {
            checkoutConfirmation: Immutable.fromJS({
                confirmationData
            })
        }
    })

    test('shows a notification on error', () => {
        IntegrationManager.account.registerUser.mockClear()
        IntegrationManager.account.registerUser.mockImplementationOnce(() => Promise.reject('Test error'))
        const thunk = submitRegisterForm()
        expect(typeof thunk).toBe('function')

        return thunk(mockDispatch, mockGetState)
            .then(() => {
                expect(mockDispatch).toBeCalled()
                expect(addNotification).toBeCalled()
            })
    })

    test('calls IntegrationManager.account.updateShippingAddress on success', () => {
        IntegrationManager.account.registerUser.mockClear()
        IntegrationManager.account.registerUser.mockImplementationOnce(() => Promise.resolve())
        const thunk = submitRegisterForm()
        expect(typeof thunk).toBe('function')

        return thunk(mockDispatch, mockGetState)
            .then(() => {
                expect(mockDispatch).toBeCalled()
                expect(IntegrationManager.account.updateShippingAddress).toBeCalled()
            })
    })

    test('calls IntegrationManager.account.registerUser with order confirmation data', () => {
        IntegrationManager.account.registerUser.mockClear()
        IntegrationManager.account.registerUser.mockImplementationOnce((...args) => {
            expect(args[4].confirmationData).toEqual(confirmationData)
            return Promise.resolve()
        })
        const thunk = submitRegisterForm()
        expect(typeof thunk).toBe('function')

        return thunk(mockDispatch, mockGetState)
            .then(() => {
                expect(IntegrationManager.account.registerUser).toBeCalled()
            })
    })
})
