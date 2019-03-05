/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
    addedProduct: '.t-cart__product-list h2.u-h5',
    callToAction: '.qa-cart__checkout'
}

const PwaCart = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

export default PwaCart
