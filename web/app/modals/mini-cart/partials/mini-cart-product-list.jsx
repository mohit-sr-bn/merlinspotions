/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import classNames from 'classnames'
import {getCartURL} from '../../../containers/app/selectors'
import {FormattedPrice} from '../../../components/intl/index'

import Button from 'progressive-web-sdk/dist/components/button'
import Image from 'progressive-web-sdk/dist/components/image'
import List from 'progressive-web-sdk/dist/components/list'
import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'
import ProductItem from '../../../components/product-item'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import * as selectors from 'progressive-web-sdk/dist/store/cart/selectors'

const SUBTOTAL_CLASSES = classNames(
    'm-mini-cart__subtotal',

    'u-flexbox',
    'u-justify-between',
    'u-margin-bottom-lg',
    'u-padding-top-lg',

    'u-h4',
    'u-text-family-header'
)

/* eslint-disable camelcase */

const productListClasses = 'u-padding-top-lg u-padding-bottom-lg u-padding-start u-padding-end'

const PlaceholderProduct = () => (
    <ProductItem
        className={productListClasses}
        title={<SkeletonText lines={2} />}
        image={<Image src="" alt="Image is loading" width="64px" height="64px" />}
    />
)

export const PlaceholderMiniCart = () => (
    <div className="u-padding-md">
        {/**
          * Button placeholder to take up as much space as the real "View and
          * edit cart" button in `MiniCartProductList`
          */}
        <div style={{height: '44px'}} />

        <List>
            <PlaceholderProduct />
            <PlaceholderProduct />
            <PlaceholderProduct />
        </List>
    </div>
)

const MiniCartProductList = ({
    items,
    orderTotal,
    cartURL
}) => {

    return (
        <div className="u-padding-md">
            <Button
                href={cartURL}
                className="pw--tertiary u-width-full u-margin-bottom u-text-capitalize"
                data-analytics-name={UI_NAME.goToCart}
            >
                View and edit cart
            </Button>

            <List>
                {items.map(({itemPrice, linePrice, quantity, id, thumbnail, title}) => {
                    const src = thumbnail ? thumbnail.src : ''
                    const alt = thumbnail ? thumbnail.alt : ''

                    return (
                        <ProductItem
                            className={productListClasses}
                            title={<h2 className="u-h3">{title}</h2>}
                            price={<FormattedPrice value={itemPrice} />}
                            key={id}
                            image={<Image src={src} alt={alt} width="64px" height="64px" />}
                        >
                            <div>
                                <p className="u-margin-bottom-sm">Qty: {quantity}</p>
                                <p>Sub-Total: <FormattedPrice value={linePrice} /></p>
                            </div>
                        </ProductItem>
                    )
                })}
            </List>

            <div className={SUBTOTAL_CLASSES}>
                <div className="u-flex u-text-uppercase">Subtotal:</div>
                <div className="u-flex-none">
                    <FormattedPrice value={orderTotal} />
                </div>
            </div>
        </div>
    )
}

MiniCartProductList.propTypes = {
    orderTotal: PropTypes.string.isRequired,
    cartURL: PropTypes.string,
    items: PropTypes.array
}

const mapStateToProps = createPropsSelector({
    cartURL: getCartURL,
    items: selectors.getCartItemsFull,
    orderTotal: selectors.getOrderTotal
})

export default connect(
    mapStateToProps
)(MiniCartProductList)
