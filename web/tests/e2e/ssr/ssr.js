/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import process from 'process'
import Home from '../page-objects/home'
import ProductList from '../page-objects/product-list'

let home
let productList

const PRODUCT_LIST_INDEX = process.env.PRODUCT_LIST_INDEX || 2

module.exports = { // eslint-disable-line import/no-commonjs
    '@tags': ['ssr'],

    before: (browser) => {
        home = new Home(browser)
        productList = new ProductList(browser)
    },

    after: () => {
        home.closeBrowser()
    },

    // The following tests are conducted in sequence within the same session.
    'SSR - Step 1 - Navigate to Home': () => {
        home.openBrowserToHomepage('https://localhost:3443/')
    },

    'SSR - Step 2 - Validate the page': (browser) => {
        browser.execute(
            // We need to JSON the result so that it can be passed back
            'return JSON.stringify(window.Progressive)',
            [],
            (result) => {
                browser.assert.ok(!!result.value, 'Loaded window.Progressive')
                const progressive = JSON.parse(result.value)
                browser.assert.ok(
                    progressive.isUniversal === true,
                    'window.Progressive.isUniversal should be true'
                )
                browser.assert.ok(
                    progressive.isServerSide === false,
                    'window.Progressive.isServerSide should be false'
                )

                // This used to test the initial value of isServerSideOrHydrating
                // - currently it tests the value after the app has been loaded.
                browser.assert.ok(
                    progressive.isServerSideOrHydrating === false,
                    'window.Progressive.isServerSideOrHydrating should be false'
                )
                browser.assert.ok(
                    progressive.buildOrigin.endsWith('/mobify/bundle/development/'),
                    'window.Progressive.buildOrigin is set'
                )
            }
        )
    },

    'SSR - Step 3 - Navigate from Home to ProductList': (browser) => {
        home.navigateToStubProductList(PRODUCT_LIST_INDEX)
        browser
            .waitForElementVisible(productList.selectors.productListTemplateIdentifier)
            .assert.visible(productList.selectors.productListTemplateIdentifier)
    }
}
