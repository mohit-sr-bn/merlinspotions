/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {FormattedPrice} from '../../../components/intl/index'

const ShippingMethodLabel = ({label, info, cost}) => {
    return (
        <div className="u-flexbox">
            <div className="u-flex">
                <div>{label}</div>
                <div className="u-text-quiet u-text-weight-regular u-margin-top-sm">{info}</div>
            </div>
            <div className="u-flex-none">
                <FormattedPrice value={cost} />
            </div>
        </div>
    )
}

ShippingMethodLabel.propTypes = {
    /**
    * The cost of the shipping method
    */
    cost: PropTypes.string.isRequired,
    /**
    * The info for the shipping method
    */
    info: PropTypes.string,
    /**
    * The label for the shipping method
    */
    label: PropTypes.string
}


export default ShippingMethodLabel
