/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {mount} from 'enzyme'
/* eslint-env jest */
import React from 'react'
import Immutable from 'immutable'

import {wrapProvider} from 'web/app/utils/test-utils'

const appStore = {
    app: Immutable.fromJS({
        selectedCurrency: {
            label: 'Dollar',
            symbol: '$',
            code: 'USD'
        }
    })
}

// Components
import Price from './index.jsx'

test('Price renders without errors', () => {
    const wrapper = mount(
        wrapProvider(<Price price="12.00" />, appStore)
    )
    expect(wrapper.length).toBe(1)
})

/* eslint-disable newline-per-chained-call */
test('includes the component class name with no className prop', () => {
    const wrapper = mount(
        wrapProvider(<Price price="12.00" />, appStore)
    )

    expect(wrapper.find('.c-price').length).toBe(1)
})

test('does not render an \'undefined\' class with no className', () => {
    const wrapper = mount(
        wrapProvider(<Price price="12.00" />, appStore)
    )

    expect(wrapper.hasClass('undefined')).toBe(false)
})

test('renders the contents of the className prop if present', () => {
    [
        'test',
        'test another'
    ].forEach((name) => {
        const wrapper = mount(
            wrapProvider(<Price price="12.00" className={name} />, appStore)
        ).children()

        expect(wrapper.find(Price).hasClass(name)).toBe(true)
    })
})
