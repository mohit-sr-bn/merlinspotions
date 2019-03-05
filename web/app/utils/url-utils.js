/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* global WEBPACK_PACKAGE_JSON_MOBIFY */

import {extractPathFromURL} from 'progressive-web-sdk/dist/utils/utils'
import {PROXY_PATH_PREFIX} from 'progressive-web-sdk/dist/ssr/constants'
import {proxyConfigs, updatePackageMobify} from 'progressive-web-sdk/dist/utils/ssr-shared-utils'

let initialized
/**
 * Return the proxy configurations. If required, initialize the
 * ssr-shared-utils with the value of the Mobify object from
 * package.json (which contains the proxy configuration)
 * @returns {Array<Object>}
 */
const getProxyConfigs = () => {
    if (!initialized) {
        updatePackageMobify(WEBPACK_PACKAGE_JSON_MOBIFY)
        initialized = true
    }
    return proxyConfigs
}

export const getRequestPath = (baseSitePath, requestPath) => {
    if (/^(https?:)\/\//.test(requestPath)) {
        requestPath = extractPathFromURL(requestPath, true, true)
    }

    const newSitePath = `${PROXY_PATH_PREFIX}/${baseSitePath}`

    return requestPath.startsWith('/') ?
        `${newSitePath}${requestPath}`
        : `${newSitePath}/${requestPath}`
}

/**
 * Get the base request path for a given proxy. The first proxy
 * has index 0, the second index 1 and so on.
 * @param path {String} the path under the proxied origin
 * @param index {Number} the proxy index (default to 0 for the first proxy)
 */
export const getBaseRequestPath = (path, index) => {
    const configs = getProxyConfigs()
    const config = configs[index || 0]
    if (config) {
        return getRequestPath(config.path, path)
    }
    throw new Error(
        `Cannot return path for unconfigured proxy index ${index}`
    )
}
