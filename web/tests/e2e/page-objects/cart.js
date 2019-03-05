/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
const ENV = process.env.NODE_ENV || 'test'

const selectors = {
    miniCart: '.qa-header__cart',
    miniCartContent: '.m-mini-cart__content',
    viewCart: '.m-mini-cart__content .pw--tertiary',
    cartTemplateIdentifier: '.t-cart.t--loaded',
    cartCheckout: '.qa-cart__checkout',
    removeItem: '.qa-cart__remove-item',
    confirmRemove: '.m-cart__remove-item-confirmation-modal .pw--secondary',
    emptyCart: '.t-cart__empty',
    emptyMiniCart: '.m-mini-cart__empty-content'
}

const Cart = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

Cart.prototype.navigateToCheckout = function() {
    // Navigate from Cart to Checkout
    this.browser
        .log('Navigating to Checkout')
        .waitForElementVisible(selectors.cartCheckout)
        .triggerClick(selectors.cartCheckout)
        .waitUntilMobified()
    return this
}

Cart.prototype.openMiniCart = function() {
    this.browser
        .log('Opening mini cart')
        .waitForElementVisible(selectors.miniCart)
        .triggerClick(selectors.miniCart)
        .waitForElementVisible(selectors.viewCart)
        .triggerClick(selectors.viewCart)
    return this
}

Cart.prototype.removeItems = function(connector) {
    if (ENV === 'debug') {
        console.log('Debugging, not removing items')
    } else {
        // Remove all items from the cart
        const self = this
        this.browser
            .saveScreenshot(`tests/screenshots/workflows/${connector}/registered-checkout/${connector}-Checkout--Registered.png`)
            .pause(2000)
            .url(process.env.npm_package_siteUrl)
            .log('Opening mini cart')
            .waitForElementVisible(selectors.miniCart)
            .click(selectors.miniCart)
            .waitForElementVisible(selectors.miniCartContent)
            .pause(2000)
            .element('css selector', selectors.viewCart, (result) => {
                if (result.value && result.value.ELEMENT) {
                    self.browser
                        .log('View cart')
                        .waitForElementVisible(selectors.viewCart)
                        .click(selectors.viewCart)
                        .log('Removing item from cart')
                        .waitForElementVisible(selectors.removeItem)
                        .triggerClick(selectors.removeItem)
                        .waitForElementVisible(selectors.confirmRemove)
                        .triggerClick(selectors.confirmRemove)
                        .waitForAjaxCompleted()
                    self.removeItems()
                }
            })
            .waitForElementVisible(selectors.emptyMiniCart)
    }
    return this
}

export default Cart
