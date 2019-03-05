/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {SubmissionError} from 'redux-form'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {parseCartTotals} from '../cart/parser'
import {getCart} from '../cart/commands'
import {fetchPageData} from '../app/commands'
import {receiveEntityID} from '../actions'
import {PAYMENT_URL} from '../config'
import {fetchCustomerAddresses} from '../account/utils'
import {
    getCustomerEntityID,
    getCartBaseUrl
} from '../selectors'
import {
    prepareEstimateAddress,
    parseAddress,
    extractMagentoShippingStepData,
    parseCheckoutEntityID
} from '../utils'

import {
    receiveCheckoutLocations,
    receiveShippingAddress,
    receiveCheckoutConfirmationData,
    setDefaultShippingAddressId,
    receiveCheckoutPageMeta,
    receiveBillingAddress,
    receiveShippingMethods,
    receiveSelectedShippingMethod,
    receiveBillingSameAsShipping
} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {makeJsonEncodedRequest} from 'progressive-web-sdk/dist/utils/fetch-utils'
import {receiveCartContents} from 'mobify-integration-manager/dist/integration-manager/api/cart/results'
import {receiveSavedAddresses} from 'mobify-integration-manager/dist/integration-manager/api/account/results'
import {getCartItemsFull} from 'progressive-web-sdk/dist/store/cart/selectors'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'

import {parsePageMeta} from 'progressive-web-sdk/dist/utils/parser-utils'
import {ADD_NEW_ADDRESS_FIELD} from '../../../containers/checkout-shipping/constants'
import * as shippingSelectors from '../../../store/checkout/shipping/selectors'
import {getShippingFormValues} from '../../../store/form/selectors'

import {
    parseShippingInitialValues,
    parseLocations,
    parseShippingMethods,
    checkoutConfirmationParser
} from './parsers'

const INITIAL_SHIPPING_ADDRESS = {
    countryId: 'us',
    name: '',
    firstname: '',
    lastname: '',
    addressLine1: '',
    postcode: '',
    telephone: '',
    city: '',
    region: '',
    regionCode: '',
    regionId: '',
    id: '',
    preferred: undefined
}

const shippingMethodEstimateSelector = createPropsSelector({
    cartBaseUrl: getCartBaseUrl,
    selectedShippingMethodId: shippingSelectors.getSelectedShippingMethodValue
})

export const fetchShippingMethodsEstimate = (inputAddress) => (dispatch, getState) => {
    const state = getState()
    const {cartBaseUrl, selectedShippingMethodId} = shippingMethodEstimateSelector(state)
    const address = prepareEstimateAddress(inputAddress)

    return makeJsonEncodedRequest(
        `${cartBaseUrl}/estimate-shipping-methods`,
        {address},
        {method: 'POST'}
    )
        .then((response) => response.json())
        .then((responseJSON) => parseShippingMethods(responseJSON))
        .then((shippingMethods) => {
            dispatch(receiveShippingMethods(shippingMethods))
            dispatch(receiveSelectedShippingMethod(selectedShippingMethodId || shippingMethods[0].id))
        })
}

export const fetchSavedShippingAddresses = (selectedSavedAddressId) => {
    return (dispatch) => {
        fetchCustomerAddresses()
            .then(({customer}) => {
                let defaultShippingId
                const addresses = customer.addresses.map((address) => {
                    if (address.default_shipping) {
                        defaultShippingId = address.id
                    }

                    return parseAddress(address)
                })

                dispatch(setDefaultShippingAddressId(selectedSavedAddressId || defaultShippingId))
                dispatch(receiveSavedAddresses(addresses))
            })
    }
}

const processShippingData = ($response) => (dispatch, getState) => {
    dispatch(receiveEntityID(parseCheckoutEntityID($response)))
    const magentoFieldData = extractMagentoShippingStepData($response)
          .getIn(['children', 'shipping-address-fieldset', 'children'])

    dispatch(receiveCheckoutLocations(parseLocations(magentoFieldData)))
    const state = getState()
    const isInitialized = shippingSelectors.getIsInitialized(state)

    if (!isInitialized) {
        const currentAddressData = shippingSelectors.getShippingAddress(state).toJS()
        const initializationData = parseShippingInitialValues(magentoFieldData)

        // initialize our current state data with the data from Magento
        // this is so that we maintain a consistent data object
        dispatch(receiveShippingAddress({...initializationData, ...currentAddressData}))
    }
}

const processPaymentData = ($response) => (dispatch) => {
    dispatch(receiveEntityID(parseCheckoutEntityID($response)))
    const magentoFieldData = extractMagentoShippingStepData($response)
          .getIn(['children', 'shipping-address-fieldset', 'children'])

    dispatch(receiveCheckoutLocations(parseLocations(magentoFieldData)))
}

const shippingDataSelector = createPropsSelector({
    isLoggedIn: getIsLoggedIn,
    selectedSavedAddressId: shippingSelectors.getSelectedSavedAddressId
})

export const initCheckoutShippingPage = (url) => (dispatch, getState) => {
    return dispatch(fetchPageData(url))
        .then(([$, $response]) => {
            dispatch(receiveCheckoutPageMeta(parsePageMeta($, $response).pageMeta))
            return dispatch(processShippingData($response))
        })
        .then(() => {
            const {
                isLoggedIn,
                selectedSavedAddressId
            } = shippingDataSelector(getState())

            if (isLoggedIn) {
                return dispatch(fetchSavedShippingAddresses(selectedSavedAddressId))
            }
            return Promise.resolve()
        })
        .then(() => dispatch(fetchShippingMethodsEstimate(getShippingFormValues(getState()))))
}

export const initCheckoutConfirmationPage = (url) => (dispatch) => {
    return dispatch(fetchPageData(url))
        .then(([$, $response]) => {
            dispatch(receiveCheckoutConfirmationData(checkoutConfirmationParser($, $response)))
            dispatch(receiveCheckoutPageMeta(parsePageMeta($, $response).pageMeta))
            dispatch(getCart())
        })
}

export const submitShipping = (formValues) => (dispatch, getState) => {
    const savedAddress = formValues.savedAddress
    const submittingWithNewAddress = savedAddress === ADD_NEW_ADDRESS_FIELD || savedAddress === undefined || savedAddress === null
    const address = {
        firstname: formValues.firstname,
        lastname: formValues.lastname,
        company: formValues.company || '',
        telephone: formValues.telephone,
        postcode: formValues.postcode,
        city: formValues.city,
        street: formValues.addressLine2
            ? [formValues.addressLine1, formValues.addressLine2]
            : [formValues.addressLine1],
        regionId: formValues.regionId,
        region: formValues.region,
        countryId: formValues.countryId,
        saveInAddressBook: true
    }

    if (!submittingWithNewAddress) {
        address.saveInAddressBook = false

        delete address.default_billing
        delete address.default_shipping
    }

    // Prepare and then run Shipping Information request
    const {shippingMethodId} = formValues
    const shippingSelections = shippingMethodId.split('_')
    const addressData = {
        addressInformation: {
            shippingAddress: address,
            billingAddress: {
                ...address,
                saveInAddressBook: false
            },
            shipping_carrier_code: shippingSelections[0],
            shipping_method_code: shippingSelections[1]
        }
    }
    const state = getState()
    const cartBaseUrl = getCartBaseUrl(state)
    const persistShippingURL = `${cartBaseUrl}/shipping-information`
    return makeJsonEncodedRequest(persistShippingURL, addressData, {method: 'POST'})
        .then((response) => {
            if (response.status === 400) {
                throw Error(`Error submitting shipping information: ${response.statusText}`)
            }
            return response.json()
        })
        .then((responseJSON) => {
            if (!responseJSON.payment_methods) {
                throw new SubmissionError({_error: 'Unable to save shipping address'})
            }
            const cartItems = getCartItemsFull(state).toJS()
            const cartTotals = parseCartTotals(responseJSON.totals)
            dispatch(receiveCartContents({items: cartItems, ...cartTotals}))
            return PAYMENT_URL
        })
}

export const initCheckoutPaymentPage = (url) => (dispatch, getState) => {
    // If the user refreshes while on the payment page
    // we no longer have their shipping data
    // So, we need to send them back to the shipping page to enter it again
    const isInitialized = shippingSelectors.getIsInitialized(getState())
    if (!isInitialized) {
        return Promise.reject(new Error('missing-shipping-data'))
    }

    return dispatch(fetchPageData(url))
        .then((res) => {
            const [$, $response] = res // eslint-disable-line no-unused-vars
            const addressData = shippingSelectors.getInitialShippingAddress(getState()).toJS()
            dispatch(receiveBillingSameAsShipping(true))
            dispatch(receiveBillingAddress(addressData))
            dispatch(receiveCheckoutPageMeta(parsePageMeta($, $response).pageMeta))
            return dispatch(processPaymentData($response))
        })
}

export const submitPayment = (formValues) => (dispatch, getState) => {
    const currentState = getState()
    const cartBaseUrl = getCartBaseUrl(currentState)
    const entityID = getCustomerEntityID(currentState)
    const {
        firstname,
        lastname,
        company,
        addressLine1,
        addressLine2,
        countryId,
        city,
        region,
        regionId,
        postcode,
        customerAddressId,
        customerId
    } = formValues
    const address = {
        firstname,
        lastname,
        customerAddressId: `${customerAddressId}`,
        customerId: `${customerId}`,
        company: company || '',
        postcode,
        city,
        street: addressLine2 ? [addressLine1, addressLine2] : [addressLine1],
        regionId,
        region,
        countryId,
        saveInAddressBook: false
    }

    const paymentInformation = {
        billingAddress: {
            ...address
        },
        cartId: entityID,
        email: formValues.username,
        paymentMethod: {
            additional_data: null,
            method: 'checkmo',
            po_number: null
        }
    }

    const persistPaymentURL = `${cartBaseUrl}/payment-information`
    return makeJsonEncodedRequest(persistPaymentURL, paymentInformation, {method: 'POST'})
        .then((response) => response.json())
        .then((responseJSON) => {
            // Looks like when it is successful, the responseJSON is a number
            if (/^\d+$/.test(responseJSON)) {
                // reset isInitialized flag in shippingAddress
                dispatch(receiveShippingAddress({...INITIAL_SHIPPING_ADDRESS, isInitialized: false}))
                return '/checkout/onepage/success/'
            } else {
                dispatch(addNotification(
                    'paymentSubmissionError',
                    responseJSON.message,
                    true
                ))
                throw new Error(responseJSON.message)
            }
        })
}
