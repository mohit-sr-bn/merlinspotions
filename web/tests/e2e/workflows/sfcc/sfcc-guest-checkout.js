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

const PRODUCT_LIST_INDEX = process.env.PRODUCT_LIST_INDEX || 2
const PRODUCT_INDEX = process.env.PRODUCT_INDEX || 1

module.exports = { // eslint-disable-line import/no-commonjs
    '@tags': ['sfcc'],

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

    'SFCC Checkout - Guest - Step 1 - Navigate to Home': () => {
        home.openBrowserToHomepage(process.env.npm_package_sfccUrl)
    },

    'SFCC Checkout - Guest - Step 2 - Navigate from Home to ProductList': (browser) => {
        home.navigateToProductList(PRODUCT_LIST_INDEX)
        browser
            .waitForElementVisible(productList.selectors.productListTemplateIdentifier)
            .assert.visible(productList.selectors.productListTemplateIdentifier)
    },

    'SFCC Checkout - Guest - Step 3 - Navigate from ProductList to ProductDetails': (browser) => {
        productList.navigateToProductDetails(PRODUCT_INDEX)
        browser
            .waitForElementVisible(productDetails.selectors.productDetailsTemplateIdentifier)
            .assert.visible(productDetails.selectors.productDetailsTemplateIdentifier)
    },

    'SFCC Checkout - Guest - Step 4 - Add item to Shopping Cart': () => {
        productDetails.addItemToCart()
    },

    'SFCC Checkout - Step 5 - Navigate from ProductDetails to Cart': (browser) => {
        productDetails.navigateToCart()
        browser
                .waitForElementVisible(cart.selectors.cartTemplateIdentifier)
                .assert.visible(cart.selectors.cartTemplateIdentifier)
    },

    'SFCC Checkout - Step 6 - Navigate from Cart to Checkout': (browser) => {
        cart.navigateToCheckout()
        browser
            .waitForElementVisible(checkout.selectors.checkoutTemplateIdentifier)
            .assert.visible(checkout.selectors.checkoutTemplateIdentifier)
    },

    'SFCC Checkout - Step 7 - Fill out Guest Checkout Shipping Info form': (browser) => {
        checkout.fillShippingInfo()
        checkout.chooseShippingMethod()
        browser
            // Phone field should have numeric input type
            .waitForElementVisible(`${checkout.selectors.phone}[type="tel"]`)
            .waitForElementVisible(checkout.selectors.address)
            .assert.valueContains(checkout.selectors.address, checkout.userData.address)
    },

    'SFCC Checkout - Guest - Step 8 - Fill out Guest Checkout Payment Details form': (browser) => {
        checkout.continueToPayment()
        checkout.fillPaymentInfo()
        browser
            .waitForElementVisible(checkout.selectors.cvv)
            .assert.valueContains(checkout.selectors.cvv, checkout.userData.cvv)
    },

    'SFCC Checkout - Guest - Step 9 - Verify Place Your Order button is visible': (browser) => {
        browser
            .waitForElementVisible(checkout.selectors.placeOrder)
            .assert.visible(checkout.selectors.placeOrder)
            .triggerClick(checkout.selectors.placeOrder)
    },

    'SFCC Checkout - Guest - Step 10 - Verify Confirmation Page: Order Number': (browser) => {
        browser
            .waitForElementVisible(checkout.selectors.checkoutConfirmationTemplate)
            .assert.visible(checkout.selectors.checkoutConfirmationTemplate)
            .useXpath()
            // Using xpath to see if Order Number is present - it's a 'strong' element that contains 000'
            .waitForElementVisible(`.//strong[contains(text(),'000')]`)
            .assert.visible(`.//strong[contains(text(),'000')]`)
            .log('Order Number Verified.')
            .useCss()
    }
}
