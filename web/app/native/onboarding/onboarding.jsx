/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* global MESSAGING_ENABLED, DEBUG */

// React
import React from 'react'
import {render} from 'react-dom'

// Onboarding
import OnboardingCarousel from './partials/onboarding-carousel'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import analyticsManager from 'progressive-web-sdk/dist/analytics/analytics-manager'
import Sandy from 'sandy-tracking-pixel-client/src/index'

// Astro
import Astro from '../../vendor/astro-client'
import {jsRpcMethod} from '../../utils/astro-integration'

import Stylesheet from './index.scss' // eslint-disable-line no-unused-vars

window.Progressive = {
    AstroPromise: Promise.resolve(Astro)
}

const location = {
    imageURL: 'static/img/onboarding/location.png',
    imageAlt: 'Location',
    title: 'Find the best deals near you!',
    subtitle: 'Enable location services to see your local stores, product availability, and local deals.',
    actionButton: {
        title: 'ENABLE',
        action: () => {},
        analyticsName: UI_NAME.enableLocationService
    }
}

const notifications = {
    imageURL: 'static/img/onboarding/notifications.png',
    imageAlt: 'Notifications',
    title: 'Stay in the loop!',
    subtitle: 'Hear about the latest deals, promotions, specials, and exclusive offers through Notifications!',
    actionButton: {
        title: 'ENABLE',
        action: () => {
            jsRpcMethod('push:enable', [])()
        },
        analyticsName: UI_NAME.enablePushNotification
    }
}

const login = {
    imageURL: 'static/img/onboarding/logo.png',
    imageAlt: 'Merlin\'s Potions',
    subtitle: 'Speed up your shopping experience, save your address information and more by registering with Merlin\'s Potions.',
    actionButton: {
        title: 'SIGN IN',
        action: () => {
            jsRpcMethod('sign-in:Show', [])()
        },
        analyticsName: UI_NAME.goToSignIn
    },
    laterButton: {
        title: 'LATER',
        action: () => {
            jsRpcMethod('onboardingHide', [])()
        },
        analyticsName: UI_NAME.dismiss
    },
    primaryButton: {
        title: 'REGISTER NOW',
        action: () => {
            jsRpcMethod('register:Show', [])()
        },
        analyticsName: UI_NAME.goToRegister
    }
}

const carouselData = [
    location
]

// MESSAGING_ENABLED is replaced at build time by webpack.
if (MESSAGING_ENABLED) {
    carouselData.push(notifications)
}

const rootEl = document.getElementsByClassName('react-target')[0]

// The app id is required in order for utility classes to work. All utility
// classes have been defined by the following format:
//
//     #app u-utility-name {...}
//
// Notice the preceding id selector. This helps ensure utility classes have
// higher specificity than most other class selectors, without relying on
// !important declarations.
const appId = 'app'

// Login should always be the last stage, so do this last
carouselData.push(login)

// There's a bug in the Android webview that doesn't immediately register
// the event handlers for the carousel, so we delay rendering to next runloop
setTimeout(() => {
    // Below is a workaround for Analytics Manager expecting a script tag to exist
    // with a particular id, to determine if it's a developent or production build
    const bundleTypeEmptyScript = document.createElement('script')
    bundleTypeEmptyScript.setAttribute('src', DEBUG ? 'development_placeholder.js' : 'production_placeholder.js')
    bundleTypeEmptyScript.setAttribute('id', 'progressive-web-main')
    bundleTypeEmptyScript.setAttribute('type', 'application/json') // Hack so the tag doesn't download
    document.body.appendChild(bundleTypeEmptyScript)

    Sandy.init(window)
    Sandy.create(AJS_SLUG, 'auto') // eslint-disable-line no-undef
    const tracker = Sandy.trackers[Sandy.DEFAULT_TRACKER_NAME]
    tracker.set('mobify_adapted', true)
    tracker.set('platform', 'Native')

    // The act of running Sandy.init() blows away the binding of
    // window.sandy.instance in the pixel client. We are restoring it
    // here for now and will revisit this when we rewrite the Sandy
    // tracking pixel client
    window.sandy.instance = Sandy

    analyticsManager.init({
        projectSlug: AJS_SLUG,              // eslint-disable-line no-undef
        mobifyGAID: WEBPACK_MOBIFY_GA_ID,   // eslint-disable-line no-undef
        ecommerceLibrary: 'ec',
        debug: DEBUG                        // eslint-disable-line no-undef
    })

    render(
        <div id={appId}>
            <OnboardingCarousel carouselData={carouselData} />
        </div>
    , rootEl)
}, 0)
