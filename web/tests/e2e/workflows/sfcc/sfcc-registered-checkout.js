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
    'SFCC Checkout - Registered - Step 1 - Navigate to Home': () => {
        home.openBrowserToHomepage(process.env.npm_package_sfccUrl)
    },

    'SFCC Checkout - Registered - Step 1 - Navigate from Home to ProductList': (browser) => {
        home.navigateToProductList(PRODUCT_LIST_INDEX)
        browser
            .waitForElementVisible(productList.selectors.productListTemplateIdentifier)
            .assert.visible(productList.selectors.productListTemplateIdentifier)
    },

    'SFCC Checkout - Registered - Step 3 - Navigate from ProductList to ProductDetails': (browser) => {
        productList.navigateToProductDetails(PRODUCT_INDEX)
        browser
            .waitForElementVisible(productDetails.selectors.productDetailsTemplateIdentifier)
            .assert.visible(productDetails.selectors.productDetailsTemplateIdentifier)
    },

    'SFCC Checkout - Registered - Step 4 - Add item to Shopping Cart': () => {
        productDetails.addItemToCart()
    },

    'SFCC Checkout - Registered - Step 5 - Navigate from ProductDetails to Cart': (browser) => {
        productDetails.navigateToCart()
        browser
            .waitForElementVisible(cart.selectors.cartTemplateIdentifier)
            .assert.visible(cart.selectors.cartTemplateIdentifier)
    },

    'SFCC Checkout - Registered - Step 6 - Navigate from Cart to Checkout': (browser) => {
        cart.navigateToCheckout()
        browser
            .waitForElementVisible(checkout.selectors.checkoutTemplateIdentifier)
            .assert.visible(checkout.selectors.checkoutTemplateIdentifier)
            // Email field should have email input type
            .waitForElementVisible(`${checkout.selectors.email}[type="email"]`)
    },

    'SFCC Checkout - Registered - Step 7 - Continue to Registered Checkout': (browser) => {
        checkout.continueAsRegistered()
        // Workaround for WEB-1837
        browser.back()
        browser.forward()
        browser
            .waitForElementVisible(checkout.selectors.checkoutTemplateIdentifier)
            .assert.visible(checkout.selectors.checkoutTemplateIdentifier)
    },

    'SFCC Checkout - Registered - Step 8 - Choose shipping info': () => {
        checkout.chooseShippingInfo()
    },

    'SFCC Checkout - Registered - Step 9 - Fill out Registered Checkout Payment Details form': (browser) => {
        checkout.continueToPayment()
        checkout.fillPaymentInfo()
        browser
            .waitForElementVisible(checkout.selectors.cvv)
            .assert.valueContains(checkout.selectors.cvv, checkout.userData.cvv)
    },

    'SFCC Checkout - Registered - Step 10 - Verify Submit Order button is visible': (browser) => {
        browser
            .waitForElementVisible(checkout.selectors.placeOrder)
            .assert.visible(checkout.selectors.placeOrder)
    }
}
