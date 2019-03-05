/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import process from 'process'
import AmpPlp from '../page-objects/amp-plp'
import PwaPlp from '../page-objects/pwa-plp'

const ENV = process.env.NODE_ENV || 'test'

let ampPlp
let pwaPlp

let productListingName

export default {
    '@tags': ['amp'],

    before: (browser) => {
        ampPlp = new AmpPlp(browser)
        pwaPlp = new PwaPlp(browser)
    },

    after: (browser) => {
        if (ENV === 'debug') {
            console.log('Debugging, not closing browser')
        } else {
            browser.end()
        }
    },

    'Open AMP Product Listing Page': (browser) => {
        browser
            .url('http://localhost:3000/potions.html')
            .waitForElementVisible(ampPlp.selectors.plp)
    },

    'Sort by Price': (browser) => {
        browser
            .waitForElementVisible(ampPlp.selectors.name)
            .getText(ampPlp.selectors.name, (expectedProductListingName) => {
                productListingName = expectedProductListingName.value
            })
        ampPlp.applySort()
    },

    'Verify we are on the same Product Listing Page in PWA': (browser) => {
        browser
            .waitForElementVisible(pwaPlp.selectors.plp)
            .waitForElementVisible(pwaPlp.selectors.name)
            .getText(pwaPlp.selectors.name, (actualProductListingName) => {
                browser.verify.equal(productListingName.toLowerCase(), actualProductListingName.value.toLowerCase())
            })
    },
}
