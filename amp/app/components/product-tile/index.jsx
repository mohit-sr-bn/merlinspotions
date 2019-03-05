/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {ampComponent} from 'mobify-amp-sdk/dist/amp-sdk'

// Components
import Img from 'mobify-amp-sdk/dist/components/img'
import ListTile from 'mobify-amp-sdk/dist/components/list-tile'
import {MicrodataOffer} from '../microdata'
import ProductItem from '../product-item'
import Price from '../price'

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
    <Img
        src={src}
        alt={alt}
        layout="fixed"
        height="150px"
        width="120px"
        itemProp="image"
    />
)

ProductImage.propTypes = {
    alt: PropTypes.string,
    src: PropTypes.string
}

const InStockPrice = ({price}) => (
    <MicrodataOffer available>
        <Price className="u-text-weight-bold u-color-error" price={price} />
    </MicrodataOffer>
)

InStockPrice.propTypes = {
    price: PropTypes.string
}

const OutOfStockPrice = () => {
    return (
        <MicrodataOffer available={false}>
            <span className="u-text-weight-bold u-color-error">Out of stock</span>
        </MicrodataOffer>
    )
}

const ProductTile = ({className, thumbnail, href, price, title, id}) => {
    const priceElement = price && price.length ?
        <InStockPrice price={price} /> :
        <OutOfStockPrice />

    return (
        <ListTile className="c-product-tile" href={href}>
            <ProductItem customWidth="45%"
                className={classNames('u-align-center', className)}
                title={<h2 className={titleClassName} itemProp="name">{title}</h2>}
                price={priceElement}
                image={<ProductImage {...thumbnail} />} />

            <meta itemProp="productID" content={id} />
            <meta itemProp="url" content={href} />
        </ListTile>
    )
}

ProductTile.propTypes = {
    available: PropTypes.bool,
    /**
     * Optional className for the product tile
     */
    className: PropTypes.string,
    href: PropTypes.string,
    id: PropTypes.string,
    price: PropTypes.string,
    thumbnail: PropTypes.shape({
        alt: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
    }),
    title: PropTypes.string
}

export default ampComponent(ProductTile)
