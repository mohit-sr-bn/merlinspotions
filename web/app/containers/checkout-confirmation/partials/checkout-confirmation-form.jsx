/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import * as ReduxForm from 'redux-form'
import {connect} from 'react-redux'
import * as actions from '../actions'

import Button from 'progressive-web-sdk/dist/components/button'
import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {CONFIRMATION_FORM_NAME} from '../../../store/form/constants'

const CheckoutConfirmationForm = ({
    error,
    handleSubmit,
    submitRegistrationForm,
    submitting,
    submitFailed
}) => {

    return (
        <form id={CONFIRMATION_FORM_NAME} data-analytics-name={UI_NAME.register} className="t-checkout-confirmation__form" onSubmit={handleSubmit(submitRegistrationForm)} noValidate>

            <FieldRow>
                <ReduxForm.Field component={Field} name="password" label="Choose Password" caption="More than 5 characters with at least one number">
                    <input type="password" noValidate data-analytics-name={UI_NAME.password} />
                </ReduxForm.Field>
            </FieldRow>

            <FieldRow>
                <ReduxForm.Field component={Field} name="password_confirmation" label="Re-enter Password">
                    <input type="password" noValidate data-analytics-name={UI_NAME.confirmPassword} />
                </ReduxForm.Field>
            </FieldRow>

            {submitFailed && error &&
                <FieldRow>
                    <p className="pw-field__error">{error}</p>
                </FieldRow>
            }

            <FieldRow>
                <Button
                    type="submit"
                    className="pw--primary u-text-uppercase u-width-full"
                    disabled={submitting}
                    data-analytics-name={UI_NAME.register}
                >
                    Create Account
                </Button>
            </FieldRow>
        </form>
    )
}

CheckoutConfirmationForm.propTypes = {
    /**
     * Whether the form is disabled or not
     */
    disabled: PropTypes.bool,
    /**
    * Redux-form internal
    */
    error: PropTypes.string,

    /**
     * Redux-form internal
     */
    handleSubmit: PropTypes.func,
    /**
    * Redux-form internal, indicates if handleSubmit failed
    */
    submitFailed: PropTypes.bool,

    /**
     * Redux-form internal
     */
    submitRegistrationForm: PropTypes.func,

    /**
     * Redux-form internal
     */
    submitting: PropTypes.bool
}

const validate = (values) => {
    const errors = {}

    if (!Object.keys(values).length) {
        return {
            _error: 'Please fill in the form'
        }
    }

    const {
        password,
        password_confirmation
    } = values

    if (!password) {
        errors.password = 'Password is required'
    } else {
        if (password.length < 6) {
            errors.password = 'Please enter 6 or more characters'
        }

        if (!/\d/.test(password)) {
            errors.password = 'Password must contain a number'
        }
    }

    if (password_confirmation && password !== password_confirmation) { // eslint-disable-line camelcase
        errors.password_confirmation = 'Passwords are not the same'
    }

    return errors
}

const CheckoutPaymentReduxForm = ReduxForm.reduxForm({
    form: CONFIRMATION_FORM_NAME,
    validate,
})(CheckoutConfirmationForm)

const mapStateToProps = () => ({})

const mapDispatchToProps = {
    submitRegistrationForm: actions.submitRegisterForm
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPaymentReduxForm)
