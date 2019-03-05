/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import {makeApiRequest, parseResponse} from 'mobify-integration-manager/dist/connectors/hybris/utils'
import {receiveCheckoutLocations} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'
import {getRegions} from 'mobify-integration-manager/dist/connectors/hybris/config'

import {PAGEMETA_CONTAINER_MAP} from './constants'
import {parseDeliveryCountries} from './parser'

import {
    LOCALE_NAV_ITEM,
    LOCALE_NAV_HEADER
} from '../../../modals/navigation/constants'

import {supportedLanguages} from '../../../config/translations-config'

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
    return Promise.resolve(PAGEMETA_CONTAINER_MAP[routeName])
}

/**
 * Get supported locations data and store it in redux store
 * @function
 */
export const getLocationData = () => (dispatch) => {
    return makeApiRequest(`/deliverycountries`, {method: 'GET'})
        .then(parseResponse('Unable to get delivery countries', true))
        .then((response) => {
            const countries = parseDeliveryCountries(response)
            dispatch(receiveCheckoutLocations({countries, regions: getRegions()}))
        })
}

const buildLanguageChildren = (supportedLanguages, type) => {
    const children = [{
        type: LOCALE_NAV_HEADER,
        options: {
            icon: 'chevron-left',
            name: null
        },
        hasChild: false
    }]
    return children.concat(Object.keys(supportedLanguages).map((locale) => ({
        title: supportedLanguages[locale],
        path: `${locale}`,
        options: {
            locale: `${locale}`
        },
        type
    })))
}

export const fetchLocaleNavigationData = () => {

    const localeNavigationData = {
        children: {
            hasChild: true,
            options: {
                hasLogo: true
            },
            path: '/languages/',
            children: buildLanguageChildren(supportedLanguages, LOCALE_NAV_ITEM)
        }
    }

    return localeNavigationData
}
