/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'

const AddressBlock = ({
    firstname,
    lastname,
    addressLine1,
    addressLine2,
    city,
    countryId,
    country,
    postcode,
    telephone,
    region,
    className
}) => {
    const classes = classNames('u-padding-md c-address-block', className)
    return (
        <div className={classes}>
            {firstname ?
                <p>{firstname} {lastname}</p>
            :
                <SkeletonText width="50%" style={{lineHeight: '20px', display: 'block'}} />
            }
            {addressLine1 ?
                <p>{addressLine1}</p>
            :
                <SkeletonText width="60%" style={{lineHeight: '20px', display: 'block'}} />
            }
            {addressLine2 &&
                <p>{addressLine2}</p>
            }
            {city ?
                <p>{city}, {region}, {postcode}</p>
            :
                <SkeletonText width="70%" style={{lineHeight: '20px', display: 'block'}} />
            }
            {countryId || country ?
                <p>{countryId || country}</p>
            :
                <SkeletonText width="40%" style={{lineHeight: '20px', display: 'block'}} />
            }
            {telephone ?
                <p>{telephone}</p>
            :
                <SkeletonText width="50%" style={{lineHeight: '20px', display: 'block'}} />
            }
        </div>
    )
}

AddressBlock.propTypes = {
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,
    country: PropTypes.string,
    countryId: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    postcode: PropTypes.string,
    region: PropTypes.string,
    telephone: PropTypes.string,
}

export default AddressBlock
