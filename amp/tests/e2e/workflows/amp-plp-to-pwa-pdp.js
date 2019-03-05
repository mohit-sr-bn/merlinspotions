/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import process from 'process'
import AmpPlp from '../page-objects/amp-plp'
import PwaPdp from '../page-objects/pwa-pdp'

const ENV = process.env.NODE_ENV || 'test'

let ampPlp
let pwaPdp

let productName

export default {
    '@tags': ['amp'],

    before: (browser) => {
        ampPlp = new AmpPlp(browser)
        pwaPdp = new PwaPdp(browser)
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

    'Browse to Product Detail Page': (browser) => {
        browser
            .waitForElementVisible(ampPlp.selectors.productDetailsItem(1))
            .getText(`${ampPlp.selectors.productDetailsItem(1)} .c-product-tile__name`, (expectedProductName) => {
                productName = expectedProductName.value
            })
            // https://bugs.chromium.org/p/chromedriver/issues/detail?id=2172
            // Change back to .click when resolved
            .triggerClick(`${ampPlp.selectors.productDetailsItem(1)} a`)
    },

    'Verify we are in PWA on the correct product': (browser) => {
        browser
            .waitForElementVisible(pwaPdp.selectors.productName)
            .getText(pwaPdp.selectors.productName, (actualProductName) => {
                browser.verify.equal(productName.toLowerCase(), actualProductName.value.toLowerCase())
            })
            .verify.attributeContains(`${pwaPdp.selectors.pdp} a`, 'href', 'mobify_id')
    },
}
