/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import classNames from 'classnames'

import {getCartHasItems} from 'progressive-web-sdk/dist/store/cart/selectors'
import {getAutoAddToCartInProgress} from '../selectors'

import {GridSpan} from 'progressive-web-sdk/dist/components/grid'
import Button from 'progressive-web-sdk/dist/components/button'
import CartProductList from './cart-product-list'
import CartSummary from './cart-summary'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const CartItems = ({
    autoAddToCartInProgress,
    hasItems,
    onContinueShopping,
    onOpenSignIn
}) => {
    const summaryClassnames = classNames('t-cart__summary-wrapper', {
        'u-visually-hidden': !hasItems,
        't--hide': !hasItems,
    })

    return (
        <div>
            <GridSpan tablet={{span: 6, pre: 1, post: 1}} desktop={{span: 7}}>
                <CartProductList onOpenSignIn={onOpenSignIn} />
            </GridSpan>

            {!autoAddToCartInProgress &&
                <GridSpan className={summaryClassnames} tablet={{span: 6, pre: 1, post: 1}} desktop={{span: 5}}>
                    <CartSummary />

                    <div className="u-padding-md u-padding-top-lg u-padding-bottom-lg">
                        <Button
                            className="pw--tertiary u-width-full u-text-uppercase"
                            onClick={onContinueShopping}
                            data-analytics-name={UI_NAME.continueShopping}
                        >
                            Continue Shopping
                        </Button>
                    </div>
                </GridSpan>
            }
        </div>
    )
}

CartItems.propTypes = {
    autoAddToCartInProgress: PropTypes.bool,
    hasItems: PropTypes.bool,
    onContinueShopping: PropTypes.func,
    onOpenSignIn: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    autoAddToCartInProgress: getAutoAddToCartInProgress,
    hasItems: getCartHasItems
})

export default connect(mapStateToProps)(CartItems)
