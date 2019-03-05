/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import IntegrationManager from 'mobify-integration-manager/dist/'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {receiveCurrentOrderNumber} from 'mobify-integration-manager/dist/integration-manager/api/account/results'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {extractPathFromURL} from 'progressive-web-sdk/dist/utils/utils'
import {getAccountOrderListURL} from '../app/selectors'
import {isRunningInAstro, trigger} from '../../utils/astro-integration'

export const receiveAccountOrderUIData = createAction('Receive Account Order UI Data')

export const initialize = (url, routeName) => (dispatch) => {
    dispatch(IntegrationManager.custom.getPageMetaData(routeName))
        .then((pageMeta) => dispatch(receiveAccountOrderUIData(pageMeta)))
    return dispatch(IntegrationManager.account.getOrderList())
}

export const receiveData = createAction('Receive AccountOrderList data')
export const setOrderListPage = createAction('Receive the paginated orderlist page', ['pageNumber'])

export const reorderItems = (orderId) => (dispatch) => {
    return dispatch(IntegrationManager.account.reorderPreviousOrder(orderId))
        .then((pathname) => {
            if (isRunningInAstro) {
                // If we're running in Astro, we want to open the cart modal instead
                trigger('open:cart-modal')
            } else {
                browserHistory.push({pathname})
            }
        })
}

export const navigateToOrder = (orderId, orderHref) => (dispatch, getState) => {

    dispatch(receiveCurrentOrderNumber(orderId))
    browserHistory.push({
        pathname: extractPathFromURL(orderHref || `${getAccountOrderListURL(getState())}?showOrder`)
    })
}
