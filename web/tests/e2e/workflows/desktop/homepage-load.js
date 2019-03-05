/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import process from 'process'
import Home from '../../page-objects/home'

let home

module.exports = { // eslint-disable-line import/no-commonjs
    '@tags': ['desktop'],

    before: (browser) => {
        home = new Home(browser)
    },

    after: () => {
        home.closeBrowser()
    },

    // The following tests are conducted in sequence within the same session.
    // TODO: When UPWA Demo stabilizes, create more functional tests.
    'UPWA Desktop - Navigate to Home': (browser) => {
        browser
            .url(process.env.npm_package_upwaUrl)
            .waitForElementVisible(home.selectors.wrapper)
            .assert.visible(home.selectors.wrapper)
            .execute('scrollTo(0, 1000)')
            .element('css selector', home.selectors.footerNewsletterTabs, (result) => {
                if (result.value && result.value.ELEMENT) {
                    browser
                        .waitForElementVisible(home.selectors.footerNewsletterTabs)
                        .click(home.selectors.footerNewsletterEmailTab)
                }
            })
    },
}
