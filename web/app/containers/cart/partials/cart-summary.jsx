/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import IntegrationManager from 'mobify-integration-manager/dist/'
import {iOSBrowser} from 'progressive-web-sdk/dist/utils/utils'
import * as cartSelectors from 'progressive-web-sdk/dist/store/cart/selectors'
import {getSelectedCurrency} from 'progressive-web-sdk/dist/store/app/selectors'
import {CART_ESTIMATE_SHIPPING_MODAL} from '../../../modals/constants'
import {openModal} from '../../../modals/actions'
import {getSelectedShippingLabel, getPostcode} from '../../../store/checkout/shipping/selectors'
import {getCheckoutShippingURL} from '../../app/selectors'
import {removePromoCode} from '../actions'
import {showPaymentSheet} from '../../../utils/payment-request/actions'
import {formatNumber} from '../../../components/intl/index'

import Button from 'progressive-web-sdk/dist/components/button'
import CartPromoForm from './cart-promo-form'
import Icon from 'progressive-web-sdk/dist/components/icon'
import {Ledger, LedgerRow} from 'progressive-web-sdk/dist/components/ledger'
import {Accordion, AccordionItem} from 'progressive-web-sdk/dist/components/accordion'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

// This is not written as a component to preserve the proptype
// requirements of the Ledger component.
const renderTaxAmountRow = (taxAmount, zipCode, openCalculateModal, currencyOptions, context) => {
    const editButton = (
        <span>Based on delivery to
            <Button
                innerClassName="u-padding-start-sm u-color-brand u-text-letter-spacing-normal"
                onClick={openCalculateModal}
                data-analytics-name={UI_NAME.recalculateTax}
            >
                {zipCode}
            </Button>
        </span>
    )
    const outputTaxAmount = formatNumber(context, taxAmount, currencyOptions)

    return (
        <LedgerRow
            className="u-flex-none"
            label="Taxes"
            value={outputTaxAmount}
            labelAction={editButton}
            key="Taxes"
        />
    )
}

const CartSummary = ({
    checkoutShippingURL,
    summaryCount,
    orderTotal,
    subtotal,
    selectedShippingRate,
    selectedShippingLabel,
    zipCode,
    taxAmount,
    coupons,
    discount,
    onCalculateClick,
    removePromoCode,
    currency,
    showPaymentSheet
}, context) => {
    const currencyOptions = {style: 'currency', currency: currency.code}

    const calculateButton = (
        <Button
            innerClassName="u-padding-end-0 u-color-brand u-text-letter-spacing-normal"
            onClick={onCalculateClick}
            data-analytics-name={UI_NAME.calculateTax}
        >
            Calculate <Icon name="chevron-right" />
        </Button>
    )

    const RemoveDiscountButton = ({id}) => ( // eslint-disable-line react/prop-types
        <Button
            innerClassName="u-color-brand u-padding-start u-text-letter-spacing-normal"
            onClick={() => removePromoCode(id)}
            data-analytics-name={UI_NAME.removePromotionCode}
        >
            Remove
        </Button>
    )

    const renderDiscountTotal = () => {
        const discountValue = discount > 0 ? discount : ''
        const outputDiscountValue = formatNumber(context, discountValue)

        return (<LedgerRow
            key="-1"
            className="t-cart__summary-discounts"
            label={`Discounts`}
            value={outputDiscountValue}
        />)
    }

    const renderDiscount = ({amount, couponCode, text, id}, index) => { // eslint-disable-line react/prop-types
        const outputAmount = formatNumber(context, amount, currencyOptions)

        return (
            <LedgerRow
                key={index}
                className="t-cart__summary-discounts"
                label={`Discount: ${couponCode}`}
                labelAction={<RemoveDiscountButton id={id} />}
                labelDescription={text}
                value={outputAmount || ''}
            />
        )
    }

    const renderDiscounts = () => {
        // use array of functions instead of stateless components
        // because Ledger must have LedgerRows as direct children
        return [renderDiscountTotal(), coupons.map(renderDiscount)]
    }

    const outputSubtotal = formatNumber(context, subtotal, currencyOptions)
    const outputSelectedShippingRate = formatNumber(context, selectedShippingRate, currencyOptions)
    const outputOrderTotal = formatNumber(context, orderTotal, currencyOptions)

    const userAgent = window.navigator.userAgent
    const paymentRequestEnabled = window.PaymentRequest &&
        IntegrationManager.getOption('paymentRequestEnabled') &&
        // Temporarily disable PRAPI on all iOS devices, even versions that have PRAPI support
        // Adding support on iOS will be reevaluated after PRAPI fully launches on that platform
        !iOSBrowser(userAgent)

    return (
        <div className="t-cart__summary">
            <Accordion className="u-margin-top u-bg-color-neutral-00">
                <AccordionItem header="Promo code">
                    <CartPromoForm />
                </AccordionItem>
            </Accordion>

            <div className="t-cart__summary-title u-padding-top-lg u-padding-bottom-md">
                <h2 className="u-h4 u-text-uppercase">
                    Order Summary
                </h2>
            </div>

            <div className="u-bg-color-neutral-00 u-border-light-top u-border-light-bottom">
                <Ledger className="u-border-light-top">
                    <LedgerRow
                        label={`Subtotal (${summaryCount} items)`}
                        value={outputSubtotal}
                    />

                    {(zipCode !== null && zipCode !== undefined) &&
                        <LedgerRow
                            label={`Shipping (${selectedShippingLabel})`}
                            value={outputSelectedShippingRate}
                            key={`Shipping (${selectedShippingLabel})`}
                        />
                    }

                    {coupons && !!coupons.length && renderDiscounts()}

                    {(taxAmount && zipCode)
                        ? renderTaxAmountRow(taxAmount, zipCode, onCalculateClick, currencyOptions, context)
                        : <LedgerRow
                            className="u-flex-none"
                            label="Taxes"
                            labelAction="Rates based on shipping location"
                            valueAction={calculateButton}
                            key="taxWithCalculate"
                        />
                    }
                </Ledger>
                <Ledger>
                    <LedgerRow
                        label="Total"
                        isTotal={true}
                        value={outputOrderTotal}
                    />
                </Ledger>

                <div className="u-padding-end-md u-padding-bottom-lg u-padding-start-md">
                    <Button
                        className="pw--primary u-flex-none u-width-full u-text-uppercase qa-cart__checkout"
                        href={checkoutShippingURL}
                        data-analytics-name={UI_NAME.checkout}>
                        <Icon name="lock" />
                        Proceed To Checkout
                    </Button>

                    {paymentRequestEnabled &&
                        <Button
                            className="pw--secondary u-flex-none u-width-full u-text-uppercase u-margin-top-md"
                            onClick={showPaymentSheet}
                            data-analytics-name="payment_request:show">
                            Payment Request
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

CartSummary.propTypes = {
    checkoutShippingURL: PropTypes.string,
    coupons: PropTypes.arrayOf(PropTypes.shape({
        couponCode: PropTypes.string,
        id: PropTypes.string,
        text: PropTypes.string,
        amount: PropTypes.string,
    })),
    currency: PropTypes.object,
    discount: PropTypes.string,
    orderTotal: PropTypes.string,
    removePromoCode: PropTypes.func,
    selectedShippingLabel: PropTypes.string,
    selectedShippingRate: PropTypes.string,
    showPaymentSheet: PropTypes.func,
    subtotal: PropTypes.string,
    summaryCount: PropTypes.number,
    taxAmount: PropTypes.string,
    zipCode: PropTypes.string,
    onCalculateClick: PropTypes.func
}

CartSummary.contextTypes = {
    intl: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    coupons: cartSelectors.getCoupons,
    currency: getSelectedCurrency,
    discount: cartSelectors.getDiscount,
    checkoutShippingURL: getCheckoutShippingURL,
    subtotal: cartSelectors.getSubtotal,
    orderTotal: cartSelectors.getOrderTotal,
    selectedShippingRate: cartSelectors.getShippingAmount,
    selectedShippingLabel: getSelectedShippingLabel,
    zipCode: getPostcode,
    taxAmount: cartSelectors.getTax,
    summaryCount: cartSelectors.getCartSummaryCount
})

const mapDispatchToProps = {
    onCalculateClick: () => openModal(CART_ESTIMATE_SHIPPING_MODAL, UI_NAME.estimateShipping),
    removePromoCode,
    showPaymentSheet
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartSummary)
