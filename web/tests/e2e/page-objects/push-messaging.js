/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
    dismissButton: '.pw-push-messaging__default-ask-actions-dismiss',
    yesPlease: '.pw-push-messaging__default-ask-actions-accept',
    optIn: '.pw-inline-ask__button'
}

const PushMessaging = function(browser) {
    this.browser = browser
    this.selectors = selectors
}

PushMessaging.prototype.dismissDefaultAsk = function() {
    const self = this
    this.browser
        .log('Checking if Push Messaging opt-in banner is present')
        .element('css selector', selectors.dismissButton, (result) => {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Dismissing Push Messaging opt-in banner')
                    .waitForElementVisible(selectors.dismissButton)
                    .triggerClick(selectors.dismissButton)
                    .waitForElementNotPresent(selectors.dismissButton)
            } else if (result.error) {
                self.browser.log('No banner to dismiss')
                return
            }
        })
    return this
}

PushMessaging.prototype.acceptDefaultAsk = function() {
    const self = this
    this.browser
        .log('Checking if Push Messaging opt-in banner is present')
        .element('css selector', selectors.yesPlease, (result) => {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Accepting Push Messaging opt-in banner')
                    .waitForElementVisible(selectors.yesPlease)
                    .triggerClick(selectors.yesPlease)
                    .waitForElementNotPresent(selectors.yesPlease)
            }
        })
    return this
}

PushMessaging.prototype.acceptInlineAsk = function() {
    const self = this
    this.browser
        .log('Checking if Push Messaging inline ask is present')
        .element('css selector', selectors.optIn, (result) => {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .log('Accepting Push Messaging inline ask')
                    .execute('scrollTo(0,500)')
                    .waitForElementVisible(selectors.optIn)
                    .triggerClick(selectors.optIn)
                    .waitForElementNotPresent(selectors.optIn)
            }
        })
    return this
}

PushMessaging.prototype.assertSubscribed = function() {
    const self = this
    this.browser
        .executeAsync((_, done) => {
            // 10 attempts; 200ms after each failure - 2 seconds total
            let attempt = 1

            const checkForSubscription = () => {
                const status = window.Progressive.MessagingClient.LocalStorage.get('mobifyMessagingClientSubscriptionStatus')

                if (status === 'subscribed' || attempt >= 10) {
                    done(status)
                } else {
                    attempt++
                    setTimeout(checkForSubscription, 200)
                }
            }

            checkForSubscription()
        },
        ['unusedValue'], // see https://github.com/nightwatchjs/nightwatch/issues/616
        ({value}) => {
            self.browser.assert.equal(value, 'subscribed')
        })
    return this
}

export default PushMessaging
