/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

// THIS IS A GENERATED FILE, DO NOT EDIT

import {combineReducers} from 'redux'

import navigation from '../modals/navigation/reducer' // navigation is a special case, since it's not in the containers directory
import accountAddress from './account-address/reducer'
import accountDashboard from './account-dashboard/reducer'
import accountInfo from './account-info/reducer'
import accountOrderList from './account-order-list/reducer'
import app from './app/reducer'
import cart from './cart/reducer'
import checkoutConfirmation from './checkout-confirmation/reducer'
import checkoutPayment from './checkout-payment/reducer'
import checkoutShipping from './checkout-shipping/reducer'
import footer from './footer/reducer'
import header from './header/reducer'
import home from './home/reducer'
import login from './login/reducer'
import pageNotFound from './page-not-found/reducer'
import productDetails from './product-details/reducer'
import productList from './product-list/reducer'
import wishlist from './wishlist/reducer'


const uiReducer = combineReducers({
    navigation,
    accountAddress,
    accountDashboard,
    accountInfo,
    accountOrderList,
    app,
    cart,
    checkoutConfirmation,
    checkoutPayment,
    checkoutShipping,
    footer,
    header,
    home,
    login,
    pageNotFound,
    productDetails,
    productList,
    wishlist,

})

export default uiReducer
