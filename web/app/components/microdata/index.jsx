/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export const MicrodataOffer = ({available, children, className}) => {
    const classes = classNames('c-microdata-offer', className)

    let availability
    if (available) {
        availability = 'In Stock'
    // If available is not true or false,
    // we haven't actually gotten the data back for it yet
    } else if (available === false) {
        availability = 'Out of Stock'
    }

    return (
        <span
            className={classes}
            itemScope
            itemProp="offers"
            itemType="http://schema.org/Offer"
        >
            {children}
            {!!availability &&
                <meta itemProp="availability" content={availability} />
            }
        </span>
    )
}

MicrodataOffer.propTypes = {
    available: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string
}
