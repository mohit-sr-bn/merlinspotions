/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {handleActions} from 'redux-actions'

import * as productDetailsActions from './actions'
import {receiveProductDetailsUIData} from 'mobify-integration-manager/dist/integration-manager/api/products/results'

import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'

const reducer = handleActions({
    [productDetailsActions.addToCartStarted]: (state) => state.set('addToCartInProgress', true),
    [productDetailsActions.addToCartComplete]: (state) => state.set('addToCartInProgress', false),
    [receiveProductDetailsUIData]: mergePayload,
    [productDetailsActions.receiveNewItemQuantity]: mergePayload,
    [productDetailsActions.setIsWishlistAdded]: mergePayload
}, Immutable.Map())

export default reducer
