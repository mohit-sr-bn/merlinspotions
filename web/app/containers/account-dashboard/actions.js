/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import IntegrationManager from 'mobify-integration-manager/dist/'

export const receiveAccountDashboardUIData = createAction('Receive Account Dashboard UI Data')

export const initialize = (url, routeName) => (dispatch) => {
    dispatch(IntegrationManager.custom.getPageMetaData(routeName))
        .then((pageMeta) => dispatch(receiveAccountDashboardUIData(pageMeta)))
    return Promise.resolve()
}

// This action will change the `title` key in the local private state
export const changeTitle = createAction('Change Account title', 'title')
