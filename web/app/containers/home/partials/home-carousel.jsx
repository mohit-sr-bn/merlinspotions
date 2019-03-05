/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'

import {getviewportSize} from 'progressive-web-sdk/dist/store/app/selectors'
import {VIEWPORT_SIZE_NAMES} from 'progressive-web-sdk/dist/ssr/constants'

import Carousel from 'progressive-web-sdk/dist/components/carousel'
import CarouselItem from 'progressive-web-sdk/dist/components/carousel/carousel-item'
import Image from 'progressive-web-sdk/dist/components/image'
import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'
import Ratio from 'progressive-web-sdk/dist/components/ratio'

const bannerMap = (viewportSize, smallOrMedium, aspect) => (banner, index) => { // eslint-disable-line react/display-name
    const {href, alt} = banner
    const imgLowRes = getAssetUrl(`static/img/homepage_carousel/promo-${viewportSize || 'small'}.png`)
    const imgHighRes = getAssetUrl(`static/img/homepage_carousel/promo-${viewportSize || 'small'}@2x.png`) + ' 2x' // eslint-disable-line prefer-template

    // Ratios:
    // - Small and Medium breakpoints: 400x249  -> 4000x2490. This is to ensure that the image fills the entire space - even when the screen is being expanded
    // - Large and XLarge breakpoints: 1280x533 -> 12800x5330. This is to ensure that the image fills the entire space - even when the screen is being expanded
    const placeholder = (
        <Ratio aspect={aspect}>
            <SkeletonBlock width="4000px" height="2490px" />
        </Ratio>
    )

    return (
        <CarouselItem href={href} key={index}>
            <Image
                src={imgLowRes}
                srcSet={[imgLowRes, imgHighRes]}
                alt={alt}
                className="u-display-block"
                hidePlaceholder={true}
                loadingIndicator={placeholder}
                // Not all browsers support the Event constructor, so use a
                // polyfilled CustomEvent constructor if window.Event is not
                // a constructor
                onImageLoaded={() => {
                    const event = typeof window.Event === 'function'
                        ? new Event('resize')
                        : new CustomEvent('resize')
                    window.dispatchEvent(event)
                    // @TODO: SDK Carousel should manage resize of its slide
                    // images as they load
                }}
            />
        </CarouselItem>
    )
}

const HomeCarousel = ({isServerSideOrHydrating, viewportSize}) => {
    const smallOrMedium = viewportSize === VIEWPORT_SIZE_NAMES.SMALL || viewportSize === VIEWPORT_SIZE_NAMES.MEDIUM
    const aspect = smallOrMedium ? '400:249' : '1280:533'

    if (isServerSideOrHydrating) {
        return (
            <div className="t-home__carousel">
                <Ratio aspect={aspect}>
                    <SkeletonBlock width="4000px" height="2490px" />
                </Ratio>
            </div>
        )
    }

    // Here we are hardcoding the quantity of banners. `bannerMap()` will output
    // a hardcoded component for each node in the `banners` array. This is
    // intentional, as the content is not coming from any backend or endpoint.
    const banners = [{}, {}, {}, {}]

    return (
        <div className="t-home__carousel">
            <Carousel
                className="pw--side-controls pw--side-controls-with-tight-space"
                allowLooping={true}
                previousIcon="chevron-left"
                nextIcon="chevron-right"
                iconSize={'' /* blank on purpose */}
            >
                {banners.map(bannerMap(viewportSize, smallOrMedium, aspect))}
            </Carousel>
        </div>
    )
}

HomeCarousel.propTypes = {
    isServerSideOrHydrating: PropTypes.bool,
    viewportSize: PropTypes.string,
}

const mapStateToProps = createPropsSelector({
    viewportSize: getviewportSize,
})

export default connect(mapStateToProps)(HomeCarousel)
