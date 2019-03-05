/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {mount} from 'enzyme'
import React from 'react'

import FooterNavigation from './footer-navigation'

const store = {
    getState: () => {},
    subscribe: () => {}
}

test('FooterNavigation renders without errors', () => {
    const wrapper = mount(<FooterNavigation store={store} />)
    expect(wrapper.length).toBe(1)
})
