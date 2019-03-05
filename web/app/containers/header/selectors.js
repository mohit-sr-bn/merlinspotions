/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import {getUi} from '../../store/selectors'
import {isStandaloneApp} from 'progressive-web-sdk/dist/store/app/selectors'

export const getHeader = createSelector(getUi, ({header}) => header)
export const getBrowsingHistory = createGetSelector(getHeader, 'appHistory', Immutable.List())
export const getIsCollapsed = createGetSelector(getHeader, 'isCollapsed')
export const getSearchIsOpen = createGetSelector(getHeader, 'searchIsOpen')
export const getSearchSuggestions = createGetSelector(getHeader, 'searchSuggestions')
export const showBackButton = createSelector(
    getBrowsingHistory,
    isStandaloneApp,
    (browsingHistory, isStandaloneApp) => isStandaloneApp && browsingHistory.size > 1)
