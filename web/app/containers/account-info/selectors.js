/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import Immutable from 'immutable'

import {getUi} from '../../store/selectors'

import {getUser} from 'progressive-web-sdk/dist/store/user/selectors'


export const getAccountInfo = createSelector(
    getUi,
    ({accountInfo}) => accountInfo
)

export const getAccountInfoPageMeta = createGetSelector(
    getAccountInfo,
    'pageMeta',
    Immutable.Map()
)

export const getAccountInfoInitialValues = createSelector(getUser, (user) => {
    return user.get('names') ? {
        names: user.get('names'),
        email: user.get('email')
    } : null
})
