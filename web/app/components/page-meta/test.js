/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {mount} from 'enzyme'
/* eslint-env jest */
import React from 'react'

import PageMeta from './index.jsx'

test('PageMeta renders without errors', () => {
    const wrapper = mount(<PageMeta />)
    expect(wrapper.length).toBe(1)
})
