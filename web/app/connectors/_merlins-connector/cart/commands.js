/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {
    makeRequest,
    makeJsonEncodedRequest
} from 'progressive-web-sdk/dist/utils/fetch-utils'
import {removeNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {
    getCartBaseUrl,
    getFormInfoByProductId
} from '../selectors'
import {receiveEntityID} from '../actions'
import {fetchPageData} from '../app/commands'
import {parseLocations} from '../checkout/parsers'
import {
    submitForm,
    textFromFragment,
    prepareEstimateAddress,
    extractMagentoJson,
    parseCheckoutEntityID,
    appRequiresProxiedURLs
} from '../utils'

import {
    receiveCartContents,
    receiveCartPageMeta,
    receiveCartTotals
} from 'mobify-integration-manager/dist/integration-manager/api/cart/results'
import {receiveCartProductData} from 'mobify-integration-manager/dist/integration-manager/api/products/results'
import {receiveCheckoutLocations} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'
import {
    getSelectedShippingMethod,
    getShippingAddress
} from '../../../store/checkout/shipping/selectors'
import {PROMO_ERROR} from '../../../containers/cart/constants'
import {parsePageMeta} from 'progressive-web-sdk/dist/utils/parser-utils'

import {
    parseCart,
    parseCartProducts,
    parseCartTotals
} from './parser'
import {getBaseRequestPath} from '../../../utils/url-utils'

const LOAD_CART_SECTION_URL = '/customer/section/load/?sections=cart%2Cmessages&update_section_id=true'
const REMOVE_CART_ITEM_URL = '/checkout/sidebar/removeItem/'
const UPDATE_ITEM_URL = '/checkout/sidebar/updateItemQty/'
const BASE_HEADERS = {
    Accept: 'application/json',
}

/**
 * Get the contents of the users cart
 */
export const getCart = () => (dispatch) => {
    const opts = {
        headers: BASE_HEADERS
    }
    dispatch(removeNotification('cartUpdateError'))
    const currentTimeMs = new Date().getTime()
    let cartURL = `${LOAD_CART_SECTION_URL}&_=${currentTimeMs}`
    if (appRequiresProxiedURLs()) {
        cartURL = getBaseRequestPath(cartURL)
    }

    return makeRequest(cartURL, opts)
        .then((response) => response.json())
        .then(({cart}) => {
            cart.items.forEach((item) => {
                item.product_price = textFromFragment(item.product_price)
            })

            if (cart.items.length > 0) {
                dispatch(receiveCartProductData(parseCartProducts(cart)))
            }

            dispatch(receiveCartContents(parseCart(cart)))
        })
}

/**
 * @function addToCart
 * @param {String} productId The product's ID
 * @param {Number} quantity The quantity to add
 * @param {Object} variant The variant object (required for this connector)
 * @param {Number} variant.id the unique product combination's ID
 * @param {Object} variant.values map of attribute slugs & selected values
 * @example
 * {
 *     color: 8,
 *     size: 6
 * }
 * @param {Object} variant.attributeIds map of options to option IDs, where optionID is Magento's attribute ID
 * @example
 * {
 *     color: 90,
 *     size: 131
 * }
 */
export const addToCart = (productId, quantity, variant) => (dispatch, getState) => {
    const formInfo = getFormInfoByProductId(productId)(getState())
    const hiddenInputs = formInfo.get('hiddenInputs')

    if (hiddenInputs === undefined) {
        return Promise.reject('Add to cart failed, form info missing')
    }

    const formValues = {
        ...formInfo.get('hiddenInputs').toJS(),
        qty: quantity
    }

    if (variant) {
        formValues.selected_configurable_option = parseInt(variant.id)
        Object.keys(variant.values).forEach((key) => {
            const superAttribute = variant.attributeIds[key]
            const selectedSuper = variant.values[key]

            formValues[`super_attribute[${superAttribute}]`] = parseInt(selectedSuper)
        })
    }

    let submitURL = formInfo.get('submitUrl')
    const requestOptions = {method: formInfo.get('method')}

    if (appRequiresProxiedURLs()) {
        submitURL = getBaseRequestPath(submitURL)
        // The add to cart submission redirects to the current PDP
        // This causes a cors error in the UPWA
        // Since we don't actually care what's in the response set the mode to no-cors
        // https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
        requestOptions.mode = 'no-cors'
    }

    return submitForm(
            submitURL,
            formValues,
            requestOptions
        )
        .then(() => dispatch(getCart()))
}

export const updateCartItem = (itemId, quantity, productId, variant) => (dispatch) => (
    // merlin's uses the standard addToCart to update cart items
    dispatch(addToCart(productId, quantity, variant))
)

/**
 * Remove an item from the users cart
 *
 * Notes:
 *
 * - The `item_id` present in the data returned from getCart.
 * - Response is 200 with JSON: `{"success":true}` on success
 * - Response is 200 with JSON: `{"success":false,"error_message":"We can't find the quote item."}` if item not in cart
 * - Important: The cart contents rendered in the main HTML is *not* updated until `getCart()` has been called which
 *   busts a cache. removeFromCart() will call getCart() once the request to remove the item has completed
 */
export const removeFromCart = (itemId) => (dispatch) => (
    submitForm(REMOVE_CART_ITEM_URL, {item_id: itemId}, {method: 'POST'})
        .then((response) => response.json())
        .then(({success}) => {
            if (success) {
                return dispatch(getCart())
            }
            throw new Error('Unable to remove item')
        })
)

/**
 * Update the quantity of an item in the users cart
 *
 * Notes:
 *
 * - Response is 200 with JSON: `{"success":true}` on success
 * - Response is 200 with JSON: `{"success":false,"error_message":"We can't find the quote item."}` if item not in cart
 */
export const updateItemQuantity = (itemId, itemQuantity) => (dispatch) => {
    const requestData = {
        item_id: itemId,
        item_qty: itemQuantity
    }

    return submitForm(UPDATE_ITEM_URL, requestData, {method: 'POST'})
        .then((response) => response.json())
        .then(({success}) => {
            if (success) {
                return dispatch(getCart())
            }
            throw new Error('Unable to update Quantity')
        })
}

const ESTIMATE_FIELD_PATH = ['#block-summary', 'Magento_Ui/js/core/app', 'components', 'block-summary', 'children', 'block-shipping', 'children', 'address-fieldsets', 'children']

export const initCartPage = (url) => (dispatch, getState) => {
    return dispatch(fetchPageData(url))
        .then(([$, $response]) => { // eslint-disable-line no-unused-vars
            const shippingAddress = getShippingAddress(getState()).toJS()
            const magentoFieldData = extractMagentoJson($response).getIn(ESTIMATE_FIELD_PATH)

            dispatch(receiveEntityID(parseCheckoutEntityID($response)))
            dispatch(receiveCheckoutLocations(parseLocations(magentoFieldData)))
            dispatch(receiveCartPageMeta(parsePageMeta($, $response).pageMeta))

            return dispatch(IntegrationManager.checkout.fetchShippingMethodsEstimate(shippingAddress || {}))
        })
}

const getCartTotals = (address, shippingMethod) => (dispatch, getState) => {
    const cartBaseUrl = getCartBaseUrl(getState())

    const shippingMethodParts = shippingMethod.split('_')

    const requestData = {
        addressInformation: {
            address: prepareEstimateAddress(address),
            shipping_carrier_code: shippingMethodParts[0],
            shipping_method_code: shippingMethodParts[1]
        }
    }

    return makeJsonEncodedRequest(`${cartBaseUrl}/totals-information`, requestData, {method: 'POST'})
        .then((response) => response.json())
        .then((responseJSON) => {
            const {
                shipping,
                discount,
                subtotal,
                tax,
                orderTotal
            } = parseCartTotals(responseJSON)
            return dispatch(receiveCartTotals(shipping, discount, subtotal, tax, orderTotal))
        })
}

export const fetchTaxEstimate = getCartTotals

const getCartTotalsSelector = createPropsSelector({
    address: getShippingAddress,
    shippingMethod: getSelectedShippingMethod
})

export const getCartTotalsInfo = () => (dispatch, getState) => {
    const {address, shippingMethod} = getCartTotalsSelector(getState())
    const shippingMethodId = shippingMethod.id || ''

    return dispatch(fetchTaxEstimate(address, shippingMethodId))
}

export const putPromoCode = (couponCode) => (dispatch, getState) => {
    const currentState = getState()
    const cartBaseUrl = getCartBaseUrl(currentState)

    return makeRequest(`${cartBaseUrl}/coupons/${couponCode}`, {method: 'PUT'})
        .then((response) => {
            // Check if coupon is valid
            if (response.status === 404) {
                throw Error(`${PROMO_ERROR}, code is invalid`)
            }
        })
        .then(() => dispatch(getCartTotalsInfo()))
}

export const deletePromoCode = (couponCode) => (dispatch, getState) => {
    const currentState = getState()
    const cartBaseUrl = getCartBaseUrl(currentState)

    const deletePromoUrl = `${cartBaseUrl}/coupons/`
    return makeJsonEncodedRequest(deletePromoUrl, couponCode, {method: 'DELETE'})
        .then((response) => response.text())
        .then((responseText) => {
            if (!/true/i.test(responseText)) {
                throw new Error('Failed to remove promo code')
            }
        })
        .then(() => dispatch(getCartTotalsInfo()))
}
