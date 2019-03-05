import process from 'process'
import packagejson from '../package.json'
import URL from 'url'
import {getEnvironment} from 'mobify-amp-sdk/dist/amp-sdk'
import {LIVE_BASE_URLS} from './constants'

/**
 * Prepend the static URL to a static asset path. The path must be relative to
 * the 'static' directory, eg.
 *
 * For the file at `app/static/images/mobify.png` use staticURL('images/mobify.png')
 */
export const staticURL = (path) => (process.env.STATIC_URL || '/static/') + path

/**
 * Return base URL of the current amp bundle environment
 */
export const getEnvironmentBaseURL = () => {
    const env = getEnvironment()
    if (env === 'dev') {
        return LIVE_BASE_URLS.dev
    }
    return env === 'staging' ? LIVE_BASE_URLS.staging : LIVE_BASE_URLS.prod
}

/**
 * Returns the path of the given URL if it looks like the URL is one that can
 * be rendered as an AMP page, else returns the original.
 *
 * Examples:
 *
 *   https://www.merlinspotions.com/potions.html -> /potions.html
 *   https://www.example.com/potions.html -> https://www.example.com/potions.html
 *
 */
export const pathFromURL = (url) => {
    return url.startsWith(packagejson.siteUrl) ? url.substring(packagejson.siteUrl.length) : url
}

/**
 * Return the canonical equivalent URL for a local, AMP URL.
 */
export const canonicalURL = (localURL) => {
    if (!localURL) {
        return ''
    }

    const canonical = URL.parse(getEnvironmentBaseURL())
    const local = URL.parse(localURL)
    local.protocol = canonical.protocol
    local.hostname = canonical.hostname
    return URL.format(local)
}
