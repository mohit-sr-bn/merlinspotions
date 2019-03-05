/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {
    setRemoveItemId,
    setIsWishlistComplete,
    setTaxRequestPending,
    setPromoSubmitting,
    autoAddToCartStarted,
    autoAddToCartFinished
} from './actions'


export default handleActions({
    [setTaxRequestPending]: mergePayload,
    [setPromoSubmitting]: mergePayload,
    [setRemoveItemId]: mergePayload,
    [setIsWishlistComplete]: mergePayload,
    [autoAddToCartStarted]: (state) => state.set('autoAddToCartInProgress', true),
    [autoAddToCartFinished]: (state) => state.set('autoAddToCartInProgress', false)
}, Immutable.Map())
