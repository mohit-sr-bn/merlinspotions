/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {handleActions} from 'redux-actions'
import * as headerActions from './actions'
import {receiveSearchSuggestions} from 'mobify-integration-manager/dist/integration-manager/results'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'

export const initialState = Immutable.fromJS({
    isCollapsed: false,
    searchIsOpen: false,
    searchSuggestions: null
})

const header = handleActions({
    [headerActions.toggleHeader]: mergePayload,
    [headerActions.openSearch]: (state) => state.set('searchIsOpen', true),
    [headerActions.closeSearch]: (state) => state.set('searchIsOpen', false).set('searchSuggestions', null),
    [headerActions.clearSuggestions]: (state) => state.set('searchSuggestions', null),
    [headerActions.pushHistoryItem]: (state, {payload}) => {
        const historyUrl = payload.replace(/[?,&]homescreen=1/, '')
        const appHistory = state.get('appHistory')

        if (appHistory && appHistory.last() === historyUrl) {
            return state
        }

        if (appHistory && appHistory.size) {
            return state.setIn(['appHistory'], Immutable.fromJS(state.get('appHistory').concat(historyUrl)))
        }

        return state.setIn(['appHistory'], Immutable.fromJS([historyUrl]))
    },
    [headerActions.popHistoryItem]: (state) => {
        if (state.get('appHistory').size > 1) {
            return state.setIn(['appHistory'], state.get('appHistory').pop()) // pop is safe since this is an Immutable List
        }
        return state
    },
    [receiveSearchSuggestions]: (state, {payload}) => state.set('searchSuggestions', payload),
    [headerActions.setIsHistoryPage]: mergePayload
}, initialState)


export default header
