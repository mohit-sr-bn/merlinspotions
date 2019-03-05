/* global DEBUG __webpack_require__ */

import {initCacheManifest, getBuildOrigin} from 'progressive-web-sdk/dist/asset-utils'
import {PerformanceManager} from 'progressive-web-sdk/dist/utils/performance-manager'
import {renderOrHydrate} from 'progressive-web-sdk/dist/utils/universal-utils'
import cacheHashManifest from '../tmp/cache-hash-manifest.json'

let origin = getBuildOrigin()

if (!/\/$/.test(origin)) {
    origin += '/'
}

// If the `window.getWebpackChunkPath` function is defined, patch
// __webpack_require__.p to use the value it returns. This allows
// webpack chunk loading to be controlled under SSR.
// If window.getWebpackChunkPath isn't defined, set __webpack_require__.p
// to be the build origin, so that all assets are loaded from the bundle
// location.
Object.defineProperty(
    __webpack_require__, 'p',
    {
        get: window.getWebpackChunkPath || (() => origin)
    }
)

// React
import React from 'react'

// Router
import Router from './router'

// Redux
import configureStore from './store'

import {convertStateObjectToStateImmutable} from 'progressive-web-sdk/dist/utils/store-utils'

// Stylesheet: importing it here compiles the SCSS into CSS. The CSS is actually
// added to the markup in `loader.js`
import Stylesheet from './stylesheet.scss' // eslint-disable-line no-unused-vars

// DO NOT USE! Merlins Connector is an example connector that is for demo only
import initConnector from './init-merlins-connector'
// import initConnector from './init-sfcc-connector'
// import initConnector from './init-hybris-connector'
// import initConnector from './init-stub-connector'

// Configure performance management
const performanceManager = PerformanceManager.getManager()

// Configure task-splitting. Change the first parameter from
// 'true' to 'false' to disable task splitting.
performanceManager.setTaskSplitting(
    true,
    {
        warnings: DEBUG,
        longStackTraces: DEBUG
    }
)

// Enable network management, and wait until that's configured.
performanceManager.configureDownloads({
    // To disable default throttling, comment out the next line so that
    // maxDownloads is set to 0.
    // maxDownloads: 0
})
    .then(() => {
        initConnector()

        initCacheManifest(cacheHashManifest)

        let initialState

        if (window.__PRELOADED_STATE__) {
            initialState = convertStateObjectToStateImmutable(window.__PRELOADED_STATE__)
            delete window.__PRELOADED_STATE__
        }

        const store = configureStore(initialState)

        const rootEl = document.getElementsByClassName('react-target')[0]

        renderOrHydrate(<Router store={store} />, store, rootEl)
    })
