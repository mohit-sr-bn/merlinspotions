/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import Image from 'progressive-web-sdk/dist/components/image'

/**
 * Product image with width and height preset for use on the
 * view wishlist or cart pages
 */

const ProductImage = ({src, alt, className}) => (
    <Image src={src} alt={alt} width="104px" height="104px" className={className} />
)

ProductImage.propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    src: PropTypes.string
}

export default ProductImage
