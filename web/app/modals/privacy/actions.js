/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import cookieManager from 'progressive-web-sdk/dist/utils/cookie-manager'

// Value of false = privacy notice was dismissed or ignored
// Value of true = privacy notice was accepted
const setPrivacyCookie = (value, time) => (dispatch) => {
    cookieManager.set('privacy-notice', value, location.hostname, time)
}

export const acceptPrivacyCookie = () => (dispatch) => {
    const tenYears = 10 * 365 * 24 * 60 * 60 * 1000
    dispatch(setPrivacyCookie(true, tenYears))
}

export const ignorePrivacyCookie = () => (dispatch) => {
    const sixtyDays = 60 * 24 * 60 * 60 * 1000
    dispatch(setPrivacyCookie(false, sixtyDays))
}
