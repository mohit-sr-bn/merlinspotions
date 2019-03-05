/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {makeFormEncodedRequest} from 'progressive-web-sdk/dist/utils/fetch-utils'
import {isLocalStorageAvailable, getCookieValue} from 'progressive-web-sdk/dist/utils/utils'
import {setLoggedIn, receiveNavigationData} from 'mobify-integration-manager/dist/integration-manager/results'
import {parseNavigation} from './navigation/parser'
import {readLoggedInState} from './account/utils'
import {parsePrice} from 'mobify-integration-manager/dist/utils/parser-utils'

/**
 * Multiplies the given price by quantity
 * @param {string} price
 * @param {number} quantity
 * @example
 * // Returns 95.96
 * productSubtotal('23.99', 4)
 */
export const productSubtotal = (price, quantity) => {
    // Note: this is naive to non-dollar currencies!
    const subtotal = (parsePrice(price) * quantity)

    return `${subtotal}`
}

/**
 * Converts an HTML text snippet into raw text.
 * @param {String} fragment
 * @example
 * ie. '<span class=\"price\">$14.00<\/span>' => '$14.00'
 */
export const textFromFragment = (fragment) => {
    const e = document.createElement('div')
    e.innerHTML = fragment
    return e.textContent.trim()
}


/**
 * Convert an HTML text snippet into raw text without price currency symbol.
 * @parm {String} fragment
 * @example
 * ie. '<span class=\"price\">$14.00<\/span>' => '14.00'
 */
export const getPriceFromFragment = (priceFragment) => parsePrice(textFromFragment(priceFragment))

export const submitForm = (url, data, options) => {
    // The form_key is a session-level value. If there is
    // a form_key cookie, that trumps all!
    const formKey = getCookieValue('form_key')
    if (formKey) {
        data.form_key = formKey
    }

    return makeFormEncodedRequest(url, data, options)
}

/**
 * Converts the given thumbnail URL to a higher resolution format
 * @param {*string} src the URL to the higher resolution image
 */
export const getHighResImage = (src) => {
    return src ? src.replace(/thumbnail\/\d+x\d+/, 'small_image/240x300') : src
}

// Some of the endpoints don't work with fetch, getting a 400 error
// from the backend. This function wraps the jQuery ajax() function
// to make requests to these endpoints.
//
// It looks like the server may be looking for the header
// X-Requested-With: XMLHttpRequest, which is not present with fetch.
//
// Alternatively, we could have an issue with header case:
// http://stackoverflow.com/questions/34656412/fetch-sends-lower-case-header-keys
export const jqueryAjaxWrapper = (options) => {
    return new Promise((resolve, reject) => {
        window.Progressive.$.ajax({
            ...options,
            success: (responseData) => resolve(responseData),
            error: (xhr, status) => reject(status)
        })
    })
}

export const prepareEstimateAddress = (inputAddress = {}) => {
    const {
        countryId = 'US',
        regionId,
        region,
        postcode = null
    } = inputAddress

    const address = {
        country_id: countryId,
        postcode
    }

    if (region) {
        address.region = region
    } else if (regionId) {
        address.regionId = regionId
    } else {
        address.regionId = '0'
    }

    return address
}

export const getNameValue = (firstname, lastname) =>
      [firstname, lastname].filter((item) => item).join(' ')

export const parseAddress = (address) => {
    const [addressLine1, addressLine2] = address.street
    return {
        city: address.city,
        countryId: address.country_id,
        preferred: address.default_shipping,
        id: `${address.id}`,
        firstname: address.firstname,
        lastname: address.lastname,
        fullname: getNameValue(address.firstname, address.lastname),
        // The form expects to be given a value for a field called name
        // If we don't provide an initial value for name when checking out with a saved address,
        // submitting the payment can fail silently, as form validation will fail
        // but the field that is missing data is hidden
        name: getNameValue(address.firstname, address.lastname),
        postcode: address.postcode,
        regionId: `${address.region.region_id}`,
        region: address.region.region,
        regionCode: address.region.region_code,
        addressLine1,
        addressLine2,
        telephone: address.telephone,
    }
}

const setLoggedInStorage = ($, $response) => {
    const [fullname, email] = $response
        .find('.box-information .box-content p')
        .contents()
        .filter((_, item) => item.nodeType === Node.TEXT_NODE)
        .map((_, item) => item.textContent.trim())

    const isLoggingIn = !!fullname

    if (!isLoggingIn) {
        if (isLocalStorageAvailable()) {
            return localStorage.setItem('mage-cache-storage', '{}')
        }
        document.cookie = 'ls_mage-cache-storage={}; path=/; expires=;'
        return true
    }

    if (isLocalStorageAvailable()) {
        const mageStorage = localStorage.getItem('mage-cache-storage')
        const userInfo = mageStorage ? JSON.parse(mageStorage) : {}
        userInfo.customer = {fullname, email}
        localStorage.setItem('mage-cache-storage', JSON.stringify(userInfo))
    } else {
        const mageCookie = getCookieValue('ls_mage-cache-storage')
        const userInfo = mageCookie ? JSON.parse(decodeURIComponent(mageCookie)) : {}
        userInfo.customer = {fullname, email}
        const updatedCookie = `ls_mage-cache-storage=${encodeURIComponent(JSON.stringify(userInfo))}; path=/; expires=;`
        document.cookie = updatedCookie
    }
    return true
}

export const updateLoggedInState = (res) => (dispatch) => {
    const [$, $response] = res
    setLoggedInStorage($, $response)
    const isLoggedIn = readLoggedInState()
    dispatch(setLoggedIn(isLoggedIn))
    dispatch(receiveNavigationData(parseNavigation($, $response, isLoggedIn)))
}

/**
 * Extract all of the JSON pieces in 'text/x-magento-init' script
 * elements, and merge them together into a single configuration object
 *
 * Returns an Immutable Map ready for the Redux store.
 */
export const extractMagentoJson = ($html) => {
    return $html
        .find('script[x-type="text/x-magento-init"]')
        .map((_, item) => item.innerHTML)
        .get()
        .map(JSON.parse)
        .map((item) => Immutable.fromJS(item))
        .reduce((summary, item) => summary.mergeDeep(item), Immutable.Map())
}

const SHIPPING_STEP_PATH = ['#checkout', 'Magento_Ui/js/core/app', 'components', 'checkout', 'children', 'steps', 'children', 'shipping-step', 'children', 'shippingAddress']

export const extractMagentoShippingStepData = ($html) => {
    return extractMagentoJson($html).getIn(SHIPPING_STEP_PATH)
}

// From Magento page-cache.js
const generateRandomString = (chars, length) => {
    let result = ''
    length = length > 0 ? length : 1

    while (length--) {
        result += chars[Math.round(Math.random() * (chars.length - 1))]
    }

    return result
}

// Set the cookie and returns the value
export const generateFormKeyCookie = () => {
    // From Magento page-cache.js
    const allowedCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const length = 16
    const generatedKey = generateRandomString(allowedCharacters, length)
    const lifetime = 3600
    const expires = new Date((new Date().getTime()) + lifetime * 1000)
    document.cookie = `form_key=${encodeURIComponent(generatedKey)}; expires=${expires.toGMTString()}; domain=.${window.location.hostname}`
    return generatedKey
}

export const getCheckoutConfigObject = ($html) => {
    const $configScript = $html.find('script:contains(window.checkoutConfig)')

    if ($configScript.length) {
        const objectMatch = /window\.checkoutConfig\s*=\s*([^;]+);/.exec($configScript.html())
        return objectMatch ? JSON.parse(objectMatch[1]) : {}
    }

    return {}
}

export const parseCheckoutEntityID = ($html) => {
    const configObject = getCheckoutConfigObject($html)

    return configObject && configObject.quoteData ? configObject.quoteData.entity_id : ''
}

// Returns true if the app needs to use proxy URLs to access the original site
// proxy URLs are required for universal apps (renders server side and client side)
export const appRequiresProxiedURLs = () => typeof window !== 'undefined' && window.Progressive && window.Progressive.isUniversal
