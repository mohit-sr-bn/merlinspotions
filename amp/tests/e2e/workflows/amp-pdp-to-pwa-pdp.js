/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import process from 'process'
import AmpPdp from '../page-objects/amp-pdp'
import PwaPdp from '../page-objects/pwa-pdp'
import PwaCart from '../page-objects/pwa-cart'

const ENV = process.env.NODE_ENV || 'test'

let ampPdp
let pwaPdp
let pwaCart

let productName

export default {
    '@tags': ['amp'],

    before: (browser) => {
        ampPdp = new AmpPdp(browser)
        pwaPdp = new PwaPdp(browser)
        pwaCart = new PwaCart(browser)
    },

    after: (browser) => {
        if (ENV === 'debug') {
            console.log('Debugging, not closing browser')
        } else {
            browser.end()
        }
    },

    'Open AMP Product Detail Page': (browser) => {
        browser
            .url('http://localhost:3000/eye-of-newt.html')
            .waitForElementVisible(ampPdp.selectors.pdp)
            .getText(ampPdp.selectors.productName, (expectedProductName) => {
                productName = expectedProductName.value
            })
    },

    'Dismiss Client ID Notification': (browser) => {
        ampPdp.dismissNotification()
        browser.waitForElementNotVisible(ampPdp.selectors.clientIdNotification)
    },

    'Add to Cart': (browser) => {
        browser
            .waitForElementVisible(ampPdp.selectors.addToCart)
            .verify.attributeContains(ampPdp.selectors.addToCart, 'href', 'mobify_id')
            // the client ID notification is still visible to Selenium
            .triggerClick(ampPdp.selectors.addToCart)
    },

    'Verify we are in PWA and Add To Cart form is visible': (browser) => {
        browser
            .waitForElementVisible(pwaCart.selectors.addedProduct)
            .getText(pwaCart.selectors.addedProduct, (actualProductName) => {
                browser.verify.equal(productName.toLowerCase(), actualProductName.value.toLowerCase())
            })
            .waitForElementVisible(pwaCart.selectors.callToAction)
            .verify.visible(pwaCart.selectors.callToAction)
    },
}
