/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import process from 'process'
import Home from '../../page-objects/home'
import ProductList from '../../page-objects/product-list'
import ProductDetails from '../../page-objects/product-details'
import Cart from '../../page-objects/cart'
import Checkout from '../../page-objects/checkout'

let home
let productList
let productDetails
let cart
let checkout
let timeBefore
let timeAfter

const PRODUCT_LIST_INDEX = process.env.PRODUCT_LIST_INDEX || 2
const PRODUCT_INDEX = process.env.PRODUCT_INDEX || 1

module.exports = { // eslint-disable-line import/no-commonjs
    '@tags': ['hybris'],

    before: (browser) => {
        home = new Home(browser)
        productList = new ProductList(browser)
        productDetails = new ProductDetails(browser)
        cart = new Cart(browser)
        checkout = new Checkout(browser)
    },

    after: () => {
        home.closeBrowser()
    },

    // The following tests are conducted in sequence within the same session.

    'Hybris Checkout - Guest - Step 1 - Navigate to Home': (browser) => {
        home.openBrowserToHomepage(process.env.npm_package_hybrisUrl)
        browser.perform(() => {
            timeBefore = Date.now()
        })
    },

    'Hybris Checkout - Guest - Step 2 - Navigate from Home to ProductList': (browser) => {
        home.navigateToProductList(PRODUCT_LIST_INDEX)
        browser
            .waitForElementVisible(productList.selectors.productListTemplateIdentifier)
            .assert.visible(productList.selectors.productListTemplateIdentifier)
    },

    'Hybris Checkout - Guest - Step 3 - Navigate from ProductList to ProductDetails': (browser) => {
        productList.navigateToProductDetails(PRODUCT_INDEX)
        browser
            .waitForElementVisible(productDetails.selectors.productDetailsTemplateIdentifier)
            .assert.visible(productDetails.selectors.productDetailsTemplateIdentifier)
    },

    'Hybris Checkout - Guest - Step 4 - Add item to Shopping Cart': () => {
        productDetails.addItemToCart()
    },

    'Hybris Checkout - Guest - Step 5 - Navigate from ProductDetails to Cart': (browser) => {
        productDetails.navigateToCart()
        browser
            .waitForElementVisible(cart.selectors.cartTemplateIdentifier)
            .assert.visible(cart.selectors.cartTemplateIdentifier)
    },

    'Hybris Checkout - Guest - Step 6 - Navigate from Cart to Checkout': (browser) => {
        cart.navigateToCheckout()
        browser
            .waitForElementVisible(checkout.selectors.checkoutTemplateIdentifier)
            .assert.visible(checkout.selectors.checkoutTemplateIdentifier)
    },

    'Hybris Checkout - Guest - Step 7 - Fill out Guest Checkout Shipping Info form': (browser) => {
        checkout.fillShippingInfo()
        browser
            // Phone field should have numeric input type
            .waitForElementVisible(`${checkout.selectors.phone}[type="tel"]`)
            .waitForElementVisible(checkout.selectors.address)
            .assert.valueContains(checkout.selectors.address, checkout.userData.address)
    },

    'Hybris Checkout - Guest - Step 8 - Choose shipping method': (browser) => {
        checkout.chooseShippingMethod()
        browser.waitForElementVisible(checkout.selectors.shippingMethodChecked)
    },

    'Hybris Checkout - Guest - Step 9 - Fill out Guest Checkout Payment Details form': (browser) => {
        checkout.continueToPayment()
        checkout.fillPaymentInfo()
        browser
            .waitForElementVisible(checkout.selectors.cvv)
            .assert.valueContains(checkout.selectors.cvv, checkout.userData.cvv)
    },

    'Hybris Checkout - Guest - Step 10 - Verify Place Your Order button is visible': (browser) => {
        browser
            .waitForElementVisible(checkout.selectors.placeOrder)
            .assert.visible(checkout.selectors.placeOrder)
            .perform(() => {
                timeAfter = Date.now()
                console.log(`Time to task completion: ${timeAfter - timeBefore} ms`)
            })
            // .triggerClick(checkout.selectors.placeOrder)
    },

    // 'Hybris Checkout - Guest - Step 11 - Verify Confirmation Page: Order Number': (browser) => {
    //     browser
    //         .waitForElementVisible(checkout.selectors.checkoutConfirmationTemplate)
    //         .assert.visible(checkout.selectors.checkoutConfirmationTemplate)
    //         .useXpath()
    //         // Using xpath to see if Order Number is present - it's a 'strong' element that contains 000'
    //         .waitForElementVisible(`.//strong[contains(text(),'000')]`)
    //         .assert.visible(`.//strong[contains(text(),'000')]`)
    //         .log('Order Number Verified.')
    //         .useCss()
    // }
}
