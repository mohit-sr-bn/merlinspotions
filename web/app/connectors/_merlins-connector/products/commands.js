/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {receiveFormInfo} from '../actions'

import {fetchPageData} from '../app/commands'
import {
    receiveProductDetailsProductData,
    receiveProductDetailsUIData
} from 'mobify-integration-manager/dist/integration-manager/api/products/results'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {receiveCurrentProductId} from 'mobify-integration-manager/dist/integration-manager/results'
import {productDetailsParser, productDetailsUIParser, pdpAddToCartFormParser} from './parsers'
import {jqueryResponse} from 'progressive-web-sdk/dist/jquery-response'
import {getUenc} from '../selectors'
import {submitForm} from '../utils'
import {ADD_TO_WISHLIST_URL} from '../../../containers/cart/constants'

export const initProductDetailsPage = (url) => (dispatch) => {
    return dispatch(fetchPageData(url))
        .then((res) => {
            const [$, $response] = res

            const productDetailsData = {
                ...productDetailsParser($, $response),
                href: url
            }

            const {id} = productDetailsData

            dispatch(receiveCurrentProductId(id))
            dispatch(receiveProductDetailsUIData({[id]: productDetailsUIParser($, $response)}))
            dispatch(receiveProductDetailsProductData({[id]: productDetailsData}))
            dispatch(receiveFormInfo({[id]: pdpAddToCartFormParser($, $response)}))

            if (url.includes('wishlist/index/configure') && productDetailsData.variants.length) {
                dispatch(addNotification(
                    'configureProfuct',
                    'You need to choose options for your item.',
                    true
                ))
            }
        })
        .catch((error) => { console.info(error.message) })
}

export const getProductVariantData = () => (dispatch) => Promise.resolve()

export const addItemToWishlist = (productId, productUrl, quantity) => (dispatch, getState) => {
    const currentState = getState()
    const payload = {
        product: productId,
        qty: quantity,
        // This won't always be defined, but add to wishlist will still work
        // if it's missing
        uenc: getUenc(productId)(currentState)
    }

    return submitForm(ADD_TO_WISHLIST_URL, payload, {method: 'POST'})
        .then(jqueryResponse)
        .then(([$, $response]) => { // eslint-disable-line no-unused-vars
            // The response is the HTML of the wishlist page, so check for the item we added
            if (!$response.find(`.price-box[data-product-id="${productId}"]`).length) {
                throw new Error('Add Request Failed')
            }
        })
}
