/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import Immutable from 'immutable'

import {getUi} from '../../store/selectors'

export const getAccountDashboard = createSelector(
    getUi,
    ({accountDashboard}) => accountDashboard
)

export const getAccountDashboardPageMeta = createGetSelector(
    getAccountDashboard,
    'pageMeta',
    Immutable.Map()
)
