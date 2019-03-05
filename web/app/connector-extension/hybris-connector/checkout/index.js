/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {SubmissionError} from 'redux-form'
import {getPaymentURL, getConfirmationURL, CREDIT_CARD_TYPES} from 'mobify-integration-manager/dist/connectors/hybris/config'
import {SHIPPING_FORM_NAME} from '../../../store/form/constants'
import {
    deleteCartID, getCartID, getUserEmail, getUserType, makeApiRequest, parseResponse, storeUserEmail, USER_GUEST, USER_REGISTERED
} from 'mobify-integration-manager/dist/connectors/hybris/utils'
import {getBillingAddressInitialValues, getShippingAddressInitialValues, parseAddressResponse, populateLocationsData} from 'mobify-integration-manager/dist/connectors/hybris/account/utils'
import {parseMobifyToHybrisPaymentDetails} from 'mobify-integration-manager/dist/connectors/hybris/checkout/parsers'
import {parseMobifyToHybrisAddress, parseHybrisToMobifyAddress, parseShippingMethods} from 'mobify-integration-manager/dist/connectors/hybris/account/parsers'
import {getSavedAddresses, setCustomerShippingAddress} from 'mobify-integration-manager/dist/connectors/hybris/account/commands'
import {getCart} from 'mobify-integration-manager/dist/connectors/hybris/cart/commands'
import {getShippingAddress} from '../../../store/checkout/shipping/selectors'
import {getEmailAddress, getShippingMethods} from '../../../store/checkout/selectors'
import {getConfirmationData} from '../../../containers/checkout-confirmation/selectors'
import {getShippingFormValues} from '../../../store/form/selectors'
import {getCardTypes} from 'mobify-integration-manager/dist/connectors/hybris/selectors'
import {receiveCardTypes} from 'mobify-integration-manager/dist/connectors/hybris/actions'
import {
    receiveShippingMethods,
    receiveShippingAddress,
    receiveBillingAddress,
    receiveSelectedShippingMethod,
    receiveBillingSameAsShipping,
    receiveUserEmail,
    setDefaultShippingAddressId,
    receiveCheckoutConfirmationData
} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'
import {receiveOrderConfirmationContents} from 'mobify-integration-manager/dist/integration-manager/results'
import {getCardData} from 'progressive-web-sdk/dist/card-utils'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'

let shippingPageInitiated = false

const setCustomerCartShippingAddress = (addressId) => {
    if (addressId) {
        return makeApiRequest(`/users/${getUserType()}/carts/${getCartID()}/addresses/delivery`, {method: 'PUT'}, {addressId})
            .then(parseResponse('Could not set customer cart shipping address'))
    }
    return Promise.reject()
}

const setGuestCartShippingAddress = (mobifyAddress) => (dispatch, getState) => {
    const hybrisAddress = parseMobifyToHybrisAddress(mobifyAddress, getState)
    return makeApiRequest(`/users/${getUserType()}/carts/${getCartID()}/addresses/delivery?fields=FULL`, {method: 'POST'}, {...hybrisAddress, defaultAddress: true})
        .then(parseAddressResponse)
        .then((hybrisAddress) => parseHybrisToMobifyAddress(hybrisAddress, getState))
}

const setGuestCartCustomerEmail = (email, forceUpdate = false) => (dispatch, getState) => {
    const storedEmail = getEmailAddress(getState())
    if (forceUpdate || getUserType() === USER_GUEST && email !== storedEmail) {
        return makeApiRequest(`/users/${getUserType()}/carts/${getCartID()}/email`, {method: 'PUT'}, {email}, false)
            .then(parseResponse('Could not set customer email'))
            .then(() => {
                storeUserEmail(email)
                dispatch(receiveUserEmail(email))
            })
    }
    return Promise.resolve()
}

const fetchShippingMethods = (savedShippingMethodId) => (dispatch, getState) => {
    const {id: selectedShippingAddressId} = getShippingAddress(getState()).toJS()
    if (selectedShippingAddressId) {
        return makeApiRequest(`/users/${getUserType()}/carts/${getCartID()}/deliverymodes`, {method: 'GET'})
            .then(parseResponse('Could not get shipping methods', true))
            .then(({deliveryModes = []} = {}) => {
                if (deliveryModes.length) {
                    const shippingMethods = parseShippingMethods(deliveryModes)
                    const selectedShippingMethod = shippingMethods.find((shippingMethod) => shippingMethod.id === savedShippingMethodId)
                    dispatch(receiveSelectedShippingMethod(selectedShippingMethod ? selectedShippingMethod.id : shippingMethods[0].id))
                    return dispatch(receiveShippingMethods(shippingMethods))
                }
                dispatch(receiveSelectedShippingMethod(null))
                return dispatch(receiveShippingMethods([]))
            })
    }
    dispatch(receiveSelectedShippingMethod(null))
    return dispatch(receiveShippingMethods([]))
}

const selectAddressFromAddressBook = (mobifyAddress, savedShippingMethodId = '') => (dispatch, getState) => {
    // Edge case: While loading page (initCheckoutShippingPage) user might have selected to add a new address
    // before the cart address has being fetched. In this case, we ignore the result to avoid populating
    // the 'Add new address' form with the cart address
    const {savedAddress} = getShippingFormValues(getState())
    if (savedAddress !== 'addNewAddressField') {
        dispatch(receiveShippingAddress(mobifyAddress))
        dispatch(setDefaultShippingAddressId(mobifyAddress.id))
        dispatch(fetchShippingMethods(savedShippingMethodId))
    }
}

export const fetchGuestShippingMethodsEstimate = (inputAddress) => (dispatch, getState) => {
    const {username, shippingMethodId} = getShippingFormValues(getState())
    return dispatch(setGuestCartCustomerEmail(username))
        .then(() => dispatch(setGuestCartShippingAddress(inputAddress)))
        .then((mobifyAddress) => {
            dispatch(receiveShippingAddress(mobifyAddress))
            return dispatch(fetchShippingMethods(shippingMethodId))
        })
}

export const fetchCustomerShippingMethodsEstimate = (inputAddress) => (dispatch, getState) => {
    if (!inputAddress) {
        const initialValues = getShippingAddressInitialValues(getState)
        dispatch(receiveShippingAddress(initialValues))
        return dispatch(populateLocationsData())
    } else if (!inputAddress.id || inputAddress.savedAddress === 'addNewAddressField') {
        return dispatch(setCustomerShippingAddress(inputAddress))
            .then((mobifyAddress) => setCustomerCartShippingAddress(mobifyAddress.id).then(() => mobifyAddress))
            .then((mobifyAddress) => {
                dispatch(receiveShippingAddress(mobifyAddress))
                return dispatch(fetchShippingMethods(mobifyAddress.shippingMethodId))
            })
    }
    const {shippingMethodId} = getShippingFormValues(getState())
    return setCustomerCartShippingAddress(inputAddress.id)
        .then(() => dispatch(selectAddressFromAddressBook(inputAddress, shippingMethodId)))
}

const shouldUpdateShippingAddress = (inputAddress) => (dispatch, getState) => {
    const previousAddress = getShippingAddress(getState()).toJS()
    let shouldUpdate = false
    for (const k of Object.keys(inputAddress)) {
        if (previousAddress.hasOwnProperty(k) && k !== 'username' && inputAddress[k] !== previousAddress[k]) {
            shouldUpdate = true
        }
    }
    return shouldUpdate
}

const shouldFetchShippingMethods = ({
    username,
    name,
    telephone,
    addressLine1,
    city,
    postcode,
    countryId,
    regionId,
    region,
    id
}) => {
    if (username && name && telephone && addressLine1 && city && postcode && countryId && (regionId || region) || !!id) {
        return true
    }
    return false
}

export const fetchShippingMethodsEstimate = (inputAddress) => (dispatch, getState) => {
    if (!inputAddress || !shouldFetchShippingMethods(inputAddress)) {
        return Promise.resolve()
    }

    const shippingMethods = getShippingMethods(getState()).toJS()
    const avoidUpdating = !dispatch(shouldUpdateShippingAddress(inputAddress)) && shippingMethods.length
    if (!shippingPageInitiated || avoidUpdating) {
        return Promise.resolve()
    }
    return getUserType() === USER_REGISTERED
        ? dispatch(fetchCustomerShippingMethodsEstimate(inputAddress))
        : dispatch(fetchGuestShippingMethodsEstimate(inputAddress))
}

export const getSupportedCardTypes = () => (dispatch, getState) => {
    const cardTypes = getCardTypes(getState())
    if (!cardTypes.size) {
        return makeApiRequest('/cardtypes', {method: 'GET'})
            .then(parseResponse('Could not get card types', true))
            .then(({cardTypes}) => dispatch(receiveCardTypes(cardTypes)))
    }
    return Promise.resolve()
}

const populateShippingForm = (shippingAddress, shippingMethod) => (dispatch) => {
    const address = parseHybrisToMobifyAddress(shippingAddress)
    dispatch(populateLocationsData())
    dispatch(receiveShippingAddress(address))
    dispatch(fetchShippingMethods(shippingMethod.code))
    dispatch(receiveSelectedShippingMethod(shippingMethod ? shippingMethod.code : undefined))
}

const initShippingForm = () => (dispatch, getState) => {
    return dispatch(populateLocationsData())
        .then(() => {
            const initialValues = getShippingAddressInitialValues(getState)
            dispatch(receiveShippingAddress(initialValues))
        })
}

const onEditShippingForm = () => (dispatch) => {
    // Clear the delivery methods every time the form is edited or a different adddress is selected
    const shippingForm = document.getElementById(SHIPPING_FORM_NAME)
    shippingForm.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type !== 'email') {
            dispatch(receiveSelectedShippingMethod(null))
            dispatch(receiveShippingMethods([]))
        }
    })
    shippingForm.addEventListener('change', (e) => {
        if (e.target.tagName === 'SELECT') {
            dispatch(receiveSelectedShippingMethod(null))
            dispatch(receiveShippingMethods([]))
        } else if (e.target.name === 'savedAddress') {
            dispatch(receiveSelectedShippingMethod(null))
            dispatch(receiveShippingMethods([]))
        }
    })
    shippingPageInitiated = true
    return Promise.resolve()
}

export const initCheckoutShippingPage = () => (dispatch) => {
    shippingPageInitiated = false
    return dispatch(getCart())
        .then(({deliveryAddress: cartDeliveryAddress, deliveryMode: cartDeliveryMode = {}} = {}) => {
            if (getUserType() === USER_REGISTERED) {
                return dispatch(getSavedAddresses())
                    .then((addresses) => {
                        if (cartDeliveryAddress) {
                            const mobifyAddress = parseHybrisToMobifyAddress(cartDeliveryAddress)
                            return dispatch(selectAddressFromAddressBook(mobifyAddress, cartDeliveryMode.code))
                        } else if (!addresses || !addresses.length) {
                            return dispatch(initShippingForm())
                        } else {
                            const preferredAddress = addresses.find((address) => address.preferred)
                            if (preferredAddress && preferredAddress.id) {
                                return setCustomerCartShippingAddress(preferredAddress.id)
                                    .then(() => dispatch(selectAddressFromAddressBook(preferredAddress, cartDeliveryMode.code)))
                            } else {
                                return dispatch(initShippingForm())
                            }
                        }
                    })
            }
            return cartDeliveryAddress
                ? dispatch(populateShippingForm(cartDeliveryAddress, cartDeliveryMode))
                : dispatch(initShippingForm())
        })
        .then(() => dispatch(onEditShippingForm()))
}

export const initCheckoutPaymentPage = () => (dispatch, getState) => {
    const selectedShippingAddress = getShippingAddress(getState()).toJS()
    const {id: selectedShippingAddressId} = selectedShippingAddress

    if (selectedShippingAddressId) {
        return dispatch(populateLocationsData())
            .then(() => {
                dispatch(receiveBillingSameAsShipping(true))
                dispatch(receiveBillingAddress(selectedShippingAddress))
            })
            .then(() => dispatch(getSupportedCardTypes()))
    } else {
        return dispatch(getCart())
            .then(({deliveryAddress, deliveryMode = {}} = {}) => {
                if (deliveryAddress) {
                    const mobifyAddress = parseHybrisToMobifyAddress(deliveryAddress)
                    dispatch(receiveBillingSameAsShipping(true))
                    dispatch(receiveShippingAddress(mobifyAddress))
                    dispatch(receiveBillingAddress(mobifyAddress))
                    dispatch(fetchShippingMethods(deliveryMode.code))
                    return dispatch(receiveSelectedShippingMethod(deliveryMode.code ? deliveryMode.code.code : undefined))
                }
                return Promise.resolve()
            })
            .then(() => {
                dispatch(getSupportedCardTypes())
                return dispatch(populateLocationsData())
            })
    }
}

const resetCheckoutForms = () => (dispatch, getState) => {
    const shippingInitialValues = getShippingAddressInitialValues(getState)
    const billingInitialValues = getBillingAddressInitialValues(getState)
    dispatch(receiveShippingAddress(shippingInitialValues))
    dispatch(receiveSelectedShippingMethod(null))
    dispatch(receiveShippingMethods([]))
    dispatch(receiveBillingAddress(billingInitialValues))
    dispatch(receiveBillingSameAsShipping(true))
}

export const initCheckoutConfirmationPage = () => (dispatch, getState) => {
    // Reset checkout values stored in redux store
    const orderConfirmationData = getConfirmationData(getState()).toJS()
    if (orderConfirmationData && orderConfirmationData.guid) {
        dispatch(resetCheckoutForms())
    }

    // Send transaction analytics
    dispatch(receiveCheckoutConfirmationData(orderConfirmationData))

    return Promise.resolve()
}

const setShippingMethod = (deliveryModeId) => (dispatch) => {
    if (deliveryModeId) {
        return makeApiRequest(`/users/${getUserType()}/carts/${getCartID()}/deliverymode`, {method: 'PUT'}, {deliveryModeId})
            .then(parseResponse('Could not set shipping method'))
            .then(() => {
                dispatch(receiveSelectedShippingMethod(deliveryModeId))
                return getPaymentURL()
            })
    }
    throw new Error('No shipping method available')
}


export const submitShipping = (formValues) => (dispatch, getState) => {
    const state = getState()
    const {username: currentUsername} = getShippingFormValues(state)
    const storedUsername = getUserEmail()
    const isLoggedIn = getIsLoggedIn(state)
    const mustUpdateUsername = currentUsername !== storedUsername && !isLoggedIn

    if (mustUpdateUsername || dispatch(shouldUpdateShippingAddress(formValues))) {
        return dispatch(setGuestCartCustomerEmail(currentUsername, true))
            .then(() => dispatch(setGuestCartShippingAddress(formValues)))
            .then(() => dispatch(setShippingMethod(formValues.shippingMethodId)))
            .catch(() => {
                throw new SubmissionError({_error: 'Unable to save shipping data'})
            })
    } else {
        return dispatch(setShippingMethod(formValues.shippingMethodId))
            .catch(() => {
                throw new SubmissionError({_error: 'Unable to save shipping data'})
            })
    }
}

const setPaymentDetails = (formValues) => {
    const paymentDetails = parseMobifyToHybrisPaymentDetails(formValues)
    return makeApiRequest(`/users/${getUserType()}/carts/${getCartID()}/paymentdetails`, {method: 'POST'}, paymentDetails)
        .then(parseResponse('Unable to set payment details'))
}

const placeOrder = (cvv) => {
    return makeApiRequest(`/users/${getUserType()}/orders?fields=FULL`, {method: 'POST'}, {cartId: getCartID(), securityCode: cvv})
        .then(parseResponse('Unable to place order', true))
}

export const submitPayment = (formValues) => (dispatch) => {
    const type = getCardData(formValues.ccnumber).cardType

    if (!CREDIT_CARD_TYPES[type]) {
        throw new SubmissionError({_error: 'Unsupported card type'})
    }

    return setPaymentDetails(formValues)
        .then(() => placeOrder(formValues.cvv))
        .then(({code, guid, user = {}} = {}) => {
            const login = user.uid.split('|')[1]
            dispatch(receiveOrderConfirmationContents({
                email: login,
                guid,
                orderNumber: code,
            }))
            dispatch(resetCheckoutForms())
            deleteCartID()
            dispatch(getCart())
            return getConfirmationURL()
        })
        .catch(() => {
            throw new SubmissionError({_error: 'Unable to save payment data'})
        })
}

export const updateShippingAndBilling = () => (dispatch) => {
    console.log('[Hybris Connector] Called updateShippingAndBilling stub')
    return Promise.resolve()
}

export const fetchSavedShippingAddresses = () => (dispatch) => {
    console.log('[Hybris Connector] Called fetchSavedShippingAddresses stub')
    return Promise.resolve()
}
