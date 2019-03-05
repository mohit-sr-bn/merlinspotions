/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/*
 The SSR-loader is a cut-down version of loader.js that sets up the correct
 environment for main.js.
 */

/* global MESSAGING_SITE_ID, MESSAGING_ENABLED, DEBUG, AJS_SLUG */
/* eslint import/no-commonjs:0 */

import {applyPolyfills} from 'progressive-web-sdk/dist/ssr/ssr-polyfills'
import {loadUPWA} from 'progressive-web-sdk/dist/utils/ssr-loader-utils'

// Polyfills - importing them will install them if needed. We always include
// them, since loading them asynchronously is slow, and unless they're
// installed by the time main.js is evaluated, it's possible that module
// initialization code will fail if it relies on a polyfilled feature.
import 'core-js/es6/array'      // Array.fill and Array.find
import 'core-js/es6/promise'    // Promise
import 'core-js/es6/string'     // string.includes
import 'whatwg-fetch'           // window.fetch
import 'url-polyfill'
import 'es6-object-assign/auto' // Object.assign polyfill

applyPolyfills()

loadUPWA(
    {
        debug: DEBUG,
        messagingSiteId: MESSAGING_ENABLED ? MESSAGING_SITE_ID : null,
        mobifyPropertyId: AJS_SLUG
    }
)
