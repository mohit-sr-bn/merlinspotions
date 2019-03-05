/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'
import {submitForm} from '../../../connectors/_merlins-connector/utils'
const UPDATE_ITEM_URL = '/checkout/cart/updatePost/'

import {initCartPage as originalInitCartPage, addToCart} from '../../../connectors/_merlins-connector/cart/commands'
import {initProductDetailsPage} from '../../../connectors/_merlins-connector/products/commands'
import {autoAddToCartFinished, cartUpdateError} from '../../../containers/cart/actions'
import {getCartURL} from '../../../containers/app/selectors'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'

// This command overrides the Merlin's connector updateItemQuantity
// instead of submitting the "mini-cart form" from the desktop site,
// this command now submits the "standard" cart form
export const updateItemQuantity = (itemId, itemQuantity) => {
    return (dispatch) => {
        const requestData = {
            update_cart_action: 'update_qty'
        }

        requestData[`cart[${itemId}][qty]`] = itemQuantity

        return submitForm(UPDATE_ITEM_URL, requestData, {method: 'POST'})
            .then(() => dispatch(IntegrationManager.cart.getCart()))
    }
}

// This command overrides the Merlin's connector initCartPage. With this, we
// parse the URL to check for parameters that might add products to the cart.
// If we are coming in from AMP, we may want to add an item to the cart
// immediately if the user has come into the PWA via a click on "Add to Cart" on
// the AMP page.
export const initCartPage = (url) => (dispatch, getState) => {
    const parsedUrl = url && new URL(url)

    // Setup "Add to Cart" URL bindings. The format of the URL should follow
    // the below template and URI parameters:
    //
    //     https://www.merlinspotions.com/checkout/cart/
    //         ?action=addToCart
    //         &quantity=1
    //         &productId=1
    //         &attributeColorId=90
    //         &attributeSizeId=131
    //         &variantId=32
    //         &variantValues=11-4
    //         &productUrl=https%3A%2F%2Fwww.merlinspotions.com%2Feye-of-newt.html
    //
    // **Note** that value is a combination of the current variant's color and
    // size values.
    const parsedAddToCartParams = parsedUrl && parsedUrl.searchParams.has('action') &&
        parsedUrl.searchParams.get('action') === 'addToCart' &&
        parsedUrl.searchParams.has('quantity') &&
        parsedUrl.searchParams.has('productId') &&
        parsedUrl.searchParams.has('attributeColorId') &&
        parsedUrl.searchParams.has('attributeSizeId') &&
        parsedUrl.searchParams.has('variantId') &&
        parsedUrl.searchParams.has('variantValues') &&
        parsedUrl.searchParams.has('productUrl')

    if (parsedAddToCartParams) {
        const quantity = parsedUrl.searchParams.get('quantity')
        const productId = parsedUrl.searchParams.get('productId')
        const attributeColorId = parsedUrl.searchParams.get('attributeColorId')
        const attributeSizeId = parsedUrl.searchParams.get('attributeSizeId')
        const variantId = parsedUrl.searchParams.get('variantId')
        const variantValues = parsedUrl.searchParams.get('variantValues')
        const url = decodeURIComponent(parsedUrl.searchParams.get('productUrl'))

        // Reconstruct the Variant object to the expected format, as defined by
        // Merlins Connector's `addToCart` command
        const [color, size] = variantValues.split('-') // this expects a string like `11-4`
        const variant = {
            id: variantId,
            attributeIds: {},
            values: {}
        }

        if (attributeColorId !== 'null' && attributeColorId !== 'undefined') {
            variant.attributeIds.color = attributeColorId
        }

        if (attributeSizeId !== 'null' && attributeSizeId !== 'undefined') {
            variant.attributeIds.size = attributeSizeId
        }

        if (color !== 'null' && color !== 'undefined') {
            variant.values.color = color
        }

        if (size !== 'null' && size !== 'undefined') {
            variant.values.size = size
        }

        // Protect against a page refresh causing another add-to-cart
        window.history.replaceState({}, '', `${getCartURL(getState())}`)

        return dispatch(initProductDetailsPage(url))
            .then(() => dispatch(addToCart(productId, quantity, variant)))
            .then(() => dispatch(autoAddToCartFinished()))
            .catch((error) => {
                dispatch(autoAddToCartFinished())
                dispatch(addNotification(
                    'errorAddingToCart',
                    'Unable to add item to your cart. Please try again later.',
                    true
                ))
                return dispatch(cartUpdateError(error))
            })
            .then(() => dispatch(originalInitCartPage(url)))
    }

    // There are other places in the app were we dispatch `autoAddToCartStarted`, dispatching this
    // is a safety-net to prevent a failure that could cause the cart to appear to load indefinitely.
    dispatch(autoAddToCartFinished())
    return dispatch(originalInitCartPage(url))
}
