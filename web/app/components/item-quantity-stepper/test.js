/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {mount, shallow} from 'enzyme'
/* eslint-env jest */
import React from 'react'

import ItemQuantityStepper from './index.jsx'

test('ItemQuantityStepper renders without errors', () => {
    const wrapper = mount(<ItemQuantityStepper />)
    expect(wrapper.length).toBe(1)
})

/* eslint-disable newline-per-chained-call */
test('does not render an \'undefined\' class with no className', () => {
    const wrapper = shallow(<ItemQuantityStepper />)

    expect(wrapper.hasClass('undefined')).toBe(false)
})

test('renders the contents of the className prop if present', () => {
    [
        'test',
        'test another'
    ].forEach((name) => {
        const wrapper = shallow(<ItemQuantityStepper className={name} />)

        expect(wrapper.hasClass(name)).toBe(true)
    })
})
