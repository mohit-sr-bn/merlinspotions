/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {isRunningInAstro} from '../app/selectors'

import {getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'

import Button from 'progressive-web-sdk/dist/components/button'
import {HeaderBar, HeaderBarTitle} from 'progressive-web-sdk/dist/components/header-bar'
import Icon from 'progressive-web-sdk/dist/components/icon'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

// import {FormattedText} from '../../components/intl/index'

const CheckoutHeader = function({headerHasSignIn, isLoggedIn, isRunningInAstro}, {intl}) {
    if (isRunningInAstro) {
        return null
    }

    return (
        <header className="t-checkout-header">
            <HeaderBar className="t-checkout-header__bar">
                <HeaderBarTitle className="u-flex-none u-padding-start u-text-align-start">
                    <h2 className="u-align-center u-text-family-header u-text-uppercase">
                        <span className="u-text-weight-extra-light">SECURE</span> CHECKOUT
                    </h2>
                </HeaderBarTitle>

                <Icon name="lock" size="medium" className="u-flex-none" />

                {(!isLoggedIn && headerHasSignIn) &&
                    <div className="u-flex u-text-align-end">
                        <Button
                            className="u-text-letter-spacing-normal qa-checkout-header__sign-in"
                            href="/customer/account/login/"
                            innerClassName="u-color-neutral-10"
                            data-analytics-name={UI_NAME.goToSignIn}
                            >
                            <Icon name="user" className="u-margin-end-sm" />
                            <div className="t-checkout-header__login-text">{
                                // TODO: This _should_ use the FormattedText component, but for an
                                //       unknown reason, when you refresh any page that uses the
                                //       CheckoutHeader component for the header the locale change
                                //       doesn't trigger it to re-render. For now we're stepping down
                                //       to use the `intl` api directly.
                                intl.formatMessage({
                                    id: 'login.link.signIn',
                                    defaultMessage: ' ' // Note this is a non-breaking space and it _must_ remain.
                                })
                                // <FormattedText messageId="login.link.signIn" />
                            }</div>
                        </Button>
                    </div>
                }
            </HeaderBar>
        </header>
    )
}

CheckoutHeader.propTypes = {
    /**
    * Whether the header has sign in
    */
    headerHasSignIn: PropTypes.bool,
    /**
    * Is the user logged in or not
    */
    isLoggedIn: PropTypes.bool,
    isRunningInAstro: PropTypes.bool
}

CheckoutHeader.contextTypes = {
    intl: PropTypes.object,
}

const mapStateToProps = createPropsSelector({
    isLoggedIn: getIsLoggedIn,
    isRunningInAstro
})

export default connect(mapStateToProps)(CheckoutHeader)
