/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {
    getModals,
    getOpenModals,
    getPreRenderingModals
} from 'progressive-web-sdk/dist/store/modals/selectors'
import {
    persistModal,
    preRenderModal
} from 'progressive-web-sdk/dist/store/modals/actions'

import Loadable from 'react-loadable'
import InlineLoader from 'progressive-web-sdk/dist/components/inline-loader'

import {
    ACCOUNT_ADDRESS_MODAL,
    ACCOUNT_REMOVE_ADDRESS_MODAL,
    ACCOUNT_REMOVE_WISHLIST_ITEM_MODAL,
    CART_ESTIMATE_SHIPPING_MODAL,
    CART_MERGE_ITEMS_MODAL,
    CART_REMOVE_ITEM_MODAL,
    CART_WISHLIST_MODAL,
    CHECKOUT_CONFIRMATION_MODAL,
    MINI_CART_MODAL,
    MORE_MENU,
    NAVIGATION_MODAL,
    OFFLINE_MODAL,
    PRIVACY_MODAL,
    PRODUCT_DETAILS_ITEM_ADDED_MODAL,
    PRODUCT_LIST_FILTER_MODAL,
    WISHLIST_ITEM_ADDED_MODAL
} from './constants'

// Modals included in main chunk
import MiniCart from './mini-cart'
import Navigation from './navigation'
import OfflineModal from './offline'

// TODO: Refactor this function to be a higher order component
// of Loadable, passing in path and prerender properties. It will then
// determine weather or not to use a loading component if we are or
// aren't prerendering.
const ModalLoadable = (loader) => {
    const loadable = Loadable({
        loader,
        LoadingComponent: () => <InlineLoader className="pw--fixed" /> // eslint-disable-line
    })
    return loadable
}

// Lazily Loaded Modals
const AccountAddressModal = ModalLoadable(() => import('./account-add-address' /* webpackChunkName: "account-add-address-modal" */))
const AccountRemoveAddressModal = ModalLoadable(() => import('./account-remove-address' /* webpackChunkName: "account-remove-address-modal" */))
const AccountRemoveWishlistItemModal = ModalLoadable(() => import('./account-remove-wishlist-item' /* webpackChunkName: "account-remove-wishlist-item-modal" */))
const CartEstimateShippingModal = ModalLoadable(() => import('./cart-estimate-shipping' /* webpackChunkName: "cart-estimate-shipping-modal" */))
const CartMergeItemsModal = ModalLoadable(() => import('./cart-merge-items' /* webpackChunkName: "cart-merge-items-modal" */))
const CartRemoveItemModal = ModalLoadable(() => import('./cart-remove-item' /* webpackChunkName: "cart-remove-item-modal" */))
const CartWishlistModal = ModalLoadable(() => import('./cart-wishlist' /* webpackChunkName: "cart-wishlist-modal" */))
const CheckoutConfirmationModal = ModalLoadable(() => import('./checkout-confirmation' /* webpackChunkName: "checkout-confirmation-modal" */))
const MoreMenuModal = ModalLoadable(() => import('./more-menu' /* webpackChunkName: "more-menu-modal" */))
const PrivacyModal = ModalLoadable(() => import('./privacy' /* webpackChunkName: "privacy-modal" */))
const ProductDetailsItemAddedModal = ModalLoadable(() => import('./product-details-item-added' /* webpackChunkName: "product-details-item-added-modal" */))
const ProductListFilterModal = ModalLoadable(() => import('./product-list-filter' /* webpackChunkName: "product-list-filter-modal" */))
const WishlistItemAddedModal = ModalLoadable(() => import('./wishlist-item-added' /* webpackChunkName: "wishlist-item-added-modal" */))

const MODAL_VIEWS = {
    // Various options can be passed into each modal object:
    //
    // - content: an instance of a Sheet component
    // - duration: an integer, custom duration for the open/close animation
    // - prerender: a boolean, whether the sheet renders while closed
    //      NOTE: modals that use this option should be imported the traditional way,
    //      now doing so will cause the modals loader to show on first page load.
    // - startsPersistent: a boolean, whether the sheet remains open on a route
    //       change, but only for the first time. Closing any modal will set
    //       its `persistent` state to false.
    //
    // [MODAL_KEY_NAME]: {
    //     content: <SheetComponentInstance />,
    //     duration: 2000,
    //     prerender: true,
    //     startsPersistent: true
    // }
    [ACCOUNT_ADDRESS_MODAL]: {content: <AccountAddressModal />},
    [ACCOUNT_REMOVE_ADDRESS_MODAL]: {content: <AccountRemoveAddressModal />},
    [ACCOUNT_REMOVE_WISHLIST_ITEM_MODAL]: {content: <AccountRemoveWishlistItemModal />},
    [CART_ESTIMATE_SHIPPING_MODAL]: {content: <CartEstimateShippingModal />},
    [CART_MERGE_ITEMS_MODAL]: {content: <CartMergeItemsModal />},
    [CART_REMOVE_ITEM_MODAL]: {content: <CartRemoveItemModal />},
    [CART_WISHLIST_MODAL]: {content: <CartWishlistModal />},
    [CHECKOUT_CONFIRMATION_MODAL]: {content: <CheckoutConfirmationModal />},
    [MINI_CART_MODAL]: {content: <MiniCart />},
    [MORE_MENU]: {content: <MoreMenuModal />},
    [NAVIGATION_MODAL]: {content: <Navigation />, prerender: true},
    [OFFLINE_MODAL]: {content: <OfflineModal />},
    [PRIVACY_MODAL]: {content: <PrivacyModal />, startsPersistent: true},
    [PRODUCT_DETAILS_ITEM_ADDED_MODAL]: {content: <ProductDetailsItemAddedModal />},
    [PRODUCT_LIST_FILTER_MODAL]: {content: <ProductListFilterModal />},
    [WISHLIST_ITEM_ADDED_MODAL]: {content: <WishlistItemAddedModal />}
}

class ModalManager extends React.Component {
    constructor(props) {
        super(props)

        Object.keys(MODAL_VIEWS).forEach((modalKey) => {
            const currentModal = MODAL_VIEWS[modalKey]

            // Initialize modals that are set to prerender
            if (currentModal.prerender) {
                props.preRenderModal(modalKey)
            }

            // Initialize modals that are set to startsPersistent
            if (currentModal.startsPersistent) {
                props.persistModal(modalKey)
            }
        })
    }

    shouldComponentUpdate(nextProps) {
        const nextModals = nextProps.modals
        const {modals, duration} = this.props

        for (const nextModal in nextModals) {
            // Open Modal
            if (nextModals[nextModal].open) {
                return true
            }

            // Close Modal
            // Set a delay for modal close animation
            if (modals[nextModal] !== nextModals[nextModal]) {
                const currentModalData = MODAL_VIEWS[nextModal]

                if (currentModalData) {
                    const delay = currentModalData.duration || duration
                    setTimeout(() => this.forceUpdate(), delay)
                    return false
                }
            }
        }

        return true
    }

    cloneModal(key, modal) {
        const {duration} = this.props
        const modalProps = {
            key,
            duration: modal.duration || duration,
            prerender: modal.prerender || false
        }

        return React.cloneElement(modal.content, modalProps)
    }

    mapModals(modals) {
        const result = []

        Object.keys(modals).forEach((modalKey) => {
            const currentModalData = MODAL_VIEWS[modalKey]

            if (currentModalData) {
                result.push(this.cloneModal(modalKey, currentModalData))
            }
        })

        return result
    }

    renderOpenModals() {
        return this.mapModals(this.props.openModals)
    }

    preRenderModals() {
        return this.mapModals(this.props.preRenderingModals)
    }

    render() {
        return (
            <div className="m-modal-manager">
                <div className="m-modal-manager__open-modals">
                    {this.renderOpenModals()}
                </div>

                <div className="m-modal-manager__pre-rendered-modals">
                    {this.preRenderModals()}
                </div>
            </div>
        )
    }
}

ModalManager.propTypes = {
    /**
     * Duration will define the time animation takes to complete.
     * It is the default value for all modals in the project.
     * You can also pass duration to individual modals.
     */
    duration: PropTypes.number,

    /**
     * An object that contains the state of each modal.
     */
    modals: PropTypes.object,

    /**
     * An object that contains only the modals that are open.
     */
    openModals: PropTypes.object,

    /**
     * A function that sets a modal to persistent (stays open on route change)
     */
    persistModal: PropTypes.func,

    /**
     * A function that sets a modal to pre-render (render even when closed)
     */
    preRenderModal: PropTypes.func,

    /**
     * An object that contains only the modals that are closed and pre-rendering
     */
    preRenderingModals: PropTypes.object,
}

ModalManager.defaultProps = {
    duration: 200
}

const mapStateToProps = createPropsSelector({
    modals: getModals,
    openModals: getOpenModals,
    preRenderingModals: getPreRenderingModals,
})

const mapDispatchToProps = {
    persistModal,
    preRenderModal
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalManager)
