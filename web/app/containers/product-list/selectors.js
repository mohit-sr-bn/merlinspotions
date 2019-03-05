/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {createSelector} from 'reselect'
import {getCategories, getProductSearches, getUi} from '../../store/selectors'
import stringify from 'json-stable-stringify'

// Selectors for UI

export const getUIState = createSelector(
    getUi,
    ({productList}) => productList || Immutable.Map()
)

export const getUIStateKey = createSelector(
    getUIState,
    (uiState) => stringify(uiState.toJS())
)

// Selectors for Data

export const getCurrentCategoryId = createSelector(
    getUIState,
    (uiState) => uiState.getIn(['filters', 'cgid'], '')
)

export const getCategory = createSelector(
    getCurrentCategoryId,
    getCategories,
    (categoryId, categories) => categories.get(categoryId)
)

export const getCategoryPath = createSelector(
    getCategory,
    getCategories,
    (currentCategory, categories) => {
        let path = Immutable.List()

        if (!currentCategory) { return path }

        let category = currentCategory

        while (category) {
            path = path.unshift(category)
            category = categories.get(category.get('parentId'))
        }

        // Add the root category onto the path.
        // TODO: This category should be in the categories store, but currently we
        // aren't loading all categories on app load.
        path = path.unshift({
            id: 'home',
            title: 'Home',
            parentId: null,
            href: '/',
            url: '/',
            pageMeta: {},
        })

        return path
    }
)

export const getProductSearch = createSelector(
    getUIStateKey,
    getProductSearches,
    (uiStateKey, productSearches) => productSearches.get(uiStateKey)
)
