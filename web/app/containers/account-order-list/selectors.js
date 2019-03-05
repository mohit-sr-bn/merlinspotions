/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import Immutable from 'immutable'

import {getUi} from '../../store/selectors'

import {getUser} from 'progressive-web-sdk/dist/store/user/selectors'


export const getAccountOrderList = createSelector(
    getUi,
    ({accountOrderList}) => accountOrderList
)

export const getTitle = createGetSelector(getAccountOrderList, 'title')

const PLACEHOLDER = {
    text: undefined
}

export const getOrdersPage = createGetSelector(getAccountOrderList, 'pageNumber', 1)

export const getOrdersPageMeta = createGetSelector(getAccountOrderList, 'pageMeta', Immutable.Map())

export const getOrderList = createSelector(getUser, getOrdersPage, (user, pageNumber) => {

    const orders = user && user.get('orders') ? user
        .get('orders')
        .toIndexedSeq()
        .toArray()
        .map((order) => order.toJS()) : new Array(3).fill(PLACEHOLDER)

    return orders.slice((pageNumber - 1) * 5, pageNumber * 5)
})

export const getNumOrderPages = createSelector(getUser, (user) => {
    return user && user.get('orders') ? Math.ceil(user
        .get('orders')
        .toIndexedSeq()
        .toArray()
        .length / 5) : 3 // same number of PLACEHOLDERS (new Array(3).fill(PLACEHOLDER))
})
