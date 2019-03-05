/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {mount, shallow} from 'enzyme'
/* eslint-env jest */
import React from 'react'
import Immutable from 'immutable'
import {
    wrapProviderIntlProvider,
    intlContext,
    currencyObject
} from '../../utils/test-utils'

import ItemPrice from './index.jsx'

const price = '10'

const appStore = {
    app: Immutable.fromJS({
        selectedCurrency: currencyObject,
        availableCurrencies: [currencyObject],
    }),
    ui: { // Note: This can't be immutable, otherwise it breaks UI selectors...
        app: Immutable.fromJS({
            translations: {},
            locale: 'en'
        })
    },
}

const component = <ItemPrice linePrice={price} itemPrice={price} />

test('ItemPrice renders without errors', () => {
    const wrapper = mount(
        wrapProviderIntlProvider(component, appStore)
    )

    expect(wrapper.find(ItemPrice).length).toBe(1)
})

/* eslint-disable newline-per-chained-call */
test('includes the component class name with no className prop', () => {
    const wrapper = mount(
        wrapProviderIntlProvider(component, appStore)
    )
    expect(wrapper.find(ItemPrice).find('Field').hasClass('c-item-price')).toBe(true)
})

test('does not render an \'undefined\' class with no className', () => {
    const wrapper = shallow(
        wrapProviderIntlProvider(component, appStore),
        intlContext
    )

    expect(wrapper.find(ItemPrice).hasClass('undefined')).toBe(false)
})

test('renders the contents of the className prop if present', () => {
    [
        'test',
        'test another'
    ].forEach((name) => {
        const wrapper = shallow(
            wrapProviderIntlProvider(<ItemPrice className={name} linePrice={price} itemPrice={price} />, appStore),
            intlContext
        )

        expect(wrapper.find(ItemPrice).hasClass(name)).toBe(true)
    })
})
