/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import * as ReduxForm from 'redux-form'
import {stripEvent} from 'progressive-web-sdk/dist/utils/utils'

import {isEmailAvailable, submitSignIn, showSignIn} from '../actions'
import {getEmailError, getIsSignInShown} from '../selectors'
import {formatMessage} from '../../../components/intl/index'

import Button from 'progressive-web-sdk/dist/components/button'
import Field from 'progressive-web-sdk/dist/components/field'
import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import Icon from 'progressive-web-sdk/dist/components/icon'
import Link from 'progressive-web-sdk/dist/components/link'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'

const PasswordHint = (_, context) => (
    <Link className="u-color-brand" href="/customer/account/forgotpassword/">
        {formatMessage(context, {id: 'checkoutShipping.button.forgotPassword'})}
    </Link>
)

const SignInButton = ({handleShowSignIn}, context) => (
    <Button
        className="pw--is-anchor"
        innerClassName="pw--no-min-height u-padding-0"
        onClick={handleShowSignIn}
        data-analytics-name={UI_NAME.showMoreAddressFields}
    >
        <span className="u-color-brand u-text-letter-spacing-normal u-text-size-small">
            {formatMessage(context, {id: 'checkoutShipping.button.haveAnAccount'})}
        </span>
        <Icon name="chevron-down" className="u-margin-start-sm u-color-brand" />
    </Button>
)

SignInButton.propTypes = {
    handleShowSignIn: PropTypes.func
}


const ShippingEmail = ({
    handleShowSignIn,
    submitSignIn,
    isEmailAvailable,
    isSignInShown
}, context) => {

    return (
        <div>
            <div className="t-checkout-shipping__email-title" />

            <div className="u-padding-md u-border-light-top u-border-light-bottom u-bg-color-neutral-00">
                <FieldRow>
                    <ReduxForm.Field
                        component={Field}
                        className="pw--overlayed-hint qa-checkout__show-sign-in"
                        name="username"
                        label={formatMessage(context, {id: 'checkoutShipping.form.label.email'})}
                        caption={!isSignInShown && <SignInButton handleShowSignIn={handleShowSignIn} />}
                        customEventHandlers={{
                            onBlur: isEmailAvailable
                        }}
                    >
                        <input
                            type="email"
                            noValidate
                            placeholder={formatMessage(context, {id: 'checkoutShipping.form.email'})}
                            data-analytics-name={UI_NAME.email}
                        />
                    </ReduxForm.Field>
                </FieldRow>

                {isSignInShown &&
                    <FieldRow>
                        <ReduxForm.Field
                            component={Field}
                            name="password"
                            label={formatMessage(context, {id: 'checkoutShipping.form.label.password'})}
                            hint={<PasswordHint />}
                        >
                            <input
                                type="password"
                                name="password"
                                noValidate
                                data-analytics-name={UI_NAME.password}
                            />
                        </ReduxForm.Field>
                    </FieldRow>
                }

                {isSignInShown &&
                    <FieldRow>
                        <Button
                            className="pw--secondary u-width-full u-text-uppercase qa-checkout__sign-in"
                            onClick={submitSignIn}
                            data-analytics-name={UI_NAME.login}
                        >
                            <Icon name="user" className="u-margin-end" />
                            {formatMessage(context, {id: 'login.link.signIn'})}
                        </Button>
                    </FieldRow>
                }
            </div>
        </div>
    )
}

ShippingEmail.propTypes = {
    /**
    * True if the users email address has an account associated with it
    */
    customerEmailRecognized: PropTypes.bool,
    /**
     * Shows the sign in password field and button
     */
    handleShowSignIn: PropTypes.func,
    /**
    * Checks if the users email address has an account associated with it
    */
    isEmailAvailable: PropTypes.func,
    /**
    * Flag of whether in-line sign in fields and button are shown
    */
    isSignInShown: PropTypes.bool,
    /**
    * Submits the sign in form data
    */
    submitSignIn: PropTypes.func
}

ShippingEmail.contextTypes = {
    intl: PropTypes.object
}
SignInButton.contextTypes = ShippingEmail.contextTypes
PasswordHint.contextTypes = ShippingEmail.contextTypes

const mapStateToProps = createPropsSelector({
    emailError: getEmailError,
    isSignInShown: getIsSignInShown,
})

const mapDispatchToProps = {
    handleShowSignIn: stripEvent(showSignIn),
    submitSignIn,
    isEmailAvailable
}

export default connect(mapStateToProps, mapDispatchToProps)(ShippingEmail)
