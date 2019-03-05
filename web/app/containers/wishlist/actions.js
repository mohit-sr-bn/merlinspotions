/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {WISHLIST_ITEM_ADDED_MODAL} from '../../modals/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import * as appActions from '../app/actions'
import {openModal, closeModal} from '../../modals/actions'
import {receiveCurrentProductId} from 'mobify-integration-manager/dist/integration-manager/results'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {getWishlistID} from 'progressive-web-sdk/dist/store/user/selectors'
import {browserHistory} from 'progressive-web-sdk/dist/routing'

export const receiveWishlistUIData = createAction('Receive Wishlist UI Data')
export const receiveWishlistItemQuantity = createAction('Receive Wishlist Item Quantity', ['itemQuantity'])
export const isConfiguringWishlist = createAction('User is configuring a wishlist item', ['isConfiguringWishlist'])
export const setRemoveWishlistItemData = createAction('User opened modal to remove wishlist item', ['removeWishlistItemData'])

export const initialize = (url, routeName) => (dispatch) => {
    dispatch(IntegrationManager.custom.getPageMetaData(routeName))
        .then((pageMeta) => dispatch(receiveWishlistUIData({...pageMeta})))
    return dispatch(IntegrationManager.account.getWishlist())
        .then(() => dispatch(receiveWishlistUIData({contentLoaded: true})))
}

export const addToCartFromWishlist = (productId, quantity, itemId) => (dispatch, getState) => {
    const wishlistId = getWishlistID(getState())
    dispatch(receiveCurrentProductId(productId))
    dispatch(receiveWishlistItemQuantity(quantity))

    return dispatch(IntegrationManager.account.addToCartFromWishlist(productId, {quantity, wishlistId, itemId}))
        .then(() => dispatch(openModal(WISHLIST_ITEM_ADDED_MODAL, UI_NAME.wishlist)))
        .catch(({message}) => {
            if (message && /redirect/i.test(message)) {
                return
            }
            dispatch(addNotification(
                'addToCartWishlistError',
                'Unable to add item to the cart.',
                true
            ))
        })
}

export const editWishlistItem = (productId, itemId) => (dispatch) => {
    dispatch(isConfiguringWishlist())
    return browserHistory.push({
        pathname: `/wishlist/index/configure/id/${itemId}/product_id/${productId}/`
    })
}

export const goToCheckout = () => (dispatch) => {
    dispatch(closeModal(WISHLIST_ITEM_ADDED_MODAL, UI_NAME.wishlist))
    dispatch(appActions.goToCheckout())
}

export const removeWishlistItem = (productId, itemId) => (dispatch, getState) => {
    const wishlistId = getWishlistID(getState())
    return dispatch(IntegrationManager.account.removeItemFromWishlist(itemId, wishlistId, productId))
}

export const updateWishlistQuantity = (quantity, itemId) => (dispatch, getState) => {
    const wishlistId = getWishlistID(getState())
    return dispatch(IntegrationManager.account.updateWishlistItemQuantity(quantity, itemId, wishlistId))
}
