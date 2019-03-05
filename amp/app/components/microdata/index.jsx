/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'

const Offer = ({available, children, className}) => {
    const classes = classNames('c-microdata-offer', className)

    return (
        <span
            className={classes}
            itemScope
            itemProp="offers"
            itemType="http://schema.org/Offer"
        >
            {children}
            <meta itemProp="availability" content={available ? 'In Stock' : 'Out of Stock'} />
        </span>
    )
}

Offer.propTypes = {
    available: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string
}

export const MicrodataOffer = ampComponent(Offer)
