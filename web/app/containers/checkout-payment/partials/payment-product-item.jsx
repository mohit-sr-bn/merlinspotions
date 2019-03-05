/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getSelectedCurrency} from 'progressive-web-sdk/dist/store/app/selectors'

// SDK Components
import Image from 'progressive-web-sdk/dist/components/image'

// Local Component
import ProductItem from '../../../components/product-item'
import {
    FormattedText,
    FormattedPrice,
    formatMessage,
    formatNumber
} from '../../../components/intl/index'

const PaymentProductItem = ({
    id,
    thumbnail,
    title,
    options,
    price,
    itemPrice,
    linePrice,
    quantity,
    currency
}, context) => {
    const productImage = (
        <Image
            src={thumbnail.src}
            alt={thumbnail.alt}
            width="104px"
            height="104px"
        />
    )

    const linePriceValue = linePrice
    const priceValue = price * quantity
    const discount = linePriceValue < priceValue

    const labelClasses = classNames({
        'u-margin-top-sm': options > 0
    })

    return (
        <ProductItem customWidth="20%"
            className="u-padding-top-lg u-padding-bottom-lg u-padding-start u-padding-end"
            title={<h2 className="u-h5">{title}</h2>}
            image={productImage}
        >
            <div className="u-flexbox u-align-bottom">
                <div className="u-flex-none u-color-neutral-50 u-text-size-small">
                    {options && options.map(({label, value}, idx) => {
                        const classes = classNames({
                            'u-margin-top-sm': idx > 0
                        })

                        return (
                            <p
                                className={classes}
                                key={`${id}-option-${idx}`}
                            >
                                {label}: {value}
                            </p>
                        )
                    })}

                    <p className={labelClasses}>
                        <FormattedText messageId="checkoutPayment.product.quantity" />: {quantity}
                    </p>
                </div>

                <div className="u-text-align-end u-flex">
                    {discount ?
                        <div>
                            <span className="u-h5 u-color-accent u-text-weight-semi-bold">
                                <FormattedPrice value={linePrice} />
                            </span>
                            <span className="u-text-quiet u-text-strikethrough u-padding-start">
                                <FormattedPrice value={price} />
                            </span>
                        </div>
                    :
                        <div className="u-h5 u-text-weight-semi-bold">
                            <FormattedPrice value={linePrice} />
                        </div>
                    }
                    <div className="u-text-quiet">
                        <em>
                            {
                                formatMessage(context, {
                                    id: 'checkoutPayment.product.priceEach',
                                    defaultMessage: '{price} each'
                                }, {
                                    price: formatNumber(
                                        context,
                                        itemPrice,
                                        {style: 'currency', currency: currency.code}
                                    )
                                })
                            }
                        </em>
                    </div>
                </div>
            </div>
        </ProductItem>
    )
}

PaymentProductItem.propTypes = {
    itemPrice: PropTypes.string.isRequired,
    linePrice: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    currency: PropTypes.object,
    /**
     * Item ID
     */
    id: PropTypes.string,
    /**
     * Product options
     */
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
    })),
    /**
     * Number of items
     */
    quantity: PropTypes.number,
    thumbnail: PropTypes.object,
    title: PropTypes.string
}

PaymentProductItem.contextTypes = {
    intl: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    currency: getSelectedCurrency
})

export default connect(
    mapStateToProps
)(PaymentProductItem)
