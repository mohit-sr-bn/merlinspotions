/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {showCompanyAndApt, showSignIn, setShowAddNewAddress, setCustomerEmailRecognized, setIsFetchingShippingMethod} from './actions'

export default handleActions({
    [setCustomerEmailRecognized]: mergePayload,
    [setShowAddNewAddress]: mergePayload,
    [setIsFetchingShippingMethod]: mergePayload,
    [showCompanyAndApt]: (state) => {
        return state.set('isCompanyOrAptShown', true)
    },
    [showSignIn]: (state) => {
        return state.set('isSignInShown', true)
    }
}, Immutable.Map())
