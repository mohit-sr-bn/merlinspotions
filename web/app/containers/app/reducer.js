/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import {fromJS} from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'

import * as appActions from './actions'

import {isRunningInAstro} from '../../utils/astro-integration'

import {
    setCheckoutShippingURL,
    setCartURL,
    setWishlistURL,
    setSignInURL,
    setAccountURL,
    setAccountInfoURL,
    setAccountAddressURL,
    setAccountOrderListURL
} from 'mobify-integration-manager/dist/integration-manager/results'

export const initialState = fromJS({
    sprite: '',
    hideApp: true,
    scrollManager: {
        locked: false
    },
    isRunningInAstro
})

export default handleActions({
    [setCheckoutShippingURL]: mergePayload,
    [setCartURL]: mergePayload,
    [setWishlistURL]: mergePayload,
    [setSignInURL]: mergePayload,
    [setAccountInfoURL]: mergePayload,
    [setAccountAddressURL]: mergePayload,
    [setAccountURL]: mergePayload,
    [setAccountOrderListURL]: mergePayload,
    [appActions.updateSvgSprite]: mergePayload,
    [appActions.toggleHideApp]: mergePayload,
    [appActions.unlockScroll]: (state) => {
        return state.mergeDeep({
            scrollManager: {
                locked: false
            }
        })
    },
    [appActions.lockScroll]: (state) => {
        return state.mergeDeep({
            scrollManager: {
                locked: true
            }
        })
    },
    [appActions.receiveLocale]: mergePayload,
    [appActions.receiveTranslations]: mergePayload,
    [appActions.setRetryingConnection]: mergePayload,
    [appActions.initializeAppComplete]: (state) => {
        return state.set('initialized', true)
    }
}, initialState)
