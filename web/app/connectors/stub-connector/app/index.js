/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable no-unused-vars */

import {makeRequest} from 'progressive-web-sdk/dist/utils/fetch-utils'
import {setPageFetchError} from 'progressive-web-sdk/dist/store/offline/actions'

import {getCart} from '../cart'

import {
    receiveNavigationData,
    setCartURL,
    setWishlistURL,
    setSignInURL,
    receiveSelectedCurrency,
    receiveAvailableCurrencies
} from 'mobify-integration-manager/dist/integration-manager/results'

import {getJQueryResponse} from '../config'

/**
 * When the user first lands on the site, the response from the desktop site is saved
 * This function allows you to get that response
 * You will only need to use this function if you're using HTML scraping as your back end
 */
const requestCapturedDoc = () => {
    return window.Progressive.capturedDocHTMLPromise.then((initialCapturedDocHTML) => {
        const body = new Blob([initialCapturedDocHTML], {type: 'text/html'})
        const capturedDocResponse = new Response(body, {
            status: 200,
            statusText: 'OK'
        })

        return Promise.resolve(capturedDocResponse)
    })
}

let isInitialEntryToSite = true

const runningInBrowser = () => typeof window !== 'undefined' && window.Progressive

const canRequestCaptureDoc = () => {
    // GoogleBot's version of Chromium does not support manually creating a response
    const isGoogleBot = /googlebot/i.test(window.navigator.userAgent)

    // AMP builds do not run in a browser and thus window will not be defined
    return runningInBrowser() && !isGoogleBot
}

const stubCurrency = {
    label: 'Dollar',
    symbol: '$',
    code: 'USD'
}

/**
 * This function is used to fetch data from a desktop page
 * You will only need to use this function if you're using HTML scraping as your back end
 */
export const fetchPageData = (url) => (dispatch) => {
    // AMP builds do not run in a browser and thus window will not be defined,
    // so request the page normally
    const request = isInitialEntryToSite &&
                    canRequestCaptureDoc() ? requestCapturedDoc() : makeRequest(url)
    isInitialEntryToSite = false

    return request
        .then(getJQueryResponse())
        .then((res) => {
            const [$, $response] = res

            // Add global actions here

            return res
        })
        .catch((error) => {
            console.info(error.message)
            if (error.name !== 'FetchError') {
                throw error
            }
        })
}

export const initApp = () => (dispatch) => {
    console.log('[Stub Connector] Called initApp stub')

    const exampleNavigationData = {
        path: '/',
        root: {
            title: 'Root',
            path: '/',
            children: [{
                title: 'Category 1',
                path: '/potions.html',
                isCategoryLink: true
            }, {
                title: 'Category 2',
                path: '/books.html',
                isCategoryLink: true
            }, {
                title: 'Category 3',
                path: '/ingredients.html',
                isCategoryLink: true
            }, {
                title: 'Category 4',
                path: '/category4.html',
                isCategoryLink: true
            }, {
                title: 'Category 5',
                path: '/category5.html',
                isCategoryLink: true
            }, {
                title: 'Category 6',
                path: '/category6.html',
                isCategoryLink: true
            }, {
                title: 'Category 7',
                path: '/category7.html',
                isCategoryLink: true
            }]
        }
    }

    // For more information on the shape of the expected data,
    // see https://docs.mobify.com/progressive-web/latest/components/#!/Nav
    dispatch(receiveNavigationData(exampleNavigationData))
    dispatch(getCart())
    dispatch(setCartURL('/checkout/cart/'))
    dispatch(setWishlistURL('/wishlist/'))
    dispatch(setSignInURL('/customer/account/login/'))
    dispatch(receiveSelectedCurrency(stubCurrency))
    dispatch(receiveAvailableCurrencies([stubCurrency]))
    return Promise.resolve()
}
