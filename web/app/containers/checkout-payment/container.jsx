/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {initPaymentPage} from './actions'
import {formatMessage} from '../../components/intl/index'

import template from '../../template'
import PageMeta from '../../components/page-meta'
import {getCartURL, getCheckoutShippingURL} from '../app/selectors'

import CheckoutPaymentReduxForm from './partials/checkout-payment-form'

import {ProgressSteps, ProgressStepsItem} from 'progressive-web-sdk/dist/components/progress-steps'
import {getCheckoutPageMeta} from 'progressive-web-sdk/dist/store/checkout/selectors'

const CheckoutPayment = ({cartURL, checkoutShippingURL, pageMeta}, context) => {
    return (
        <div className="t-checkout-payment">
            <PageMeta {...pageMeta} />

            <div className="u-bg-color-neutral-00 u-border-light-bottom">
                <div className="t-checkout-payment__progress">
                    <ProgressSteps>
                        <ProgressStepsItem
                            icon="cart-full"
                            title={formatMessage(context, {id: 'checkoutShipping.progress.cart'})}
                            href={cartURL}
                        />

                        <ProgressStepsItem
                            icon="shipping"
                            title={formatMessage(context, {id: 'checkoutShipping.progress.shipping'})}
                            href={checkoutShippingURL}
                        />

                        <ProgressStepsItem
                            icon="payment-full"
                            title={formatMessage(context, {id: 'checkoutShipping.progress.payment'})}
                            current
                        />

                        <ProgressStepsItem
                            icon="done"
                            title={formatMessage(context, {id: 'checkoutShipping.progress.done'})}
                        />
                    </ProgressSteps>
                </div>
            </div>

            <CheckoutPaymentReduxForm />
        </div>
    )
}

CheckoutPayment.propTypes = {
    /**
    * The relative URL for the cart page
    */
    cartURL: PropTypes.string,
    /**
    * The relative URL for the checkout shipping page
    */
    checkoutShippingURL: PropTypes.string,
    /**
    * SEO page meta data for the <title> and <meta> tags
    */
    pageMeta: PropTypes.object
}

CheckoutPayment.contextTypes = {
    intl: PropTypes.object,
}

CheckoutPayment.initAction = initPaymentPage

const mapStateToProps = createPropsSelector({
    cartURL: getCartURL,
    checkoutShippingURL: getCheckoutShippingURL,
    pageMeta: getCheckoutPageMeta
})

export default template(connect(mapStateToProps)(CheckoutPayment))
