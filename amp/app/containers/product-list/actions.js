/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import IntegrationManager from 'mobify-integration-manager/dist/'
import urlMapper from 'web/app/config/url-mapper'
import {ITEMS_PER_PAGE} from 'web/app/containers/product-list/constants'

export const updateUIState = createAction('Update product list page UI state')

export const initialize = (url) => (dispatch) => {
    const {
        query,
        start = 0,
        count = ITEMS_PER_PAGE,
        sort,
        filters = {}
    } = urlMapper.parseSearchUrl(url)

    const {cgid} = filters
    const searchParams = {
        count,
        filters,
        query,
        start,
        sort
    }

    dispatch(updateUIState(searchParams))

    // AMP requires the redux store to be in complete state when initialize completes
    // Make sure all dispatches are complete before returning the promise
    return Promise.all([
        new Promise((resolve) => {
            if (cgid) {
                resolve(dispatch(IntegrationManager.categories.getCategory(cgid, {url})))
            }
            resolve()
        }),
        dispatch(IntegrationManager.productSearch.searchProducts(searchParams))
    ])
}
