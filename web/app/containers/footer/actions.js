/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import * as constants from './constants'

export const newsletterSignupComplete = createAction('Newsletter signup complete', ['signupStatus'])

export const signUpToNewsletter = (data) => (dispatch) => {
    if (IntegrationManager.custom && IntegrationManager.custom.submitNewsletter) {
        return dispatch(IntegrationManager.custom.submitNewsletter(data))
            .then(() => dispatch(newsletterSignupComplete(constants.SIGNUP_SUCCESSFUL)))
            .catch(() => dispatch(newsletterSignupComplete(constants.SIGNUP_FAILED)))
    }
    return Promise.resolve()
}
