/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
    plp: '.t-app--productListPage',
    name: '.t-product-list h1'
}

const PwaPlp = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

export default PwaPlp
