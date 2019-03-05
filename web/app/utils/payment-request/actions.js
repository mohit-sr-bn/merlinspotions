/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import IntegrationManager from 'mobify-integration-manager/dist/'
import {
    receiveSelectedShippingMethod,
    receiveShippingAddress,
    receiveUserEmail
} from 'mobify-integration-manager/dist/integration-manager/api/checkout/results'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {createPropsSelector} from 'reselect-immutable-helpers'

import AppError from 'progressive-web-sdk/dist/analytics/error'

import {getPaymentDetails} from './selectors'
import {getSelectedShippingMethodValue, getShippingAddress} from '../../store/checkout/shipping/selectors'

const sendPaymentRequestAnalytics = (event) => {
    const {send, constants} = window.Progressive.analytics

    send({
        subject: constants.UI_SUBJECT.user,
        action: constants.UI_ACTION.click,
        object: constants.UI_OBJECT.button,
        name: `payment_request:${event}`
    })
}

const paymentRequestSelector = createPropsSelector({
    paymentDetails: getPaymentDetails,
    shippingAddress: getShippingAddress,
    selectedShippingMethod: getSelectedShippingMethodValue
})

const remapAddress = (shippingAddress) => {
    const {
        recipient,
        organization,
        addressLine,
        country,
        city,
        region,
        postalCode,
        phone
    } = shippingAddress || {}

    const [addressLine1, addressLine2] = addressLine

    const formValues = {
        firstname: recipient,
        lastname: recipient,
        company: organization,
        telephone: phone,
        postcode: postalCode,
        regionId: region,
        countryId: country,
        city,
        addressLine1,
        addressLine2,
        region
    }

    return formValues
}

const remapPaymentResult = (result) => {
    const {
        payerEmail,
        details
    } = result

    const {
        cardholderName,
        cardNumber,
        expiryMonth,
        expiryYear,
        cardSecurityCode,
        billingAddress
    } = details

    const formValues = {
        username: payerEmail,
        ccname: cardholderName,
        ccnumber: cardNumber,
        ccexpiry: `${expiryMonth}${expiryYear.slice(2)}`,
        cvv: cardSecurityCode,
        ...remapAddress(billingAddress)
    }

    return formValues
}

const onShippingAddressChange = (evt) => (dispatch, getState) => {
    const {
        shippingAddress
    } = evt.target

    const transformedShippingAddress = remapAddress(shippingAddress)
    dispatch(receiveShippingAddress(transformedShippingAddress))

    // When the shipping address changes, we want to find the appropriate shipping options
    const promise = dispatch(IntegrationManager.checkout.fetchShippingMethodsEstimate(transformedShippingAddress))
        .then(() => {
            // If the user never changes their shipping option, onShippingChange will never be called
            // So we also need to make sure to submit the shipping form here
            const shippingMethodId = paymentRequestSelector(getState()).selectedShippingMethod
            const formValues = {
                ...transformedShippingAddress,
                shippingMethodId
            }

            return dispatch(IntegrationManager.checkout.submitShipping(formValues))
        })
        // Return the payment details, so that the Payment Request sheet can update its state
        .then(() => paymentRequestSelector(getState()).paymentDetails)

    evt.updateWith(promise)
}

const updateShippingAddressAndOption = (result) => (dispatch, getState) => {
    const {
        shippingAddress,
        shippingOption
    } = result

    // If the shippingAddress hasn't been changed in the Payment Sheet,
    // it won't be provided as part of result
    // In that case, use whatever address we already have in the store
    const currentShippingAddress = paymentRequestSelector(getState()).shippingAddress
    const addressToUse = shippingAddress ? remapAddress(shippingAddress) : currentShippingAddress

    const formValues = {
        ...addressToUse,
        shippingMethodId: shippingOption
    }

    dispatch(receiveSelectedShippingMethod(shippingOption))
    dispatch(receiveShippingAddress(addressToUse))

    // Now that we have the selected shipping option,
    // we're ready to submit our shipping information
    return dispatch(IntegrationManager.checkout.submitShipping(formValues))
}

const onShippingOptionChange = (evt) => (dispatch, getState) => {
    const promise = dispatch(updateShippingAddressAndOption(evt.target))
        // Return the payment details, so that the Payment Request sheet can update its state
        .then(() => paymentRequestSelector(getState()).paymentDetails)

    evt.updateWith(promise)
}

const onSubmit = (result) => (dispatch) => {
    sendPaymentRequestAnalytics('submit')

    const formValues = remapPaymentResult(result)
    dispatch(receiveUserEmail(result.payerEmail))

    // If the user has already submitted one order,
    // it's possible for the user to click the pay button
    // without having modified the shipping address or option.
    // In that case, we need to make sure we're still submitting the address data.
    return dispatch(updateShippingAddressAndOption(result))
        .then(() => dispatch(IntegrationManager.checkout.submitPayment(formValues)))
        .then((url) => {
            // This closes the Payment Sheet
            result.complete('success')

            browserHistory.push({
                pathname: url
            })
        })
        .catch(() => result.complete('fail'))
}

export const showPaymentSheet = () => (dispatch, getState) => {
    // Provide the initial configuration needed to set up the PaymentRequest
    const supportedPaymentMethods = [{
        supportedMethods: ['basic-card', 'visa', 'mastercard', 'amex'],
        data: {
            supportedNetworks: ['visa', 'mastercard', 'amex'],
        }
    }]

    const initialPaymentDetails = paymentRequestSelector(getState()).paymentDetails
    const options = {
        requestShipping: true,
        requestPayerEmail: true
    }
    const request = new window.PaymentRequest(
        supportedPaymentMethods,
        initialPaymentDetails,
        options
    )

    request.addEventListener('shippingaddresschange', (evt) => dispatch(onShippingAddressChange(evt)))
    request.addEventListener('shippingoptionchange', (evt) => dispatch(onShippingOptionChange(evt)))

    request.show()
        // This promise resolves when the user clicks the "Pay" button
        .then((result) => dispatch(onSubmit(result)))
        .catch((e) => {
            // If the user has only closed the payment sheet,
            // that's not really an error and shouldn't be treated like one
            if (/Request cancelled/.test(e.message)) {
                sendPaymentRequestAnalytics('cancel')
            } else {
                try {
                    // This AppError automatically sends analytics about this error to our Engagement Engine
                    throw new AppError('Payment Request failed')
                } catch (e) {
                    console.error(
                        'Payment Request failed. ' +
                        'One common reason for PRAPI to fail is because of SSL errors on the page. ' +
                        'Check that the current page is loaded over HTTPS, ' +
                        'that a fully trusted certificate is used (accepting a certificate in the browser does not count), ' +
                        'and that no insecure requests are being made on the page. ' +
                        'Original error: '
                    , e)
                }
            }
        })
}
