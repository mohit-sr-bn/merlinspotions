/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import * as ReduxForm from 'redux-form'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import Button from 'progressive-web-sdk/dist/components/button'
import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import InlineLoader from 'progressive-web-sdk/dist/components/inline-loader'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import {submitPromoCode} from '../actions'
import {isPromoSubmitting} from '../selectors'

import {CART_PROMO_FORM_NAME} from '../../../store/form/constants'
import {formatMessage} from '../../../components/intl/index'

const CartPromoForm = (props, context) => {
    const {handleSubmit, submitPromoCode, disabled, submitting, isPromoSubmitting} = props
    return (
        <form id={CART_PROMO_FORM_NAME} data-analytics-name={UI_NAME.promotionCode} onSubmit={handleSubmit(submitPromoCode)} noValidate>
            <FieldRow>
                <ReduxForm.Field component={Field} name="promo">
                    <input
                        disabled={isPromoSubmitting}
                        noValidate={!isPromoSubmitting}
                        className="t-cart__promo-input"
                        type="text"
                        placeholder={formatMessage(context, {id: 'checkoutPayment.form.enterPromo'})}
                        data-analytics-name={UI_NAME.promotionCode}
                    />
                </ReduxForm.Field>
                {isPromoSubmitting ?
                    <Button className="pw--tertiary u-margin-0">
                        <InlineLoader className="pw--small" title="Submitting" />
                    </Button>
                :
                    <Button
                        type="submit"
                        className="pw--tertiary u-margin-0 u-text-uppercase"
                        disabled={disabled || submitting}
                        data-analytics-name={UI_NAME.submitPromoCode}
                    >
                        {formatMessage(context, {id: 'checkoutPayment.button.apply'})}
                    </Button>
                }
            </FieldRow>
        </form>
    )
}

CartPromoForm.propTypes = {
    /**
     * Whether the form is disabled or not
     */
    disabled: PropTypes.bool,

    /**
     * Redux-form internal
     */
    handleSubmit: PropTypes.func,

    isPromoSubmitting: PropTypes.bool,

    /**
     * Submits the promo code
     */
    submitPromoCode: PropTypes.func,

    /**
     * Redux-form internal
     */
    submitting: PropTypes.bool
}

CartPromoForm.contextTypes = {
    intl: PropTypes.object
}

// Just return an empty error object for now
const validate = () => ({})

const mapStateToProps = createPropsSelector({
    isPromoSubmitting
})

const mapDispatchToProps = {
    submitPromoCode
}

const CartPromoReduxForm = ReduxForm.reduxForm({
    form: CART_PROMO_FORM_NAME,
    validate,
})(CartPromoForm)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartPromoReduxForm)
