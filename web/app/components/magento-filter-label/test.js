/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2018 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {mount} from 'enzyme'
/* eslint-env jest */
import React from 'react'
import Immutable from 'immutable'

import {
    wrapProviderIntlProvider,
    currencyObject
} from '../../utils/test-utils'

import MagentoFilterLabel from './index'

const firstLabel = '20'
const secondLabel = '30'
const label = `${firstLabel} - ${secondLabel}`

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

const component = <MagentoFilterLabel label={label} />

test('FilterLabel renders without errors', () => {
    const wrapper = mount(
        wrapProviderIntlProvider(component, appStore)
    )

    expect(wrapper.length).toBe(1)
})

/* eslint-disable newline-per-chained-call */
test('render first and second labels correctly', () => {
    const wrapper = mount(
        wrapProviderIntlProvider(component, appStore)
    )

    expect(wrapper.find('MagentoFilterLabel').find('FormattedPrice').first().prop('value')).toBe(firstLabel)
    expect(wrapper.find('MagentoFilterLabel').find('FormattedPrice').last().prop('value')).toBe(secondLabel)
})
