/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getWishlistItemQuantity} from '../../containers/wishlist/selectors'
import {stripEvent} from 'progressive-web-sdk/dist/utils/utils'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {getProductThumbnail, getProductTitle, getProductPrice} from 'progressive-web-sdk/dist/store/products/selectors'
import * as wishlistActions from '../../containers/wishlist/actions'
import {WISHLIST_ITEM_ADDED_MODAL} from '../constants'
import {closeModal} from '../actions'

import ItemAddedModalContents from '../../components/item-added-modal-contents'
import Sheet from 'progressive-web-sdk/dist/components/sheet'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const WishlistItemAddedModal = ({open, onDismiss, quantity, title, price, thumbnail, onGoToCheckout, duration}) => (
    <Sheet
        open={open}
        onDismiss={onDismiss}
        duration={duration}
        effect="slide-bottom"
        className="m-wishlist__item-added-modal"
        coverage="50%"
        shrinkToContent
    >
        <ItemAddedModalContents
            headerText="Product Added to Cart"
            ctaButtonOptions={{
                text: 'Go To Checkout',
                onClick: onGoToCheckout,
                'data-analytics-name': UI_NAME.checkout
            }}
            ctaClickHandler={onGoToCheckout}
            onDismiss={onDismiss}
            title={title}
            thumbnail={thumbnail}
            quantity={quantity}
            price={price}
        />
    </Sheet>
)

WishlistItemAddedModal.propTypes = {
    /**
     * Duration will define the time the animation takes to complete.
     */
    duration: PropTypes.number,
    open: PropTypes.bool,
    price: PropTypes.string,
    quantity: PropTypes.number,
    thumbnail: PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string
    }),
    title: PropTypes.string,
    onDismiss: PropTypes.func,
    onGoToCheckout: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    thumbnail: getProductThumbnail,
    open: isModalOpen(WISHLIST_ITEM_ADDED_MODAL),
    quantity: getWishlistItemQuantity,
    title: getProductTitle,
    price: getProductPrice
})

const mapDispatchToProps = {
    onGoToCheckout: wishlistActions.goToCheckout,
    onDismiss: stripEvent(() => closeModal(WISHLIST_ITEM_ADDED_MODAL, UI_NAME.wishlist))
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WishlistItemAddedModal)
