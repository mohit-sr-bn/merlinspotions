/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import {ACCOUNT_REMOVE_WISHLIST_ITEM_MODAL} from '../constants'
import {removeWishlistItem} from '../../containers/wishlist/actions'
import {getRemoveWishlistItemData} from '../../containers/wishlist/selectors'
import {closeModal} from '../actions'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'

import Sheet from 'progressive-web-sdk/dist/components/sheet'
import Button from 'progressive-web-sdk/dist/components/button'
import Image from 'progressive-web-sdk/dist/components/image'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const AccountRemoveWishlistItemModal = ({closeModal, isOpen, removeWishlistItem, itemData, duration}) => {
    const {productId, itemId} = itemData
    return (
        <Sheet
            className="pw--no-shadow m-cart__account-remove-wishlist-item-modal"
            open={isOpen}
            onDismiss={closeModal}
            duration={duration}
            maskOpacity={0.7}
            effect="modal-center"
            shrinkToContent={true}
            coverage="90%"
        >
            <div className="u-flexbox u-direction-column u-align-center u-padding-md u-padding-top-lg u-padding-bottom-lg u-text-align-center">
                <div className="u-padding-md">
                    <Image
                        src={getAssetUrl('static/img/cart/remove-item@2x.png')}
                        alt="Stars and motion lines indicating something has disappeared"
                        height="75px"
                        width="95px"
                    />
                </div>

                <p className="u-margin-bottom-lg u-padding-start-lg u-padding-end-lg">
                    <strong>Are you sure you want to delete this wishlist item?</strong>
                </p>

                <div className="u-flex u-flexbox">
                    <Button
                        className="pw--tertiary u-text-uppercase u-flex"
                        onClick={closeModal}
                        data-analytics-name={UI_NAME.cancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="pw--secondary u-text-uppercase u-flex u-margin-start"
                        onClick={() => {
                            closeModal()
                            removeWishlistItem(productId, itemId)
                        }}
                        data-analytics-name={UI_NAME.confirmation}
                    >
                        Ok
                    </Button>
                </div>
            </div>
        </Sheet>
    )
}

AccountRemoveWishlistItemModal.propTypes = {
    /**
     * A function used to set the navigation-sheet's state to closed
     */
    closeModal: PropTypes.func,
    /**
     * Duration will define the time the animation takes to complete.
     */
    duration: PropTypes.number,
    /**
     * Whether the modal is open or not
     */
    isOpen: PropTypes.bool,
    /**
    * The id of the item being deleted
    */
    itemData: PropTypes.object,
    /**
    * Removes the wishlist item
    */
    removeWishlistItem: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    isOpen: isModalOpen(ACCOUNT_REMOVE_WISHLIST_ITEM_MODAL),
    itemData: getRemoveWishlistItemData
})

const mapDispatchToProps = {
    closeModal: () => closeModal(ACCOUNT_REMOVE_WISHLIST_ITEM_MODAL, UI_NAME.removeSavedWishlistItem),
    removeWishlistItem
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountRemoveWishlistItemModal)
