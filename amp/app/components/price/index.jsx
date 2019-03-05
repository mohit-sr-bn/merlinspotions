/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'

import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getSelectedCurrency} from 'progressive-web-sdk/dist/store/app/selectors'

/**
 * This component displays a price with microdata
 */

const Price = ({
    className,
    price,
    currency
}) => {
    const classes = classNames('c-price', className)

    return (
        <span className={classes}>
            <span>{currency.symbol}</span><span itemProp="price">{price}</span>
            <meta itemProp="priceCurrency" content={currency.code} />
        </span>
    )
}


Price.propTypes = {
    price: PropTypes.string.isRequired,

    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    currency: PropTypes.object
}

const mapStateToProps = createPropsSelector({
    currency: getSelectedCurrency
})

const ConnectedPrice = connect(
    mapStateToProps
)(Price)

export default ampComponent(ConnectedPrice)
