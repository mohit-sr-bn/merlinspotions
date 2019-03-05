/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'
import {CURRENT_URL} from 'progressive-web-sdk/dist/store/app/constants'
import {initialize} from 'web/app/containers/product-details/actions'

// Partials
import ProductDetailsHeading from './partials/product-details-heading'
import ProductDetailsCarousel from './partials/product-details-carousel'
import ProductDetailsAddToCart from './partials/product-details-add-to-cart'
import ProductDetailsDescription from './partials/product-details-description'
import ProductDetailsState from './partials/product-details-state'

const ProductDetails = () => {
    return (
        <div className="t-product-details" itemScope itemType="http://schema.org/Product">
            <ProductDetailsState />
            <ProductDetailsHeading />
            <ProductDetailsCarousel />
            <ProductDetailsAddToCart />
            <ProductDetailsDescription />
        </div>
    )
}

ProductDetails.resolves = [({dispatch, getState}) => {
    return dispatch(initialize(getState().app.get(CURRENT_URL)))
}]

ProductDetails.templateName = 'pdp'

export default ampComponent(ProductDetails)
