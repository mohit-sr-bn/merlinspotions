/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import stringify from 'json-stable-stringify'

import {fetchPageData} from '../app/commands'
import {receiveProductSearchData} from 'mobify-integration-manager/dist/integration-manager/api/product-search/results'
import {receiveProductsData} from 'mobify-integration-manager/dist/integration-manager/api/products/results'

import {parseProductSearch} from './parser'
import urlMapper from '../../../config/url-mapper'

const mapSearchResultIntoProduct = (searchResult) => {
    const {
        productId,
        productName,
        available,
        image,
        price,
        href
    } = searchResult

    const images = [{
        alt: image.alt,
        src: image.link
    }]

    return {
        id: productId,
        title: productName,
        price,
        href,
        available,
        images
    }
}

export const searchProducts = (searchParams, shouldParseNav = true) => (dispatch) => { // eslint-disable-line no-unused-vars
    const url = urlMapper.getSearchUrl(searchParams)
    return dispatch(fetchPageData(url, shouldParseNav))
        .then((res) => {
            const [$, $response] = res

            const productSearch = parseProductSearch($, $response, searchParams) // eslint-disable-line no-unused-vars
            dispatch(receiveProductSearchData({
                [stringify(searchParams)]: productSearch
            }))

            const productMap = {}
            productSearch.products.forEach((product) => {
                productMap[product.productId] = mapSearchResultIntoProduct(product)
            })
            dispatch(receiveProductsData(productMap))

            return res
        })
}
