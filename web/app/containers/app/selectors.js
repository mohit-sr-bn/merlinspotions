/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import {getUi} from '../../store/selectors'
import {defaultLanguage} from '../../config/translations-config'

export const getApp = createSelector(getUi, ({app}) => app)

export const getSvgSprite = createGetSelector(getApp, 'sprite')
export const getHideApp = createGetSelector(getApp, 'hideApp')

export const getCheckoutShippingURL = createGetSelector(getApp, 'checkoutShippingURL')
export const getCartURL = createGetSelector(getApp, 'cartURL')
export const getWishlistURL = createGetSelector(getApp, 'wishlistURL')
export const getSignInURL = createGetSelector(getApp, 'signInURL')
export const getAccountAddressURL = createGetSelector(getApp, 'accountAddressURL')
export const getAccountInfoURL = createGetSelector(getApp, 'accountInfoURL')
export const getAccountURL = createGetSelector(getApp, 'accountURL')
export const getAccountOrderListURL = createGetSelector(getApp, 'orderListURL')
export const getScrollManager = createGetSelector(getApp, 'scrollManager')
export const getLocale = createGetSelector(getApp, 'locale', defaultLanguage)
export const getTranslations = createGetSelector(getApp, 'translations', {})
export const isRetryingConnection = createGetSelector(getApp, 'retryingConnection', false)
export const isAppInitialized = createGetSelector(getApp, 'initialized', false)
export const isRunningInAstro = createGetSelector(getApp, 'isRunningInAstro', false)
