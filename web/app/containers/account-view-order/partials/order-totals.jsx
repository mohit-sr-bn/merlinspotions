/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {getSelectedCurrency} from 'progressive-web-sdk/dist/store/app/selectors'
import {Ledger, LedgerRow} from 'progressive-web-sdk/dist/components/ledger'
import {
    getOrderTotal,
    getOrderTax,
    getOrderShippingTotal,
    getOrderSubtotal
} from 'progressive-web-sdk/dist/store/user/orders/selectors'

import {formatNumber} from '../../../components/intl/index'

const OrderTotals = ({
    currency,
    subtotal,
    shipping,
    tax,
    total
}, context) => {
    const options = {style: 'currency', currency: currency.code}
    const outputSubtotal = formatNumber(context, subtotal, options)
    const outputShipping = formatNumber(context, shipping, options)
    const outputTax = formatNumber(context, tax, options)
    const outputTotal = formatNumber(context, total, options)

    return (
        <div className="u-padding-md">
            <Ledger>
                <LedgerRow
                    className="u-border-0"
                    label="Subtotal"
                    value={outputSubtotal}
                />
                <LedgerRow
                    className="u-border-0"
                    label="Shipping & Handling"
                    value={outputShipping}
                />
                <LedgerRow
                    className="u-border-0"
                    label="Tax"
                    value={outputTax}
                />
                <LedgerRow
                    className="u-border-0 u-text-size-big u-text-weight-bold"
                    label="Total"
                    value={outputTotal}
                />
            </Ledger>
        </div>
    )
}

OrderTotals.propTypes = {
    currency: PropTypes.shape({
        label: PropTypes.string,
        symbol: PropTypes.string,
        code: PropTypes.string
    }),
    shipping: PropTypes.string,
    subtotal: PropTypes.string,
    tax: PropTypes.string,
    total: PropTypes.string,
}

OrderTotals.contextTypes = {
    intl: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    currency: getSelectedCurrency,
    subtotal: getOrderSubtotal,
    shipping: getOrderShippingTotal,
    tax: getOrderTax,
    total: getOrderTotal
})

export default connect(
    mapStateToProps
)(OrderTotals)
