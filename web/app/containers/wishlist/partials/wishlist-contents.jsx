/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getContentLoaded} from '../selectors'
import {getWishlistProducts} from 'progressive-web-sdk/dist/store/user/selectors'
import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'
import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'
import ProductItem from '../../../components/product-item'
import ProductImage from '../../../components/product-image'
import WishlistShareButton from './wishlist-share'
import WishlistItems from './wishlist-items'

const productItemClassNames = 'u-padding-md u-padding-top-lg u-padding-bottom-lg u-border-light-top'

const ProductSkeleton = () => (
    <ProductItem
        className={productItemClassNames}
        title={<SkeletonText type="h3" className="u-margin-bottom-sm" />}
        image={<ProductImage src="null" alt="null" />}
        footerContent={
            <SkeletonBlock height="40px" width="100%" className="u-margin-top-md" />
        }
    >
        <SkeletonText width="60%" style={{lineHeight: '20px'}} />
        <SkeletonText width="60%" style={{lineHeight: '20px'}} className="u-margin-bottom-sm" />
    </ProductItem>
)

const WishlistContents = ({
    products,
    contentLoaded
}) => (
    <div className="u-padding-top-md u-bg-color-neutral-10">
        <div className="u-border-light-bottom u-bg-color-neutral-00">
            {contentLoaded ?
                <WishlistItems productItemClassNames={productItemClassNames} />
            :
                <ProductSkeleton />
            }
        </div>
        {products.length > 0 &&
            <WishlistShareButton />
        }
    </div>
)


WishlistContents.propTypes = {
    contentLoaded: PropTypes.bool,
    products: PropTypes.array,
}

const mapStateToProps = createPropsSelector({
    contentLoaded: getContentLoaded,
    products: getWishlistProducts
})

export default connect(
    mapStateToProps
)(WishlistContents)
