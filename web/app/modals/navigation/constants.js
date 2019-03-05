/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

export const SIGN_IN_LINK_TEXT = 'Sign In'
export const SIGN_OUT_LINK_TEXT = 'Sign Out'



export const ACCOUNT_NAV_ITEM = 'AccountNavItem'
export const SIGN_OUT_NAV_ITEM = 'AccountLogoutNavItem'
export const SIGNED_OUT_ACCOUNT_NAV_ITEM = 'HiddenAccountItem'
export const LOCALE_NAV_ITEM = 'CurrentLocale'
export const LOCALE_NAV_HEADER = 'CurrentLocaleHeader'
export const INSTALL_APP_ITEM = 'InstallAppItem'

export const LOGGED_IN_NAV = {
    type: SIGN_OUT_NAV_ITEM,
    title: SIGN_OUT_LINK_TEXT
}

export const GUEST_NAV = {
    type: ACCOUNT_NAV_ITEM,
    title: SIGN_IN_LINK_TEXT
}
