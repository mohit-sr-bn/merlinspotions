/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import classNames from 'classnames'

// Utils
import {canonicalURL} from '../../../utils'

// Constants
import {ADD_TO_CART_FORM_NAME} from 'web/app/store/form/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {SOCIAL_SHARE_MODAL} from '../../../modals/constants'

// Components
import Button from 'mobify-amp-sdk/dist/components/button'
import Form from 'mobify-amp-sdk/dist/components/form'
import ProductDetailsVariations from './product-details-variations'
import State from 'mobify-amp-sdk/dist/components/state'
import Stepper from 'mobify-amp-sdk/dist/components/stepper'
import Icon from 'mobify-amp-sdk/dist/components/icon'

// Selectors
import * as selectors from 'web/app/containers/product-details/selectors'
import {getCurrentUrl} from 'progressive-web-sdk/dist/store/app/selectors'
import {getProductAvailability, getProductId, getProductVariants} from 'progressive-web-sdk/dist/store/products/selectors'

const ACTION_URL = canonicalURL('/checkout/cart/')

const ProductDetailsAddToCart = ({
    available,
    currentUrl,
    disabled,
    productId,
    quantity,
    variants
}) => {
    // Setup Quantity stepper's AMP state
    const ampBind = {
        nameSpace: 'quantity',
        value: 1,
    }
    const quantityState = {
        value: ampBind.value
    }

    // Setup "Add to Cart" URL bindings. The format of the URL should follow
    // the below template and URI parameters:
    //
    //     https://www.merlinspotions.com/checkout/cart/
    //         ?action=addToCart
    //         &quantity=1
    //         &productId=1
    //         &attributeColorId=90
    //         &attributeSizeId=131
    //         &variantId=32
    //         &variantValues=11-4
    //         &productUrl=https%3A%2F%2Fwww.merlinspotions.com%2Feye-of-newt.html
    //
    // **Note** that value is a combination of the current variant's color and
    // size values.
    const firstVariant = variants[0] || {}
    const initialAddToCartUrl = `${canonicalURL(ACTION_URL)}` +
        `?action=addToCart` +
        `&quantity=${ampBind.value}` +
        `&productId=${productId}` +
        `&attributeColorId=${firstVariant.attributeIds && firstVariant.attributeIds.color}` +
        `&attributeSizeId=${firstVariant.attributeIds && firstVariant.attributeIds.size}` +
        `&variantId=${firstVariant.id}` +
        `&variantValues=${firstVariant.values && firstVariant.values.color}-${firstVariant.values && firstVariant.values.size}` +
        `&productUrl=${encodeURIComponent(currentUrl)}`
    const bindings = `[href]="'${canonicalURL(ACTION_URL)}` +
        `?action=addToCart` +
        `&quantity=' + quantity.value + '` +
        `&productId=${productId}` +
        `&attributeColorId=' + attributeIds.color + '` +
        `&attributeSizeId=' + attributeIds.size + '` +
        `&variantId=' + getCurrentVariantId() + '` +
        `&variantValues=' + currentVariant.value + '` +
        `&productUrl=' + encodeURIComponent('${currentUrl}') + '` +
        `&mobify_id=CLIENT_ID(sandy-client-id)` +
        `'"` // closes the bind expression

    // Other UI setup from here on out...
    const error = null // temp
    const classes = classNames('t-product-details__indicator u-border u-padding-md u-flex u-flexbox u-justify-center', {
        'u-margin-start': available
    })
    const stepperProps = {
        initialDisabled: disabled,
        decrementIcon: 'minus',
        incrementIcon: 'plus',
        initialValue: ampBind.value,
        minimumValue: ampBind.value,
        className: 'u-flex-none',
        name: ampBind.nameSpace,
        bindings: `[value]="quantity.value"`,
        required: true,
        onChange(value) {
            return `AMP.setState({quantity: {value: ${value}}})`
        }
    }

    return (
        <div className="u-padding-start-md u-padding-end-md">
            <Form
                method="POST"
                action-xhr={ACTION_URL}
                target="_top"
                id={ADD_TO_CART_FORM_NAME}
                data-vars-analytics-name={UI_NAME.addToCart}
            >
                <ProductDetailsVariations error={error} />
                <State namespace={ampBind.nameSpace} data={quantityState} />

                <div className="u-margin-top-lg">
                    <label htmlFor="quantity">Quantity</label>

                    <div className="u-flexbox u-margin-bottom-lg u-margin-top">
                        {quantity > 0 &&
                            <Stepper {...stepperProps} />
                        }

                        <div className={classes}>
                            <Icon name={available ? 'check' : 'close'} className="u-margin-end-sm" />
                            {available ? 'In stock' : 'Out of stock'}
                        </div>
                    </div>
                </div>

                {available &&
                    <Button
                        href={initialAddToCartUrl}
                        bindings={bindings}
                        icon="plus"
                        iconClassName="pw--small u-margin-end"
                        title="Add to Cart"
                        showIconText={true}
                        className="a--primary u-width-full u-text-uppercase t-product-details__add-to-cart"
                        data-vars-analytics-action="userClickButton"
                        data-vars-analytics-name={UI_NAME.addToCart}
                    />
                }

                <div className="t-product-details__social u-border-light-top u-border-light-bottom u-margin-top-md">
                    <Button
                        className="t-product-details__social-button u-color-brand u-text-letter-spacing-normal u-width-full"
                        icon="share"
                        title="Share"
                        on={`tap:${SOCIAL_SHARE_MODAL}`}
                        showIconText
                    />
                </div>
            </Form>
        </div>
    )
}

ProductDetailsAddToCart.propTypes = {
    available: PropTypes.bool,
    currentUrl: PropTypes.string,
    disabled: PropTypes.bool,
    productId: PropTypes.string,
    quantity: PropTypes.number,
    variants: PropTypes.array
}

const mapStateToProps = createPropsSelector({
    available: getProductAvailability,
    currentUrl: getCurrentUrl,
    disabled: selectors.getAddToCartDisabled,
    productId: getProductId,
    quantity: selectors.getItemQuantity,
    variants: getProductVariants
})

export default connect(mapStateToProps)(ProductDetailsAddToCart)
