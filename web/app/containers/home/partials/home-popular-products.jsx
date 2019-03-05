/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import Scroller from 'progressive-web-sdk/dist/components/scroller'
import Tile from 'progressive-web-sdk/dist/components/tile'
import {FormattedPrice} from '../../../components/intl/index'

import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'
import {VIEWPORT_SIZE_NAMES} from 'progressive-web-sdk/dist/ssr/constants'

import Carousel from 'progressive-web-sdk/dist/components/carousel'
import CarouselItem from 'progressive-web-sdk/dist/components/carousel/carousel-item'

const imagesPerCarouselItem = 6

const productState = (price) => {
    if (price) {
        return <FormattedPrice value={price} />
    } else {
        return <span className="u-color-error">Out of stock</span>
    }
}

const chunkArray = (array, chunksize) => {
    const tempArray = array ? array.slice() : []
    const outArray = []
    while (tempArray.length > 0) {
        outArray.push(tempArray.splice(0, chunksize))
    }
    return outArray
}

const imgAspect = {
    ratio: {aspect: '4:5'},
    width: '240',
    height: '300'
}

const createPopularItems = (products, isServerSideOrHydrating) => {
    return products.map((product, idx) => {
        const imagePropsCheck = isServerSideOrHydrating
        ? imgAspect
        : {
            src: product.image.link,
            alt: product.image.alt,
            ...imgAspect
        }
        const ratingPropsCheck = (product.rating && product.rating.count > 0)
        ? {
            className: 'pw--solid',
            count: product.rating.count,
            total: product.rating.total
        }
        : undefined

        return (
            <Tile
                key={idx}
                className="u-flex"
                isColumn
                imageProps={imagePropsCheck}
                ratingProps={ratingPropsCheck}
                title={product.productName}
                price={productState(product.price)}
                href={product.href}
            />
        )
    })
}

const determineViewportSize = (largeOrXlarge, products, isServerSideOrHydrating) => {
    return (
        (largeOrXlarge && products.length > 0)
            ? <Carousel
                className="pw--side-controls pw--side-controls-with-tight-space"
                previousIcon="chevron-left"
                nextIcon="chevron-right"
                showPips={false}
                iconSize={'' /* blank on purpose */}
                >
                {chunkArray(products, imagesPerCarouselItem).map((chunk, index) =>
                    <CarouselItem key={index}>
                        <div className="u-text-height-single u-flexbox u-text-height-base u-text-align-start">
                            {createPopularItems(chunk, isServerSideOrHydrating)}
                        </div>
                    </CarouselItem>
                )}
            </Carousel>
         : <Scroller className="u-padding-bottom-lg">
             {createPopularItems(products, isServerSideOrHydrating)}
         </Scroller>
    )
}

const HomePopularProducts = ({products, isServerSideOrHydrating, viewportSize}) => {
    const largeOrXlarge = viewportSize === VIEWPORT_SIZE_NAMES.LARGE || viewportSize === VIEWPORT_SIZE_NAMES.XLARGE

    return (
        <div className="t-home__popular-items">
            <div className="u-margin-bottom-md u-padding-start-md u-padding-end-md u-flexbox u-align-center">
                <h2 className="u-h4 u-padding-top-lg">
                    New in Category
                </h2>
            </div>

            {determineViewportSize(largeOrXlarge, products, isServerSideOrHydrating)}
        </div>
    )
}

HomePopularProducts.propTypes = {
    isServerSideOrHydrating: PropTypes.bool,
    products: PropTypes.array,
    viewportSize: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    viewportSize: getviewportSize
})

export default connect(mapStateToProps)(HomePopularProducts)
