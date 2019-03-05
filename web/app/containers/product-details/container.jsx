/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {initialize} from './actions'
import template from '../../template'

import * as selectors from './selectors'
import {isRunningInAstro, getCartURL, getWishlistURL} from '../app/selectors'

import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'
import ProductDetailsHeading from './partials/product-details-heading'
import ProductDetailsCarousel from './partials/product-details-carousel'
import ProductDetailsMoreInfo from './partials/product-details-more-info'
import ProductDetailsAddToCart from './partials/product-details-add-to-cart'


const ProductDetails = ({breadcrumbs, cartURL, isRunningInAstro, route: {routeName}, wishlistURL}) => {

    let breadcrumbItems = breadcrumbs
    const isInCheckout = (routeName === 'cartEditPage')
    const isInWishlist = (routeName === 'wishlistEditPage')

    if (isInCheckout) {
        breadcrumbItems = [{text: 'Cart', href: cartURL}]
    } else if (isInWishlist) {
        breadcrumbItems = [{text: 'Wishlist', href: wishlistURL}]
    }

    return (
        <div className="t-product-details" itemScope itemType="http://schema.org/Product">
            {!isRunningInAstro &&
                <div className="t-product-details__breadcrumbs">
                    <Breadcrumbs items={breadcrumbItems} includeMicroData />
                </div>
            }
            <div className="t-product-details__overview">
                <ProductDetailsCarousel />
                <div className="t-product-details__info">
                    <ProductDetailsHeading />
                    <ProductDetailsAddToCart isInCheckout={isInCheckout} isInWishlist={isInWishlist} />
                </div>
            </div>
            <ProductDetailsMoreInfo />
        </div>
    )
}


ProductDetails.propTypes = {
    breadcrumbs: PropTypes.array,
    cartURL: PropTypes.string,
    isRunningInAstro: PropTypes.bool,
    route: PropTypes.object,
    wishlistURL: PropTypes.string

}

ProductDetails.initAction = initialize

const mapStateToProps = createPropsSelector({
    breadcrumbs: selectors.getProductDetailsBreadcrumbs,
    cartURL: getCartURL,
    isRunningInAstro,
    wishlistURL: getWishlistURL,
})

export default template(
    connect(mapStateToProps)(ProductDetails)
)
