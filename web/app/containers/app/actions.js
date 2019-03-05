/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-disable import/namespace */
/* eslint-disable import/named */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {browserHistory} from 'progressive-web-sdk/dist/routing'

import {makeRequest} from 'progressive-web-sdk/dist/utils/fetch-utils'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {isStandalone} from 'progressive-web-sdk/dist/utils/utils'
import {
    setPageFetchError,
    clearPageFetchError,
    setOfflineModeStartTime,
    clearOfflineModeStartTime,
    trackOfflinePage,
    clearOfflinePages
} from 'progressive-web-sdk/dist/store/offline/actions'
import {sendOfflineModeUsedAnalytics, sendOfflinePageview, sendLaunchedFromHomeScreenAnalytics} from 'progressive-web-sdk/dist/analytics/actions'
import {OFFLINE_ASSET_URL} from './constants'
import {closeModal} from '../../modals/actions'
import {isModalOpen} from 'progressive-web-sdk/dist/store/modals/selectors'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {getOfflineModeStartTime, getOfflinePageViews} from 'progressive-web-sdk/dist/store/offline/selectors'
import {isServerSide} from 'progressive-web-sdk/dist/store/app/selectors'
import {OFFLINE_MODAL} from '../../modals/constants'
import {trigger, pwaRendered} from '../../utils/astro-integration'
import {getCartURL, getCheckoutShippingURL, isRunningInAstro} from './selectors'
import {setStandAloneAppFlag} from 'progressive-web-sdk/dist/store/app/actions'
import {receiveLocaleData} from '../../modals/navigation/actions'

// @TODO: Uncomment these imports when we are ready to re-add the privacy modal
// import {isCrawler} from 'progressive-web-sdk/dist/utils/utils'
// import cookieManager from 'progressive-web-sdk/dist/utils/cookie-manager'
// import {openModal} from 'progressive-web-sdk/dist/store/modals/actions'
// import {PRIVACY_MODAL} from '../../modals/constants'
// import {ignorePrivacyCookie} from '../../modals/privacy/actions'

import {defaultLanguage, supportedLanguages} from '../../config/translations-config'

export const initializeAppComplete = createAction('App Initialization Complete')

export const updateSvgSprite = createAction('Updated SVG sprite', ['sprite'])
export const toggleHideApp = createAction('Toggling the hiding of App', ['hideApp'])

export const receiveLocale = createAction('Receive Locale', ['locale'])
export const receiveTranslations = createAction('Receive translations', ['translations'])

export const lockScroll = createAction('Lock Scroll')
export const unlockScroll = createAction('Unock Scroll')

export const setRetryingConnection = createAction('Set retrying connection', ['retryingConnection'])

export const retryConnection = () => (dispatch) => {
    // In order to support custom routers like the selector router,
    // we need to force the router to update when we retry the connection
    // This way, we can navigate to the new route
    browserHistory.replace(window.location.href)
    dispatch(setRetryingConnection(true))
}

export const finishedRetryingConnection = () => (dispatch) => {
    // When we retry the connection while still openModal
    // if we're on a fast connection it ends up resolving almost immediately
    // As a result, the loading indicator just flashes for a moment
    // This timeout keeps the loading indicator up for just a little longer
    setTimeout(() => dispatch(setRetryingConnection(false)), 500)
}

export const checkIfStandAlone = () => (dispatch) => {
    const isAppStandalone = isStandalone()
    if (isAppStandalone) {
        dispatch(sendLaunchedFromHomeScreenAnalytics())
    }
    dispatch(setStandAloneAppFlag(isAppStandalone))
}

const sendOfflineAnalytics = (offlineModeStartTime) => (dispatch, getState) => {
    const timestamp = Date.now()
    const offlineModeDuration = timestamp - offlineModeStartTime
    const pagesViewed = getOfflinePageViews(getState()).toJS()

    pagesViewed.forEach(({routeName, inCache, title, url}) => {
        dispatch(sendOfflinePageview(url, routeName, title, inCache))
    })

    dispatch(sendOfflineModeUsedAnalytics(offlineModeDuration, timestamp, pagesViewed))
}

const startOfflineTimer = (offlineModeStartTime) => (dispatch) => {
    // set offline mode start time if we haven't already
    if (!offlineModeStartTime) {
        dispatch(setOfflineModeStartTime(Date.now()))
    }
}

/**
 * Make a separate request that is intercepted by the worker. The worker will
 * return a JSON object where `{offline: true}` if the request failed, which we
 * can use to detect if we're offline.
 */
export const checkIfOffline = (url, routeName) => (dispatch, getState) => {
    // we need to cachebreak every request to ensure we don't get something
    // stale from the disk cache on the device - the CDN will ignore query
    // parameters for this asset, however
    const currentState = getState()
    const offlineModeStartTime = getOfflineModeStartTime(currentState)
    return fetch(`${OFFLINE_ASSET_URL}?${Date.now()}`, {
        cache: 'no-store'
    })
        .then((response) => response.json())
        .then((json) => {
            if (json.offline) {
                dispatch(setPageFetchError('Network failure, using worker cache'))
                dispatch(startOfflineTimer(offlineModeStartTime))
                dispatch(trackOfflinePage({url, routeName, title: window.document.title}))
            } else {
                // if we have an offline mode start time then we're transitioning from offline to online
                // calculate the time we were offline for
                if (offlineModeStartTime) {
                    dispatch(sendOfflineAnalytics(offlineModeStartTime))
                    dispatch(clearOfflineModeStartTime())
                    dispatch(clearOfflinePages())
                }
                dispatch(clearPageFetchError())

                if (isModalOpen(OFFLINE_MODAL)(currentState)) {
                    dispatch(closeModal(OFFLINE_MODAL, UI_NAME.offline))
                }
            }
        })
        .catch((error) => {
            // In cases where we don't have the worker installed, this means
            // we indeed have a network failure, so switch on offline
            dispatch(setPageFetchError(error.message))
            dispatch(startOfflineTimer(offlineModeStartTime))
            dispatch(trackOfflinePage({url, routeName, title: window.document.title}))
        })
}

/**
 * Until the day that the `use` element's cross-domain issues are fixed, we are
 * forced to fetch the SVG Sprite's XML as a string and manually inject it into
 * the DOM. See here for details on the issue with `use`:
 * @URL: https://bugs.chromium.org/p/chromium/issues/detail?id=470601
 */
export const fetchSvgSprite = () => (dispatch) => {
    const spriteUrl = getAssetUrl('static/svg/sprite-dist/sprite.svg')
    return makeRequest(spriteUrl)
        .then((response) => response.text())
        .then((text) => dispatch(updateSvgSprite(text)))
}

export const signOut = () => (dispatch, getState) => {
    return dispatch(IntegrationManager.account.logout())
        .then(() => {
            if (!isRunningInAstro(getState())) {
                browserHistory.push({pathname: '/'})

                // Desktop's message includes 'redirect to home page' message
                // so we'll just hardcode a message instead
                dispatch(addNotification(
                    'signedOutNotification',
                    'You are now signed out'
                ))
            }
        })
}

export const cartExpired = () => (dispatch) => {
    // navigate to homepage, show notification
    browserHistory.push({
        pathname: '/'
    })
    dispatch(addNotification(
        'cartUpdateError',
        'Your cart has expired.',
        true
    ))
}

export const missingShippingData = () => (dispatch, getState) => {
    browserHistory.push({
        pathname: getCheckoutShippingURL(getState())
    })
}

export const handleCartError = (error) => (dispatch) => {
    if (error.message.includes('expired')) {
        return dispatch(cartExpired())
    }

    if (error.message.includes('missing-shipping-data')) {
        return dispatch(missingShippingData())
    }

    throw error
}

export const goToCheckout = () => (dispatch, getState) => {
    if (isRunningInAstro(getState())) {
        // If we're running in Astro, we want to dismiss open the cart modal,
        // otherwise, navigating is taken care of by the button press
        trigger('open:cart-modal')
    } else {
        browserHistory.push(getCartURL(getState()))
    }
}

export const initializeApp = () => (dispatch) => {
    return dispatch(IntegrationManager.app.initApp())
        .then(() => {
            if (IntegrationManager.custom && IntegrationManager.custom.fetchLocaleNavigationData) {
                const localeData = IntegrationManager.custom.fetchLocaleNavigationData()
                dispatch(receiveLocaleData(localeData))
            }

            dispatch(initializeAppComplete())

            // @TODO: Uncomment this section once we are ready to re-activate
            //        the cookie modal with a responsive design.
            //
            // Skip the privacy modal check if we're server side.
            // if (!isServerSide(getState())) {
            //     // Initialize Privacy Notice if the user has not yet seen it.
            //     if (!!window && !isCrawler() && !cookieManager.isCookieSet('privacy-notice')) {
            //         dispatch(openModal(PRIVACY_MODAL))
            //         // Ignoring the cookie is the default assumption we make. The user will
            //         // ultimately decide what they want to do with it in the modal UI.
            //         dispatch(ignorePrivacyCookie())
            //     }
            // }
        })
}

const loadLocale = (locale) => (dispatch, getState) => {
    const isServerSideFlag = isServerSide(getState())
    if (isServerSideFlag) {
        return Promise.resolve()
    }
    // See https://webpack.js.org/api/module-methods/#import-
    return import(
        /* webpackChunkName: "translation-[request]" */
        `../../config/translations/${locale}`
    )
        .then((obj) => { // Can't destructure because 'default' is a reserved word
            console.log(`[Progressive Web] Loaded translations for ${locale}`)
            dispatch(receiveTranslations(obj.default))
        })
}

export const changeLocale = (locale) => (dispatch) => {
    // load translations
    return dispatch(loadLocale(locale))
        .then(() => dispatch(receiveLocale(locale)))
}

export const setInitialLocale = () => (dispatch) => {
    // Get the User's language based on their browser settings
    const userLanguage = window.navigator.languages
        ? window.navigator.languages[0]
        : (window.navigator.language || window.navigator.userLanguage)

    // Get a list of support languages from the PWA configurations
    const supported = Object.keys(supportedLanguages)

    // Choose a locale by picking a supported language based on the user's
    // browser's language. If no compatible language is found, use the default.
    const fromUserLang = (lang) => userLanguage.indexOf(lang) === 0
    const locale = supported.find(fromUserLang) || defaultLanguage

    return dispatch(changeLocale(locale))
}

export const pwaHasRendered = () => () => {
    pwaRendered()
}
