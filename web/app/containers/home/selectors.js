/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import Immutable from 'immutable'

import {getUi, getProductSearches} from '../../store/selectors'
import {getNavigationChildren} from '../../modals/navigation/selectors'
import {getHeroProductsSearchParams} from './constants'
import stringify from 'json-stable-stringify'

export const getHome = createSelector(getUi, ({home}) => home)

export const getHomePageMeta = createGetSelector(getHome, 'pageMeta', Immutable.Map())

export const getHomeCategories = createSelector(
    getNavigationChildren,
    (children) => children.filter((navChild) => navChild.get('isCategoryLink'))
)

export const getHeroProducts = createSelector(
    getProductSearches,
    (productSearches) => {
        const searchParams = stringify(getHeroProductsSearchParams())
        const results = productSearches.get(searchParams, Immutable.Map())

        return results.get('products', Immutable.List())
    }
)
