/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {receiveWishlistUIData, receiveWishlistItemQuantity, setRemoveWishlistItemData} from './actions'

const initialState = Immutable.Map()

export default handleActions({
    [receiveWishlistUIData]: mergePayload,
    [receiveWishlistItemQuantity]: mergePayload,
    [setRemoveWishlistItemData]: mergePayload
}, initialState)
