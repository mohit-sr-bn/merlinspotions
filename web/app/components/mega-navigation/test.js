/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {shallow} from 'enzyme'
/* eslint-env jest */
import React from 'react'

import MegaNavigation from './index.jsx'
const MegaNav = MegaNavigation.WrappedComponent


test('MegaNavigation renders without errors', () => {
    const wrapper = shallow(<MegaNav />)
    expect(wrapper.length).toBe(1)
})
