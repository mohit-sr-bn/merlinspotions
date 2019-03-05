/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {getCurrentOrderNumber} from 'progressive-web-sdk/dist/store/user/orders/selectors'

export const initialize = () => (dispatch, getState) => {
    return dispatch(IntegrationManager.account.getOrder(getCurrentOrderNumber(getState())))
}

export const reorderItem = () => (dispatch, getState) => {
    return dispatch(IntegrationManager.account.reorderPreviousOrder(getCurrentOrderNumber(getState())))
        .then((url) => {
            browserHistory.push({
                pathname: url
            })
        })
}
