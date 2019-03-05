/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Home from '../../page-objects/home'

let home

// On the homepage, at least the following skip
// links should be present on the page...
const skipLinkTargets = {
    main: '#app-main',
    nav: '#header-navigation',
    footer: '#app-footer',
}

module.exports = { // eslint-disable-line import/no-commonjs
    '@tags': ['e2e'],

    before: (browser) => {
        home = new Home(browser)
    },

    after: () => {
        home.closeBrowser()
    },

    'Merlins Home Page': () => {
        home.openBrowserToHomepage(process.env.npm_package_siteUrl)
    },

    'Skip Links': (browser) => {
        browser
            // Site should have skip links!
            .assert.elementPresent(home.selectors.skipLinks)

            // Skip Links and their target should match
            .assert.elementPresent(skipLinkTargets.main)
            .assert.elementPresent(skipLinkTargets.nav)
            .assert.elementPresent(skipLinkTargets.footer)
            .assert.attributeContains(home.selectors.skipToMain, 'href', skipLinkTargets.main)
            .assert.attributeContains(home.selectors.skipToNav, 'href', skipLinkTargets.nav)
            .assert.attributeContains(home.selectors.skipToFooter, 'href', skipLinkTargets.footer)
    },

    'Footer copyright is present': (browser) => {
        browser
            .execute('scrollTo(0, 500)')
            .waitForElementVisible(`${home.selectors.copyright}`)
            .assert.visible(`${home.selectors.copyright}`)
    },
}
