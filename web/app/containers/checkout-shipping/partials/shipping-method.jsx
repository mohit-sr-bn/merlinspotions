/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as ReduxForm from 'redux-form'

import {getShippingMethods, hasShippingMethods} from '../../../store/checkout/selectors'
import {getIsFetchingShippingMethod} from '../selectors'

import Button from 'progressive-web-sdk/dist/components/button'
import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import ShippingMethodLabel from './shipping-method-label'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import InlineLoader from 'progressive-web-sdk/dist/components/inline-loader'

import {FormattedText} from '../../../components/intl/index'

const ShippingMethod = ({hasShippingMethods, isFetchingShippingMethod, shippingMethods}) => {
    return (
        <div className="t-checkout-shipping__shipping-method">
            <div className="t-checkout-shipping__title u-padding-top-lg u-padding-bottom-md">
                <h2 className="u-h4 u-text-uppercase">
                    <FormattedText messageId="checkoutShipping.heading.shippingMethod" />
                </h2>
            </div>

            <div className="u-padding-md u-border-light-top u-border-light-bottom u-bg-color-neutral-00">
                {hasShippingMethods ?
                    shippingMethods.map(({label, info, cost, id}) => (
                        <FieldRow key={id}>
                            <ReduxForm.Field
                                component={Field}
                                name="shippingMethodId"
                                type="radio"
                                value={id}
                                label={<ShippingMethodLabel label={label} info={info} cost={cost} />}
                            >
                                <input type="radio" noValidate data-analytics-name={UI_NAME.shippingMethod} />
                            </ReduxForm.Field>
                        </FieldRow>
                    ))
                :
                    <div>
                        <FormattedText messageId="checkoutShipping.form.shippingMessage" />
                    </div>
                }

                <FieldRow className="u-margin-top-lg">
                    <Button
                        type="submit"
                        disabled={!hasShippingMethods || isFetchingShippingMethod}
                        className="pw--primary u-width-full u-text-uppercase qa-checkout__continue-to-payment"
                        data-analytics-name={UI_NAME.continueCheckout}
                    >
                        {isFetchingShippingMethod ?
                            <InlineLoader />
                        :
                            <FormattedText messageId="checkoutShipping.button.continueToPayment" />
                        }
                    </Button>
                </FieldRow>
            </div>
        </div>
    )
}

ShippingMethod.defaultProps = {
    shippingMethods: []
}

ShippingMethod.propTypes = {
    /**
    * The flag of whether shipping methods have been fetched
    */
    hasShippingMethods: PropTypes.bool,

    /**
    * Whether shipping method is being fetched
    */
    isFetchingShippingMethod: PropTypes.bool,

    /**
    * The available shipping methods for the order
    */
    shippingMethods: PropTypes.arrayOf(PropTypes.shape({
        cost: PropTypes.string,
        info: PropTypes.string,
        label: PropTypes.string,
        id: PropTypes.string
    }))
}

const mapStateToProps = createPropsSelector({
    hasShippingMethods,
    isFetchingShippingMethod: getIsFetchingShippingMethod,
    shippingMethods: getShippingMethods
})


export default connect(
    mapStateToProps
)(ShippingMethod)
