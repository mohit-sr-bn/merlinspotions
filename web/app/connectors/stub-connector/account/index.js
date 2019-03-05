/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {setLoggedIn} from 'mobify-integration-manager/dist/integration-manager/results'

/* eslint-disable no-unused-vars */

export const navigateToSection = (router, routes, sectionName) => (dispatch) => {
    console.log('[Stub Connector] Called navigateToSection stub with parameters:', router, routes, sectionName)
    return Promise.resolve()
}

export const login = (username, password, rememberMe) => (dispatch) => {
    console.log('[Stub Connector] Called login stub with parameters:', username, password, rememberMe)
    dispatch(setLoggedIn(true))

    // This promise should resolve to the URL of the account page
    // to redirect the user to.
    return Promise.resolve()
}

export const logout = () => (dispatch) => {
    console.log('[Stub Connector] Called logout stub')
    dispatch(setLoggedIn(false))
    return Promise.resolve()
}

export const registerUser = (firstname, lastname, email, password) => (dispatch) => {
    console.log('[Stub Connector] Called registerUser stub with parameters:', firstname, lastname, email, password)

    // This promise should resolve to the URL of the account page
    // to redirect the user to.
    return Promise.resolve()
}

export const updateShippingAddress = (formValues) => (dispatch) => {
    console.log('[Stub Connector] Called updateShippingAddress stub with parameters:', formValues)
    return Promise.resolve()
}

export const updateBillingAddress = (formValues) => (dispatch) => {
    console.log('[Stub Connector] Called updateBillingAddress stub with parameters:', formValues)
    return Promise.resolve()
}

export const getAccountInfo = () => (dispatch) => {
    console.log('[Stub Connector] Called getAccountInfo stub')
    return Promise.resolve()
}

export const getOrderList = () => (dispatch) => {
    console.log('[Stub Connector] Called getOrderList stub')
    return Promise.resolve()
}

export const getOrder = (orderNumber) => (dispatch) => {
    console.log('[Stub Connector] Called getOrder stub with parameter:', orderNumber)
    return Promise.resolve()
}

export const getSavedAddresses = () => (dispatch) => { // eslint-disable-line no-unused-vars
    console.log('[Stub Connector] Called getSavedAddresses stub')
    return Promise.resolve()
}

export const getWishlist = () => (dispatch) => {
    console.log('[Stub Connector] Called getWishlist stub')
    return Promise.resolve()
}

export const addToCartFromWishlist = (url) => (dispatch) => {
    console.log('[Stub Connector] Called addToCartFromWishlist stub with parameters:', url)
    return Promise.resolve()
}

export const removeItemFromWishlist = (url) => (dispatch) => {
    console.log('[Stub Connector] Called removeItemFromWishlist stub with parameters:', url)
    return Promise.resolve()
}
