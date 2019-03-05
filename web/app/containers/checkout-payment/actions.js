/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {getPaymentBillingFormValues} from '../../store/form/selectors'
import {getEmailAddress} from '../../store/checkout/selectors'
import {getShippingAddress} from '../../store/checkout/shipping/selectors'
import {splitFullName} from 'progressive-web-sdk/dist/utils/utils'
import {handleCartError} from '../app/actions'
import {receiveBillingAddress, receiveBillingSameAsShipping} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'

export const receiveContents = createAction('Received CheckoutPayment Contents')
export const toggleLoadingState = createAction('Toggled the spinner inside of "Place Order" button', ['isLoading'])
export const toggleFixedPlaceOrder = createAction('Toggled the fixed "Place Order" container', ['isFixedPlaceOrderShown'])
export const toggleCardInputRadio = createAction('Toggled the card method radio input', ['isNewCardInputSelected'])
export const toggleCompanyAptField = createAction('Toggled the "Company" and "Apt #" fields (Payment)', ['isCompanyOrAptShown'])
export const toggleNewAddressFields = createAction('Toggled new address fields', ['newShippingAddressIsEnabled'])
export const setCvvType = createAction('Setting CVV type', ['cvvType'])

export const initPaymentPage = (url, routeName) => (dispatch) => (
    dispatch(IntegrationManager.checkout.initCheckoutPaymentPage(url, routeName))
        .catch((error) => dispatch(handleCartError(error)))
)

export const submitPayment = () => (dispatch, getState) => {
    dispatch(toggleLoadingState(true))
    const currentState = getState()
    const billingFormValues = getPaymentBillingFormValues(currentState)
    const billingSameAsShipping = billingFormValues.billingSameAsShipping

    // Remove the billingSameAsShipping value from our formValues object
    // so we don't store duplicate data in our app state
    delete billingFormValues.billingSameAsShipping

    // Careful. This get's completely overwritten below
    let address = null
    const email = getEmailAddress(currentState)
    const paymentInfo = {
        ccname: billingFormValues.ccname,
        ccnumber: billingFormValues.ccnumber,
        ccexpiry: billingFormValues.ccexpiry,
        cvv: billingFormValues.cvv
    }


    if (billingSameAsShipping) {
        address = {
            username: email,
            ...getShippingAddress(currentState).toJS(),
            sameAsShipping: true
        }
    } else {
        const {firstname, lastname} = splitFullName(billingFormValues.name)
        address = {
            firstname,
            lastname,
            username: email,
            ...billingFormValues,
        }
    }

    dispatch(receiveBillingSameAsShipping(billingSameAsShipping))
    dispatch(receiveBillingAddress(address))
    return dispatch(IntegrationManager.checkout.submitPayment({...address, ...paymentInfo, billingSameAsShipping}))
        .then((url) => {
            dispatch(toggleLoadingState(false))
            browserHistory.push({
                pathname: url
            })
        })
        .catch((error) => {
            dispatch(toggleLoadingState(false))
            return dispatch(handleCartError(error))
        })
}
