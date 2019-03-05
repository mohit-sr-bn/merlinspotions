/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/namespace */
/* eslint-disable import/named */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {createPropsSelector} from 'reselect-immutable-helpers'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'

import {splitFullName} from 'progressive-web-sdk/dist/utils/utils'
import {
    receiveUserEmail,
    receiveShippingAddress,
    receiveSelectedShippingMethod,
    setDefaultShippingAddressId,
    clearShippingAddress
} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'
import {handleCartError} from '../app/actions'
import {openModal} from 'progressive-web-sdk/dist/store/modals/actions'
import {CART_MERGE_ITEMS_MODAL} from '../../modals/constants'

import {getShippingFormValues, getShippingEstimateAddress} from '../../store/form/selectors'
import {getSelectedSavedShippingAddress} from '../../store/checkout/shipping/selectors'
import {addNotification, removeNotification} from 'progressive-web-sdk/dist/store/notifications/actions'

import {trigger} from '../../utils/astro-integration'
import {isRunningInAstro} from '../app/selectors'

export const showCompanyAndApt = createAction('Showing the "Company" and "Apt #" fields (Shipping)')
export const showSignIn = createAction('Showing the "Password" and "Sign In" fields (Shipping)')
export const setCustomerEmailRecognized = createAction('Set Customer email Recognized', ['customerEmailRecognized'])
export const setShowAddNewAddress = createAction('Setting the "Saved/New Address" field', ['showAddNewAddress'])
export const receiveData = createAction('Receive Checkout Shipping Data')
export const setIsFetchingShippingMethod = createAction('Set fetching shipping method flag', ['isFetchingShippingMethod'])

const WELCOME_BACK_NOTIFICATION_ID = 'shippingWelcomeBackMessage'

export const initShippingPage = (url, routeName) => (dispatch) => (
    dispatch(IntegrationManager.checkout.initCheckoutShippingPage(url, routeName))
        .catch((error) => dispatch(handleCartError(error)))
)

const onShippingEmailRecognized = () => (dispatch) => {
    dispatch(setCustomerEmailRecognized(true))
    dispatch(addNotification(
        WELCOME_BACK_NOTIFICATION_ID,
        'Welcome back! Sign in for a faster checkout or continue as a guest.',
        true
    ))
}

const onShippingEmailAvailable = () => (dispatch) => {
    dispatch(removeNotification(WELCOME_BACK_NOTIFICATION_ID))
    return dispatch(setCustomerEmailRecognized(false))
}

export const onShippingLoginError = (errorMessage) =>
    addNotification(
        'shippingEmailError',
        errorMessage,
        true
    )

export const onSavedShippingAddressChange = (id, savedAddress) => (dispatch) => {
    dispatch(setDefaultShippingAddressId(id))
    dispatch(setIsFetchingShippingMethod(true))

    if (!id) {
        dispatch(clearShippingAddress())
    }

    return dispatch(IntegrationManager.checkout.fetchShippingMethodsEstimate(savedAddress))
        .catch((error) => dispatch(handleCartError(error)))
        .then(() => dispatch(setIsFetchingShippingMethod(false)))
}

export const submitSignIn = () => (dispatch, getState) => {
    const {
        username,
        password
    } = getShippingFormValues(getState())

    return dispatch(IntegrationManager.account.login(username, password, 'on'))
        .then(({defaultAddress, isCartMerged}) => {
            if (isCartMerged) {
                dispatch((openModal(CART_MERGE_ITEMS_MODAL)))
            }
            if (defaultAddress && defaultAddress.id) {
                dispatch(onSavedShippingAddressChange(defaultAddress.id, defaultAddress))
            }
        })
        .then(() => dispatch(IntegrationManager.checkout.fetchSavedShippingAddresses()))
        .catch((error) => dispatch(onShippingLoginError(error.message)))
}

const submitShippingSelector = createPropsSelector({
    address: getSelectedSavedShippingAddress,
    formValues: getShippingFormValues
})

export const submitShipping = () => (dispatch, getState) => {
    const shippingSelections = submitShippingSelector(getState())
    let formValues = shippingSelections.formValues
    const savedAddress = shippingSelections.address
    if (savedAddress) {
        // Merge form values with the values we have for the selected saved address
        formValues = {
            ...formValues,
            ...savedAddress
        }
        dispatch(setDefaultShippingAddressId(formValues.savedAddress))
    }
    const {
        name,
        company,
        addressLine1,
        addressLine2,
        countryId,
        city,
        regionId,
        postcode,
        telephone,
        shippingMethodId,
        username
    } = formValues
    const {firstname, lastname} = formValues.firstname ? formValues : splitFullName(name)
    const address = {
        firstname,
        lastname,
        name,
        company,
        addressLine1,
        addressLine2,
        countryId,
        city,
        regionId,
        postcode,
        telephone,
    }

    if (username) {
        dispatch(receiveUserEmail(username))
    }
    dispatch(receiveSelectedShippingMethod(shippingMethodId))
    dispatch(receiveShippingAddress(address))
    return dispatch(IntegrationManager.checkout.submitShipping({...address, shippingMethodId, savedAddress}))
        .then((paymentURL) => {
            browserHistory.push({
                pathname: paymentURL
            })
        })
        .catch((error) => dispatch(handleCartError(error)))
        // second catch block is to catch any non-cart
        // expiry error messages that handleCartError might throw
        .catch(() => (
            dispatch(addNotification(
                'submitShippingError',
                `Unable to save shipping information. Please, check input data.`,
                true
            ))))
}

export const isEmailAvailable = () => (dispatch, getState) => {
    const formValues = getShippingFormValues(getState())

    if (IntegrationManager.custom && IntegrationManager.custom.isEmailAvailable && formValues.username) {
        return dispatch(IntegrationManager.custom.isEmailAvailable(formValues.username))
        .then((emailAvailable) => {
            if (emailAvailable) {
                return dispatch(onShippingEmailAvailable())
            }
            return dispatch(onShippingEmailRecognized())
        })
    }

    return dispatch(onShippingEmailAvailable())
}

export const fetchShippingMethods = () => (dispatch, getState) => {
    const address = getShippingEstimateAddress(getState())

    dispatch(setIsFetchingShippingMethod(true))
    return dispatch(IntegrationManager.checkout.fetchShippingMethodsEstimate(address))
        .catch((error) => dispatch(handleCartError(error)))
        .then(() => dispatch(setIsFetchingShippingMethod(false)))
}

export const enableNativeAlert = () => (dispatch, getState) => {
    if (isRunningInAstro(getState())) {
        trigger('checkout:enable-alert')
    }
}
