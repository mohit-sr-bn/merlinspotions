/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {createAction, createActionWithAnalytics} from 'progressive-web-sdk/dist/utils/action-creation'
import {EVENT_ACTION} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {lockScroll, unlockScroll} from '../app/actions'
import urlMapper, {getRouteFromUrl} from '../../config/url-mapper'

export const pushHistoryItem = createAction('Added item to history stack')

export const popHistoryItem = createAction('Removed item from history stack')

export const setIsHistoryPage = createAction('Navigated to page from history', ['isHistoryPage'])

const searchAnalytics = createActionWithAnalytics(
    'Send search analytics', [],
    EVENT_ACTION.search,
    (query) => ({query})
)

export const toggleHeader = createAction('Toggled the header', ['isCollapsed'])

export const openSearch = createAction('Open header search')
export const closeSearch = createAction('Close header search')
export const clearSuggestions = createAction('Clear search suggestion')

export const openSearchModal = () => (dispatch) => {
    dispatch(openSearch())
    dispatch(lockScroll())
}

export const closeSearchModal = () => (dispatch) => {
    dispatch(closeSearch())
    dispatch(unlockScroll())
}

export const searchQueryChanged = (query) => (dispatch) => (
    dispatch(IntegrationManager.app.getSearchSuggestions(query))
)

export const searchSubmit = (query) => (dispatch) => {
    dispatch(searchAnalytics(query))

    browserHistory.push(
        getRouteFromUrl(urlMapper.getSearchUrl({query}))
    )
}

export const goBack = () => (dispatch) => {
    dispatch(popHistoryItem())
    dispatch(setIsHistoryPage(true))
    return browserHistory.goBack()
}
