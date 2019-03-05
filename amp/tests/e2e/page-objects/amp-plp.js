/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
    plp: '.t-app.amp-mode-touch',
    name: '.t-product-list h1',
    productDetailsItem(index) {
        return `.c-card:nth-of-type(${index})`
    },
    sortBy: '#sort',
    sortByOption: 'Price'
}

const AmpPlp = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

AmpPlp.prototype.applySort = function() {

    this.browser
        .waitForElementVisible(selectors.sortBy)
        .setValue(selectors.sortBy, selectors.sortByOption)
    return this
}

export default AmpPlp
