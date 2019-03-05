/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/**
 * Product Item represents a single product and it's basic information: name,
 * price, category and other desired information.
 */

const ProductItem = ({
    category,
    children,
    className,
    image,
    price,
    title,
    customWidth,
    footerContent
}) => {
    const classes = classNames('c-product-item', className)

    return (
        <div className={classes}>
            <div className="u-flex">
                {!!category &&
                    <p className="c-product-item__category u-margin-bottom-sm u-color-brand">
                        {category}
                    </p>
                }

                <div className="u-margin-bottom-sm u-text-capitilize">
                    {title}
                </div>

                {!!price &&
                    <div>{price}</div>
                }

                {!!children &&
                    <div>
                        {children}
                    </div>
                }
            </div>

            {image &&
                <div className="u-padding-end u-padding-bottom u-flex-none" style={{width: customWidth}}>
                    {image}
                </div>
            }

            {!!footerContent &&
                <div>
                    {footerContent}
                </div>
            }
        </div>
    )
}


ProductItem.propTypes = {
    /**
     * The ProductItem's name or designation
     */
    title: PropTypes.node.isRequired,

    /**
     * Designates the ProductItem's category (i.e. Potions, Books, etc.)
     */
    category: PropTypes.string,

    /**
     * Any children to be nested within this ProductItem
     */
    children: PropTypes.node,

    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    /**
     * Designates the custom width that accepets valid css units
     */
    customWidth: PropTypes.string,

    /**
     * Content to be added at the bottom of the item
    */
    footerContent: PropTypes.node,

    /**
     * Image of the product. Usually an `<img />` tag or `<Image />` component
     */
    image: PropTypes.node,

    /**
     * Designates the ProductItem's unit price
     */
    price: PropTypes.node
}

export default ProductItem
