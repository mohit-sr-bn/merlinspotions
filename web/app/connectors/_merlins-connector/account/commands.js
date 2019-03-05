/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {makeRequest, makeFormEncodedRequest} from 'progressive-web-sdk/dist/utils/fetch-utils'
import {jqueryResponse} from 'progressive-web-sdk/dist/jquery-response'
import {getCurrentProductId} from 'progressive-web-sdk/dist/store/products/selectors'
import {extractPathFromURL, splitFullName, getCookieValue} from 'progressive-web-sdk/dist/utils/utils'
import {SubmissionError} from 'redux-form'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {getFormKey, getUenc, getCurrentOrderId} from '../selectors'
import {fetchPageData} from '../app/commands'
import {getCart} from '../cart/commands'
import {
    receiveAccountInfoData,
    receiveAccountOrderListData,
    receiveCurrentOrderNumber,
    receiveUpdatedWishlistItem,
    removeWishlistItem,
    receiveSavedAddresses
} from 'mobify-integration-manager/dist/integration-manager/api/account/results'

import {
    buildFormData,
    createAddressRequestObject,
    receiveWishlistResponse
} from './utils'

import {
    isFormResponseInvalid,
    parseAccountInfo,
    parseOrderListData,
    parseOrder
} from './parsers'
import {
    jqueryAjaxWrapper,
    updateLoggedInState,
    parseAddress
} from '../utils'
import {
    CART_URL,
    LOGIN_POST_URL,
    CREATE_ACCOUNT_POST_URL,
    ACCOUNT_INFO_URL,
    ACCOUNT_ORDER_LIST_URL,
    getDeleteAddressURL,
    UPDATE_WISHLIST_URL,
    WISHLIST_URL,
    getWishlistQuantityUrl,
    getAccountOrderDetailUrl
} from '../config'

export const getAccountInfo = () => (dispatch) => {
    return dispatch(fetchPageData(ACCOUNT_INFO_URL))
        .then((res) => {
            const [$, $response] = res
            dispatch(receiveAccountInfoData(parseAccountInfo($, $response)))
        })
}

export const getSavedAddresses = () => (dispatch) => {
    const fetchURL = `/rest/default/V1/carts/mine`
    return makeRequest(fetchURL, {method: 'GET'})
        .then((response) => response.json())
        .then(({customer: {addresses}}) => addresses.map((address) => parseAddress(address)))
        .then((addresses) => dispatch(receiveSavedAddresses(addresses)))
}

export const getWishlist = () => (dispatch) => {
    return dispatch(fetchPageData(WISHLIST_URL))
        .then(([$, $response]) => dispatch(receiveWishlistResponse($, $response)))
}

export const addToCartFromWishlist = (productId, {itemId, quantity}) => (dispatch, getState) => {
    const currentState = getState()
    const formKey = getFormKey(currentState)
    const uenc = getUenc(productId)(currentState)
    const href = '/wishlist/index/cart/'
    const requestData = {
        item: itemId,
        qty: quantity,
        uenc,
        form_key: formKey
    }
    return makeFormEncodedRequest(href, requestData, {method: 'POST'})
        .then((response) => {
            if (response.url.includes('configure')) {
                // the response is a redirect to the PDP
                // The user needs to select their options
                browserHistory.push({
                    pathname: extractPathFromURL(response.url)
                })
                // Throw an error to prevent showing the item added modal
                throw new Error('Redirecting to PDP, item not added')
            } else {
                return jqueryResponse(response)
                    .then((res) => {
                        const [$, $response] = res

                        // Don't return this promise because we don't
                        // need to wait until this returns to update the wishlist UI
                        dispatch(getCart())

                        dispatch(receiveWishlistResponse($, $response))
                    })
            }
        })
}

export const removeItemFromWishlist = (itemId) => (dispatch, getState) => {
    const requestBody = {
        item: parseInt(itemId),
        form_key: getFormKey(getState())
    }
    return makeFormEncodedRequest('/wishlist/index/remove/', requestBody, {method: 'POST'})
        .then(() => dispatch(removeWishlistItem(itemId)))
}

const MAGENTO_MESSAGE_COOKIE = 'mage-messages'
const clearMessageCookie = () => {
    document.cookie = `${MAGENTO_MESSAGE_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}
const DEFAULT_ERROR_TEXT = 'Username or password is incorrect'
const EXISTING_ACCT_REGEX = /already an account/

const submitForm = (href, formValues, formSelector) => {
    clearMessageCookie()
    return makeFormEncodedRequest(href, formValues, {method: 'POST'})
        .then(jqueryResponse)
        .catch(() => {
            throw new SubmissionError({_error: 'Failed to login due to network error.'})
        })
        .then((res) => {
            const [$, $response] = res // eslint-disable-line no-unused-vars

            if (isFormResponseInvalid($response, formSelector)) {
                const messages = JSON.parse(decodeURIComponent(getCookieValue(MAGENTO_MESSAGE_COOKIE)))

                if (messages.length === 0) {
                    throw new SubmissionError({_error: DEFAULT_ERROR_TEXT})
                }

                let message = messages[0].text.replace(/\+/g, ' ')
                // This message has HTML in it, just patch it up for now
                if (EXISTING_ACCT_REGEX.test(message)) {
                    message = `${message.split('.')[0]}.`
                }

                throw new SubmissionError({
                    _error: message
                })
            }
            return res
        })
}

export const login = (username, password, rememberMe) => (dispatch, getState) => {
    const currentState = getState()
    const formKey = getFormKey(currentState)

    const formData = {
        'login[username]': username,
        'login[password]': password,
        form_key: formKey,
        send: ''
    }

    if (rememberMe) {
        formData.persistent_remember_me = 'on'
    }

    return submitForm(LOGIN_POST_URL, formData, '.form-login')
        .then((res) => dispatch(updateLoggedInState(res)))
        .then(() => ({
            isCartMerged: false,
            href: '/customer/account'
        }))
}

export const registerUser = (firstname, lastname, email, password, opts) => (dispatch, getState) => {
    const currentState = getState()
    const formKey = getFormKey(currentState)

    const formData = {
        firstname,
        lastname,
        email,
        password,
        password_confirmation: password,
        form_key: formKey
    }
    if (opts.rememberMe) {
        formData.persistent_remember_me = 'on'
    }
    return submitForm(CREATE_ACCOUNT_POST_URL, formData, '.form-create-account')
        .then((res) => dispatch(updateLoggedInState(res)))
        .then(() => ({
            href: '/customer/account'
        }))
}

const findPathForRoute = (routes, routeName) => {
    const path = routes[0].childRoutes.find((route) => route.routeName === routeName).path
    return `/${path}`
}

/**
 * Uses React router to ensure browser history remains consistent with the
 * selected section.
 */
export const navigateToSection = (router, routes, sectionName) => {
    return () => {
        router.push(findPathForRoute(routes, sectionName))
    }
}

export const logout = () => (dispatch) => (
    makeRequest('/customer/account/logout/')
        .then(jqueryResponse)
        // Don't wait for the cart to do everything else
        .then((res) => {
            dispatch(updateLoggedInState(res))
            dispatch(getCart())
        })
        // Update navigation menu and logged in flag
        // Need to request current location so that the right entry is active
        .then(() => dispatch(fetchPageData(window.location.href)))
)

export const updateShippingAddress = (shippingData) => (dispatch) => {
    const formData = buildFormData({
        success_url: '',
        error_url: '',
        ...createAddressRequestObject(shippingData),
        default_billing: 1,
        default_shipping: 1,
    })

    const postUpdateCustomerAddressURL = '/customer/address/formPost/'

    return jqueryAjaxWrapper({
        url: postUpdateCustomerAddressURL,
        data: formData,
        method: 'POST',
        processData: false,
        contentType: false
    })
        .catch((error) => {
            console.error('Updating the user Shipping and Billing address failed. Response log:')
            console.error(error)
            throw new Error('Unable to save Shipping and Billing Address')
        })
}

export const updateBillingAddress = (paymentData) => (dispatch) => {
    const formData = buildFormData({
        success_url: '',
        error_url: '',
        ...createAddressRequestObject(paymentData),
        default_billing: 1,
        default_shipping: 1,
    })

    const postUpdateCustomerAddressURL = '/customer/address/formPost/id/46/'
    return jqueryAjaxWrapper({
        url: postUpdateCustomerAddressURL,
        data: formData,
        method: 'POST',
        processData: false,
        contentType: false
    })
        .catch((error) => {
            console.error('Updating the user Shipping/Billing address failed. Response log:')
            console.error(error)
            throw new Error('Unable to save Billing Address')
        })
}

export const deleteAddress = (addressId) => (dispatch, getState) => { // eslint-disable-line
    const formKey = getFormKey(getState())
    return makeRequest(getDeleteAddressURL(addressId, formKey), {method: 'POST'})
        .then(() => dispatch(getSavedAddresses()))
}

export const editAddress = (address, addressId) => (dispatch, getState) => { // eslint-disable-line
    const formKey = getFormKey(getState())
    const formData = {
        form_key: formKey,
        ...createAddressRequestObject(address)
    }
    return submitForm(`/customer/address/formPost/id/${addressId}`, formData, '.form-address-edit')
        .then(() => dispatch(getSavedAddresses()))
        .then(() => ({
            href: '/customer/address/index/'
        }))
}

export const addAddress = (address) => (dispatch, getState) => {
    const formKey = getFormKey(getState())
    const formData = {
        form_key: formKey,
        ...createAddressRequestObject(address)
    }
    return submitForm('/customer/address/formPost/', formData, '.form-address-edit')
        .then(() => dispatch(getSavedAddresses()))
        .then(() => ({
            href: '/customer/address/index/'
        }))
}

/* eslint-disable camelcase */
export const updateAccountInfo = ({names, email, currentPassword, newPassword}) => (dispatch, getState) => {
    const formKey = getFormKey(getState())
    const {firstname, lastname} = splitFullName(names)
    const formData = {
        firstname,
        lastname,
        email,
        change_password: currentPassword && newPassword ? 1 : '',
        current_password: currentPassword ? currentPassword : '',
        password: newPassword ? newPassword : '',
        password_confirmation: newPassword ? newPassword : '',
        form_key: formKey
    }

    dispatch(receiveAccountInfoData({names, email}))
    return submitForm('/customer/account/editPost/', formData, '.form-edit-account')
        .then(() => ({
            href: '/customer/account/edit/'
        }))
}

export const updateAccountPassword = (formValues) => (dispatch) => {
    dispatch(updateAccountInfo(formValues))
}

export const getOrder = (orderNumber) => (dispatch, getState) => { // eslint-disable-line
    /*
    * Merlins Potions has an orderId associated with each orderNumber
    * getOrder command takes orderNumber as the only parameter
    * In IM V2 we should translate orderNumber to orderId in pre-hook
    * instead of using: orderId = getCurrentOrderId(getState())
    */
    const orderId = getCurrentOrderId(getState())
    const url = getAccountOrderDetailUrl(orderId)

    return dispatch(fetchPageData(url))
        .then(([$, $response]) => {
            const orderData = {
                ...parseOrder($, $response),
                id: orderId
            }
            // set current order Number
            dispatch(receiveCurrentOrderNumber(orderData.orderNumber))
            dispatch(receiveAccountOrderListData({[orderData.orderNumber]: orderData}))
        })
}

export const getOrderList = () => (dispatch) => {
    return dispatch(fetchPageData(ACCOUNT_ORDER_LIST_URL))
    .then(([$, $response]) => {
        return dispatch(receiveAccountOrderListData(parseOrderListData($, $response)))
    })
}

export const reorderPreviousOrder = (orderNumber) => (dispatch, getState) => { // eslint-disable-line
    const formKey = getFormKey(getState())
    const orderId = orderNumber.replace(/^0+/, '')
    return makeFormEncodedRequest(`/sales/order/reorder/order_id/${orderId}/`, {form_key: formKey}, {method: 'POST'})
        .then(() => CART_URL)
}

export const updateWishlistItem = (itemId, wishlistId, quantity) => (dispatch, getState) => {
    const currentState = getState()
    const productId = getCurrentProductId(currentState)
    const payload = {
        product: productId,
        qty: quantity,
        id: itemId,
        form_key: getFormKey(currentState),
        // This won't always be defined, but add to wishlist will still work
        // if it's missing
        uenc: getUenc(productId)(currentState)
    }

    return makeFormEncodedRequest(UPDATE_WISHLIST_URL, payload, {method: 'POST'})
        .then(() => dispatch(receiveUpdatedWishlistItem({itemId, quantity})))
        .then(() => WISHLIST_URL)
}

export const updateWishlistItemQuantity = (quantity, itemId, wishlistId) => (dispatch, getState) => {
    const formKey = getFormKey(getState())
    const requestBody = {
        form_key: formKey,
        do: '',
    }
    requestBody[`qty[${itemId}]`] = quantity
    requestBody[`description[${itemId}]`] = ''
    return makeFormEncodedRequest(getWishlistQuantityUrl(wishlistId), requestBody, {method: 'POST'})
        .then(() => dispatch(receiveUpdatedWishlistItem({itemId, quantity})))
}
