/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {setLoggedIn} from 'mobify-integration-manager/dist/integration-manager/results'
import IntegrationManager from 'mobify-integration-manager/dist/'

import {trigger, jsRpcMethod} from '../../utils/astro-integration'

export const syncLoggedIn = () => (dispatch) => {
    dispatch(setLoggedIn(true))
    dispatch(IntegrationManager.cart.getCart())
}

export const syncLoggedOut = () => (dispatch) => {
    dispatch(setLoggedIn(false))
    dispatch(IntegrationManager.cart.getCart())
}

export const refreshCart = () => (dispatch) => {
    dispatch(IntegrationManager.cart.getCart())
}

export const rpcUserIsLoggedIn = () => () => {
    jsRpcMethod('user:loggedIn', [])()
}

export const rpcUserIsGuest = () => () => {
    jsRpcMethod('user:guest', [])()
}

export const cartCountUpdated = (count, userTriggered) => () => {
    trigger('cart:count-updated', {
        count,
        userTriggered
    })
}
