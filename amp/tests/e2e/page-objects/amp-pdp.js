/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
	clientIdNotification: '#user-notification-button',
	hiddenNotification: '.amp-hidden',
    pdp: '.t-app.amp-mode-touch .t-product-details',
    productName: '.t-product-details-heading__title',
    addToCart: '.t-app.amp-mode-touch .t-product-details__add-to-cart'
}

const AmpPdp = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

AmpPdp.prototype.dismissNotification = function() {
    this.browser
        .waitForElementVisible(selectors.clientIdNotification)
        .triggerClick(selectors.clientIdNotification)
        .waitForElementPresent(selectors.hiddenNotification)
    return this
}

export default AmpPdp
