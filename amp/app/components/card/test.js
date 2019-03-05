/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

/* eslint-env jest */
/* eslint-disable newline-per-chained-call */
import {shallowHOC as shallow} from 'mobify-amp-sdk/dist/test-utils'
import React from 'react'

import Card from './index.jsx'

test('Card renders without errors', () => {
    const wrapper = shallow(<Card />)
    expect(wrapper.length).toBe(1)
})

/* eslint-disable newline-per-chained-call */
test('includes the component class name with no className prop', () => {
    const wrapper = shallow(<Card />)

    expect(wrapper.hasClass('c-card')).toBe(true)
})

test('does not render an \'undefined\' class with no className', () => {
    const wrapper = shallow(<Card />)

    expect(wrapper.hasClass('undefined')).toBe(false)
})

test('renders the contents of the className prop if present', () => {
    [
        'test',
        'test another'
    ].forEach((name) => {
        const wrapper = shallow(<Card className={name} />)

        expect(wrapper.hasClass(name)).toBe(true)
    })
})

test('renders header and footer if header and footer props present', () => {
    const headerText = 'header'
    const footerText = 'footer'
    const wrapper = shallow(<Card header={<div>{headerText}</div>} footer={<div>{footerText}</div>} />)
    const headerTag = wrapper.find('.c-card__header')
    const footerTag = wrapper.find('.c-card__footer')

    expect(headerTag.length).toBe(1)
    expect(headerTag.text()).toBe(headerText)
    expect(footerTag.length).toBe(1)
    expect(footerTag.text()).toBe(footerText)
})
