/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Image from 'progressive-web-sdk/dist/components/image'
import Link from 'progressive-web-sdk/dist/components/link'
import Ratio from 'progressive-web-sdk/dist/components/ratio'
import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'

import ProductItem from '../product-item'
import {FormattedPrice} from '../intl/index'
import {MicrodataOffer} from '../microdata'

/**
 * Product Tile represents a product and its basic information: image,
 * link and price.
 */

const titleClassName = classNames(
    'c-product-tile__name',
    'u-h4',
    'u-text-family',
    'u-text-weight-medium',
    'u-color-neutral-60'
)

const ProductImage = ({src, alt}) => (
    <Ratio width="8" height="10">
        <Image
            className="c-product-tile__image"
            src={src}
            alt={alt}
            width="100%"
            height="100%"
            itemProp="image"
            shouldLazyLoad={true}
            lazyLoadThreshold={120}
        />
    </Ratio>
)

ProductImage.propTypes = {
    alt: PropTypes.string,
    src: PropTypes.string
}

const ProductPrice = ({price}) => {
    return (
        <MicrodataOffer className="u-text-weight-bold u-color-error" available>
            <FormattedPrice value={price} />
        </MicrodataOffer>
    )
}

ProductPrice.propTypes = {
    price: PropTypes.string.isRequired,
    currency: PropTypes.object,
}

const OutOfStockPrice = () => {
    return (
        <MicrodataOffer className="u-text-weight-bold u-color-error" available={false}>
            Out of stock
        </MicrodataOffer>
    )
}

const ProductTile = ({className, thumbnail, href, price, title, onClick, productId, available}) => {
    const productImage = (<ProductImage {...thumbnail} />)

    const titleElement = title
        ? <h2 className={titleClassName} itemProp="name">{title}</h2>
        : <SkeletonBlock height="34px" />

    const priceElement = (price && price.length > 0 && <ProductPrice price={price} />) ||
        (!available) && <OutOfStockPrice /> ||
        <SkeletonBlock height="22px" width="50px" />

    return (
        <article
            className={classNames(className, 'c-product-tile', 'u-padding-bottom-lg')}
        >
            <Link
                href={href}
                onClick={onClick}
            >
                <ProductItem
                    className="t-product-list__product-tile"
                    title={titleElement}
                    price={priceElement}
                    image={productImage}
                    customWidth="100%"
                />

                <meta itemProp="productID" content={productId} />
                <meta itemProp="url" content={href} />
            </Link>
        </article>
    )
}

ProductTile.propTypes = {
    available: PropTypes.bool,
    /**
     * Optional className for the product tile
     */
    className: PropTypes.string,
    href: PropTypes.string,
    price: PropTypes.string,
    productId: PropTypes.string,
    thumbnail: PropTypes.shape({
        alt: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
    }),
    title: PropTypes.string,
    onClick: PropTypes.func
}

export default ProductTile
