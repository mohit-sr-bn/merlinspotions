/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
import {mount, shallow} from 'enzyme'
import React from 'react'

import FooterExtras from './footer-extras'

const store = {
    getState: () => {},
    subscribe: () => {}
}

test('FooterExtras renders without errors', () => {
    const wrapper = mount(<FooterExtras store={store} />)
    expect(wrapper.length).toBe(1)
})

test('FooterExtras renders social links when viewport is wide enough', () => {
    const wrapper = shallow(<FooterExtras viewportSize="large" />)

    const socialLinks = wrapper.find('.t-footer__social')

    expect(socialLinks.length).toBe(1)
})
