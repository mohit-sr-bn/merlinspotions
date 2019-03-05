/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Field from 'progressive-web-sdk/dist/components/field'
import {FormattedPrice} from '../intl/index'

/**
 * Displays the price for an item
 * Accepts both the linePrice and itemPrice
 */

const ItemPrice = ({
    linePrice,
    itemPrice,
    className,
    quantity,
    originalPrice
}) => {
    const wrapperClass = classnames(className, 'c-item-price')

    const linePriceValue = linePrice ? linePrice : 0
    const priceValue = originalPrice ? originalPrice * quantity : 0
    const discount = linePriceValue < priceValue

    return (
        <Field className={wrapperClass}>
            <div className="u-text-align-end u-flex">
                {discount ?
                    <div>
                        <span className="u-h5 u-color-accent u-text-weight-bold">
                            <FormattedPrice value={linePrice} />
                        </span>
                        <span className="u-text-quiet u-text-strikethrough u-padding-start">
                            <FormattedPrice value={originalPrice} />
                        </span>
                    </div>
                :
                    <div className="u-h5 u-color-accent u-text-weight-bold">
                        <FormattedPrice value={linePrice} />
                    </div>
                }
                {itemPrice &&
                    <div className="u-text-quiet"><em><FormattedPrice value={itemPrice} /> each</em></div>
                }
            </div>
        </Field>
    )
}


ItemPrice.propTypes = {
    /**
     * The full price for the line item (unit price * quantity)
    */
    linePrice: PropTypes.string.isRequired,
    className: PropTypes.string,
    /**
     * The Unit price for the line item
     */
    itemPrice: PropTypes.string,
    /**
     * The original unit price for the item
    */
    originalPrice: PropTypes.string,
    /**
     * The quantity of this item
    */
    quantity: PropTypes.number,
}

export default ItemPrice
