/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/**
 * This file is the entry point for the `non-pwa.js` script which is loaded on
 * desktop environments by `/web/app/loader.js`.
 */

import stylesheet from './stylesheet.scss' // eslint-disable-line no-unused-vars

// Push Messaging
import {initMessaging} from 'progressive-web-sdk/dist/non-pwa/messaging'
import defaultAskHtml from './default-ask.html'

const messagingConfiguration = {
    defaultAsk: {
        html: defaultAskHtml,
        auto: true
    }
}

/**
 * This is called after this script file has successfully loaded, and must exist
 * on `window.Mobify.NonPWA`. Include your own methods if needed.
 */
const init = () => {
    // This initializes the Push Messaging feature, including the default ask
    // iframe which prompts visitors to subscribe.
    initMessaging(messagingConfiguration)
}

window.Mobify = window.Mobify || {}
window.Mobify.NonPWA = {
    init
}

