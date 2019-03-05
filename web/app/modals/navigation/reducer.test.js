/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import reducer, {initialState} from './reducer'

describe('The navigation reducer', () => {
    test('should not modify the state on an unknown action type', () => {
        expect(reducer(initialState, {type: 'uuddlrlrabstart'})).toBe(initialState)
    })
})
