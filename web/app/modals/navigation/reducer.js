/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {receiveNavigationData} from 'mobify-integration-manager/dist/integration-manager/results'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {setNavigationPath, receiveLocaleData} from './actions'


export const initialState = Immutable.fromJS({
    path: undefined,
    root: {
        children: [],
    },
})

export const reducer = handleActions({
    [receiveLocaleData]: (state, {payload}) => {
        return state.updateIn(['root', 'children'], (val) => val.push(Immutable.fromJS(payload.root.children)))
    },
    [receiveNavigationData]: mergePayload,
    [setNavigationPath]: mergePayload
}, initialState)

export default reducer
