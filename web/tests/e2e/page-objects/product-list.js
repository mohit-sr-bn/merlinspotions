/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
    productListTemplateIdentifier: '.t-product-list__container',
    addItem: '.t-product-details__add-to-cart:not([disabled])',
    productTitle(index) {
        return `.t-product-list__tile:nth-child(${index}) a .c-product-tile__name`
    },
    productDetailsItem(index) {
        return `.t-product-list__tile:nth-child(${index}) a`
    }
}

const ProductList = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

ProductList.prototype.navigateToProductDetails = function(productIndex) {
    // Navigate from ProductList to ProductDetails
    this.browser
        .waitForElementVisible(selectors.productTitle(productIndex))
        .getText(selectors.productTitle(productIndex), (result) => {
            const title = result.value
            this.browser.log(`Navigating to Product Index ${productIndex}. Going to Product: ${title}`)
        })
        .waitForElementVisible(selectors.productDetailsItem(productIndex))
        .click(selectors.productDetailsItem(productIndex))
        .waitUntilMobified()
    return this
}

export default ProductList
