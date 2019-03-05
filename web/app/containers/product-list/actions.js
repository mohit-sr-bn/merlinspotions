/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import IntegrationManager from 'mobify-integration-manager/dist/'
import urlMapper from '../../config/url-mapper'
import {ITEMS_PER_PAGE} from './constants'

export const updateUIState = createAction('Update product list page UI state')

export const initialize = (url) => (dispatch) => {
    const {
        query,
        start = 0,
        count = ITEMS_PER_PAGE,
        sort,
        total,
        filters = {}
    } = urlMapper.parseSearchUrl(url)

    const {cgid} = filters
    const searchParams = {
        count,
        filters,
        query,
        start,
        sort,
        total
    }
    let categoryPromise = Promise.resolve()

    // Update the UI information base on our findings in the url.
    dispatch(updateUIState(searchParams))

    // Looks like we are on a category page, so go ahead and get the category information.
    if (cgid) {
        categoryPromise = dispatch(IntegrationManager.categories.getCategory(cgid, {url}))
    }

    // Finally call the product search, let the reducer and selectors do the
    // rest of the work.
    return Promise.all([categoryPromise, dispatch(IntegrationManager.productSearch.searchProducts(searchParams))])
}
