/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'
import isEmail from 'validator/lib/isEmail'
import {SubmissionError} from 'redux-form'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {isRunningInAstro, jsRpcMethod} from '../../utils/astro-integration'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import isReactRoute from 'progressive-web-sdk/dist/routing/is-react-route'
import {openPersistentModal} from 'progressive-web-sdk/dist/store/modals/actions'
import {CART_MERGE_ITEMS_MODAL} from '../../modals/constants'
import {
    SIGN_IN_SECTION,
    REGISTER_SECTION
} from './constants'

export const setSigninLoaded = createAction('Set Sign In Page Loaded')
export const setRegisterLoaded = createAction('Set Register Page Loaded')
export const receiveSigninUIData = createAction('Receive Sign In Page Data')
export const receiveRegisterUIData = createAction('Receive Register Page Data')

export const initialize = (url, routeName) => (dispatch) => {
    if (routeName === SIGN_IN_SECTION) {
        dispatch(setSigninLoaded())
        dispatch(IntegrationManager.custom.getPageMetaData(routeName))
            .then((pageMeta) => dispatch(receiveSigninUIData(pageMeta)))
        return Promise.resolve()
    } else if (routeName === REGISTER_SECTION) {
        dispatch(setRegisterLoaded())
        dispatch(IntegrationManager.custom.getPageMetaData(routeName))
            .then((pageMeta) => dispatch(receiveRegisterUIData(pageMeta)))
        return Promise.resolve()
    }
    return Promise.reject(`Unknown routeName: ${routeName}`)
}

const validateSignInForm = (formValues) => {
    const errors = {
    }
    if (!formValues) {
        return {
            _error: 'Please fill in the form'
        }
    }

    const {
        username,
        password
    } = formValues

    if (!username) {
        errors.username = 'Email address is required'
    } else if (!isEmail(username)) {
        errors.username = 'Email address is invalid'
    }
    if (!password) {
        errors.password = 'Password is required'
    }
    return errors
}

const validateRegisterForm = (formValues) => {
    const errors = {}

    if (!Object.keys(formValues).length) {
        return {
            _error: 'Please fill in the form'
        }
    }

    const {
        firstname,
        lastname,
        email,
        password,
        password_confirmation: passwordConfirmation
    } = formValues

    if (!firstname) {
        errors.firstname = 'First name is required'
    }

    if (!lastname) {
        errors.lastname = 'Last name is required'
    }

    if (!email) {
        errors.email = 'Email address is required'
    } else if (!isEmail(email)) {
        errors.email = 'Email address is invalid'
    }

    if (!password) {
        errors.password = 'Password is required'
    }

    if (password !== passwordConfirmation) {
        errors.password_confirmation = 'Passwords are not the same'
    }

    if (password.length < 6) {
        errors.password = 'Please enter 6 or more characters'
    }

    return errors
}

const handleLoginSuccess = (href) => {
    if (isRunningInAstro) {
        jsRpcMethod('user:loggedIn', [])()
    }
    // This is only here because there is no account page in the PWA right now
    // Once we've added one we should user browserHistory to navigate to the account page after successfully logging in
    if (!href) {
        return
    }
    if (isReactRoute(href)) {
        browserHistory.push({pathname: href})
    } else {
        window.location.href = href
    }
}

export const submitSignInForm = (formValues) => (dispatch) => {
    const errors = validateSignInForm(formValues)
    if (errors._error || Object.keys(errors).length) {
        return Promise.reject(new SubmissionError(errors))
    }

    const {
        username,
        password,
        persistent_remember_me
    } = formValues

    return dispatch(IntegrationManager.account.login(username, password, persistent_remember_me))
        .then(({href, isCartMerged}) => {
            if (isCartMerged) {
                dispatch((openPersistentModal(CART_MERGE_ITEMS_MODAL)))
            }
            return handleLoginSuccess(href)
        })
}

export const submitRegisterForm = (formValues) => (dispatch) => {
    const errors = validateRegisterForm(formValues)
    if (errors._error || Object.keys(errors).length) {
        return Promise.reject(new SubmissionError(errors))
    }

    const {
        firstname,
        lastname,
        email,
        password,
        password_confirmation, // eslint-disable-line no-unused-vars
        ...opts
    } = formValues

    return dispatch(IntegrationManager.account.registerUser(firstname, lastname, email, password, opts))
        .then(({href}) => handleLoginSuccess(href))
}
