/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */


import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import * as ReduxForm from 'redux-form'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {validateFullName, validateCCExpiry, validateCCNumber, validatePostalCode} from 'progressive-web-sdk/dist/utils/validation'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {getCardData, cvvAmex, cvvDefault} from 'progressive-web-sdk/dist/card-utils'

// Selectors
import {PAYMENT_FORM_NAME} from '../../../store/form/constants'
import {getBillingInitialValues} from '../../../store/checkout/billing/selectors'
import {getSelectedSavedAddressId} from '../../../store/checkout/shipping/selectors'

// Actions
import {submitPayment} from '../actions'

// SDK Component
import {Grid, GridSpan} from 'progressive-web-sdk/dist/components/grid'

// Partials
import CreditCardForm from './credit-card-form'
import BillingAddressForm from './billing-address-form'
import OrderSummary from './order-summary'

import {formatMessage} from '../../../components/intl/index'


const validate = (values, savedAddressId, context) => {
    const errors = {}
    const requiredFieldNames = [
        'name',
        'addressLine1',
        'city',
        'countryId',
        'postcode',
        'telephone',
        'ccexpiry',
        'ccname',
        'ccnumber',
        'cvv'
    ]
    const cardData = getCardData(values.ccnumber)
    const cardDataCvv = parseInt(cardData.cvv.default.toString())
    const defaultCvv = parseInt(cvvDefault.default.toString())
    const amexCvv = parseInt(cvvAmex.default.toString())

    if (values.name && !validateFullName(values.name)) {
        errors.name = context && formatMessage(context, {id: 'checkoutShipping.form.validation.fixNames'})
    }

    if (values.ccnumber && !validateCCNumber(values.ccnumber)) {
        errors.ccnumber = context && formatMessage(context, {id: 'checkoutPayment.form.validation.fixCCNum'})
    }

    if (values.ccexpiry && !validateCCExpiry(values.ccexpiry)) {
        errors.ccexpiry = context && formatMessage(context, {id: 'checkoutPayment.form.validation.fixExpiry'})
    }

    // check if card cvv is amex cvv or default
    if (values.cvv) {
        const isAmex = cardDataCvv === amexCvv
        const cvvLength = values.cvv.length

        if ((isAmex && cvvLength !== amexCvv) || (!isAmex && cvvLength !== defaultCvv)) {
            errors.cvv = context && formatMessage(context, {id: 'checkoutPayment.form.validation.fixCVVLength'})
        }
    }

    // don't validate if the address has already been validated by backend
    if (!savedAddressId || !values.billingSameAsShipping) {
        if (values.countryId && values.postcode && !validatePostalCode(values.postcode, values.countryId.toUpperCase())) {
            errors.postcode = context && formatMessage(context, {id: 'checkoutShipping.form.validation.fixPostalCode'})
        }
    }

    requiredFieldNames.forEach((fieldName) => {
        if (!values[fieldName]) {
            errors[fieldName] = context && formatMessage(context, {id: 'checkoutShipping.form.required'})
        }
    })

    return errors
}

class CheckoutPaymentForm extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(values) {
        return new Promise((resolve, reject) => {
            const errors = validate(values, this.props.savedAddressId, this.context)
            if (!Object.keys(errors).length) {
                this.props.submitPayment()
                return resolve()
            }
            return reject(new ReduxForm.SubmissionError(errors))
        })
    }

    render() {
        const {
            handleSubmit
        } = this.props

        return (
            <Grid className="u-center-piece">
                <GridSpan tablet={{span: 6, pre: 1, post: 1}} desktop={{span: 7}}>
                    <form id={PAYMENT_FORM_NAME} data-analytics-name={UI_NAME.payment} className="t-checkout-payment__form" onSubmit={handleSubmit(this.onSubmit)} noValidate>
                        <CreditCardForm />
                        <BillingAddressForm />
                    </form>
                </GridSpan>
                <GridSpan tablet={{span: 6, pre: 1, post: 1}} desktop={{span: 5}}>
                    <OrderSummary submitPayment={handleSubmit(this.onSubmit)} />
                </GridSpan>
            </Grid>
        )
    }
}

CheckoutPaymentForm.propTypes = {
    /**
     * Redux-form internal
     */
    handleSubmit: PropTypes.func,
    /**
    * The id of previsouly saved address
    */
    savedAddressId: PropTypes.string,
    /**
    * Submits the payment form information to the server
    */
    submitPayment: PropTypes.func,
    /**
     * Redux-form internal
     */
    submitting: PropTypes.bool
}

CheckoutPaymentForm.contextTypes = {
    intl: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    initialValues: getBillingInitialValues,
    savedAddressId: getSelectedSavedAddressId
})

const mapDispatchToProps = {
    submitPayment
}

const CheckoutPaymentReduxForm = ReduxForm.reduxForm({
    form: PAYMENT_FORM_NAME,
    keepDirtyOnReinitialize: true,
    enableReinitialize: true,
    validate
})(CheckoutPaymentForm)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutPaymentReduxForm)
