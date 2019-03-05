/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import userData from './accountData'

const selectors = {
    checkoutTemplateIdentifier: '.t-checkout-shipping.t--loaded',
    checkoutConfirmationTemplate: '.t-checkout-confirmation__splash',
    email: 'input[name="username"]',
    password: 'input[name="password"][type="password"]',
    showSignIn: '.qa-checkout__show-sign-in .pw-button.pw--is-anchor',
    signIn: '.qa-checkout__sign-in',
    headerSignIn: '.qa-checkout-header__sign-in',

    // Shipping info
    name: 'input[name="name"]',
    address: 'input[name="addressLine1"]',
    city: 'input[name*="city"]',
    country: 'select[name*="country"]',
    state: '[name*="region"]',
    postCode: 'input[name*="postcode"]',
    phone: 'input[name*="phone"]',
    addressListOption: '.t-checkout-shipping__shipping-address .pw-field-row:first-child input',
    lastAddressListOption: '.t-checkout-shipping__shipping-address .pw-field-row:last-child input',
    shippingMethod: '.t-checkout-shipping__shipping-method',
    shippingMethodOption: '.t-checkout-shipping__shipping-method .pw-field-row:first-child input[type="radio"]',
    shippingMethodChecked: '.t-checkout-shipping__shipping-method .pw--checked',
    continueToPayment: '.qa-checkout__continue-to-payment:not(:disabled)',

    paymentTemplate: '.t-app--checkingPayment',
    creditCardName: 'input[name="ccname"]',
    creditCardNumber: '.pw-card-input input',
    expiry: '.pw-expiry-date input',
    cvv: '.pw-card-verification input',

    placeOrder: '.u-padding-end-md .qa-checkout__place-order:enabled'
}

const Checkout = function(browser) {
    this.browser = browser
    this.selectors = selectors
    this.userData = userData
}

Checkout.prototype.continueAsGuest = function() {
    // Select Continue as Guest / Guest Checkout
    this.browser
        .log('Navigating to Guest Checkout')
        .waitForElementVisible(selectors.continueAsGuest)
        .click(selectors.continueAsGuest)
        .waitUntilMobified()
    return this
}

Checkout.prototype.continueAsRegistered = function() {
    // Sign in to continue Registered Checkout
    this.browser
        .log('Navigating to Registered Checkout')
        .waitForElementVisible(selectors.email)
        .setValue(selectors.email, userData.email)
        .click(selectors.showSignIn)
        .waitForElementVisible(selectors.password)
        .setValue(selectors.password, userData.password)
        .waitForElementVisible(selectors.signIn)
        .click(selectors.signIn)
        // Workaround. The login experience is currently not ideal.
        .pause(5000)
    return this
}

Checkout.prototype.continueToPayment = function() {
    const self = this
    this.browser
        .log('Continue to Payment')
        .execute('scrollTo(0,500)')
        .waitForElementVisible(selectors.continueToPayment)
        .click(selectors.continueToPayment)
        .pause(3000)
        // Sometimes clicking once is not enough
        .element('css selector', selectors.continueToPayment, ({value}) => {
            if (value && value.ELEMENT) {
                self.browser.click(selectors.continueToPayment)
            }
        })
    return this
}

Checkout.prototype.fillShippingInfo = function() {
    // Fill out Shipping info form fields
    const self = this
    this.browser
        .log('Fill out Shipping Info form fields')
        .waitForElementVisible(selectors.email)
        .clearValue(selectors.email)
        .clearValue(selectors.name)
        .clearValue(selectors.address)
        .clearValue(selectors.city)
        .clearValue(selectors.postCode)
        .clearValue(selectors.phone)

        .pause(3000) // Safety pause!

        .setValue(selectors.email, userData.email)
        .setValue(selectors.name, userData.name)
        .setValue(selectors.address, userData.address)
        .setValue(selectors.city, userData.city)

        // Country selection
        .click(selectors.country)
        .useXpath()
        .waitForElementVisible(userData.country)
        .click(userData.country)
        .useCss()

        // Hybris has a text field instead of a drop down menu
        .url((result) => {
            if (result.value.includes('hybris')) {
                self.browser.setValue(selectors.state, userData.stateString)
            } else {
                self.browser
                    // State selection
                    .click(selectors.state)
                    .useXpath()
                    .waitForElementVisible(userData.state)
                    .click(userData.state)
                    .useCss()
            }
        })

        .setValue(selectors.postCode, userData.postCode)
        .setValue(selectors.phone, userData.phone)

    return this
}

Checkout.prototype.chooseShippingInfo = function() {
    // For registered users who have a list of shipping addresses to choose
    this.browser
        .log('Choose shipping address')
        // E2E workaround until WEB-1835 is resolved
        .waitForElementVisible(selectors.lastAddressListOption)
        .click(selectors.lastAddressListOption)
        .waitForElementVisible(selectors.addressListOption)
        .click(selectors.addressListOption)
    return this
}

Checkout.prototype.chooseShippingMethod = function() {
    // Choose shipping method
    this.browser
        .log('Choose shipping method')
        .click(selectors.shippingMethod)
        .log('Choosing First Shipping Method')
        .waitForElementVisible(selectors.shippingMethodOption)
        .click(selectors.shippingMethodOption)
        .waitForElementVisible(selectors.shippingMethodChecked)
}

Checkout.prototype.fillPaymentInfo = function() {
    // Fill out Payment Infos form fields
    this.browser
        .log('Fill out Payment Info form fields')
        .waitForElementVisible(selectors.creditCardName)
        .clearValue(selectors.creditCardName)
        .clearValue(selectors.creditCardNumber)
        .clearValue(selectors.expiry)
        .clearValue(selectors.cvv)

        .setValue(selectors.creditCardName, userData.name)
        .setValue(selectors.creditCardNumber, userData.creditCardNumber)
        .setValue(selectors.expiry, userData.expiry)
        .setValue(selectors.cvv, userData.cvv)
    return this
}

export default Checkout
