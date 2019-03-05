/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import process from 'process'
import Home from '../../page-objects/home'
import Account from '../../page-objects/account'

let home
let account

module.exports = { // eslint-disable-line import/no-commonjs
    '@tags': ['sfcc'],

    before: (browser) => {
        home = new Home(browser)
        account = new Account(browser)
    },

    after: () => {
        home.closeBrowser()
    },

    'My Account - Step 1 - Navigate to Home': () => {
        home.openBrowserToHomepage(process.env.npm_package_sfccUrl)
    },

    'My Account - Step 2 - Go to Sign in Page ': (browser) => {
        home.openMenuToSignIn()
        browser
            .waitForElementVisible(account.selectors.accountTemplateIdentifier)
            .assert.visible(account.selectors.accountTemplateIdentifier)
    },

    'My Account - Step 3 - Sign in into Account Dashboard': (browser) => {
        account.fillOutSignInForm()
        browser
            .waitForElementVisible(account.selectors.dashboard)
            .assert.visible(account.selectors.dashboard)
    },

    'My Account - Step 4 - Sign Out': () => {
        home.openMenuToSignOut()
        account.openMenuToVerifySignInButton()
    }
}
