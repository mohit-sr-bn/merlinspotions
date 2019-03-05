/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import AddressBlock from '../../../components/address-block'
import Card from '../../../components/card'

import {
    getOrderPaymentMethods,
    getOrderBillingAddress,
    getOrderShippingAddress,
    getOrderShippingMethod
} from 'progressive-web-sdk/dist/store/user/orders/selectors'

const OrderInformation = ({
    billingAddress,
    paymentMethods,
    shippingAddress,
    shippingMethod
}) => (
    <div className="u-padding-md">
        <Card className="u-margin-top-md u-margin-bottom-md" hasBorder header="Shipping Address" headerClassName="u-padding-top u-padding-start-md u-text-weight-bold">
            <AddressBlock className="u-color-neutral-50" {...shippingAddress} />
        </Card>
        <Card className="u-margin-top-md u-margin-bottom-md" hasBorder header="Shipping Method" headerClassName="u-padding-top u-padding-start-md u-text-weight-bold">
            <div className="u-padding-md u-color-neutral-50">{shippingMethod}</div>
        </Card>
        <Card className="u-margin-top-md u-margin-bottom-md" hasBorder header="Billing Address" headerClassName="u-padding-top u-padding-start-md u-text-weight-bold">
            <AddressBlock className="u-color-neutral-50" {...billingAddress} />
        </Card>
        <Card className="u-margin-top-md u-margin-bottom-lg" hasBorder header="Payment Method" headerClassName="u-padding-top u-padding-start-md u-text-weight-bold">
            <div className="u-padding-md u-color-neutral-50">{paymentMethods && paymentMethods.map((paymentMethod) => paymentMethod)}</div>
        </Card>
    </div>
)


OrderInformation.propTypes = {
    billingAddress: PropTypes.object,
    paymentMethods: PropTypes.arrayOf(PropTypes.string),
    shippingAddress: PropTypes.object,
    shippingMethod: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    billingAddress: getOrderBillingAddress,
    paymentMethods: getOrderPaymentMethods,
    shippingAddress: getOrderShippingAddress,
    shippingMethod: getOrderShippingMethod
})

export default connect(
    mapStateToProps
)(OrderInformation)
