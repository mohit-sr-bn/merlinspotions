/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

// The wrapping is implemented here to avoid a circular dependency
// involving the containers and the app actions.
import Loadable from 'react-loadable'

import {getBuildOrigin} from 'progressive-web-sdk/dist/asset-utils'
import ContainerPlaceholder from '../components/container-placeholder'
import {prefetchLink, runningServerSide} from 'progressive-web-sdk/dist/utils/utils'
import {requestIdleCallback} from '../utils/utils'
import {PerformanceManager} from 'progressive-web-sdk/dist/utils/performance-manager'

const isRunningInIOS = /ip(hone|ad)/i.test(navigator.userAgent)
const loadableList = []
const prefetchFilenames = []

const PWALoadable = (loader, chunkName) => {
    const loadable = Loadable({
        loader,
        LoadingComponent: ContainerPlaceholder
    })
    loadableList.push(loadable)
    prefetchFilenames.push(`${chunkName}.js`)
    return loadable
}

const registerPreloadCallbacks = () => {
    loadableList.forEach((loadable) => {
        requestIdleCallback(() => loadable.preload())
    })
}

export const prefetchTemplateChunks = () => {
    // Don't do any prefetching server-side
    if (runningServerSide()) {
        return
    }

    // iOS browsers do not support prefetch link tags so
    // register the loadables to be preloaded when browser is idle
    if (isRunningInIOS) {
        registerPreloadCallbacks()
    } else {
        const loadNextItem = () => {
            if (prefetchFilenames.length) {
                const filename = prefetchFilenames.shift()
                const link = `${getBuildOrigin()}${filename}`
                const deferNext = () => PerformanceManager.defer(loadNextItem)
                prefetchLink(
                    {
                        href: link,
                        callback: deferNext,
                        errorback: deferNext
                    }
                )
            }
        }

        PerformanceManager.getManager().callWhenQuiet(loadNextItem)
    }
}

export const AccountDashboard = PWALoadable(() => import('./account-dashboard/container' /* webpackChunkName: "account-dashboard" */), 'account-dashboard')
export const AccountInfo = PWALoadable(() => import('./account-info/container' /* webpackChunkName: "account-info" */), 'account-info')
export const Cart = PWALoadable(() => import('./cart/container' /* webpackChunkName: "cart" */), 'cart')
export const CheckoutConfirmation = PWALoadable(() => import('./checkout-confirmation/container' /* webpackChunkName: "checkout-confirmation" */), 'checkout-confirmation')
export const CheckoutPayment = PWALoadable(() => import('./checkout-payment/container' /* webpackChunkName: "checkout-payment" */), 'checkout-payment')
export const CheckoutShipping = PWALoadable(() => import('./checkout-shipping/container' /* webpackChunkName: "checkout-shipping" */), 'checkout-shipping')
export const Login = PWALoadable(() => import('./login/container' /* webpackChunkName: "login" */), 'login')
export const ProductDetails = PWALoadable(() => import('./product-details/container' /* webpackChunkName: "product-details" */), 'product-details')
export const ProductList = PWALoadable(() => import('./product-list/container' /* webpackChunkName: "product-list" */), 'product-list')
export const AccountAddress = PWALoadable(() => import('./account-address/container' /* webpackChunkName: "account-address" */), 'account-address')
export const Wishlist = PWALoadable(() => import('./wishlist/container' /* webpackChunkName: "wishlist" */), 'wishlist')
export const AccountViewOrder = PWALoadable(() => import('./account-view-order/container' /* webpackChunkName: "account-view-order" */), 'account-view-order')
export const AccountOrderList = PWALoadable(() => import('./account-order-list/container' /* webpackChunkName: "account-order-list" */), 'account-order-list')
