/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {FormattedPrice} from '../intl/index'

import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'
import ProductItem from '../product-item'

/**
 * The contents of an item added wishlist
 * seen on the PDP when adding an item to the cart or wishlist
 * or on the wishlist page when adding an item to the cart
 */

const ItemAddedModalContents = ({
    className,
    headerText,
    onDismiss,
    title,
    thumbnail,
    quantity,
    price,
    ctaButtonOptions
}) => {
    const classes = classNames('c-item-added-modal-contents', {
        // 'c--modifier': bool ? true : false
    }, className)

    return (
        <div className={classes}>
            {/* Modal header */}
            <div className="u-flex-none u-border-bottom">
                <div className="u-flexbox u-align-center">
                    <h1 className="u-flex u-padding-lg u-h4 u-text-uppercase">
                        {headerText}
                    </h1>

                    <div className="c-item-added-modal-contents__close u-flexbox u-flex-none u-align-center u-justify-center">
                        <Button
                            className="u-text-uppercase"
                            onClick={onDismiss}
                            data-analytics-name={UI_NAME.dismissModal}
                        >
                            <Icon name="close" title="Close" className="c-item-added-modal-contents__icon" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="u-flexbox u-direction-column u-flex u-padding-md">
                {/* Modal product information */}
                <div className="u-flex u-margin-bottom-md">
                    <ProductItem customWidth="20%"
                        title={<h2 className="u-h5 u-text-family u-text-weight-medium">{title}</h2>}
                        image={<img role="presentation" {...thumbnail} width="60px" />}
                    >
                        <div className="u-flexbox u-justify-between u-padding-top-sm">
                            <p>Qty: {quantity}</p>
                            <p className="u-text-weight-bold">
                                <FormattedPrice value={price} />
                            </p>
                        </div>
                    </ProductItem>
                </div>

                {/* Buttons */}
                <div className="u-flex-none">
                    <Button
                        {...ctaButtonOptions}
                        className="pw--primary u-width-full u-margin-bottom-md u-text-uppercase"
                        innerClassName="u-text-align-center"
                    />
                    <Button
                        className="pw--tertiary u-width-full u-text-uppercase"
                        onClick={onDismiss}
                        data-analytics-name={UI_NAME.continueShopping}
                    >
                        Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    )
}


ItemAddedModalContents.propTypes = {
    price: PropTypes.string.isRequired,
    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,
    ctaButtonOptions: PropTypes.shape({
        'data-analytics-name': PropTypes.string,
        onClick: PropTypes.func,
        text: PropTypes.string
    }),
    headerText: PropTypes.string,
    quantity: PropTypes.number,
    thumbnail: PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string
    }),
    title: PropTypes.string,
    onDismiss: PropTypes.func,
}

export default ItemAddedModalContents
