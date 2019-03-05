/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

export const initialize = () => (dispatch) => Promise.resolve()

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'

// This is an example action which is used to trigger change in UI state
export const toggleUIState = createAction('Toggle PageNotFound UI state')
