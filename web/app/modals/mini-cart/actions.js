/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'

import {openModal} from '../actions'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {MINI_CART_MODAL} from '../constants'

export const requestOpenMiniCart = () => (dispatch) => {
    dispatch(IntegrationManager.cart.getCart())
    dispatch(openModal(MINI_CART_MODAL, UI_NAME.miniCart))
}

export const requestCartContent = () => (dispatch) => {
    dispatch(IntegrationManager.cart.getCart())
}
