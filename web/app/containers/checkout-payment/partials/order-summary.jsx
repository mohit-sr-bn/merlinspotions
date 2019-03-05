/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import throttle from 'lodash.throttle'
import {removePromoCode} from '../../cart/actions' // @TODO: figure out where this is coming from
import {
    FormattedPrice,
    formatMessage,
    formatNumber
} from '../../../components/intl/index'

// Selectors
import * as selectors from '../selectors'
import {getSelectedCurrency} from 'progressive-web-sdk/dist/store/app/selectors'
import * as cartSelectors from 'progressive-web-sdk/dist/store/cart/selectors'
import {getSelectedShippingRate, getSelectedShippingLabel} from '../../../store/checkout/shipping/selectors'

// Actions
import * as checkoutPaymentActions from '../actions'

// Partials
import PaymentProductItem from './payment-product-item'
import CartPromoForm from '../../cart/partials/cart-promo-form'

// SDK Components
import {Accordion, AccordionItem} from 'progressive-web-sdk/dist/components/accordion'
import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Image from 'progressive-web-sdk/dist/components/image'
import {Ledger, LedgerRow} from 'progressive-web-sdk/dist/components/ledger'
import List from 'progressive-web-sdk/dist/components/list'
import InlineLoader from 'progressive-web-sdk/dist/components/inline-loader'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

class OrderSummary extends React.Component {
    constructor(props) {
        super(props)

        this.handleScroll = throttle(this.handleScroll.bind(this), 200)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    handleScroll() {
        const {isFixedPlaceOrderShown} = this.props
        const footerHeight = 200
        const scrollPosition = window.pageYOffset
        const windowSize = window.innerHeight
        const bodyHeight = document.body.offsetHeight
        const distanceFromBottom = Math.max(bodyHeight - (scrollPosition + windowSize), 0)
        const newIsFixedPlaceOrderShown = distanceFromBottom > footerHeight

        if (newIsFixedPlaceOrderShown !== isFixedPlaceOrderShown) {  // Saves triggering the action
            this.props.toggleFixedPlaceOrder(newIsFixedPlaceOrderShown)
        }
    }

    render() {
        const {
            cartItems,
            cartshippingRate,
            discount,
            coupons,
            isLoading,
            isFixedPlaceOrderShown,
            orderTotal,
            subtotal,
            summaryCount,
            shippingRate,
            shippingLabel,
            taxAmount,
            removePromoCode,
            submitPayment,
            currency
        } = this.props

        const context = this.context
        const currencyOptions = {style: 'currency', currency: currency.code}

        const RemoveDiscountButton = ({id}) => (
            <Button
                innerClassName="u-color-brand u-padding-start u-text-letter-spacing-normal"
                onClick={() => removePromoCode(id)}
                data-analytics-name={UI_NAME.removePromotionCode}
            >
                {formatMessage(context, {id: 'checkoutPayment.button.remove'})}
            </Button>
        )

        const PlaceOrderButton = ({submitPayment, isLoading}) => (
            <Button
                className="pw--primary u-flex-none u-width-full u-text-uppercase qa-checkout__place-order"
                type="button"
                onClick={submitPayment}
                disabled={isLoading}
                data-analytics-name={UI_NAME.submitOrder}
            >
                {isLoading ?
                    <InlineLoader />
                :
                    [<Icon key="" name="lock" />, formatMessage(context, {id: 'checkoutPayment.button.placeOrder'})]
                }
            </Button>
        )

        const renderDiscountTotal = () => {
            const outputDiscount = formatNumber(context, discount, currencyOptions)

            return (
                <LedgerRow
                    key="-1"
                    className="t-cart__summary-discounts"
                    label={formatMessage(context, {id: 'checkoutPayment.ledger.discounts'})}
                    value={outputDiscount}
                />
            )
        }

        const renderDiscount = ({amount, couponCode, text, id}, index) => { // eslint-disable-line react/prop-types
            const outputAmount = formatNumber(context, amount, currencyOptions)

            return (
                <LedgerRow
                    key={index}
                    className="t-cart__summary-discounts"
                    label={formatMessage(context, {
                        id: 'checkoutPayment.ledger.discount',
                        defaultMessage: 'Discount: {coupon}',
                    }, {coupon: couponCode})}
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
        const outputCartshippingRate = formatNumber(context, cartshippingRate, currencyOptions)
        const outputShippingRate = formatNumber(context, shippingRate, currencyOptions)
        const outputTaxAmount = formatNumber(context, taxAmount, currencyOptions)
        const outputOrderTotal = formatNumber(context, orderTotal, currencyOptions)

        const fixedPlaceOrderClasses = classNames('t-checkout-payment__fixed-place-order', {
            't--show': isFixedPlaceOrderShown
        })

        return (
            <div className="t-checkout-payment__order-summary">
                <div className="t-checkout-payment__title u-padding-top-lg u-padding-bottom-md">
                    <h2 className="u-h4 u-text-uppercase">
                        {formatMessage(context, {id: 'checkoutPayment.heading.orderSummary'})}
                    </h2>
                </div>

                <div className="u-border-light-top u-border-light-bottom u-bg-color-neutral-00 t-checkout-payment__card">
                    <List>
                        {cartItems.map((item, idx) =>
                            <PaymentProductItem {...item} key={idx} />
                        )}
                    </List>

                    <Ledger className="u-border-light-top">
                        <LedgerRow
                            label={formatMessage(context, {
                                id: 'checkoutPayment.ledger.subtotal',
                                defaultMessage: 'Subtotal ({count} {things})',
                            }, {
                                count: summaryCount,
                                things: summaryCount > 1
                                    ? formatMessage(context, {id: 'checkoutPayment.ledger.things.many'})
                                    : formatMessage(context, {id: 'checkoutPayment.ledger.things.one'})
                            })}
                            value={outputSubtotal}
                        />

                        <LedgerRow
                            label={formatMessage(context, {
                                id: 'checkoutPayment.ledger.shipping',
                                defaultMessage: 'Shipping ({label})',
                            }, {label: shippingLabel})}
                            value={coupons && !!coupons.length ?
                                outputCartshippingRate
                            :
                                outputShippingRate
                            }
                        />

                        {coupons && !!coupons.length && renderDiscounts()}

                        {taxAmount &&
                            <LedgerRow
                                className="u-flex-none"
                                label={formatMessage(context, {id: 'checkoutPayment.ledger.taxes'})}
                                value={outputTaxAmount}
                            />
                        }
                    </Ledger>

                    <Accordion>
                        <AccordionItem header={formatMessage(context, {id: 'checkoutPayment.button.promocode'})}>
                            <CartPromoForm />
                        </AccordionItem>
                    </Accordion>

                    <Ledger>
                        <LedgerRow
                            label={formatMessage(context, {id: 'checkoutPayment.ledger.total'})}
                            isTotal={true}
                            value={outputOrderTotal}
                        />
                    </Ledger>

                    {/* This is the statically positioned "Place Your Order" container */}
                    <div className="u-padding-end-md u-padding-start-md">
                        <PlaceOrderButton submitPayment={submitPayment} isLoading={isLoading} />
                    </div>

                    {/* This is the FIXED positioned "Place Your Order" container */}
                    <div
                        className={fixedPlaceOrderClasses}
                        tabIndex="-1"
                        aria-hidden="true"
                    >
                        <div className="u-padding-md u-bg-color-neutral-00 u-text-align-center">
                            <PlaceOrderButton submitPayment={submitPayment} isLoading={isLoading} />
                            <p className="u-margin-top-md">
                                {formatMessage(context, {id: 'checkoutPayment.ledger.total'})}: <strong><FormattedPrice value={orderTotal || '0.00'} /></strong>
                            </p>
                        </div>
                    </div>

                    <div className="u-padding-top-lg u-padding-bottom-lg u-text-align-center">
                        <Image
                            src={getAssetUrl('static/img/checkout/verisign-mcafee-secure.png')}
                            alt="Verisign and McAfee Secure"
                            height="38px"
                            width="150px"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

OrderSummary.propTypes = {
    /**
     * Cart item data
     */
    cartItems: PropTypes.array,

    /**
     * Shipping rate calculated in cart
     */
    cartshippingRate: PropTypes.string,

    /**
     * Array of coupons and vouchers
     */
    coupons: PropTypes.arrayOf(PropTypes.shape({
        couponCode: PropTypes.string,
        id: PropTypes.string,
        text: PropTypes.string,
        amount: PropTypes.string
    })),

    /**
     * Currency code used for `react-intl` to output currency symbol
     */
    currency: PropTypes.object,

    /**
     * Total discount value applied
     */
    discount: PropTypes.string,

    /**
     * Whether the fixed 'Place Order' container displays
     */
    isFixedPlaceOrderShown: PropTypes.bool,

    /**
     * Whether the spinner displays for 'Place Order' button
     */
    isLoading: PropTypes.bool,

    /**
     * The total cost of the order
     */
    orderTotal: PropTypes.string,

    /**
     * Removes applied promo code
     */
    removePromoCode: PropTypes.func,

    /**
     * Shipping rate label
     */
    shippingLabel: PropTypes.string,

    /**
     * Shipping rate amount calculated in shipping step
     */
    shippingRate: PropTypes.string,

    /**
     * Submits payment
     */
    submitPayment: PropTypes.func,

    /**
     * Total of all cart items (excluding shipping and taxes)
     */
    subtotal: PropTypes.string,

    /**
     * Total item count in cart
     */
    summaryCount: PropTypes.number,

    /**
     * Tax amount
     */
    taxAmount: PropTypes.string,

    /**
     * Handle scroll to toggle fixed 'Place Order' container
     */
    toggleFixedPlaceOrder: PropTypes.func
}

OrderSummary.contextTypes = {
    intl: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    cartItems: cartSelectors.getCartItemsFull,
    cartshippingRate: cartSelectors.getShippingAmount,
    currency: getSelectedCurrency,
    coupons: cartSelectors.getCoupons,
    discount: cartSelectors.getDiscount,
    subtotal: cartSelectors.getSubtotal,
    orderTotal: cartSelectors.getOrderTotal,
    shippingRate: getSelectedShippingRate,
    shippingLabel: getSelectedShippingLabel,
    taxAmount: cartSelectors.getTax,
    summaryCount: cartSelectors.getCartSummaryCount,
    isFixedPlaceOrderShown: selectors.getIsFixedPlaceOrderShown,
    isLoading: selectors.getIsLoading
})

const mapDispatchToProps = {
    toggleFixedPlaceOrder: checkoutPaymentActions.toggleFixedPlaceOrder,
    removePromoCode,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderSummary)
