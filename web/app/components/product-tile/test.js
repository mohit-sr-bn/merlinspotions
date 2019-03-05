/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {mount, shallow} from 'enzyme'
/* eslint-env jest */
import React from 'react'
import Immutable from 'immutable'
import {wrapProvider} from '../../utils/test-utils'

import ProductTile from './index.jsx'

const appStore = {
    app: Immutable.fromJS({
        selectedCurrency: 'USD',
        symbol: '$'
    })
}

test('ProductTile renders without errors', () => {
    const wrapper = mount(
        wrapProvider(<ProductTile />, appStore)
    )

    expect(wrapper.length).toBe(1)
})

/* eslint-disable newline-per-chained-call */
test('includes the component class name with no className prop', () => {
    const wrapper = mount(
        wrapProvider(<ProductTile />, appStore)
    )

    expect(wrapper.children().children().hasClass('c-product-tile')).toBe(true)
})

test('does not render an \'undefined\' class with no className', () => {
    const wrapper = shallow(
        wrapProvider(<ProductTile />, appStore)
    )

    expect(wrapper.hasClass('undefined')).toBe(false)
})

test('renders the contents of the className prop if present', () => {
    [
        'test',
        'test2'
    ].forEach((name) => {
        const wrapper = mount(
            wrapProvider(<ProductTile className={name} />, appStore)
        )

        expect(wrapper.find(ProductTile).hasClass(name)).toBe(true)
    })
})
