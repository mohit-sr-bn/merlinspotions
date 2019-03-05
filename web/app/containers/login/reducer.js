/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {handleActions} from 'redux-actions'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {setSigninLoaded, setRegisterLoaded, receiveSigninUIData, receiveRegisterUIData} from './actions'

const initialState = Immutable.fromJS({
    signinSection: false,
    registerSection: false
})

export default handleActions({
    [setSigninLoaded]: (state) => state.set('signinSection', true),
    [receiveSigninUIData]: mergePayload,
    [setRegisterLoaded]: (state) => state.set('registerSection', true),
    [receiveRegisterUIData]: mergePayload
}, initialState)
