/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {requestContentById} from 'mobify-integration-manager/dist/connectors/sfcc/utils'
import {parsePageMeta} from 'mobify-integration-manager/dist/connectors/sfcc/parsers'
import {receiveCheckoutLocations} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'
import {ID_CONTAINER_MAP, STATES} from './constants'

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
    const id = ID_CONTAINER_MAP[routeName]
    return requestContentById(id)
        .then((resJson) => {
            return parsePageMeta(resJson)
        })
}

/**
 * Get supported locations data and store it in redux store
 * @function
 */
export const getLocationData = () => receiveCheckoutLocations({
    countries: [
        {
            id: '',
            label: '',
            regionRequired: false,
            postcodeRequired: false
        },
        {
            id: 'us',
            label: 'United States',
            regionRequired: true,
            postcodeRequired: true
        }
    ],
    regions: STATES
})
