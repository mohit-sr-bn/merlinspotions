/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
    pdp: '.t-app--productDetailsPage',
    productName: '.t-product-details-heading__title',
    addToCart: '#product-add-to-cart'
}

const PwaPdp = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

export default PwaPdp
