/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
// import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {updateUIState} from './actions'
import {ITEMS_PER_PAGE} from './constants'

const initialState = Immutable.Map({
    count: ITEMS_PER_PAGE
})

export default handleActions({
    [updateUIState]: (state, {payload}) => {
        return initialState.merge(payload)
    }
}, initialState)
