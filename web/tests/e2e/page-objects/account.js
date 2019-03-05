/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import userData from './accountData'

const selectors = {
    accountTemplateIdentifier: '.t-app--signin',
    menu: 'button#header-navigation',
    signIn: '//*[text()="Sign In"]',
    signOut: '//*[text()="Sign Out"]',
    email: 'input[name="username"]',
    password: 'input[name="password"][type="password"]',
    login: '#signin-form button[type=submit]',
    dashboard: '.t-account-dashboard'
}

const Account = function(browser) {
    this.browser = browser
    this.selectors = selectors
    this.userData = userData
}

Account.prototype.fillOutSignInForm = function() {
    this.browser
        .log('Filling out Forms to sign in')
        .waitForElementVisible(selectors.email)
        .clearValue(selectors.email)
        .setValue(selectors.email, userData.email)
        .waitForElementVisible(selectors.password)
        .clearValue(selectors.password)
        .setValue(selectors.password, userData.password)
        .waitForElementVisible(selectors.login)
        .click(selectors.login)
}

Account.prototype.openMenuToVerifySignInButton = function() {
    this.browser
        .waitForElementVisible(selectors.menu)
        .click(selectors.menu)
        /* Using Xpath for searching for the exact text 'Sign In' */
        .useXpath()
        .waitForElementVisible(selectors.signIn)
        .useCss()
    return this
}

export default Account
