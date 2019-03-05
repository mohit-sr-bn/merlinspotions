/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {setAddressID, setIsEditing, receiveAccountAddressUIData} from './actions'

const initialState = Immutable.Map()

export default handleActions({
    [receiveAccountAddressUIData]: mergePayload,
    [setAddressID]: mergePayload,
    [setIsEditing]: mergePayload
}, initialState)
