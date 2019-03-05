/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
const ENV = process.env.NODE_ENV || 'test'
const SKIP_PREVIEW = (ENV === 'production' || process.env.SKIP_PREVIEW)

const selectors = {
    wrapper: '.t-home__container',
    skipLinks: '.pw-skip-links',
    skipToMain: '.pw-skip-links__anchor:first-of-type',
    skipToNav: '.pw-skip-links__anchor:nth-child(2n)',
    skipToFooter: '.pw-skip-links__anchor:last-of-type',
    menu: 'button#header-navigation',
    signIn: '//*[text()="Sign In"]',
    signOut: '//*[text()="Sign Out"]',
    productListItem(index) {
        return `.t-home__category-item:nth-child(${index}) .pw--is-loaded`
    },
    productListItemStub(index) {
        return `.t-home__category-item:nth-child(${index})`
    },
    copyright: '.qa-footer__copyright',
    // @TODO: Re-enable once a responsive design for the privacy policy modal
    //        has been created
    // privacyModal: '.m-privacy',
    // acceptPrivacyPolicy: '.m-privacy .pw-button.pw--secondary'
}

const Home = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

Home.prototype.openBrowserToHomepage = function(url) {
    if (SKIP_PREVIEW) {
        this.browser.url(url)
    } else {
        console.log('Running preview.')
        this.browser
            // iOS Sim won't preview without this
            // You will still need to run the simulator and manually
            // and accept the SSL cert beforehand
            .url('https://localhost:8443/loader.js')
            .preview(url, 'https://localhost:8443/loader.js')
    }
    this.browser
        .waitForElementVisible(selectors.wrapper)
        .assert.visible(selectors.wrapper)
        // @TODO: Re-enable once a responsive design for the privacy policy
        //        modal has been created
        // .waitForElementVisible(selectors.privacyModal)
        // .assert.visible(selectors.privacyModal)
        // .waitForElementVisible(selectors.acceptPrivacyPolicy)
        // .click(selectors.acceptPrivacyPolicy)
        .pause(3000)
}

Home.prototype.closeBrowser = function() {
    if (ENV === 'debug') {
        console.log('Debugging, not closing browser')
    } else {
        this.browser.end()
    }
    return this
}

Home.prototype.openMenuToSignIn = function() {
    this.browser
        .waitForElementVisible(selectors.menu)
        .click(selectors.menu)
        .pause(3000)
        .useXpath()
        .waitForElementVisible(selectors.signIn)
        .click(selectors.signIn)
        .useCss()
    return this
}

Home.prototype.openMenuToSignOut = function() {
    this.browser
        .waitForElementVisible(selectors.menu)
        .click(selectors.menu)
        .pause(3000)
        .useXpath()
        .waitForElementVisible(selectors.signOut)
        .click(selectors.signOut)
        .useCss()
        .waitForElementVisible(selectors.wrapper)
        .assert.visible(selectors.wrapper)
    return this
}

Home.prototype.navigateToProductList = function(PRODUCT_LIST_INDEX) {
    // Navigate from Home to ProductList
    this.browser
        .log(`Navigating to ProductList number: ${PRODUCT_LIST_INDEX}`)
        .waitForElementVisible(selectors.productListItem(PRODUCT_LIST_INDEX))
        .click(selectors.productListItem(PRODUCT_LIST_INDEX))
    return this
}

Home.prototype.navigateToStubProductList = function(PRODUCT_LIST_INDEX) {
    // Navigate from Home to ProductList
    this.browser
        .log('Navigating to ProductList')
        .waitForElementVisible(selectors.productListItemStub(PRODUCT_LIST_INDEX))
        .click(selectors.productListItemStub(PRODUCT_LIST_INDEX))
    return this
}

export default Home
