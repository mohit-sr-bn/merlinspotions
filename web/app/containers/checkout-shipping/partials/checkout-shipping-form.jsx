/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as ReduxForm from 'redux-form'
import isEmail from 'validator/lib/isEmail'

import {validateFullName, validatePostalCode} from 'progressive-web-sdk/dist/utils/validation'
import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'
import {getInitialShippingAddress} from '../../../store/checkout/shipping/selectors'
import {formatMessage} from '../../../components/intl/index'

import {submitShipping} from '../actions'
import {SHIPPING_FORM_NAME} from '../../../store/form/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {Grid, GridSpan} from 'progressive-web-sdk/dist/components/grid'
import ShippingAddress from './shipping-address'
import ShippingEmail from './shipping-email'
import ShippingMethod from './shipping-method'

const validate = (values, props, context = {}) => {
    const errors = {}
    const requiredFieldNames = [
        'name',
        'addressLine1',
        'city',
        'countryId',
        'postcode',
        'telephone'
    ]
    const isSavedAddressSelected = !!values.savedAddress

    if (isSavedAddressSelected) {
        // If user has chosen a saved address, no further validation necessary
        return errors
    }

    if (values.username && !isEmail(values.username)) {
        errors.username = context.intl && formatMessage(context, {id: 'checkoutShipping.form.validation.fixEmail'})
    }

    if (values.name && !validateFullName(values.name)) {
        errors.name = context.intl && formatMessage(context, {id: 'checkoutShipping.form.validation.fixNames'})
    }

    if (!props.isLoggedIn && !values.username) {
        errors.username = context.intl && formatMessage(context, {id: 'checkoutShipping.form.required'})
    }

    if (values.countryId && values.postcode && !validatePostalCode(values.postcode, values.countryId.toUpperCase())) {
        errors.postcode = context.intl && formatMessage(context, {id: 'checkoutShipping.form.validation.fixPostalCode'})
    }

    requiredFieldNames.forEach((fieldName) => {
        if (!values[fieldName]) {
            errors[fieldName] = context.intl && formatMessage(context, {id: 'checkoutShipping.form.required'})
        }
    })

    return errors
}

class CheckoutShippingForm extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(values) {
        return new Promise((resolve, reject) => {
            const errors = validate(values, this.props, this.context)
            if (!Object.keys(errors).length) {
                return this.props.submitShipping()
            }
            return reject(new ReduxForm.SubmissionError(errors))
        })
    }

    render() {
        const {
            handleSubmit,
            isLoggedIn
        } = this.props

        return (
            <form id={SHIPPING_FORM_NAME} data-analytics-name={UI_NAME.shippingAddress} className="t-checkout-shipping__form" onSubmit={handleSubmit(this.onSubmit)} noValidate>
                <Grid className="u-center-piece">
                    <GridSpan tablet={{span: 6, pre: 1, post: 1}} desktop={{span: 7}}>
                        {!isLoggedIn && <ShippingEmail />}
                        <ShippingAddress />
                    </GridSpan>

                    <GridSpan tablet={{span: 6, pre: 1, post: 1}} desktop={{span: 5}}>
                        <ShippingMethod />
                    </GridSpan>
                </Grid>
            </form>
        )
    }
}

CheckoutShippingForm.propTypes = {
    /**
     * Whether the form is disabled or not
     */
    disabled: PropTypes.bool,
    /**
     * Redux-form internal
     */
    handleSubmit: PropTypes.func,
    /**
    * Is the user logged in or not
    */
    isLoggedIn: PropTypes.bool,
    /**
    * Submits the shipping form information to the server
    */
    submitShipping: PropTypes.func
}

CheckoutShippingForm.contextTypes = {
    intl: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    initialValues: getInitialShippingAddress,
    isLoggedIn: getIsLoggedIn
})

const mapDispatchToProps = {
    submitShipping
}


const CheckoutShippingReduxForm = ReduxForm.reduxForm({
    form: SHIPPING_FORM_NAME,
    validate,
    keepDirtyOnReinitialize: true,
    enableReinitialize: true
})(CheckoutShippingForm)


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutShippingReduxForm)
