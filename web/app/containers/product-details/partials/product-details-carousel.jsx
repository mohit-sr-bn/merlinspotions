/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as selectors from '../selectors'
import {getProductImages} from 'progressive-web-sdk/dist/store/products/selectors'
import classNames from 'classnames'

import Carousel from 'progressive-web-sdk/dist/components/carousel'
import CarouselItem from 'progressive-web-sdk/dist/components/carousel/carousel-item'
import Ratio from 'progressive-web-sdk/dist/components/ratio'
import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'
import Image from 'progressive-web-sdk/dist/components/image'

const ProductDetailsCarousel = ({images, contentsLoaded}) => {
    const carouselProps = {
        previousIcon: 'chevron-left',
        nextIcon: 'chevron-right',
        iconSize: 'medium',
        className: 'pw--frame pw--side-controls t-product-details__carousel',
        showControls: images.length > 1
    }

    const imgProps = {
        className: classNames('u-display-block', {
            'pw--is-transitioning': !contentsLoaded // Carousel hasn't received the final images yet
        }),
        hidePlaceholder: true,
        ratio: {aspect: '1:1'},
        loadingIndicator: <SkeletonBlock height="100%" />,
        useLoaderDuringTransitions: false
    }

    const renderItems = ({src, alt = ''}) => { // eslint-disable-line react/prop-types
        return (
            <CarouselItem key={src} >
                <Image {...imgProps} alt={alt} src={src} itemProp="image" />
            </CarouselItem>
        )
    }

    const renderSkeleton = (
        <CarouselItem>
            <Ratio aspect="1:1">
                <SkeletonBlock
                    height="100%"
                    width="100%"
                    className="u-padding-md"
                />
            </Ratio>
            <SkeletonBlock height="30px" />
        </CarouselItem>
    )

    return (
        <Carousel {...carouselProps}>
            {(images.length > 0) ? images.map(renderItems) : renderSkeleton}
        </Carousel>
    )
}

ProductDetailsCarousel.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape({
        src: PropTypes.string.isRequired,
        alt: PropTypes.string
    })).isRequired,
    contentsLoaded: PropTypes.bool
}

const mapStateToProps = createPropsSelector({
    contentsLoaded: selectors.getProductDetailsContentsLoaded,
    images: getProductImages
})

export default connect(mapStateToProps)(ProductDetailsCarousel)
