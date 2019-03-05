/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {mount} from 'enzyme'
import React from 'react'

import ShareHeader from './index'

/* eslint-disable newline-per-chained-call */

test('ShareHeader renders without errors', () => {
    const wrapper = mount(<ShareHeader />)
    expect(wrapper.length).toBe(1)
})
