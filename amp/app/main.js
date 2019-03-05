/* global DEBUG */

import sourceMapSupport from 'source-map-support'
sourceMapSupport.install()


import process from 'process'
import path from 'path'
import express from 'express'
import morgan from 'morgan'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Provider} from 'react-redux'
import * as awsServerlessExpress from 'aws-serverless-express'
import ampPackageJson from '../package.json'
import {staticURL, getEnvironmentBaseURL, canonicalURL} from './utils'

import Analytics from 'mobify-amp-sdk/dist/components/analytics'
import AmpInstallServiceWorker from 'mobify-amp-sdk/dist/components/amp-install-sw'
import ProductDetails from './containers/product-details/container'
import ProductList from './containers/product-list/container'
import App from './containers/app/container'
import ErrorContainer from './containers/error/container'

import * as ampSDK from 'mobify-amp-sdk/dist/amp-sdk'
import ampPage from './templates/amp-page'

import {initializeStore} from './data-integration/connectedStore'
import {PAGE_TITLE} from './data-integration/constants'
import {getStoreSnapshot} from './data-integration/store-snapshot'

import globalStyles from './styles/global.scss'
import styles from './styles'

import {productListingTemplates, productDetailsTemplates} from './templates/templateUrls'

const fonts = [
    '<link href="https://fonts.googleapis.com/css?family=Oswald:200,400" rel="stylesheet">'
]

const cacheMaxAge = 43200 // 12 hours

const addHeaders = (response) => {
    response.set('Cache-Control', `public, max-age=${cacheMaxAge}`)
}

const buildAppBody = (store, component, error) => {

    // The src attribute for the AmpInstallServiceWorker component used here does
    // not matter for our use case. Right now, regular users coming from Google
    // search results, are served from the Google AMP cache. When being rendered
    // from Google AMP cache, the original <amp-install-serviceworker> tag does not use
    // the src attribute, but instead installs the SW from an html page via the iframeSrc
    // attribute. Thus, both src and iframeSrc url's are the same.

    if (!error) {
        return (
            <Provider store={store}>
                <App templateName={component.templateName}>
                    <AmpInstallServiceWorker src={canonicalURL('/sw.html')} iframeSrc={canonicalURL('/sw.html')} />
                    <Analytics templateName={component.templateName} projectSlug={ampPackageJson.cloudSlug} gaAccount={ampPackageJson.gaAccount} />
                    {ampPackageJson.ampgaAccount !== null &&
                    <Analytics templateName={component.templateName} gaAccount={ampPackageJson.ampgaAccount} />}
                    {React.createElement(component, {}, null)}
                </App>
            </Provider>
        )
    } else {
        return (
            <ErrorContainer>
                <Analytics templateName={component.templateName} projectSlug={ampPackageJson.cloudSlug} gaAccount={ampPackageJson.gaAccount} />
                {ampPackageJson.ampgaAccount !== null &&
                <Analytics templateName={component.templateName} gaAccount={ampPackageJson.ampgaAccount} />}
            </ErrorContainer>
        )
    }
}

const render = (req, res, store, component, error) => {

    const components = new Set()
    const state = error ? null : store.getState()
    const title = error ? 'Error 404 - Page Not Found' : state.app.get(PAGE_TITLE)

    const body = ReactDOMServer.renderToStaticMarkup(
        <ampSDK.AmpContext trackRender={components.add.bind(components)}>
            {buildAppBody(store, component, error)}
        </ampSDK.AmpContext>
    )

    const scriptIncludes = new Set()
    const styleIncludes = [globalStyles]

    components.forEach((component) => {
        (component.scripts || []).forEach((script) => {
            scriptIncludes.add(script)
        })

        Array.prototype.push.apply(styleIncludes, styles.get(component) || [])
    })

    const storeAsJSON = JSON.stringify(getStoreSnapshot())

    const rendered = ampPage({
        title,
        canonicalURL: canonicalURL(req.url),
        body,
        css: styleIncludes.map((x) => x.toString()
                    .trim()
                    .replace(/\/static\//g, staticURL('')))
                    .join('\n'),
        scriptIncludes: Array.from(scriptIncludes).join('\n'),
        fontIncludes: fonts.join('\n'),
        // Placing this info inside a comment so it doesn't invalidate the page
        debugInfo: DEBUG ? `<!-- <script>var store = ${storeAsJSON}</script> -->` : ''
    })

    if (error) {
        res.status(404)
    }

    addHeaders(res)
    res.send(rendered)
}

// Pass in empty store, and Error as true
const handleError = (req, res) => render(req, res, null, ErrorContainer, true)

const handlePage = (page) => (req, res, next) => {
    console.log(`Handling request: ${req.url} as ${page.templateName}`)
    initializeStore(canonicalURL(req.url), [page, App])
        .then((store) => render(req, res, store, page, false))
        .catch(next)
}

const onLambda = process.env.hasOwnProperty('AWS_LAMBDA_FUNCTION_NAME')

const app = express()

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(onLambda ? 'short' : 'dev'))
}

app.use('/static', express.static(path.resolve('./app/static'), {
    fallthrough: false
}))

app.get('/favicon.ico', (req, res) => res.redirect(staticURL('ico/favicon.ico')))
app.get('/robots.txt', (req, res) => res.redirect(staticURL('robots.txt')))
app.get('/s/2017refresh/womens', handlePage(ProductList))
app.get('/s/2017refresh/mens', handlePage(ProductList))
app.get('/potions.html', handlePage(ProductList))
app.get('/books.html', handlePage(ProductList))
app.get('/ingredients.html', handlePage(ProductList))
app.get('/supplies.html', handlePage(ProductList))
app.get('/new-arrivals.html', handlePage(ProductList))
app.get('/charms.html', handlePage(ProductList))
app.get('/checkout/cart/configure/id/*/product_id/*/', handlePage(ProductDetails))
app.get('*.html', handlePage(ProductDetails))

app.use((req, res) => handleError(req, res))

// Express adds this header by default. We don't want to use extra data advertising
// one of our infrastructure choices
app.set('x-powered-by', false)

const logEnvironmentConfig = () => {
    const environmentConfig = [
        `\nAMP @ http://127.0.0.1:3000 => ${getEnvironmentBaseURL()} - ${ampSDK.getEnvironment()}\n`
    ]

    const sampleUrls = ['Check out some sample urls!:']
    productListingTemplates.forEach((route) => sampleUrls.push(`PLP: http://127.0.0.1:3000${route}`))
    productDetailsTemplates.forEach((route) => sampleUrls.push(`PDP: http://127.0.0.1:3000${route}`))

    console.log(
        environmentConfig.concat(sampleUrls).join('\n')
    )
}

if (!onLambda && require.main === module) {
    const port = 3000
    app.listen(port)
}

logEnvironmentConfig()

/**
 * Wrap the express app returning a handler function that can be used with AWS Lambda.
 */
const makeHandler = (expressApp) => {
    const binaryMimeTypes = [
      // If we choose to let express output gzipped responses, we'd need to add mimetypes here.
      // 'text/html',
    ]
    const server = awsServerlessExpress.createServer(expressApp, null, binaryMimeTypes)
    return (event, context) => awsServerlessExpress.proxy(server, event, context)
}

export const handler = onLambda ? makeHandler(app) : undefined

export default app
