/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as selectors from '../../containers/product-details/selectors'
import {stripEvent} from 'progressive-web-sdk/dist/utils/utils'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {getProductThumbnail, getProductTitle, getProductPrice} from 'progressive-web-sdk/dist/store/products/selectors'
import * as productDetailsActions from '../../containers/product-details/actions'
import {PRODUCT_DETAILS_ITEM_ADDED_MODAL} from '../constants'
import {closeModal} from '../actions'

import ItemAddedModalContents from '../../components/item-added-modal-contents'
import Sheet from 'progressive-web-sdk/dist/components/sheet'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {getAddToCartQuantityValue} from '../../store/form/selectors'

const ProductDetailsItemAddedModal = ({open, onDismiss, quantity, title, price, thumbnail, onGoToCheckout, onGoToWishlist, duration, isWishlistAdded}) => (
    <Sheet
        open={open}
        onDismiss={onDismiss}
        duration={duration}
        effect="slide-bottom"
        className="m-product-details__item-added-modal"
        coverage="50%"
        shrinkToContent
    >
        <ItemAddedModalContents
            headerText={`Product Added to ${isWishlistAdded ? 'Wishlist' : 'Cart'}`}
            ctaButtonOptions={{
                text: isWishlistAdded ? 'View Wishlist' : 'Go To Checkout',
                onClick: isWishlistAdded ? onGoToWishlist : onGoToCheckout,
                'data-analytics-name': isWishlistAdded ? UI_NAME.wishlist : UI_NAME.checkout
            }}
            ctaClickHandler={isWishlistAdded ? onGoToWishlist : onGoToCheckout}
            onDismiss={onDismiss}
            title={title}
            thumbnail={thumbnail}
            quantity={quantity}
            price={price}
        />
    </Sheet>
)

ProductDetailsItemAddedModal.propTypes = {
    /**
     * Duration will define the time the animation takes to complete.
     */
    duration: PropTypes.number,
    isWishlistAdded: PropTypes.bool,
    open: PropTypes.bool,
    price: PropTypes.string,
    quantity: PropTypes.number,
    thumbnail: PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string
    }),
    title: PropTypes.string,
    onDismiss: PropTypes.func,
    onGoToCheckout: PropTypes.func,
    onGoToWishlist: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    isWishlistAdded: selectors.getIsWishlistAdded,
    thumbnail: getProductThumbnail,
    open: isModalOpen(PRODUCT_DETAILS_ITEM_ADDED_MODAL),
    quantity: getAddToCartQuantityValue,
    title: getProductTitle,
    price: getProductPrice
})

const mapDispatchToProps = {
    onGoToCheckout: productDetailsActions.goToCheckout,
    onGoToWishlist: productDetailsActions.goToWishlist,
    onDismiss: stripEvent(() => closeModal(PRODUCT_DETAILS_ITEM_ADDED_MODAL, UI_NAME.addToCart))
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductDetailsItemAddedModal)
