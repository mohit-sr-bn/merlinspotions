/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import IntegrationManager from 'mobify-integration-manager/dist/'

import {receiveNavigationData} from 'mobify-integration-manager/dist/integration-manager/results'

import {getHeroProductsSearchParams} from './constants'
import {parseNavigation} from '../../connectors/_merlins-connector/navigation/parser'

export const receiveHomeData = createAction('Receive Home Data')

export const initialize = (url, routeName) => (dispatch) => {
    // Fetch information you need for the template here
    const fetchPageMeta = dispatch(IntegrationManager.custom.getPageMetaData(routeName))
        .then((pageMeta) => dispatch(receiveHomeData(pageMeta)))

    const searchParams = getHeroProductsSearchParams()
    const fetchProductsSearch = dispatch(
        IntegrationManager.productSearch.searchProducts(
            searchParams,
            // This skips the nav from being parsed by default. Instead, we
            // modify it below, THEN parse the navigation. See WEB-2083
            false
        )
    )
        .then((res) => {
            const [$, $response] = res

            $response.find('.active').removeClass('active')

            dispatch(receiveNavigationData(parseNavigation($, $response)))
        })

    return Promise.all([fetchPageMeta, fetchProductsSearch])
}
