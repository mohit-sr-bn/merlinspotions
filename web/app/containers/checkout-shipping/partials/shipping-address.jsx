/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'

import FormOrSavedAddresses from './form-or-saved-addresses'

import {FormattedText} from '../../../components/intl/index'

const ShippingAddress = () => (
    <div className="t-checkout-shipping__shipping-address">
        <div className="t-checkout-shipping__title u-padding-top-lg u-padding-bottom-md">
            <h2 className="u-h4 u-text-uppercase">
                <FormattedText messageId="checkoutShipping.heading.shippingAddress" />
            </h2>
        </div>

        <div className="u-padding-md u-border-light-top u-border-light-bottom u-bg-color-neutral-00">
            <FormOrSavedAddresses />
        </div>
    </div>
)

export default ShippingAddress
