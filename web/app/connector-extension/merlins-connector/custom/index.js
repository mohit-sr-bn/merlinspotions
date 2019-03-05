/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import {jqueryResponse} from 'progressive-web-sdk/dist/jquery-response'
import {makeRequest, makeFormEncodedRequest, makeJsonEncodedRequest} from 'progressive-web-sdk/dist/utils/fetch-utils'
import {receiveCheckoutLocations} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'

import {fetchPageData} from '../../../connectors/_merlins-connector/app/commands'
import {extractMagentoJson} from '../../../connectors/_merlins-connector/utils'
import {parsePageMeta} from 'progressive-web-sdk/dist/utils/parser-utils'
import {parseAccountLocations} from './parser'
import {URL_CONTAINER_MAP} from './constants'

export const isEmailAvailable = (email) => (dispatch) => {
    return makeJsonEncodedRequest(
            '/rest/default/V1/customers/isEmailAvailable',
            {customerEmail: email},
            {method: 'POST'}
        )
        .then((response) => response.text())
        .then((responseText) => {
            return /true/.test(responseText)
        })
}

export const submitNewsletter = (formData) => (dispatch) => {
    return makeFormEncodedRequest('/newsletter/subscriber/new/', formData, {method: 'POST'})
}


/**
 * Return the page meta data for a specific container
 * @function
 * @param {string} routeName The name of the container
 * @returns {Object} The object contains pageMeta
 *
 * NOTE: This function is backlogged for rework
 * Page meta data should not be something that is bound by integration manager
 * Depending on connector type, there are various ways page meta data can be
 * composed of:
 * - Hard-coded based on page template
 * - Composition of various data from data api end-point
 * - Captured from original source document
 */
export const getPageMetaData = (routeName) => (dispatch) => {
    const url = URL_CONTAINER_MAP[routeName]

    if (url) {
        return dispatch(fetchPageData(url))
            .then((res) => {
                const [$, $response] = res
                return parsePageMeta($, $response)
            })
    } else {
        return Promise.resolve()
    }
}

/**
 * Get supported locations data and store it in redux store
 * @function
 */
export const getLocationData = () => (dispatch) => {
    return makeRequest('/customer/address/new/')
    .then(jqueryResponse)
    .then(([, $response]) => {
        // we're going to fetch the cart page so we can re-use the country
        // parsing functionality from initCartPage
        const magentoFieldData = extractMagentoJson($response)
        return dispatch(receiveCheckoutLocations(parseAccountLocations(magentoFieldData, $response)))
    })
}
