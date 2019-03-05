/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

// Components
import Breadcrumbs from 'mobify-amp-sdk/dist/components/breadcrumbs'
import Price from '../../../components/price'
import {MicrodataOffer} from '../../../components/microdata'

// Utils
import {canonicalURL} from '../../../utils'

// Selectors
import * as selectors from 'web/app/containers/product-details/selectors'
import {
    getProductTitle,
    getProductPrice,
    getProductAvailability,
    getProductHref,
    getProductId
} from 'progressive-web-sdk/dist/store/products/selectors'

const ProductDetailsHeading = ({
    available,
    breadcrumbs,
    title,
    price,
    productID,
    productHref
}) => {
    // Fix breadcrumbs href data
    const categoryBreadcrumbsItems = breadcrumbs.map((entry) => {
        entry.href = canonicalURL(entry.href)
        return entry
    })

    return (
        <div className="t-product-details-heading u-padding-md u-box-shadow u-position-relative u-z-index-1">
            <div className="t-product-details__breadcrumbs u-margin-bottom-md">
                <Breadcrumbs items={categoryBreadcrumbsItems} includeMicroData />
            </div>

            <h1
                className="t-product-details-heading__title u-text-uppercase u-margin-bottom"
                itemProp="name"
            >
                {title}
            </h1>

            <MicrodataOffer available={available}>
                {(available && price) &&
                    <Price
                        className="t-product-details-heading__price t-product-details__price u-color-accent u-text-weight-regular u-text-family-header u-text-letter-spacing-small"
                        price={price}
                    />
                }
            </MicrodataOffer>

            <meta itemProp="productID" content={productID} />
            <meta itemProp="url" content={productHref} />
        </div>
    )
}

ProductDetailsHeading.propTypes = {
    available: PropTypes.bool,
    breadcrumbs: PropTypes.array,
    price: PropTypes.string,
    productHref: PropTypes.string,
    productID: PropTypes.string,
    title: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    available: getProductAvailability,
    breadcrumbs: selectors.getProductDetailsBreadcrumbs,
    title: getProductTitle,
    price: getProductPrice,
    productHref: getProductHref,
    productID: getProductId,
})

export default connect(mapStateToProps)(ProductDetailsHeading)
