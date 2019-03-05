/* global AJS_SLUG, NATIVE_WEBPACK_ASTRO_VERSION, MESSAGING_SITE_ID, MESSAGING_ENABLED, DEBUG, WEBPACK_NON_PWA_ENABLED, AMP_LINKING_ENABLED */
import {getAssetUrl, loadAsset, initCacheManifest} from 'progressive-web-sdk/dist/asset-utils'
import {
    browserSupportsMessaging,
    documentWriteSupported,
    isFirefoxBrowser,
    isSamsungBrowser,
    loadScript,
    loadScriptAsPromise,
    preventDesktopSiteFromRendering,
    prefetchLink
} from 'progressive-web-sdk/dist/utils/utils'
import {isPreview, isV8Tag, loadPreview, shouldPreview} from 'progressive-web-sdk/dist/utils/preview-utils'
import {displayPreloader} from 'progressive-web-sdk/dist/preloader'
import cacheHashManifest from '../tmp/loader-cache-hash-manifest.json'
import {isRunningInAstro, isRunningInAstroAndroid} from './utils/astro-integration'
import {
    createGlobalMessagingClientInitPromise,
    loadAndInitMessagingClient
} from 'progressive-web-sdk/dist/utils/messaging'

import {
    setPerformanceValues,
    trackFirstPaints,
    trackTTI,
    triggerSandyAppStartEvent,
    getPWAType
} from 'progressive-web-sdk/dist/utils/loader-utils/performance-timing'
import {PLATFORMS} from 'progressive-web-sdk/dist/analytics/constants'
import {
    loaderLog,
    setLoaderDebug
} from 'progressive-web-sdk/dist/utils/loader-utils/loader-logging'
import {loadWorker, preloadSWAmp} from 'progressive-web-sdk/dist/utils/loader-utils/service-worker-setup'


import {getNeededPolyfills} from './utils/polyfills'
import {isReactRoute, setRouteList, setBlacklist} from 'progressive-web-sdk/dist/routing/is-react-route'
import ReactRegexes from './loader-routes'
import blacklist from './config/route-blacklist'

import preloadHTML from 'html-loader?minimize!./preloader/preload.html'
import preloadCSS from 'css-loader?minimize!./preloader/preload.css'
import preloadJS from 'raw-loader!./preloader/preload.js' // eslint-disable-line import/default

import {baseAMPUrl, hasAMPPage} from './ampUrls'

const ASTRO_VERSION = NATIVE_WEBPACK_ASTRO_VERSION // replaced at build time
const messagingEnabled = MESSAGING_ENABLED  // replaced at build time
const nonPwaEnabled = WEBPACK_NON_PWA_ENABLED // replaced at build time
const ampLinkingEnabled = AMP_LINKING_ENABLED // replaced at build time

const CAPTURING_CDN = '//cdn.mobify.com/capturejs/capture-latest.min.js'
const ASTRO_CLIENT_CDN = `//assets.mobify.com/astro/astro-client-${ASTRO_VERSION}.min.js`


//  True if the loader is being loaded in preview mode (either as detected
//  by the SDK, or if the V8.1 tag set the flag.
const IS_PREVIEW = isPreview() || window.Mobify.isPreview

//  True if the loader has been loaded via a V8+ tag
const IS_V8_TAG = isV8Tag()

setLoaderDebug(DEBUG || IS_PREVIEW)

// Set this flag according to whether this browser is capable of
// supporting Messaging. This is a separate check from whether
// Messaging has been enabled (in package.json).
const MESSAGING_SUPPORTED = browserSupportsMessaging()

window.Progressive = {
    AstroPromise: Promise.resolve({}),
    Messaging: {
        enabled: messagingEnabled,
        supported: MESSAGING_SUPPORTED
    },
    // This flag is the one true way to identify if PWA is loaded via
    //   window.Progressive && !window.Progressive.PWADisabled
    // We use the negation since this allows backwards comaptibility
    PWADisabled: true,

    // isPWA() can be used to identify if PWA is loaded
    // without backwards compatibility concerns
    isPWA: () => !window.Progressive.PWADisabled
}

setPerformanceValues()

// Track First Paint and First Contentful Paint for PWA and non-PWA
trackFirstPaints()

// Set up the routes and blacklist
setRouteList(ReactRegexes)
setBlacklist(blacklist)

const isPWARoute = () => isReactRoute(window.location.pathname)

/**
 * Determine if the browser is one that supports PWAs.
 *
 * If loaded by a V8+ tag, the decision is based on the shouldLoadPWA
 * flag set by the tag. For a non V8 tag, we check the UA directly.
 *
 * @return {boolean} true if this browser supports PWAs.
 */
const isSupportedPWABrowser = () => {
    // By default, the PWA will run on all mobile browsers except Samsung
    // and Firefox. The tag contains a browser test that sets the
    // window.Mobify.shouldLoadPWA flag for a set of browsers, but this
    // function may also apply stricter checks.
    const ua = window.navigator.userAgent
    return (
        // For a V8 tag, use the flag set by the tag
        (IS_V8_TAG && window.Mobify.shouldLoadPWA) ||
        // For a non-V8 tag check the UA directly
        /ip(hone|od)|android.*(mobile)|blackberry.*applewebkit|bb1\d.*mobile/i.test(ua)
    ) &&
    // Always return false if this is Firefox or a Samsung browser
    !isSamsungBrowser(ua) &&
    !isFirefoxBrowser(ua)
}

const MINIMUM_NON_PWA_CHROME = 49
const MINIMUM_NON_PWA_FIREFOX = 49

/**
 * Returns true if the browser supports the nonPWA client. Note that
 * isSupportedPWABrowser and isSupportedNonPWABrowser *might* both
 * return true for a given browser; support is not mutually exclusive.
 * By default, non-PWA mode will run on Chrome (above
 * a minimum version) and Firefox.
 * @returns {boolean}
 */
const isSupportedNonPWABrowser = () => {
    // If service workers are not supported, then we are not a non-pwa
    // browser, even in preview mode.
    if (!('serviceWorker' in navigator)) {
        return false
    }

    let match = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)
    if (match && parseInt(match[2], 10) >= MINIMUM_NON_PWA_CHROME) {
        return true
    }

    match = navigator.userAgent.match(/Firefox\/([0-9]+)\./)
    if (match && parseInt(match[1], 10) >= MINIMUM_NON_PWA_FIREFOX) {
        return true
    }

    return false
}

/**
 * Do the preloading preparation for the Messaging client.
 * This includes any work that does not require a network fetch or
 * otherwise slow down initialization.
 *
 * If either messagingEnabled or MESSAGING_SUPPORTED are false,
 * then we don't load the Messaging PWA client. The Messaging
 * service worker code is still included, but won't be configured
 * and will do nothing.
 *
 * @param serviceWorkerSupported {Boolean} true if the service worker
 * has successfully loaded and is ready. False if there was a failure.
 * @param pwaMode {Boolean} passed to the Messaging client initialization.
 * @returns {Promise.<*>} that resolves when the client is loaded and
 * initialized, with the initial messaging state value (from
 * the Messaging client's init()). If messaging is not enabled,
 * returns a Promise that resolves to null (we don't reject because
 * that would lead to console warnings about uncaught rejections)
 */
const setupMessagingClient = (serviceWorkerSupported, pwaMode) => {
    if (serviceWorkerSupported && (!isRunningInAstro)) {
        // We need to create window.Mobify.WebPush.PWAClient
        // at this point. If a project is configured to use
        // non-progressive Messaging, it will load the
        // webpush-client-loader, which will then detect that
        // window.Mobify.WebPush.PWAClient exists and do nothing.
        window.Mobify = window.Mobify || {}
        window.Mobify.WebPush = window.Mobify.WebPush || {}
        window.Mobify.WebPush.PWAClient = {}

        if (messagingEnabled && MESSAGING_SUPPORTED) {
            // We know we're not running in Astro, that the service worker is
            // supported and loaded, and messaging is enabled and supported,
            // so we can load and initialize the Messaging client, returning
            // the promise from init().
            return loadAndInitMessagingClient(DEBUG, MESSAGING_SITE_ID, pwaMode)
        }
    }

    return Promise.resolve(null)
}

let waitForBodyPromise
const waitForBody = () => {
    waitForBodyPromise = waitForBodyPromise || new Promise((resolve) => {
        const bodyEl = document.getElementsByTagName('body')

        const checkForBody = () => {
            if (bodyEl.length > 0) {
                resolve()
            } else {
                setTimeout(checkForBody, 50)
            }
        }

        checkForBody()
    })

    return waitForBodyPromise
}

const shouldLoadWorker = () => {
    // Don't load the service worker if running inside an Android Astro app in the PreviewEnabled configuration
    // because the device doesn't trust the dev server, the SW will not install
    // This can cause issues where preview doesn't work correctly on Android.
    const previewEnabledBuildInAstroAndroid = isRunningInAstroAndroid && window.AstroNativeObject.isPreviewEnabled() && !/^cdn\.mobify\.com/.test(getAssetUrl(''))
    if (previewEnabledBuildInAstroAndroid) {
        loaderLog('Not installing the Service Worker because we are running inside a preview enabled version of Astro Android')
    }

    return 'serviceWorker' in navigator &&
        !previewEnabledBuildInAstroAndroid
}

const addAMPLinkTags = () => {
    if (!ampLinkingEnabled) {
        return
    }

    // Only add AMP tag for specified URLs
    if (hasAMPPage(window.location.pathname)) {
        loadAsset('link', {
            rel: 'amphtml',
            href: `${baseAMPUrl}${window.location.pathname}`
        })
    }
}

/**
 * Initialize the app. Assumes that all needed polyfills have been
 * loaded.
 */
const loadPWA = () => {
    window.Progressive.PWADisabled = false

    try {
        trackTTI()
    } catch (e) {
        if (typeof console !== 'undefined') {
            console.error(e.message)
        }
    }
    // We need to check if loadScriptsSynchronously is undefined because if it's
    // previously been set to false, we want it to remain set to false.
    if (window.loadScriptsSynchronously === undefined) {
        // On poor connections, the problem is that Chrome doesn't allow writing
        // script tags via document.write, so we want to detect for poor connections
        // and load async in those cases. More info can be found here:
        // https://developers.google.com/web/updates/2016/08/removing-document-write
        window.loadScriptsSynchronously = documentWriteSupported() && IS_V8_TAG
    }

    const neededPolyfills = getNeededPolyfills()
    if (neededPolyfills.length) {
        // We disable loading scripts sychronously if polyfills are needed,
        // because the polyfills load async.
        window.loadScriptsSynchronously = false
        // But we still need to ensure the desktop script doesn't render while the
        // document.readyState is "loading"
        preventDesktopSiteFromRendering()

        neededPolyfills.forEach((polyfill) => polyfill.load(loadPWA))
        return
    }

    initCacheManifest(cacheHashManifest)
    triggerSandyAppStartEvent(true, AJS_SLUG, getPWAType())

    addAMPLinkTags()

    loadAsset('link', {
        rel: 'apple-touch-icon',
        href: getAssetUrl('static/img/global/apple-touch-icon.png')
    })

    loadAsset('link', {
        href: getAssetUrl('main.css'),
        rel: 'stylesheet',
        type: 'text/css',
        // Tell us when the stylesheet has loaded so we know when it's safe to
        // display the app! This prevents a flash of unstyled content.
        onload: 'window.Progressive.stylesheetLoaded = true;'
    })

    loadAsset('link', {
        href: getAssetUrl('static/manifest.json'),
        rel: 'manifest'
    })

    // Force create the body element in order to render the Preloader. This is necessary
    // because we load scripts synchronously in order to speed up loading, which
    // by default would throw them in head, where as we need them in body.
    if (window.loadScriptsSynchronously) {
        document.write('<body>')
    }

    // Display the Preloader to indicate progress to the user (except when running
    // in an Astro app, hide the preloader because apps have their own splash screen).
    waitForBody().then(() => {
        if (!isRunningInAstro) {
            displayPreloader(preloadCSS, preloadHTML, preloadJS)
        }

        // Create React mounting target
        const body = document.getElementsByTagName('body')[0]
        const reactTarget = document.createElement('div')
        reactTarget.className = 'react-target'
        body.appendChild(reactTarget)
    })

    /**
     * This must be called before vendor.js is loaded (or before the Webpack
     * chunk that contains Messaging React components is loaded)
     *
     * This creates a Promise: `window.Progressive.MessagingClientInitPromise`
     * which will be resolved or rejected later by the method `setupMessagingClient`
     */
    createGlobalMessagingClientInitPromise(messagingEnabled)

    window.loadCriticalScripts = () => {
        // The following scripts are loaded sync via document.write, in order
        // for the browser to increase the priority of these scripts. If the scripts
        // are loaded async, the browser will not consider them high priority and
        // queue them while waiting for other high priority resources to finish
        // loading. This delay can go all the way up to 5 seconds on a Moto G4 on a
        // 3G connection. More information can be found here:
        // https://developers.google.com/web/updates/2016/08/removing-document-write
        loadScript({
            id: 'progressive-web-vendor',
            src: getAssetUrl('vendor.js'),
            docwrite: window.loadScriptsSynchronously,
            isAsync: false,
            // If there is an error loading the script, then it must be a document.write issue,
            // so in that case, retry the loading asynchronously.
            onerror: () => {
                console.warn('[Mobify.Progressive.Loader] document.write was blocked from loading 3rd party scripts. Loading scripts asynchronously instead.')
                window.loadScriptsSynchronously = false
                window.loadCriticalScripts()
            }
        })

        loadScript({
            id: 'progressive-web-main',
            src: getAssetUrl('main.js'),
            docwrite: window.loadScriptsSynchronously
        })

        loadScript({
            id: 'progressive-web-jquery',
            src: getAssetUrl('static/js/jquery.min.js'),
            docwrite: window.loadScriptsSynchronously
        })

        // We need to know the URL of the captured document
        // So we can determine if we can use it or not for fulfilling requests
        window.Progressive.capturedURL = window.location.href
        window.Progressive.capturedDocHTMLPromise = new Promise((resolve) => {
            // The reason we bound this to window is because the "onload" method below
            // is added to the document via document.write, this "onload" is toString'ed,
            // meaning it doesn't have accessed to closure variables.
            window.captureResolve = resolve
            loadScript({
                id: 'progressive-web-capture',
                src: CAPTURING_CDN,
                docwrite: window.loadScriptsSynchronously,
                onload: () => {
                    window.Capture.init((capture) => {
                        // NOTE: by this time, the captured doc has changed a little
                        // bit from original desktop. It now has some of our own
                        // assets (e.g. main.css) but they can be safely ignored.
                        window.captureResolve(capture.enabledHTMLString())
                    })
                }
            })
        })
    }

    window.loadCriticalScripts()

    if (isRunningInAstro) {
        window.Progressive.AstroPromise = loadScriptAsPromise({
            id: 'progressive-web-app',
            src: ASTRO_CLIENT_CDN,
            rejectOnError: false
        }).then(() => window.Astro)
    }

    // Attempt to load the worker, in PWA mode
    ((shouldLoadWorker())
        ? loadWorker(true, MESSAGING_ENABLED, cacheHashManifest)
        : Promise.resolve(false)
    ).then((serviceWorkerSupported) => {
        // Start the process of fetching and initializing the
        // Messaging client, in PWA mode.
        setupMessagingClient(serviceWorkerSupported, true)
    })

    // Prefetch analytics - it's something that we will be downloading later,
    // and thus we want to fetch it so execution is not delayed to prevent
    // time to interactive from being delayed.
    prefetchLink({href: '//www.google-analytics.com/analytics.js'})

    // We insert a <plaintext> tag at the end of loading the scripts, in order
    // to ensure that the original site does not execute anything.
    // Do not remove!
    preventDesktopSiteFromRendering()
}

// To preload SW on AMP, it needs the SW code to be served
// from the site origin, via HTTPS. The <amp-install-serviceworker>
// element then loads the markup into an iframe and installs the
// the service worker on the AMP page. This piece of code fetches
// sw.js configuration, registers it, and then halts execution for the PWA.
if (preloadSWAmp(true, messagingEnabled, cacheHashManifest)) {
    loaderLog('Setup SW from AMP')
     // This route will only be hit from AMP pages, and does not
    // require loading the rest of the PWA.
    preventDesktopSiteFromRendering()
} else if (shouldPreview()) {
    // If preview is being used, load a completely different file from this one and do nothing.
    loadPreview()
} else {
    // Run the app.
    if (
        // Load the PWA if the browser supports it and the route matches
        isSupportedPWABrowser() && isPWARoute()
    ) {
        loaderLog('Starting in PWA mode')
        loadPWA()
    } else if (nonPwaEnabled && isSupportedNonPWABrowser()) {
        // In preview mode, we arrive here when IS_PREVIEW_PWA_MODE is
        // false - the default for preview is to load the PWA, not non-PWA
        // mode.
        loaderLog('Starting in nonPWA mode')
        initCacheManifest(cacheHashManifest)
        addAMPLinkTags()
        // This a browser that supports our non-PWA mode, so we can assume that
        // service workers are supported. Load the worker in non-PWA mode, and
        // (in parallel) initialize analytics.
        // We assume that the browsers supporting nonPWA mode do not need any
        // polyfills. If any are needed, this would be the point to load them.

        // There are a number of steps that we can run simultaneously;
        // initializing the worker, initializing Analytics and waiting
        // for the <body> tag to exist.
        const promises = [
            triggerSandyAppStartEvent(false, AJS_SLUG, PLATFORMS.NON_PWA),
            // We're loaded in a script located in <head> but we need to inject
            // scripts using `loadScript` which places them in <body> - so
            // we must wait until <body> exists.
            waitForBody()
        ]

        if (shouldLoadWorker()) {
            promises.push(loadWorker(false, messagingEnabled, cacheHashManifest))
        }

        Promise.all(promises)
            .then((results) => {
                loaderLog('Completing setup for nonPWA mode')

                // This is called early so that the Promise is available
                // to any scripts that need to chain from it. It gets
                // resolved when setupMessagingClient completes.
                createGlobalMessagingClientInitPromise(messagingEnabled)

                // Set up the Messaging client integration (we do this after
                // analytics is set up, so that window.Sandy.instance is
                // available to Messaging). The serviceWorkerLoadedAndReady
                // result from loadWorker is available as results[0].
                // We ignore the Promise returned from this call, since
                // we want to continue to load and setup the non-pwa
                // script anyway, whether Messaging succeeds or not.
                setupMessagingClient(results[0], false)
                    .then((state) => loaderLog(`Messaging init complete with state ${JSON.stringify(state)}`))

                // This load will execute in parallel with setup of the
                // Messaging client.
                return loadScriptAsPromise({
                    id: 'mobify-non-pwa-script',
                    src: getAssetUrl('non-pwa.js'),
                    // We do nothing if the script fails
                    rejectOnError: true
                })
            })
            // we reach this point when the Messaging client has been
            // loaded and initialized, and the non-pwa.js script has
            // been loaded. We can now init the non-pwa script.
            .then(() => window.Mobify.NonPWA.init())
    } else {
        // If it's not a supported browser or there is no PWA view for this page,
        // still load a.js to record analytics.
        addAMPLinkTags()
        waitForBody().then(() => {
            loadScript(
                {
                    id: 'ajs',
                    src: `https://a.mobify.com/${AJS_SLUG}/a.js`
                })
            triggerSandyAppStartEvent(false, AJS_SLUG, PLATFORMS.NON_PWA)
        })
    }
}
