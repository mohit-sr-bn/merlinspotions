/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {CHECKOUT_CONFIRMATION_REGISTRATION_FAILED} from './constants'
import {CHECKOUT_CONFIRMATION_MODAL} from '../../modals/constants'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {createSelector} from 'reselect'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {addNotification, removeAllNotifications} from 'progressive-web-sdk/dist/store/notifications/actions'
import {openModal} from '../../modals/actions'
import * as shippingSelectors from '../../store/checkout/shipping/selectors'
import * as formSelectors from '../../store/form/selectors'
import {getConfirmationData} from './selectors'
import {getBillingAddress} from '../../store/checkout/billing/selectors'
import {getEmailAddress} from '../../store/checkout/selectors'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {trigger} from '../../utils/astro-integration'
import {isRunningInAstro} from '../app/selectors'

import {browserHistory} from 'progressive-web-sdk/dist/routing'

export const initialize = (url, routeName) => (dispatch) => {
    // Fetch information you need for the template here
    // Do not extend the init*Page command as it is going to be deprecated
    return dispatch(IntegrationManager.checkout.initCheckoutConfirmationPage(url, routeName))
}

export const hideRegistrationForm = createAction('Hiding Registration Form (Save Your Address Details)')

const registrationFormSelector = createPropsSelector({
    firstname: shippingSelectors.getShippingFirstName,
    lastname: shippingSelectors.getShippingLastName,
    email: getEmailAddress,
    password: createSelector(
        formSelectors.getConfirmationFormValues,
        ({password}) => password
    ),
    shippingData: shippingSelectors.getShippingAddress,
    billingAddressData: getBillingAddress
})

export const submitRegisterForm = () => {
    return (dispatch, getState) => {
        dispatch(removeAllNotifications())
        const {
            firstname,
            lastname,
            email,
            password,
            shippingData,
            billingAddressData
        } = registrationFormSelector(getState())

        const confirmationData = getConfirmationData(getState()).toJS()

        const opts = {}

        // `titleCode` is specific to Hybris Connector
        // You can delete this if you are not using Hybris Connector
        opts.titleCode = 'mr'
        opts.confirmationData = confirmationData

        return dispatch(IntegrationManager.account.registerUser(firstname, lastname, email, password, opts))
            .then(() => {
                dispatch(openModal(CHECKOUT_CONFIRMATION_MODAL, UI_NAME.createAccountConfirmation))
                return dispatch(IntegrationManager.account.updateShippingAddress(shippingData))
                    .then(() => {
                        if (!billingAddressData.sameAsShipping) {
                            return dispatch(IntegrationManager.account.updateBillingAddress(billingAddressData))
                        }

                        return Promise.resolve()
                    })
            })
            .then(() => dispatch(hideRegistrationForm()))
            .catch((error) => {
                if (error.name !== 'SubmissionError') {
                    dispatch(addNotification(
                        CHECKOUT_CONFIRMATION_REGISTRATION_FAILED,
                        `Sorry, registration failed. Contact us for assistance. ${error.message}`,
                        true
                    ))
                } else if (error.message.includes('Unable to save')) {
                    dispatch(addNotification(
                        CHECKOUT_CONFIRMATION_REGISTRATION_FAILED,
                        error.message,
                        true
                    ))
                } else {
                    dispatch(addNotification(
                        CHECKOUT_CONFIRMATION_REGISTRATION_FAILED,
                        'Could not complete registration. The email you provided may already be in use.',
                        true
                    ))
                }
            })
    }
}

export const continueShopping = () => (dispatch, getState) => {
    if (isRunningInAstro(getState())) {
        trigger('close')
    } else {
        browserHistory.push('/')
    }
}

export const checkoutCompleted = () => () => {
    trigger('checkout:completed')
}
