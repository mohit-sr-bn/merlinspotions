/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import Immutable from 'immutable'

import {PRODUCT_DETAILS_ITEM_ADDED_MODAL} from '../../modals/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

jest.mock(
    'mobify-integration-manager/dist/',
    () => ({
        cart: {
            addToCart: jest.fn(() => Promise.resolve())
        }
    })
)
import IntegrationManager from 'mobify-integration-manager/dist/'
jest.mock('../../modals/actions')
import {openModal} from '../../modals/actions'

import {addToCartStarted, submitCartForm} from './actions'

/* eslint-disable import/namespace */

describe('Add to Cart', () => {
    const mockDispatch = jest.fn()
    mockDispatch.mockImplementation((...args) => args[0])

    const getStore = () => ({
        app: Immutable.fromJS({currentProduct: '1'}),
        products: Immutable.fromJS({
            1: {
                variationOptions: undefined
            }
        }),
        form: {
            'product-add-to-cart': Immutable.fromJS({
                values: {
                    quantity: 1
                }
            })
        },
    })

    beforeEach(() => {
        mockDispatch.mockClear()
    })

    test('submitCartForm marks operation as in progress and adds to cart', () => {
        const submitCartFormThunk = submitCartForm()
        expect(typeof submitCartFormThunk).toBe('function')

        submitCartFormThunk(mockDispatch, getStore).then(() => {
            expect(mockDispatch).toBeCalled()
            expect(mockDispatch.mock.calls[0][0]).toEqual(addToCartStarted())
            expect(mockDispatch.mock.calls[1][0]).toEqual(IntegrationManager.cart.addToCart('/', 1))
        })
    })

    test('submitCartForm shows the "added to cart" modal if it succeeds', () => {
        const submitCartFormThunk = submitCartForm()

        return submitCartFormThunk(mockDispatch, getStore).then(() => {
            expect(mockDispatch).toBeCalled()
            expect(openModal).toHaveBeenCalledWith(PRODUCT_DETAILS_ITEM_ADDED_MODAL, UI_NAME.addToCart)
        })
    })

    test('submitCartForm does not show the "added to cart" modal if it fails', () => {
        const submitCartFormThunk = submitCartForm()
        IntegrationManager.cart.addToCart.mockImplementation(() => Promise.reject('Network error adding to cart'))

        return submitCartFormThunk(mockDispatch, getStore).then(() => {
            expect(mockDispatch).not.toHaveBeenCalledWith(openModal(PRODUCT_DETAILS_ITEM_ADDED_MODAL))
        })
    })
})
