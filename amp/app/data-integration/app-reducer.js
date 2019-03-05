/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/*
 * Our own app reducer, because AMP only needs `setCurrentURL` and the web
 * version ends up including code that relies on `window` to exist.
*/
import {handleActions} from 'redux-actions'
import {fromJS} from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'

import {
    receiveCurrentProductId,
    setCurrentURL,
    receiveSelectedCurrency
} from 'mobify-integration-manager/dist/integration-manager/results'

import {CURRENT_URL} from 'progressive-web-sdk/dist/store/app/constants'

export const initialState = fromJS({
    [CURRENT_URL]: ''
})

export default handleActions({
    [setCurrentURL]: mergePayload,
    [receiveCurrentProductId]: mergePayload,
    [receiveSelectedCurrency]: mergePayload
}, initialState)
