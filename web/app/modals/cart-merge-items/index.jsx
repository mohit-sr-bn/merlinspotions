/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import {CART_MERGE_ITEMS_MODAL} from '../constants'
import {closeModal} from 'progressive-web-sdk/dist/store/modals/actions'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {getCartURL} from '../../containers/app/selectors'

import Sheet from 'progressive-web-sdk/dist/components/sheet'
import Button from 'progressive-web-sdk/dist/components/button'
import Image from 'progressive-web-sdk/dist/components/image'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const CartMergeItemsModal = ({handleContinueClick, isOpen, duration, cartURL}) => {
    return (
        <Sheet
            className="pw--no-shadow m-cart__merge-item-modal"
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
                        src={getAssetUrl('static/img/checkout/merge-cart.svg')}
                        alt=""
                        height="75px"
                        width="113px"
                    />
                </div>

                <p className="u-h5 u-padding-top u-margin-bottom-md">
                    <strong>Items added to cart</strong>
                </p>

                <p className="u-margin-bottom-lg u-padding-start-lg u-padding-end-lg">
                    Items saved in your cart from a previous session have been added to your order.
                </p>

                <Button
                    className="pw--secondary u-width-full u-text-uppercase u-margin-bottom-md"
                    onClick={() => {
                        handleContinueClick()
                        browserHistory.push(cartURL)
                    }}
                >
                    Review Cart
                </Button>

                <Button
                    className="m-cart__merge-item-continue pw--tertiary u-width-full u-text-uppercase"
                    onClick={handleContinueClick}
                >
                    Continue
                </Button>
            </div>
        </Sheet>
    )
}

CartMergeItemsModal.propTypes = {
    /**
     * The URL path name for cart
     */
    cartURL: PropTypes.string,
    /**
     * Duration will define the time the animation takes to complete.
     */
    duration: PropTypes.number,
    /**
     * A function used to set the navigation-sheet's state to closed
     */
    handleContinueClick: PropTypes.func,
    /**
     * Whether the modal is open or not
     */
    isOpen: PropTypes.bool
}

const mapStateToProps = createPropsSelector({
    cartURL: getCartURL,
    isOpen: isModalOpen(CART_MERGE_ITEMS_MODAL)
})

const mapDispatchToProps = {
    handleContinueClick: () => closeModal(CART_MERGE_ITEMS_MODAL, UI_NAME.dismissModal)
}

export default connect(mapStateToProps, mapDispatchToProps)(CartMergeItemsModal)
