/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

// Components
import Img from 'mobify-amp-sdk/dist/components/img'
import Carousel from 'mobify-amp-sdk/dist/components/carousel'

// Selectors
import {getProductImages} from 'progressive-web-sdk/dist/store/products/selectors'

const ProductDetailsCarousel = ({images}) => {

    return (
        <Carousel
            id="product-details-carousel"
            className="a--frame a--side-controls t-product-details__carousel u-padding-md u-bg-color-neutral-10"
            height="330"
            width="330"
        >
            {images.map(({src, alt = ''}) => (
                <Img
                    className="u-display-block"
                    height="330"
                    width="330"
                    alt={alt}
                    src={src}
                    key={src}
                    itemProp="image"
                />
            ))}
        </Carousel>
    )
}

ProductDetailsCarousel.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string
    })).isRequired
}

const mapStateToProps = createPropsSelector({
    images: getProductImages
})

export default connect(mapStateToProps)(ProductDetailsCarousel)
