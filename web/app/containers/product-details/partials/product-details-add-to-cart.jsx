/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'

import {connect} from 'react-redux'
import * as ReduxForm from 'redux-form'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {getProductAvailability, getProductVariationCategories} from 'progressive-web-sdk/dist/store/products/selectors'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import * as selectors from '../selectors'
import {isRunningInAstro} from '../../app/selectors'

import * as actions from '../actions'
import {closeModal, openModal} from '../../../modals/actions'

import Button from 'progressive-web-sdk/dist/components/button'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Stepper from 'progressive-web-sdk/dist/components/stepper'
import Share from 'progressive-web-sdk/dist/components/share'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

import ProductDetailsVariations from './product-details-variations'
import {ADD_TO_CART_FORM_NAME} from '../../../store/form/constants'
import ShareHeader from '../../../components/share-header'


const openShareButton = (
    <Button
        icon="share"
        title="Share"
        iconClassName="u-margin-end"
        showIconText={true}
        className="u-color-brand u-text-letter-spacing-normal u-width-full"
        data-analytics-name={UI_NAME.shareModal}
        type="button"
    />
)

const SHARE_MODAL = 'share'

const ProductDetailsAddToCart = ({
    available,
    quantity,
    setQuantity,
    onSubmit,
    disabled,
    isInCheckout,
    isShareOpen,
    isInWishlist,
    error,
    handleSubmit,
    addToWishlist,
    updateWishlistItem,
    openShare,
    closeShare,
    decreaseQuantity,
    increaseQuantity,
    openNativeShare,
    isRunningInAstro,
    variations
}) => {
    const stepperProps = {
        decrementIcon: 'minus',
        disabled,
        incrementIcon: 'plus',
        initialValue: quantity,
        minimumValue: 1,
        onChange: setQuantity,
        className: 'u-flex-none',
        name: 'quantity',
        useReduxForm: true,
        onDecreaseClick: decreaseQuantity,
        onIncreaseClick: increaseQuantity,
    }

    const nativeShareButton = React.cloneElement(
        openShareButton,
        {
            onClick: openNativeShare
        }
    )

    return (
        <form
            id={ADD_TO_CART_FORM_NAME}
            data-analytics-name={UI_NAME.addToCart}
            onSubmit={handleSubmit(onSubmit)}
        >
            {variations.length > 0 &&
                <ProductDetailsVariations error={error} variations={variations} />
            }

            <label htmlFor="quantity">Quantity</label>
            <div className="u-margin-bottom-lg">
                {quantity > 0 &&
                    <Stepper {...stepperProps} />
                }
            </div>

            {available ? (
                <Button
                    type="submit"
                    icon="plus"
                    iconClassName="pw--small u-margin-end"
                    title={isInCheckout ? 'Update Cart' : 'Add to Cart'}
                    showIconText={true}
                    className="pw--primary u-width-full u-text-uppercase u-margin-bottom-lg t-product-details__add-to-cart"
                    disabled={disabled}
                    data-analytics-name={UI_NAME.addToCart}
                />
            ) : (
                <div className="t-product-details__indicator u-margin-bottom-lg">
                    <Icon name="close" className="u-margin-end-sm" />
                    Out of stock
                </div>
            )}

            <p className="u-text-weight-bold u-text-align-center u-margin-bottom-lg">
                Free shipping over $100. Free returns.
            </p>

            <div className="t-product-details__share-n-save">
                <Button
                    icon="wishlist-add"
                    title={isInWishlist ? 'Update in Wishlist' : 'Wishlist'}
                    iconClassName="u-margin-end"
                    showIconText={true}
                    className="t-product-details__save"
                    onClick={() => {
                        if (isInWishlist) {
                            return updateWishlistItem(quantity)
                        }
                        return addToWishlist(quantity)
                    }}
                    data-analytics-name={UI_NAME.wishlist}
                />

                {isRunningInAstro ?
                    nativeShareButton
                :
                    <Share
                        className="u-flex"
                        onShow={openShare}
                        onDismiss={closeShare}
                        open={isShareOpen}
                        triggerElement={openShareButton}
                        headerContent={ShareHeader(closeShare)}
                        coverage="40%"
                    />
                }
            </div>
        </form>
    )
}

ProductDetailsAddToCart.propTypes = {
    setQuantity: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    addToWishlist: PropTypes.func,
    available: PropTypes.bool,
    closeShare: PropTypes.func,
    decreaseQuantity: PropTypes.func,
    disabled: PropTypes.bool,
    error: PropTypes.object,
    handleSubmit: PropTypes.func,
    increaseQuantity: PropTypes.func,
    initialValues: PropTypes.object,
    isInCheckout: PropTypes.bool,
    isInWishlist: PropTypes.bool,
    isRunningInAstro: PropTypes.bool,
    isShareOpen: PropTypes.bool,
    openNativeShare: PropTypes.func,
    openShare: PropTypes.func,
    quantity: PropTypes.number,
    setOpenShare: PropTypes.func,
    updateWishlistItem: PropTypes.func,
    variations: PropTypes.array
}

const mapStateToProps = createPropsSelector({
    available: getProductAvailability,
    quantity: selectors.getItemQuantity,
    disabled: selectors.getAddToCartDisabled,
    initialValues: selectors.getInitialValues,
    isShareOpen: isModalOpen(SHARE_MODAL),
    isRunningInAstro,
    variations: getProductVariationCategories
})

const mapDispatchToProps = {
    setQuantity: actions.setItemQuantity,
    onSubmit: actions.submitCartForm,
    addToWishlist: actions.addToWishlist,
    updateWishlistItem: actions.updateItemInWishlist,
    closeShare: () => closeModal(SHARE_MODAL, UI_NAME.shareModal),
    openShare: () => openModal(SHARE_MODAL, UI_NAME.shareModal),
    openNativeShare: actions.openNativeShare,
    increaseQuantity: actions.increaseQuantity,
    decreaseQuantity: actions.decreaseQuantity
}

const ProductDetailsAddToCartReduxForm = ReduxForm.reduxForm({
    form: ADD_TO_CART_FORM_NAME,
    enableReinitialize: true
})(ProductDetailsAddToCart)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductDetailsAddToCartReduxForm)
